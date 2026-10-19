import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc,
  query, 
  where,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { 
  db, 
  auth, 
  googleProvider, 
  OperationType, 
  handleFirestoreError 
} from '../lib/firebase';
import { Order, Product, PaymentStatus } from '../types';
import { PRODUCTS } from '../data/products';

let isAuthInProgress = false;

export async function loginWithGoogle(): Promise<User | null> {
  if (isAuthInProgress) {
    console.info('Google Sign-In is already in progress.');
    return null;
  }

  isAuthInProgress = true;
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    const errorCode = error?.code || '';

    // Gracefully handle benign user-cancelled popup events without throwing
    if (
      errorCode === 'auth/cancelled-popup-request' ||
      errorCode === 'auth/popup-closed-by-user' ||
      errorCode === 'auth/user-cancelled'
    ) {
      console.info('Google Sign-In prompt was closed or cancelled by user.');
      return null;
    }

    if (errorCode === 'auth/popup-blocked') {
      throw new Error('Sign-in popup was blocked by your browser. Please allow popups.');
    }

    console.error('Google Sign-In Error:', error);
    throw error;
  } finally {
    isAuthInProgress = false;
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign Out Error:', error);
    throw error;
  }
}

export function subscribeToAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Save an order to Firestore `/orders/{orderId}`
 */
export async function saveOrderToFirestore(order: Order): Promise<void> {
  // Normalize order ID for Firestore document key (e.g. #ND-882314 -> ND-882314)
  const cleanId = order.id.replace(/[^a-zA-Z0-9_-]/g, '') || `ORD-${Date.now()}`;
  const path = `orders/${cleanId}`;

  try {
    const orderRef = doc(db, 'orders', cleanId);
    await setDoc(orderRef, {
      ...order,
      createdAtIso: new Date().toISOString(),
      updatedAtIso: new Date().toISOString(),
    });
    console.log(`Order ${order.id} saved to Firestore successfully.`);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

/**
 * Find order by order ID or tracking number from Firestore
 */
export async function findOrderInFirestore(queryParam: string): Promise<Order | null> {
  const cleanQuery = queryParam.trim();
  const cleanId = cleanQuery.replace(/[^a-zA-Z0-9_-]/g, '');

  // 1. Try direct document get
  if (cleanId) {
    try {
      const directDoc = await getDoc(doc(db, 'orders', cleanId));
      if (directDoc.exists()) {
        return directDoc.data() as Order;
      }
    } catch {
      // Continue to search query
    }
  }

  // 2. Query by trackingNumber or original id
  try {
    const ordersCol = collection(db, 'orders');
    const q1 = query(ordersCol, where('trackingNumber', '==', cleanQuery));
    const snap1 = await getDocs(q1);
    if (!snap1.empty) {
      return snap1.docs[0].data() as Order;
    }

    const q2 = query(ordersCol, where('id', '==', cleanQuery));
    const snap2 = await getDocs(q2);
    if (!snap2.empty) {
      return snap2.docs[0].data() as Order;
    }
  } catch (error) {
    console.warn('Firestore order query failed or restricted, falling back:', error);
  }

  return null;
}

/**
 * Retrieve an authenticated customer's order history from Firestore
 */
export async function getUserOrdersFromFirestore(userId?: string, email?: string): Promise<Order[]> {
  if (!userId && !email) return [];
  const results: Order[] = [];
  const seenIds = new Set<string>();

  try {
    const ordersCol = collection(db, 'orders');

    if (userId) {
      try {
        const qUser = query(ordersCol, where('userId', '==', userId));
        const snapUser = await getDocs(qUser);
        snapUser.forEach((d) => {
          const ord = d.data() as Order;
          if (!seenIds.has(ord.id)) {
            seenIds.add(ord.id);
            results.push(ord);
          }
        });
      } catch (err) {
        console.warn('Query user orders by userId failed or restricted:', err);
      }
    }

    if (email) {
      try {
        const qEmail = query(ordersCol, where('shippingAddress.email', '==', email.trim().toLowerCase()));
        const snapEmail = await getDocs(qEmail);
        snapEmail.forEach((d) => {
          const ord = d.data() as Order;
          if (!seenIds.has(ord.id)) {
            seenIds.add(ord.id);
            results.push(ord);
          }
        });
      } catch (err) {
        console.warn('Query user orders by email failed or restricted:', err);
      }
    }
  } catch (err) {
    console.error('Error fetching user orders from Firestore:', err);
  }

  // Sort newest first
  results.sort((a, b) => {
    const dateA = new Date(a.createdAtIso || a.createdAt || a.date || 0).getTime();
    const dateB = new Date(b.createdAtIso || b.createdAt || b.date || 0).getTime();
    return dateB - dateA;
  });

  return results;
}

/**
 * Save newsletter subscriber to Firestore `/subscribers`
 */
export async function saveSubscriberToFirestore(email: string): Promise<void> {
  const cleanEmail = email.trim().toLowerCase();
  const docId = cleanEmail.replace(/[^a-zA-Z0-9_]/g, '_');
  const path = `subscribers/${docId}`;

  try {
    const subRef = doc(db, 'subscribers', docId);
    await setDoc(subRef, {
      email: cleanEmail,
      subscribedAt: new Date().toISOString(),
    });
    console.log(`Subscriber ${cleanEmail} saved to Firestore.`);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export const ADMIN_EMAIL = 'waleedliaqat69@gmail.com';

/**
 * Verifies if user has administrator authorization
 */
export function isAdminUser(user: User | null): boolean {
  if (!user || !user.email) return false;
  return user.email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase();
}

/**
 * Fetch all orders from Firestore (Administrator restricted)
 */
export async function getAllOrdersFromFirestore(): Promise<Order[]> {
  try {
    const ordersCol = collection(db, 'orders');
    const snapshot = await getDocs(ordersCol);
    if (snapshot.empty) {
      return [];
    }
    const orders: Order[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as Order;
      orders.push(data);
    });

    // Sort newest first
    orders.sort((a, b) => {
      const dateA = new Date(a.createdAtIso || a.createdAt || a.date || 0).getTime();
      const dateB = new Date(b.createdAtIso || b.createdAt || b.date || 0).getTime();
      return dateB - dateA;
    });

    return orders;
  } catch (error) {
    console.warn('Could not read all orders from Firestore:', error);
    return [];
  }
}

/**
 * Update an order's status in Firestore (Admin action)
 */
export async function updateOrderStatusInFirestore(
  orderId: string, 
  newStatus: Order['status'],
  note?: string
): Promise<boolean> {
  const cleanId = orderId.replace(/[^a-zA-Z0-9_-]/g, '');
  const path = `orders/${cleanId}`;

  try {
    const orderRef = doc(db, 'orders', cleanId);
    const existingSnap = await getDoc(orderRef);
    
    const newEvent = {
      status: newStatus,
      description: note || `Order status updated to ${newStatus.replace('_', ' ').toUpperCase()}`,
      timestamp: new Date().toISOString(),
      location: 'Csenzo Logistics Hub, Lahore'
    };

    if (existingSnap.exists()) {
      const currentData = existingSnap.data() as Order;
      const currentEvents = currentData.trackingEvents || [];
      await updateDoc(orderRef, {
        status: newStatus,
        updatedAtIso: new Date().toISOString(),
        trackingEvents: [...currentEvents, newEvent]
      });
    } else {
      await updateDoc(orderRef, {
        status: newStatus,
        updatedAtIso: new Date().toISOString(),
      });
    }

    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
    return false;
  }
}

/**
 * Update an order's payment status in Firestore (Admin action)
 */
export async function updateOrderPaymentInFirestore(
  orderId: string, 
  newPaymentStatus: PaymentStatus,
  transactionId?: string
): Promise<boolean> {
  const cleanId = orderId.replace(/[^a-zA-Z0-9_-]/g, '');
  const path = `orders/${cleanId}`;

  try {
    const orderRef = doc(db, 'orders', cleanId);
    const updatePayload: Record<string, any> = {
      paymentStatus: newPaymentStatus,
      updatedAtIso: new Date().toISOString(),
    };
    if (transactionId) {
      updatePayload.transactionId = transactionId;
    }
    await updateDoc(orderRef, updatePayload);
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
    return false;
  }
}

/**
 * Fetch all subscribers from Firestore
 */
export async function getAllSubscribersFromFirestore(): Promise<{ email: string; subscribedAt: string }[]> {
  try {
    const subsCol = collection(db, 'subscribers');
    const snapshot = await getDocs(subsCol);
    const subscribers: { email: string; subscribedAt: string }[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data && data.email) {
        subscribers.push({
          email: data.email,
          subscribedAt: data.subscribedAt || new Date().toISOString()
        });
      }
    });
    return subscribers;
  } catch (error) {
    console.warn('Could not load subscribers from Firestore:', error);
    return [];
  }
}

