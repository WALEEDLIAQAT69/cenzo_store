import React, { useState, useEffect, useMemo } from 'react';
import { 
  BrowserRouter, 
  Routes, 
  Route, 
  useNavigate, 
  useLocation, 
  useParams, 
  Navigate 
} from 'react-router-dom';
import { 
  Gender, 
  Product, 
  ProductColor, 
  CartItem, 
  Order,
  PaymentMethod 
} from './types';
import { PRODUCTS } from './data/products';
import { AnnouncementMarquee } from './components/AnnouncementMarquee';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { CollectionPage } from './pages/CollectionPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { StoreLocatorPage } from './pages/StoreLocatorPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

// Modals
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { SearchModal } from './components/SearchModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { AuthModal } from './components/AuthModal';
import { Check } from 'lucide-react';

// Firebase Services
import { 
  saveOrderToFirestore, 
  subscribeToAuth, 
  loginWithGoogle, 
  logoutUser 
} from './services/firebaseStore';
import { User } from 'firebase/auth';

const INITIAL_CART: CartItem[] = [
  {
    cartItemId: 'init-item-1',
    product: PRODUCTS[0], // HR Signature Court Low
    selectedSize: 42,
    selectedColor: PRODUCTS[0].colors[0],
    quantity: 1,
  },
];

const INITIAL_ORDERS: Order[] = [
  {
    id: '#ND-882314',
    trackingNumber: '7719203841',
    date: '18 Oct 2026',
    items: [INITIAL_CART[0]],
    shippingAddress: {
      fullName: 'Ali Raza',
      email: 'ali.raza@example.com',
      phone: '0301-4458921',
      address: 'House 42, Sector Y, DHA Phase 3',
      city: 'Karachi',
      postalCode: '75500',
    },
    paymentMethod: 'cod',
    paymentTitle: 'Cash on Delivery (COD)',
    paymentStatus: 'PENDING_COD',
    subtotal: 6499,
    shippingFee: 0,
    discountAmount: 0,
    total: 6499,
    status: 'Out for Delivery',
    estimatedDelivery: 'Today by 6:00 PM',
  },
  {
    id: '#ND-991204',
    trackingNumber: '7719204918',
    date: '19 Oct 2026',
    items: [
      {
        cartItemId: 'init-item-2',
        product: PRODUCTS[2],
        selectedSize: 41,
        selectedColor: PRODUCTS[2].colors[0],
        quantity: 1,
      },
    ],
    shippingAddress: {
      fullName: 'Zainab Malik',
      email: 'zainab@example.com',
      phone: '0322-9012344',
      address: 'Plaza 14, Main Boulevard, Gulberg',
      city: 'Lahore',
      postalCode: '54000',
    },
    paymentMethod: 'card',
    paymentTitle: 'Visa / Mastercard Online Card',
    paymentStatus: 'PAID',
    transactionId: 'TXN-VISA-984210',
    subtotal: 5499,
    shippingFee: 0,
    discountAmount: 500,
    total: 4999,
    status: 'Dispatched (TCS/Trax)',
    estimatedDelivery: 'Tomorrow by 2:00 PM',
  },
];

function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // Catalog State (hydrated from Express backend `/api/products`)
  const [products, setProducts] = useState<Product[]>(PRODUCTS);

  // Cart State (Persisted in localStorage)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('csenzo_cart');
      return saved ? JSON.parse(saved) : INITIAL_CART;
    } catch {
      return INITIAL_CART;
    }
  });

  // Wishlist State (Set of product IDs)
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('csenzo_wishlist');
      return saved ? new Set(JSON.parse(saved)) : new Set(['cs-hr-01', 'cs-sk-03']);
    } catch {
      return new Set(['cs-hr-01', 'cs-sk-03']);
    }
  });

  // Orders State (hydrated from Express backend `/api/orders` + localStorage)
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('csenzo_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // Modals state
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Auto-open Auth / Security Center if navigating to /login or /account
  useEffect(() => {
    if (location.pathname === '/login' || location.pathname === '/account') {
      setIsAuthModalOpen(true);
    }
  }, [location.pathname]);

  // Checkout payload
  const [checkoutDiscount, setCheckoutDiscount] = useState<number>(0);
  const [checkoutCoupon, setCheckoutCoupon] = useState<string>('');
  const [checkoutPaymentMethod, setCheckoutPaymentMethod] = useState<PaymentMethod>('cod');

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Firebase User Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = subscribeToAuth((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2400);
  };

  // Fetch products from backend API on mount
  useEffect(() => {
    fetch('/api/products')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('API offline');
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
      })
      .catch((err) => {
        console.log('Using local fallback catalog:', err.message);
      });
  }, []);

  // Fetch orders from backend API
  useEffect(() => {
    fetch('/api/orders')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('API offline');
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setOrders(data);
        }
      })
      .catch(() => {});
  }, []);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('csenzo_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Sync wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('csenzo_wishlist', JSON.stringify(Array.from(wishlistIds)));
    } catch (e) {
      console.error(e);
    }
  }, [wishlistIds]);

  // Navigation helper that automatically scrolls to top
  const handleNavigate = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart operations
  const handleAddToCart = (
    product: Product,
    size: number,
    color: ProductColor,
    quantity = 1
  ) => {
    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === size &&
          item.selectedColor.name === color.name
      );

      if (existingIdx > -1) {
        const updated = [...prevCart];
        updated[existingIdx].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevCart,
          {
            cartItemId: `${product.id}-${size}-${color.name}-${Date.now()}`,
            product,
            selectedSize: size,
            selectedColor: color,
            quantity,
          },
        ];
      }
    });

    showToast(`Added ${product.name} (EU ${size}) to your bag`);
  };

  const handleUpdateCartQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveCartItem(cartItemId);
    } else {
      setCart((prev) =>
        prev.map((item) =>
          item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
    showToast('Item removed from bag');
  };

  // Express Buy Now
  const handleBuyNow = (
    product: Product,
    size: number,
    color: ProductColor,
    quantity = 1
  ) => {
    handleAddToCart(product, size, color, quantity);
    setCheckoutDiscount(0);
    setCheckoutCoupon('');
    setIsCheckoutOpen(true);
  };

  // Wishlist toggle
  const handleToggleWishlist = (product: Product) => {
    setWishlistIds((prev) => {
      const updated = new Set(prev);
      if (updated.has(product.id)) {
        updated.delete(product.id);
        showToast(`Removed from saved kicks`);
      } else {
        updated.add(product.id);
        showToast(`Saved ${product.name} to wishlist`);
      }
      return updated;
    });
  };

  const wishlistProducts = useMemo(() => {
    return products.filter((p) => wishlistIds.has(p.id));
  }, [products, wishlistIds]);

  // Proceed to checkout modal
  const handleProceedToCheckout = (discountAmount: number, couponCode: string, initialPaymentMode?: PaymentMethod) => {
    setCheckoutDiscount(discountAmount);
    setCheckoutCoupon(couponCode);
    if (initialPaymentMode) {
      setCheckoutPaymentMethod(initialPaymentMode);
    }
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Handle order placed (send to Firebase Firestore + backend database + update state)
  const handleOrderPlaced = async (newOrder: Order) => {
    const orderToSave: Order = {
      ...newOrder,
      userId: currentUser?.uid || undefined,
    };
    setOrders((prev) => [orderToSave, ...prev]);
    setCart([]);

    try {
      await Promise.allSettled([
        saveOrderToFirestore(orderToSave),
        fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderToSave),
        })
      ]);
      const statusNote = orderToSave.paymentStatus === 'PAID' ? 'Paid Online' : 'COD Due on Arrival';
      showToast(`Order ${orderToSave.id} confirmed (${statusNote})`);
    } catch (err) {
      console.error('Failed to post order to server/firestore:', err);
    }
  };

  const handleTrackOrderDirectly = (trackingNumber: string) => {
    handleNavigate('/track-order');
  };

  const handleLogin = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    try {
      const user = await loginWithGoogle();
      if (user) {
        showToast(`Welcome, ${user.displayName || user.email?.split('@')[0] || 'Member'}`);
      }
    } catch (err: any) {
      showToast(err?.message || 'Login was not completed');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      showToast('Signed out of session');
    } catch (err) {
      console.error('Sign out failed:', err);
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#fdf8f8] text-[#0A0A0A] font-grotesk selection:bg-[#0062FF] selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0A0A0A] text-white px-4 py-3 border border-white shadow-hard flex items-center space-x-2 text-xs font-bold uppercase tracking-wider animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Announcement Bar */}
      <AnnouncementMarquee />

      {/* Global Header */}
      <Header
        activePath={location.pathname}
        onNavigate={handleNavigate}
        cartCount={cartCount}
        cartTotal={cartTotal}
        wishlistCount={wishlistIds.size}
        onOpenCart={() => handleNavigate('/cart')}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        user={currentUser}
        isLoggingIn={isLoggingIn}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      {/* Multi-Page Routes */}
      <main className="flex-1">
        <Routes>
          {/* Home Page */}
          <Route
            path="/"
            element={
              <HomePage
                onNavigate={handleNavigate}
                onSelectCategory={(cat) => {
                  if (cat === 'Capsule') handleNavigate('/hasan-raheem-collection');
                  else if (cat === 'Sale') handleNavigate('/sale');
                  else handleNavigate(`/collections/${cat.toLowerCase()}`);
                }}
                featuredProducts={products}
                onSelectProduct={(p) => handleNavigate(`/product/${p.id}`)}
              />
            }
          />

          {/* Collection Pages */}
          <Route
            path="/collections"
            element={
              <CollectionPage
                currentCategory="all"
                products={products}
                onNavigate={handleNavigate}
                onSelectProduct={(p) => handleNavigate(`/product/${p.id}`)}
                onAddToCart={(p, size, color) => handleAddToCart(p, size, color, 1)}
                wishlistIds={wishlistIds}
                onToggleWishlist={handleToggleWishlist}
              />
            }
          />
          <Route
            path="/collections/:category"
            element={
              <CollectionPageWrapper 
                products={products}
                onNavigate={handleNavigate} 
                onSelectProduct={(p) => handleNavigate(`/product/${p.id}`)} 
                onAddToCart={(p, size, color) => handleAddToCart(p, size, color, 1)} 
                wishlistIds={wishlistIds} 
                onToggleWishlist={handleToggleWishlist} 
              />
            }
          />
          <Route
            path="/men"
            element={
              <CollectionPage
                currentCategory="men"
                products={products}
                onNavigate={handleNavigate}
                onSelectProduct={(p) => handleNavigate(`/product/${p.id}`)}
                onAddToCart={(p, size, color) => handleAddToCart(p, size, color, 1)}
                wishlistIds={wishlistIds}
                onToggleWishlist={handleToggleWishlist}
              />
            }
          />
          <Route
            path="/women"
            element={
              <CollectionPage
                currentCategory="women"
                products={products}
                onNavigate={handleNavigate}
                onSelectProduct={(p) => handleNavigate(`/product/${p.id}`)}
                onAddToCart={(p, size, color) => handleAddToCart(p, size, color, 1)}
                wishlistIds={wishlistIds}
                onToggleWishlist={handleToggleWishlist}
              />
            }
          />
          <Route
            path="/kids"
            element={
              <CollectionPage
                currentCategory="kids"
                products={products}
                onNavigate={handleNavigate}
                onSelectProduct={(p) => handleNavigate(`/product/${p.id}`)}
                onAddToCart={(p, size, color) => handleAddToCart(p, size, color, 1)}
                wishlistIds={wishlistIds}
                onToggleWishlist={handleToggleWishlist}
              />
            }
          />
          <Route
            path="/sale"
            element={
              <CollectionPage
                currentCategory="sale"
                products={products}
                onNavigate={handleNavigate}
                onSelectProduct={(p) => handleNavigate(`/product/${p.id}`)}
                onAddToCart={(p, size, color) => handleAddToCart(p, size, color, 1)}
                wishlistIds={wishlistIds}
                onToggleWishlist={handleToggleWishlist}
              />
            }
          />
          <Route
            path="/hasan-raheem-collection"
            element={
              <CollectionPage
                currentCategory="hasan-raheem-collection"
                products={products}
                onNavigate={handleNavigate}
                onSelectProduct={(p) => handleNavigate(`/product/${p.id}`)}
                onAddToCart={(p, size, color) => handleAddToCart(p, size, color, 1)}
                wishlistIds={wishlistIds}
                onToggleWishlist={handleToggleWishlist}
              />
            }
          />

          {/* Product Detail Page */}
          <Route
            path="/product/:id"
            element={
              <ProductDetailPageWrapper
                products={products}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                onNavigate={handleNavigate}
              />
            }
          />

          {/* Cart & Instant Checkout Page */}
          <Route
            path="/cart"
            element={
              <CartPage
                items={cart}
                onUpdateQuantity={handleUpdateCartQuantity}
                onRemoveItem={handleRemoveCartItem}
                onNavigate={handleNavigate}
                onProceedToCheckout={handleProceedToCheckout}
                onMoveToWishlist={(p, cartItemId) => {
                  handleToggleWishlist(p);
                  handleRemoveCartItem(cartItemId);
                }}
                onSelectProduct={(p) => handleNavigate(`/product/${p.id}`)}
                allProducts={products}
              />
            }
          />

          {/* Order Tracking Radar Page */}
          <Route
            path="/track-order"
            element={
              <TrackOrderPage
                onNavigate={handleNavigate}
                recentOrders={orders}
              />
            }
          />

          {/* Store Locator Page */}
          <Route
            path="/stores"
            element={<StoreLocatorPage onNavigate={handleNavigate} />}
          />

          {/* Admin Operations Console Page */}
          <Route
            path="/admin"
            element={
              <AdminDashboardPage
                onNavigate={handleNavigate}
                currentUser={currentUser}
                onLogin={handleLogin}
                onLogout={handleLogout}
                products={products}
                recentLocalOrders={orders}
              />
            }
          />

          {/* Dedicated Member Auth & Account Routes */}
          <Route
            path="/login"
            element={
              <div className="py-24 text-center">
                <div className="max-w-md mx-auto p-6 border-2 border-[#0A0A0A] bg-white shadow-hard">
                  <div className="font-mono text-xs uppercase font-bold text-[#0062FF] mb-2">CSENZO × NDURE AUTH</div>
                  <h2 className="text-xl font-black font-display uppercase text-[#0A0A0A] mb-3">Authenticating Kinetic Session</h2>
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="px-4 py-2.5 bg-[#0A0A0A] text-white font-mono text-xs font-bold uppercase hover:bg-[#0062FF] transition-colors"
                  >
                    Open Member Gate
                  </button>
                </div>
              </div>
            }
          />
          <Route
            path="/account"
            element={
              <div className="py-24 text-center">
                <div className="max-w-md mx-auto p-6 border-2 border-[#0A0A0A] bg-white shadow-hard">
                  <div className="font-mono text-xs uppercase font-bold text-[#0062FF] mb-2">CSENZO × NDURE ACCOUNT</div>
                  <h2 className="text-xl font-black font-display uppercase text-[#0A0A0A] mb-3">Member &amp; Security Hub</h2>
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="px-4 py-2.5 bg-[#0A0A0A] text-white font-mono text-xs font-bold uppercase hover:bg-[#0062FF] transition-colors"
                  >
                    View Account &amp; Clearances
                  </button>
                </div>
              </div>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Global Quick Modals */}
      {/* 1. Quick View Modal */}
      <ProductDetailModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        isWishlisted={quickViewProduct ? wishlistIds.has(quickViewProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
      />

      {/* 2. Slide-out Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* 3. Full Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        appliedDiscount={checkoutDiscount}
        appliedCouponCode={checkoutCoupon}
        initialPaymentMethod={checkoutPaymentMethod}
        onOrderPlaced={handleOrderPlaced}
        onTrackOrderDirectly={handleTrackOrderDirectly}
      />

      {/* 4. Instant Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onSelectProduct={(p) => {
          setIsSearchOpen(false);
          handleNavigate(`/product/${p.id}`);
        }}
      />

      {/* 5. Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlistProducts}
        onRemoveFromWishlist={handleToggleWishlist}
        onSelectProduct={(p) => {
          setIsWishlistOpen(false);
          handleNavigate(`/product/${p.id}`);
        }}
      />

      {/* 6. Kinetic Member Authentication & Security Center Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          if (location.pathname === '/login' || location.pathname === '/account') {
            handleNavigate('/');
          }
        }}
        user={currentUser}
        isLoggingIn={isLoggingIn}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        allLocalOrders={orders}
      />
    </div>
  );
}

// Wrapper to extract :category param
function CollectionPageWrapper({
  products,
  onNavigate,
  onSelectProduct,
  onAddToCart,
  wishlistIds,
  onToggleWishlist,
}: {
  products: Product[];
  onNavigate: (path: string) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, size: number, color: ProductColor) => void;
  wishlistIds: Set<string>;
  onToggleWishlist: (product: Product) => void;
}) {
  const { category } = useParams<{ category: string }>();

  return (
    <CollectionPage
      currentCategory={category || 'all'}
      products={products}
      onNavigate={onNavigate}
      onSelectProduct={onSelectProduct}
      onAddToCart={onAddToCart}
      wishlistIds={wishlistIds}
      onToggleWishlist={onToggleWishlist}
    />
  );
}

// Wrapper to extract :id param
function ProductDetailPageWrapper({
  products,
  onAddToCart,
  onBuyNow,
  onNavigate,
}: {
  products: Product[];
  onAddToCart: (product: Product, size: number, color: ProductColor, quantity?: number) => void;
  onBuyNow: (product: Product, size: number, color: ProductColor, quantity?: number) => void;
  onNavigate: (path: string) => void;
}) {
  const { id } = useParams<{ id: string }>();
  const product = products.find((p) => p.id === id || p.slug === id) || products[0];

  return (
    <ProductDetailPage
      product={product}
      onAddToCart={onAddToCart}
      onBuyNow={onBuyNow}
      onNavigate={onNavigate}
      onSelectProduct={(p) => onNavigate(`/product/${p.id}`)}
      allProducts={products}
    />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <MainLayout />
    </BrowserRouter>
  );
}
