import React, { useState } from 'react';
import { CartItem, Product } from '../types';
import { formatPrice } from '../utils/format';
import { 
  LocalShipping, 
  Favorite, 
  DeleteIcon, 
  ArrowForward, 
  CheckIcon, 
  Verified, 
  StoreIcon, 
  LockIcon, 
  Headphones, 
  RocketLaunch,
  ChevronLeft
} from '../components/Icons';

interface CartPageProps {
  items: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQuantity: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onNavigate: (path: string) => void;
  onProceedToCheckout: (discountAmount: number, couponCode: string, paymentMethod: 'cod' | 'card') => void;
  onMoveToWishlist: (product: Product, cartItemId: string) => void;
  onSelectProduct: (product: Product) => void;
  allProducts: Product[];
}

export const CartPage: React.FC<CartPageProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onNavigate,
  onProceedToCheckout,
  onMoveToWishlist,
  onSelectProduct,
  allProducts,
}) => {
  const [paymentMode, setPaymentMode] = useState<'cod' | 'card'>('card');
  const [promoCode, setPromoCode] = useState<string>('NDUREFIRST');
  const [appliedDiscountPercent, setAppliedDiscountPercent] = useState<number>(10);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [creaseShieldAdded, setCreaseShieldAdded] = useState<boolean>(false);
  const [socksAdded, setSocksAdded] = useState<boolean>(false);

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    + (creaseShieldAdded ? 499 : 0)
    + (socksAdded ? 699 : 0);

  // Free shipping threshold (Rs. 3,000)
  const isFreeShipping = subtotal >= 3000;
  const shippingProgress = Math.min(100, Math.round((subtotal / 3000) * 100));

  // Calculate discount
  const discountAmount = appliedDiscountPercent > 0 
    ? Math.round((subtotal * appliedDiscountPercent) / 100) 
    : 0;

  // Extra 5% off if paid online
  const onlinePaymentBonus = paymentMode === 'card' ? Math.round(subtotal * 0.05) : 0;

  const totalPayable = Math.max(0, subtotal - discountAmount - onlinePaymentBonus);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.toUpperCase() === 'NDUREFIRST' || promoCode.toUpperCase() === 'CSENZO10') {
      setAppliedDiscountPercent(10);
      setPromoError(null);
    } else if (promoCode.toUpperCase() === 'STREET20') {
      setAppliedDiscountPercent(20);
      setPromoError(null);
    } else {
      setPromoError('Invalid coupon code');
    }
  };

  const handleRemovePromo = () => {
    setAppliedDiscountPercent(0);
    setPromoCode('');
  };

  const recommendations = allProducts.slice(0, 4);

  return (
    <div className="w-full flex flex-col">
      {/* Top Marquee Delivery Progression Strip */}
      <section className="w-full bg-[#000000] text-white py-2.5 px-4 sm:px-8 lg:px-12 border-b-2 border-[#0A0A0A]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-none bg-[#DFFF00] text-[#000000]">
              <LocalShipping className="w-4 h-4" />
            </span>
            <span className="text-xs uppercase tracking-wider font-mono">
              🎉 You've unlocked <strong className="text-[#DFFF00] font-bold">FREE Nationwide Express Delivery</strong> (Order is above Rs. 3,000)
            </span>
          </div>

          {/* Progress visualizer */}
          <div className="flex items-center gap-3 w-full md:w-72">
            <div className="w-full bg-white/20 h-2 overflow-hidden border border-white/40">
              <div 
                className="bg-[#DFFF00] h-full transition-all duration-300"
                style={{ width: `${shippingProgress}%` }}
              ></div>
            </div>
            <span className="text-[10px] font-mono text-[#DFFF00] font-bold uppercase tracking-widest whitespace-nowrap">
              {shippingProgress}% UNLOCKED
            </span>
          </div>
        </div>
      </section>

      {/* Main Bag & Instant Checkout Layout */}
      <section className="w-full px-4 sm:px-8 lg:px-12 py-8 bg-[#fdf8f8]">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          
          {/* Headline & Bag Status Indicator */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 pb-3 border-b-2 border-[#0A0A0A]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#747878]">
                  SECURE CHECKOUT CONSOLE
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#004ccb]"></span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#004ccb] font-bold">
                  SESSION ACTIVE
                </span>
              </div>
              <h1 className="font-anton text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-[#000000] leading-none">
                SHOPPING BAG <span className="text-[#004ccb]">({items.length} ITEMS)</span>
              </h1>
            </div>

            <button
              onClick={() => onNavigate('/men')}
              className="text-xs font-bold uppercase tracking-wider text-[#444748] hover:text-black transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>CONTINUE BROWSING</span>
            </button>
          </div>

          {/* Two-Column Checkout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Bag Items, Upsells & Shipping Methods (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              {/* Items List Container */}
              <div className="flex flex-col gap-4">
                {items.length === 0 ? (
                  <div className="bg-white border-2 border-[#0A0A0A] p-12 text-center space-y-4 shadow-hard-sm">
                    <p className="font-anton text-2xl uppercase text-[#000000]">YOUR BAG IS EMPTY</p>
                    <p className="text-xs text-[#747878]">Explore our latest streetwear drops and Hasan Raheem Capsule collection.</p>
                    <button
                      onClick={() => onNavigate('/men')}
                      className="px-6 py-3 bg-[#000000] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#004ccb] transition-colors cursor-pointer"
                    >
                      Shop Sneakers
                    </button>
                  </div>
                ) : (
                  items.map((item) => (
                    <article
                      key={item.cartItemId}
                      className="relative bg-[#F4F4F6] border-2 border-[#0A0A0A] p-4 shadow-hard-sm transition-all flex flex-col sm:flex-row gap-4 group"
                    >
                      {/* Item Image */}
                      <div className="relative w-full sm:w-36 h-40 sm:h-36 bg-white border border-[#0A0A0A] flex-shrink-0 overflow-hidden">
                        <img
                          src={item.product.thumbnail}
                          alt={item.product.name}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute top-2 left-2 bg-[#FF3366] text-white text-[8px] font-mono uppercase tracking-widest px-1.5 py-0.5 font-bold">
                          {item.product.isCapsule ? 'CAPSULE DROP' : 'AUTHENTIC'}
                        </span>
                      </div>

                      {/* Item Information */}
                      <div className="flex flex-col justify-between flex-grow">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <span className="text-[10px] font-mono uppercase tracking-widest text-[#747878] font-semibold block">
                              {item.product.subtitle || 'HASAN RAHEEM X NDURE'}
                            </span>
                            <h2 
                              onClick={() => onSelectProduct(item.product)}
                              className="font-anton text-lg uppercase tracking-tight text-[#000000] leading-tight mt-0.5 hover:text-[#004ccb] cursor-pointer"
                            >
                              {item.product.name}
                            </h2>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-[#444748]">
                              <span>SIZE: <strong className="text-black font-bold font-mono">{item.selectedSize} EU</strong></span>
                              <span>COLOR: <strong className="text-black font-bold">{item.selectedColor.name}</strong></span>
                              <span className="text-[10px] font-mono text-[#004ccb] uppercase font-bold tracking-wider">
                                In Stock (Lahore Hub)
                              </span>
                            </div>
                          </div>

                          <div className="text-right flex-shrink-0">
                            <p className="font-anton text-lg text-[#000000]">
                              {formatPrice(item.product.price * item.quantity)}
                            </p>
                            {item.product.originalPrice && (
                              <span className="text-[11px] text-[#747878] line-through font-mono">
                                {formatPrice(item.product.originalPrice * item.quantity)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Bottom Controls: Counter and Actions */}
                        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 mt-2 border-t border-[#e5e2e1]">
                          {/* Stepper */}
                          <div className="flex items-center bg-white border border-[#0A0A0A] shadow-xs">
                            <button
                              aria-label="Decrease quantity"
                              onClick={() => onUpdateQuantity(item.cartItemId, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center text-black hover:bg-gray-100 font-bold text-base cursor-pointer"
                            >
                              −
                            </button>
                            <span className="w-9 text-center text-xs font-bold text-black font-mono">
                              {item.quantity}
                            </span>
                            <button
                              aria-label="Increase quantity"
                              onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center text-black hover:bg-gray-100 font-bold text-base cursor-pointer"
                            >
                              +
                            </button>
                          </div>

                          {/* Item Actions */}
                          <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider">
                            <button
                              onClick={() => onMoveToWishlist(item.product, item.cartItemId)}
                              className="text-[#747878] hover:text-[#004ccb] flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Favorite className="w-3.5 h-3.5" />
                              <span>Move to Wishlist</span>
                            </button>
                            <button
                              onClick={() => onRemoveItem(item.cartItemId)}
                              className="text-[#E60000] hover:opacity-80 flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <DeleteIcon className="w-3.5 h-3.5" />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>

              {/* Delivery Mode Selector */}
              <div className="bg-[#f7f3f2] p-4 border-2 border-[#0A0A0A] flex flex-col gap-3 shadow-hard-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-black flex items-center gap-2">
                    <LocalShipping className="w-4 h-4 text-[#004ccb]" />
                    <span>Select Payment &amp; Fulfillment Mode</span>
                  </span>
                  <span className="text-[9px] font-mono text-[#DFFF00] bg-black px-2 py-0.5 uppercase font-bold tracking-wider">
                    FAST DISPATCH
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Payment Option A: Cash on Delivery */}
                  <label
                    onClick={() => setPaymentMode('cod')}
                    className={`cursor-pointer p-4 border-2 transition-all flex items-start gap-3 relative ${
                      paymentMode === 'cod'
                        ? 'bg-white border-[#000000] shadow-hard-sm'
                        : 'bg-white/60 border-gray-300 hover:border-black'
                    }`}
                  >
                    <input
                      type="radio"
                      name="cart_payment_mode"
                      checked={paymentMode === 'cod'}
                      onChange={() => setPaymentMode('cod')}
                      className="mt-1 accent-black cursor-pointer"
                    />
                    <div className="flex flex-col">
                      <span className="font-anton text-sm uppercase text-black">
                        Cash On Delivery (COD)
                      </span>
                      <span className="text-xs text-[#444748] mt-0.5">
                        Pay in cash right at your doorstep upon parcel receipt anywhere in Pakistan.
                      </span>
                      <span className="text-[10px] font-mono text-[#747878] uppercase font-bold mt-2">
                        Rs. 0 Additional Fee
                      </span>
                    </div>
                  </label>

                  {/* Payment Option B: Online / Card / Yeylo */}
                  <label
                    onClick={() => setPaymentMode('card')}
                    className={`cursor-pointer p-4 border-2 transition-all flex items-start gap-3 relative ${
                      paymentMode === 'card'
                        ? 'bg-white border-[#000000] shadow-hard-sm'
                        : 'bg-white/60 border-gray-300 hover:border-black'
                    }`}
                  >
                    <div className="absolute -top-2.5 right-2 bg-[#004ccb] text-white px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider font-bold shadow-xs">
                      Extra 5% Off
                    </div>
                    <input
                      type="radio"
                      name="cart_payment_mode"
                      checked={paymentMode === 'card'}
                      onChange={() => setPaymentMode('card')}
                      className="mt-1 accent-black cursor-pointer"
                    />
                    <div className="flex flex-col">
                      <span className="font-anton text-sm uppercase text-black">
                        Pay Online / Card / Yeylo
                      </span>
                      <span className="text-xs text-[#444748] mt-0.5">
                        Instant Visa, Mastercard, JazzCash or 3-Month Split with Yeylo BNPL.
                      </span>
                      <span className="text-[10px] font-mono text-[#004ccb] uppercase font-bold mt-2 flex items-center gap-1">
                        <Verified className="w-3.5 h-3.5" />
                        <span>Instant Priority Dispatch</span>
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Upsell Quick-Add Recommendations Section */}
              <div className="bg-[#f1edec] p-4 border-2 border-[#0A0A0A]">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#747878] font-bold">
                      STREETWEAR CARE &amp; ACCENTS
                    </span>
                    <h3 className="font-anton text-lg uppercase text-black">
                      Complete Your Setup
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#004ccb] font-bold">
                    One-Tap Add
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Upsell 1 */}
                  <div className="bg-white p-3 border border-[#0A0A0A] flex items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 bg-[#F4F4F6] border border-gray-300 overflow-hidden shrink-0">
                        <img
                          src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=200&q=80"
                          alt="Ndure Crease Shield"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs uppercase text-black leading-tight">
                          Ndure Crease Shield
                        </h4>
                        <p className="text-[10px] text-[#747878] uppercase">Universal Pair (Fits 40-45)</p>
                        <span className="font-anton text-sm text-black">+Rs. 499</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setCreaseShieldAdded(!creaseShieldAdded)}
                      className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer border ${
                        creaseShieldAdded
                          ? 'bg-[#DFFF00] text-black border-black font-bold'
                          : 'bg-black text-white border-black hover:bg-[#004ccb]'
                      }`}
                    >
                      {creaseShieldAdded ? 'Added ✓' : '+ Add'}
                    </button>
                  </div>

                  {/* Upsell 2 */}
                  <div className="bg-white p-3 border border-[#0A0A0A] flex items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 bg-[#F4F4F6] border border-gray-300 overflow-hidden shrink-0">
                        <img
                          src="https://images.unsplash.com/photo-1582965372481-628d0959f97d?auto=format&fit=crop&w=200&q=80"
                          alt="Terry Crew Socks"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs uppercase text-black leading-tight">
                          Terry Crew Socks (3-Pk)
                        </h4>
                        <p className="text-[10px] text-[#747878] uppercase">Monochrome Ribbed Cushion</p>
                        <span className="font-anton text-sm text-black">+Rs. 699</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSocksAdded(!socksAdded)}
                      className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer border ${
                        socksAdded
                          ? 'bg-[#DFFF00] text-black border-black font-bold'
                          : 'bg-black text-white border-black hover:bg-[#004ccb]'
                      }`}
                    >
                      {socksAdded ? 'Added ✓' : '+ Add'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary, BNPL & Instant Pay Panel (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col gap-4 lg:sticky lg:top-24">
              <div className="bg-white border-2 border-[#0A0A0A] p-6 shadow-hard flex flex-col gap-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#e5e2e1]">
                  <h3 className="font-anton text-2xl uppercase tracking-wide text-black">
                    ORDER SUMMARY
                  </h3>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#747878] font-bold">
                    PKR CURRENCY
                  </span>
                </div>

                {/* Cost Line Items */}
                <div className="flex flex-col gap-2 py-1 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-[#444748]">Subtotal ({items.length} Items)</span>
                    <span className="font-anton text-sm text-black">Rs. {subtotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <span className="text-[#444748]">Nationwide Express Shipping</span>
                      <Verified className="w-3.5 h-3.5 text-[#004ccb]" />
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-[#004ccb] uppercase tracking-wider">FREE</span>
                      <span className="text-[10px] text-[#747878] line-through ml-1.5 font-mono">Rs. 250</span>
                    </div>
                  </div>

                  {appliedDiscountPercent > 0 && (
                    <div className="flex justify-between items-center text-[#E60000]">
                      <span>Promo: {promoCode} ({appliedDiscountPercent}%)</span>
                      <span className="font-anton text-sm">-Rs. {discountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  {onlinePaymentBonus > 0 && (
                    <div className="flex justify-between items-center text-[#004ccb]">
                      <span>Online Payment Discount (5%)</span>
                      <span className="font-anton text-sm">-Rs. {onlinePaymentBonus.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-[#747878] text-[11px]">
                    <span>Sales Tax &amp; Surcharges</span>
                    <span className="font-bold uppercase text-black">Included</span>
                  </div>
                </div>

                {/* Promo Code Input & Applied State */}
                <div className="bg-[#f1edec] p-3 border border-gray-300 flex flex-col gap-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#747878] font-bold">
                    PROMO / VOUCHER CODE
                  </span>
                  {appliedDiscountPercent > 0 ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="bg-[#E60000] text-white px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                          -{appliedDiscountPercent}% OFF
                        </span>
                        <span className="text-xs font-bold text-black font-mono tracking-wider">
                          {promoCode}
                        </span>
                      </div>
                      <button
                        onClick={handleRemovePromo}
                        className="text-[10px] font-bold uppercase tracking-wider text-[#747878] hover:text-[#E60000] underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyPromo} className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="ENTER COUPON..."
                        className="w-full px-2 py-1.5 bg-white border border-[#0A0A0A] text-xs font-mono uppercase outline-none"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1.5 bg-black text-white text-xs font-bold uppercase hover:bg-[#004ccb] cursor-pointer"
                      >
                        APPLY
                      </button>
                    </form>
                  )}
                  {promoError && (
                    <span className="text-[10px] text-red-600 font-bold">{promoError}</span>
                  )}
                </div>

                {/* Net Total Block */}
                <div className="bg-[#000000] text-white p-4 border border-black flex flex-col gap-1">
                  <div className="flex justify-between items-baseline">
                    <div>
                      <span className="font-anton text-xl uppercase tracking-wide text-white">
                        TOTAL PAYABLE
                      </span>
                      <p className="text-[9px] text-gray-400 uppercase font-mono">
                        Includes all applicable duties &amp; GST
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-anton text-2xl text-[#DFFF00]">
                        Rs. {totalPayable.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Primary Direct Checkout Button */}
                <button
                  disabled={items.length === 0}
                  onClick={() => onProceedToCheckout(discountAmount + onlinePaymentBonus, promoCode, paymentMode)}
                  className="w-full h-12 bg-[#000000] text-white hover:bg-[#004ccb] font-bold text-xs uppercase tracking-widest transition-all shadow-hard-sm flex items-center justify-center gap-2 cursor-pointer group disabled:opacity-40"
                >
                  <span>PROCEED TO SECURE CHECKOUT</span>
                  <ArrowForward className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Yeylo BNPL 3-Month Installment Banner */}
                <div className="bg-[#ebe7e6] p-3 border border-gray-300 flex flex-col gap-1 text-left">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] bg-black text-white px-1.5 py-0.5 font-bold uppercase font-mono">
                        Yeylo BNPL
                      </span>
                      <span className="text-xs font-bold text-black uppercase">Split in 3</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#004ccb] font-bold uppercase">0% Interest</span>
                  </div>
                  <p className="text-xs text-[#444748] mt-0.5">
                    Pay only <strong className="text-black font-bold">Rs. {Math.round(totalPayable / 3).toLocaleString()} today</strong>, and 2 equal monthly installments later.
                  </p>
                  <button 
                    onClick={() => onProceedToCheckout(discountAmount + onlinePaymentBonus, promoCode, 'card')}
                    className="mt-1 w-full py-2 bg-white text-black hover:bg-black hover:text-white text-[10px] font-bold uppercase tracking-wider transition-colors border border-black flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Buy in 3 installments of Rs. {Math.round(totalPayable / 3).toLocaleString()}</span>
                  </button>
                </div>

                {/* Ndure Trust Badges */}
                <div className="grid grid-cols-3 gap-1 pt-1 text-center">
                  <div className="flex flex-col items-center gap-1 p-2 bg-[#f7f3f2] border border-gray-200">
                    <Verified className="w-4 h-4 text-black" />
                    <span className="text-[9px] uppercase font-bold text-black leading-tight">100% Original</span>
                    <span className="text-[8px] text-[#747878] uppercase">Direct From Hub</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 p-2 bg-[#f7f3f2] border border-gray-200">
                    <StoreIcon className="w-4 h-4 text-black" />
                    <span className="text-[9px] uppercase font-bold text-black leading-tight">200+ Stores</span>
                    <span className="text-[8px] text-[#747878] uppercase">Exchange</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 p-2 bg-[#f7f3f2] border border-gray-200">
                    <LockIcon className="w-4 h-4 text-black" />
                    <span className="text-[9px] uppercase font-bold text-black leading-tight">256-Bit SSL</span>
                    <span className="text-[8px] text-[#747878] uppercase">Bank Grade</span>
                  </div>
                </div>

                {/* Instant Helpline Callout */}
                <div className="flex items-center justify-center gap-1 text-[11px] text-[#747878] pt-1">
                  <Headphones className="w-3.5 h-3.5 text-black" />
                  <span>
                    Assistance Required? Dial <a href="tel:04235880175" className="text-black font-bold hover:underline font-mono">042-35880175</a>
                  </span>
                </div>
              </div>

              {/* Fast Shipping Guarantee Box */}
              <div className="bg-[#f7f3f2] border-2 border-[#0A0A0A] p-4 shadow-hard-sm flex items-start gap-3">
                <div className="p-2 bg-black text-[#DFFF00] shrink-0">
                  <RocketLaunch className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-anton text-base uppercase text-black">
                    Dispatched Within 24-48 Hours
                  </h4>
                  <p className="text-xs text-[#444748] mt-0.5">
                    Orders placed before 4:00 PM PKT are processed on the same business day from our central Gulberg Lahore fulfilment terminal.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Cross-Sell Section */}
          <section className="mt-8 pt-6 bg-[#f7f3f2] p-6 border-2 border-[#0A0A0A]">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2 mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#004ccb] font-bold">
                  FRESH DROPS FOR YOU
                </span>
                <h3 className="font-anton text-2xl uppercase text-black tracking-tight mt-0.5">
                  YOU MIGHT ALSO LIKE
                </h3>
              </div>
              <span className="text-xs uppercase tracking-wider text-[#747878] font-bold">
                Street &amp; Athleisure Picks
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  onClick={() => onSelectProduct(rec)}
                  className="bg-white border-2 border-[#0A0A0A] flex flex-col justify-between group shadow-hard-sm hover:shadow-hard transition-all cursor-pointer"
                >
                  <div className="relative w-full aspect-square bg-[#F4F4F6] border-b border-[#0A0A0A] overflow-hidden">
                    <img
                      src={rec.thumbnail}
                      alt={rec.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-2 left-2 bg-black text-white text-[8px] font-mono uppercase px-1.5 py-0.5 font-bold">
                      {rec.isCapsule ? 'CAPSULE' : 'NEW'}
                    </span>
                  </div>
                  <div className="p-3 flex flex-col gap-1">
                    <span className="text-[9px] text-[#747878] uppercase font-bold">{rec.category}</span>
                    <h4 className="font-anton text-xs uppercase text-black line-clamp-1 group-hover:text-[#004ccb]">
                      {rec.name}
                    </h4>
                    <p className="font-anton text-sm text-black">{formatPrice(rec.price)}</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProduct(rec);
                      }}
                      className="mt-1 w-full py-1.5 bg-[#f1edec] text-black hover:bg-black hover:text-white text-[10px] font-bold uppercase tracking-wider transition-colors border border-black cursor-pointer"
                    >
                      Quick View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
};
