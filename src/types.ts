export type Gender = 'Men' | 'Women' | 'Kids' | 'Unisex';

export type ProductCategory = 
  | 'Sneakers'
  | 'Running'
  | 'Casual'
  | 'High-Tops'
  | 'Sliders & Slides'
  | 'Capsule'
  | 'Athleisure'
  | 'Apparel';

export interface ProductColor {
  name: string;
  hex: string;
  image?: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verifiedBuyer: boolean;
  fit: 'True to size' | 'Runs small' | 'Runs large';
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  subtitle: string;
  category: ProductCategory;
  gender: Gender;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  isNew?: boolean;
  isSale?: boolean;
  isCapsule?: boolean; // Hasan Raheem capsule drop
  badge?: string;
  images: string[];
  thumbnail: string;
  colors: ProductColor[];
  sizes: number[]; // EU sizes e.g. 39, 40, 41, 42, 43, 44, 45
  stockBySize: Record<number, number>;
  rating: number;
  reviewCount: number;
  reviews?: Review[];
  tags: string[];
  description: string;
  features: string[];
  specs: {
    upperMaterial: string;
    soleMaterial: string;
    closureType: string;
    insole: string;
    origin: string;
  };
}

export interface CartItem {
  cartItemId: string; // unique item id in cart
  product: Product;
  selectedSize: number;
  selectedColor: ProductColor;
  quantity: number;
}

export interface FilterState {
  gender: Gender | 'All';
  category: string;
  sizes: number[];
  priceRange: [number, number];
  discountOnly: boolean;
  capsuleOnly: boolean;
  inStockOnly: boolean;
  searchQuery: string;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'rating' | 'discount';
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  notes?: string;
}

export type PaymentMethod = 'cod' | 'card' | 'wallet' | 'bnpl';

export type PaymentStatus = 'PAID' | 'PENDING_COD' | 'VERIFIED_PAID' | 'PAYMENT_FAILED';

export interface Order {
  id: string;
  trackingNumber: string;
  date: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  paymentTitle: string;
  paymentStatus: PaymentStatus;
  userId?: string;
  transactionId?: string;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  couponCode?: string;
  total: number;
  status: 'Order Placed' | 'Warehouse Packed' | 'Dispatched (TCS/Trax)' | 'Out for Delivery' | 'Delivered';
  estimatedDelivery: string;
  createdAt?: string;
  createdAtIso?: string;
  updatedAtIso?: string;
  trackingEvents?: {
    status: string;
    description: string;
    timestamp: string;
    location?: string;
  }[];
}

export interface StoreLocation {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  hours: string;
  landmark: string;
}
