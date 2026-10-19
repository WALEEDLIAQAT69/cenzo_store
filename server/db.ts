import fs from 'fs';
import path from 'path';
import { Product, Order, PaymentStatus } from '../src/types';
import { PRODUCTS } from '../src/data/products';
import { STORE_LOCATIONS } from '../src/data/stores';

const DB_FILE = path.join(process.cwd(), 'database.json');

export interface DatabaseSchema {
  products: Product[];
  orders: Order[];
  coupons: { code: string; discountPercent: number; minOrder: number }[];
  subscribers: { email: string; date: string }[];
  stores: typeof STORE_LOCATIONS;
}

const INITIAL_DB: DatabaseSchema = {
  products: PRODUCTS,
  orders: [
    {
      id: '#ND-882314',
      trackingNumber: '7719203841',
      date: '18 Oct 2026',
      items: [
        {
          cartItemId: 'ord-item-1',
          product: PRODUCTS[0], // HR-01 Cyber Runner / HR Signature Court Low
          selectedSize: 42,
          selectedColor: PRODUCTS[0].colors[0],
          quantity: 1,
        },
        {
          cartItemId: 'ord-item-2',
          product: PRODUCTS[6], // Nomad Comfort Slide / Urban Comfort Slide
          selectedSize: 42,
          selectedColor: PRODUCTS[6].colors[0],
          quantity: 1,
        },
      ],
      shippingAddress: {
        fullName: 'Ali Raza',
        email: 'ali.raza@example.com',
        phone: '0301-4458921',
        address: 'House 42, Sector Y, DHA Phase 3',
        city: 'Karachi',
        postalCode: '75500',
        notes: 'Call before delivery',
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
          cartItemId: 'ord-item-3',
          product: PRODUCTS[2], // Kinetic Chunky Phantom
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
      paymentTitle: 'Online Card / Yeylo',
      paymentStatus: 'PAID',
      transactionId: 'TXN-VISA-984210',
      subtotal: 5499,
      shippingFee: 0,
      discountAmount: 500,
      total: 4999,
      status: 'Dispatched (TCS/Trax)',
      estimatedDelivery: 'Tomorrow by 2:00 PM',
    },
  ],
  coupons: [
    { code: 'NDUREFIRST', discountPercent: 10, minOrder: 2000 },
    { code: 'CSENZO10', discountPercent: 10, minOrder: 1500 },
    { code: 'STREET20', discountPercent: 20, minOrder: 4000 },
    { code: 'HASAN15', discountPercent: 15, minOrder: 3000 },
  ],
  subscribers: [
    { email: 'vip.street@csenzo.com', date: '2026-09-20' },
  ],
  stores: STORE_LOCATIONS,
};

function readDatabase(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DB, null, 2), 'utf-8');
      return INITIAL_DB;
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading database file, returning fallback:', err);
    return INITIAL_DB;
  }
}

function writeDatabase(data: DatabaseSchema): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing database file:', err);
  }
}

export const db = {
  getProducts(): Product[] {
    return readDatabase().products;
  },
  getProductBySlugOrId(identifier: string): Product | undefined {
    const products = readDatabase().products;
    return products.find(
      (p) => p.slug === identifier || p.id === identifier || p.name.toLowerCase().replace(/\s+/g, '-') === identifier.toLowerCase()
    );
  },
  getOrders(): Order[] {
    return readDatabase().orders;
  },
  findOrder(query: string): Order | undefined {
    const orders = readDatabase().orders;
    const cleanQuery = query.trim().replace(/^#/, '').toUpperCase();
    return orders.find(
      (o) =>
        o.id.replace(/^#/, '').toUpperCase() === cleanQuery ||
        o.trackingNumber.toUpperCase() === cleanQuery ||
        o.shippingAddress.phone.replace(/[^0-9]/g, '') === query.replace(/[^0-9]/g, '')
    );
  },
  createOrder(orderData: Omit<Order, 'id' | 'date'> & { id?: string; date?: string }): Order {
    const current = readDatabase();
    const orderId = orderData.id || `#ND-${Math.floor(100000 + Math.random() * 900000)}`;
    const trackingNumber = orderData.trackingNumber || `7719${Math.floor(100000 + Math.random() * 900000)}`;
    
    const newOrder: Order = {
      ...orderData,
      id: orderId,
      trackingNumber,
      date: orderData.date || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: orderData.status || 'Order Placed',
      paymentStatus: orderData.paymentStatus || (orderData.paymentMethod === 'cod' ? 'PENDING_COD' : 'PAID'),
      transactionId: orderData.transactionId || (orderData.paymentMethod !== 'cod' ? `TXN-${Math.floor(100000 + Math.random() * 900000)}` : undefined),
      estimatedDelivery: orderData.estimatedDelivery || '2-4 Business Days',
    };

    current.orders.unshift(newOrder);

    // Decrement stock for ordered items
    orderData.items.forEach((item) => {
      const prod = current.products.find((p) => p.id === item.product.id);
      if (prod && prod.stockBySize[item.selectedSize]) {
        prod.stockBySize[item.selectedSize] = Math.max(0, prod.stockBySize[item.selectedSize] - item.quantity);
      }
    });

    writeDatabase(current);
    return newOrder;
  },
  updateOrderStatus(
    orderId: string,
    updates: {
      status?: Order['status'];
      paymentStatus?: PaymentStatus;
      transactionId?: string;
      note?: string;
    }
  ): Order | null {
    const current = readDatabase();
    const cleanId = orderId.replace(/^#/, '').toUpperCase();
    const orderIndex = current.orders.findIndex(
      (o) => o.id.replace(/^#/, '').toUpperCase() === cleanId
    );
    if (orderIndex === -1) return null;

    const targetOrder = current.orders[orderIndex];
    if (updates.status) targetOrder.status = updates.status;
    if (updates.paymentStatus) targetOrder.paymentStatus = updates.paymentStatus;
    if (updates.transactionId) targetOrder.transactionId = updates.transactionId;
    targetOrder.updatedAtIso = new Date().toISOString();

    if (updates.status || updates.note) {
      if (!targetOrder.trackingEvents) targetOrder.trackingEvents = [];
      targetOrder.trackingEvents.push({
        status: updates.status || targetOrder.status,
        description: updates.note || `Order status updated to ${targetOrder.status}`,
        timestamp: new Date().toISOString(),
        location: 'Csenzo Logistics Hub, Lahore',
      });
    }

    current.orders[orderIndex] = targetOrder;
    writeDatabase(current);
    return targetOrder;
  },
  verifyCoupon(code: string, subtotal: number) {
    const coupons = readDatabase().coupons;
    const found = coupons.find((c) => c.code.toUpperCase() === code.trim().toUpperCase());
    if (!found) return { valid: false, message: 'Invalid promo code' };
    if (subtotal < found.minOrder) {
      return { valid: false, message: `Minimum order of Rs. ${found.minOrder.toLocaleString()} required for this code` };
    }
    return { valid: true, code: found.code, discountPercent: found.discountPercent };
  },
  addSubscriber(email: string) {
    const current = readDatabase();
    if (!current.subscribers.some((s) => s.email.toLowerCase() === email.toLowerCase())) {
      current.subscribers.push({ email, date: new Date().toISOString() });
      writeDatabase(current);
    }
    return { success: true, message: 'Successfully subscribed! Use code NDUREFIRST for 10% off.' };
  },
  getStores() {
    return readDatabase().stores;
  },
};
