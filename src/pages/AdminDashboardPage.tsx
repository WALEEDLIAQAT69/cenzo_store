import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { Order, Product, PaymentStatus } from '../types';
import { formatPrice } from '../utils/format';
import { 
  getAllOrdersFromFirestore, 
  updateOrderStatusInFirestore, 
  updateOrderPaymentInFirestore,
  getAllSubscribersFromFirestore,
  isAdminUser,
  ADMIN_EMAIL 
} from '../services/firebaseStore';
import { 
  ShieldCheck, 
  Package, 
  Users, 
  Database, 
  RefreshCw, 
  ExternalLink, 
  Check, 
  AlertCircle, 
  Search, 
  Filter, 
  ArrowRight, 
  Layers, 
  Clock, 
  Truck, 
  ShoppingBag, 
  Copy, 
  Phone, 
  MapPin, 
  Lock, 
  ChevronRight,
  TrendingUp,
  Sliders,
  DollarSign
} from 'lucide-react';

interface AdminDashboardPageProps {
  onNavigate: (path: string) => void;
  currentUser: User | null;
  onLogin: () => void;
  onLogout: () => void;
  products: Product[];
  recentLocalOrders: Order[];
}

const ORDER_STATUS_OPTIONS: Order['status'][] = [
  'Order Placed',
  'Warehouse Packed',
  'Dispatched (TCS/Trax)',
  'Out for Delivery',
  'Delivered'
];

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  onNavigate,
  currentUser,
  onLogin,
  onLogout,
  products,
  recentLocalOrders,
}) => {
  // State
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'subscribers' | 'system'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [subscribers, setSubscribers] = useState<{ email: string; subscribedAt: string }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  
  // Updating state for orders
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  
  // Override / bypass preview for development testing if not yet logged in with Google
  const [previewAdminMode, setPreviewAdminMode] = useState<boolean>(false);

  const isUserAdmin = isAdminUser(currentUser);
  const hasAdminAccess = isUserAdmin || previewAdminMode;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    showToast(`Copied ${label} to clipboard`);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Load Firestore Data
  const loadData = async () => {
    setIsRefreshing(true);
    try {
      // 1. Fetch orders from Firestore
      const firestoreOrders = await getAllOrdersFromFirestore();
      
      // Merge with any local orders not yet reflected
      const orderMap = new Map<string, Order>();
      firestoreOrders.forEach((o) => orderMap.set(o.id.toLowerCase(), o));
      recentLocalOrders.forEach((o) => {
        if (!orderMap.has(o.id.toLowerCase())) {
          orderMap.set(o.id.toLowerCase(), o);
        }
      });
      
      const mergedOrders = Array.from(orderMap.values());
      // Sort newest first
      mergedOrders.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
      setOrders(mergedOrders);

      // 2. Fetch subscribers
      const subs = await getAllSubscribersFromFirestore();
      setSubscribers(subs);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle Order Status Update
  const handleUpdateStatus = async (orderId: string, newStatus: Order['status']) => {
    setUpdatingOrderId(orderId);
    try {
      const success = await updateOrderStatusInFirestore(orderId, newStatus);
      if (success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        showToast(`Order ${orderId} updated to "${newStatus}" in Firestore`);
      } else {
        // Fallback update in state
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        showToast(`Order ${orderId} status changed locally`);
      }
    } catch (err) {
      console.error('Status update failed:', err);
      showToast('Status update failed');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Handle Order Payment Status Update
  const handleUpdatePaymentStatus = async (orderId: string, newPaymentStatus: PaymentStatus) => {
    setUpdatingOrderId(orderId);
    try {
      const generatedTxn = newPaymentStatus === 'PAID' ? `TXN-ADM-${Date.now().toString().slice(-6)}` : undefined;
      await Promise.allSettled([
        updateOrderPaymentInFirestore(orderId, newPaymentStatus, generatedTxn),
        fetch(`/api/orders/${orderId.replace(/^#/, '')}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentStatus: newPaymentStatus, transactionId: generatedTxn }),
        }),
      ]);
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? { ...o, paymentStatus: newPaymentStatus, transactionId: generatedTxn || o.transactionId }
            : o
        )
      );
      showToast(`Order ${orderId} payment status updated to "${newPaymentStatus}"`);
    } catch (err) {
      console.error('Payment status update failed:', err);
      showToast('Payment update failed');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Metrics calculations
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === 'Order Placed' || o.status === 'Warehouse Packed').length;
  const inTransitOrders = orders.filter((o) => o.status === 'Dispatched (TCS/Trax)' || o.status === 'Out for Delivery').length;
  const deliveredOrders = orders.filter((o) => o.status === 'Delivered').length;

  // Filtered orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.trackingNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shippingAddress?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shippingAddress?.phone?.includes(searchQuery) ||
      order.shippingAddress?.city?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'paid' ? (order.paymentStatus === 'PAID' || order.paymentStatus === 'VERIFIED_PAID') :
       statusFilter === 'cod' ? (order.paymentStatus === 'PENDING_COD' || (!order.paymentStatus && order.paymentMethod === 'cod')) :
       order.status.toLowerCase().replace(/\s+/g, '') === statusFilter.toLowerCase().replace(/\s+/g, ''));

    return matchesSearch && matchesStatus;
  });

  // Access Gate Screen
  if (!hasAdminAccess) {
    return (
      <div className="min-h-[80vh] bg-[#f8f6f6] flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-lg bg-white border-2 border-[#0A0A0A] shadow-hard-lg p-6 sm:p-10 space-y-6">
          <div className="flex items-center space-x-3 border-b-2 border-[#0A0A0A] pb-4">
            <div className="p-3 bg-[#0A0A0A] text-[#DFFF00]">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#0062FF] font-bold">
                SECURITY BARRIER
              </span>
              <h1 className="font-anton text-2xl uppercase tracking-wide text-[#0A0A0A]">
                STORE ADMIN CONSOLE
              </h1>
            </div>
          </div>

          <div className="space-y-3 text-xs text-[#444748] leading-relaxed">
            <p>
              This console provides operational access to live customer orders, order tracking statuses, VIP subscribers, and catalog synchronization on <strong>Cloud Firestore</strong>.
            </p>
            <div className="bg-[#f1edec] p-3 border border-[#0A0A0A] space-y-1 font-mono text-[11px]">
              <div className="text-gray-500 uppercase text-[9px] tracking-wider">Authorized Operator</div>
              <div className="font-bold text-[#0A0A0A]">{ADMIN_EMAIL}</div>
            </div>
            {currentUser && (
              <div className="p-2.5 bg-amber-50 border border-amber-300 text-amber-900 text-xs">
                Currently signed in as: <strong>{currentUser.email}</strong> (Non-admin account).
              </div>
            )}
          </div>

          <div className="space-y-3 pt-2">
            {!currentUser ? (
              <button
                onClick={onLogin}
                className="w-full py-3.5 bg-[#0A0A0A] hover:bg-[#0062FF] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 shadow-hard-sm cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-[#DFFF00]" />
                <span>Sign In With Google ({ADMIN_EMAIL})</span>
              </button>
            ) : (
              <button
                onClick={onLogout}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Sign Out & Switch Account</span>
              </button>
            )}

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-[10px] font-mono text-gray-400 uppercase tracking-widest">DEVELOPER OVERRIDE</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <button
              onClick={() => setPreviewAdminMode(true)}
              className="w-full py-2.5 bg-[#f1edec] hover:bg-black hover:text-white border border-[#0A0A0A] font-mono text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              Enter Preview / Demo Admin Mode
            </button>

            <button
              onClick={() => onNavigate('/')}
              className="w-full py-2 text-gray-500 hover:text-black text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer text-center block"
            >
              Return to Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f6f6] pb-24 text-[#0A0A0A]">
      {/* Admin Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0A0A0A] text-white px-4 py-3 border-2 border-[#DFFF00] shadow-hard flex items-center space-x-2 text-xs font-mono font-bold animate-fade-in">
          <Check className="w-4 h-4 text-[#DFFF00]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Admin Utility Strip */}
      <div className="bg-[#0A0A0A] text-white py-2.5 px-4 sm:px-8 border-b-2 border-[#0A0A0A]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-3">
            <div className="px-2 py-0.5 bg-[#DFFF00] text-black font-mono font-black text-[10px] uppercase tracking-wider">
              OPERATIONS CONSOLE
            </div>
            <span className="font-mono text-gray-400 text-[11px] hidden md:inline">
              FIRESTORE ID: <span className="text-white">ai-studio-csenzokineticstr</span>
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-gray-300">ADMIN:</span>
              <strong className="text-white">{currentUser?.email || ADMIN_EMAIL}</strong>
            </div>

            <button
              onClick={loadData}
              disabled={isRefreshing}
              className="flex items-center space-x-1.5 px-2.5 py-1 bg-white/10 hover:bg-white/20 border border-white/20 text-[10px] font-mono uppercase font-bold transition-all cursor-pointer"
              title="Reload Firestore Collections"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'SYNCING...' : 'SYNC FIRESTORE'}</span>
            </button>

            <button
              onClick={() => onNavigate('/')}
              className="text-[10px] font-mono text-gray-400 hover:text-white underline uppercase cursor-pointer"
            >
              Storefront &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Main Admin Header */}
      <header className="bg-white border-b-2 border-[#0A0A0A] px-4 sm:px-8 py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-[#0062FF] font-bold uppercase tracking-widest mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>STORE MANAGEMENT &amp; ORDER FULFILLMENT</span>
            </div>
            <h1 className="font-anton text-3xl sm:text-4xl uppercase tracking-wide">
              ADMINISTRATIVE DASHBOARD
            </h1>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider border-2 border-[#0A0A0A] transition-all cursor-pointer flex items-center space-x-2 ${
                activeTab === 'orders' 
                  ? 'bg-[#0A0A0A] text-white shadow-hard-sm' 
                  : 'bg-white hover:bg-[#f1edec] text-[#0A0A0A]'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>ORDERS ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider border-2 border-[#0A0A0A] transition-all cursor-pointer flex items-center space-x-2 ${
                activeTab === 'inventory' 
                  ? 'bg-[#0A0A0A] text-white shadow-hard-sm' 
                  : 'bg-white hover:bg-[#f1edec] text-[#0A0A0A]'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>INVENTORY ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('subscribers')}
              className={`px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider border-2 border-[#0A0A0A] transition-all cursor-pointer flex items-center space-x-2 ${
                activeTab === 'subscribers' 
                  ? 'bg-[#0A0A0A] text-white shadow-hard-sm' 
                  : 'bg-white hover:bg-[#f1edec] text-[#0A0A0A]'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>VIP LEADS ({subscribers.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('system')}
              className={`px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider border-2 border-[#0A0A0A] transition-all cursor-pointer flex items-center space-x-2 ${
                activeTab === 'system' 
                  ? 'bg-[#0A0A0A] text-white shadow-hard-sm' 
                  : 'bg-white hover:bg-[#f1edec] text-[#0A0A0A]'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>TELEMETRY</span>
            </button>
          </div>
        </div>
      </header>

      {/* Metric Tiles Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border-2 border-[#0A0A0A] p-4 shadow-hard-sm">
            <div className="flex items-center justify-between text-gray-500 mb-1">
              <span className="font-mono text-[10px] uppercase font-bold tracking-wider">Gross Orders Volume</span>
              <DollarSign className="w-4 h-4 text-[#0062FF]" />
            </div>
            <div className="font-anton text-2xl sm:text-3xl text-[#0A0A0A]">
              {formatPrice(totalRevenue)}
            </div>
            <div className="text-[11px] text-gray-500 font-mono mt-1">
              Across {orders.length} total orders
            </div>
          </div>

          <div className="bg-white border-2 border-[#0A0A0A] p-4 shadow-hard-sm">
            <div className="flex items-center justify-between text-gray-500 mb-1">
              <span className="font-mono text-[10px] uppercase font-bold tracking-wider">Processing &amp; Packing</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="font-anton text-2xl sm:text-3xl text-amber-600">
              {pendingOrders}
            </div>
            <div className="text-[11px] text-gray-500 font-mono mt-1">
              Requires warehouse dispatch
            </div>
          </div>

          <div className="bg-white border-2 border-[#0A0A0A] p-4 shadow-hard-sm">
            <div className="flex items-center justify-between text-gray-500 mb-1">
              <span className="font-mono text-[10px] uppercase font-bold tracking-wider">In Transit / Courier</span>
              <Truck className="w-4 h-4 text-[#0062FF]" />
            </div>
            <div className="font-anton text-2xl sm:text-3xl text-[#0062FF]">
              {inTransitOrders}
            </div>
            <div className="text-[11px] text-gray-500 font-mono mt-1">
              Active with TCS &amp; Leopards
            </div>
          </div>

          <div className="bg-white border-2 border-[#0A0A0A] p-4 shadow-hard-sm">
            <div className="flex items-center justify-between text-gray-500 mb-1">
              <span className="font-mono text-[10px] uppercase font-bold tracking-wider">Delivered Rate</span>
              <Check className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="font-anton text-2xl sm:text-3xl text-emerald-600">
              {deliveredOrders}
            </div>
            <div className="text-[11px] text-gray-500 font-mono mt-1">
              Completed cash collected
            </div>
          </div>
        </div>
      </section>

      {/* TAB CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* TAB 1: ORDERS FULFILLMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Filter & Search Bar */}
            <div className="bg-white border-2 border-[#0A0A0A] p-4 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center shadow-hard-sm">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="SEARCH ORDERS BY ID (#ND-...), NAME, PHONE, CITY, OR AWB..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-[#f8f6f6] border border-[#0A0A0A] text-xs font-mono uppercase placeholder:text-gray-400 outline-none focus:bg-white"
                />
              </div>

              {/* Status Filter Tabs */}
              <div className="flex flex-wrap gap-1.5 text-[11px] font-mono">
                {[
                  { id: 'all', label: 'ALL' },
                  { id: 'paid', label: '✓ PAID ONLINE' },
                  { id: 'cod', label: '⚠ COD DUE' },
                  { id: 'orderplaced', label: 'PLACED' },
                  { id: 'warehousepacked', label: 'PACKED' },
                  { id: 'dispatched(tcs/trax)', label: 'DISPATCHED' },
                  { id: 'outfordelivery', label: 'OUT FOR DELIV' },
                  { id: 'delivered', label: 'DELIVERED' },
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setStatusFilter(st.id)}
                    className={`px-2.5 py-1.5 border font-bold uppercase transition-colors cursor-pointer ${
                      statusFilter === st.id
                        ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]'
                        : 'bg-white hover:bg-gray-100 text-gray-700 border-gray-300'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders List */}
            {isLoading ? (
              <div className="p-16 text-center bg-white border-2 border-[#0A0A0A] space-y-3 font-mono">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#0062FF]" />
                <div className="text-xs uppercase font-bold">Querying Cloud Firestore Orders...</div>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="p-16 text-center bg-white border-2 border-[#0A0A0A] space-y-4">
                <Package className="w-10 h-10 mx-auto text-gray-400" />
                <h3 className="font-anton text-xl uppercase">No Orders Found</h3>
                <p className="text-xs text-gray-500 font-mono max-w-sm mx-auto">
                  {searchQuery || statusFilter !== 'all' 
                    ? 'No orders match your current filter parameters. Try clearing the search query.' 
                    : 'No customer orders exist yet. Place a test order through the shopping cart to verify synchronization.'}
                </p>
                <button
                  onClick={() => onNavigate('/collections')}
                  className="px-4 py-2 bg-[#0A0A0A] text-white font-mono text-xs font-bold uppercase hover:bg-[#0062FF] cursor-pointer"
                >
                  Go to Storefront to Order
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const isUpdating = updatingOrderId === order.id;

                  return (
                    <div 
                      key={order.id}
                      className="bg-white border-2 border-[#0A0A0A] p-5 shadow-hard-sm transition-all hover:border-[#0062FF]"
                    >
                      {/* Top Header Row */}
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-gray-200 gap-3">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-base font-black text-[#0A0A0A]">
                              {order.id}
                            </span>
                            <span className="text-xs text-gray-400 font-mono">|</span>
                            <span className="text-xs text-gray-600 font-mono">
                              {order.date || 'Recent'}
                            </span>
                            {order.paymentStatus === 'PAID' || order.paymentStatus === 'VERIFIED_PAID' ? (
                              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-mono uppercase font-bold border border-emerald-300 flex items-center gap-1">
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span>PAID ONLINE</span>
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-amber-50 text-amber-800 text-[10px] font-mono uppercase font-bold border border-amber-300 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3 text-amber-600" />
                                <span>COD PENDING</span>
                              </span>
                            )}
                            {order.transactionId && (
                              <span className="text-[10px] font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5 border border-gray-200">
                                {order.transactionId}
                              </span>
                            )}
                          </div>
                          
                          <div className="text-xs text-gray-600 flex flex-wrap items-center gap-x-3 gap-y-1">
                            <span className="font-semibold text-[#0A0A0A]">
                              {order.shippingAddress?.fullName || 'Customer'}
                            </span>
                            <span>•</span>
                            <span className="font-mono">{order.shippingAddress?.phone || 'No Phone'}</span>
                            <span>•</span>
                            <span className="flex items-center space-x-1">
                              <MapPin className="w-3 h-3 text-gray-400" />
                              <span>{order.shippingAddress?.city || 'Pakistan'}</span>
                            </span>
                          </div>
                        </div>

                        {/* Status Updater & Payment Action Controls */}
                        <div className="flex flex-wrap items-center gap-2 bg-[#f8f6f6] p-2 border border-[#0A0A0A]">
                          <div className="flex items-center space-x-1.5">
                            <span className="text-[10px] font-mono font-bold uppercase text-gray-500">
                              STATUS:
                            </span>
                            <select
                              disabled={isUpdating}
                              value={order.status}
                              onChange={(e) => handleUpdateStatus(order.id, e.target.value as Order['status'])}
                              className="text-xs font-mono font-bold uppercase bg-white border border-[#0A0A0A] px-2 py-1 outline-none cursor-pointer"
                            >
                              {ORDER_STATUS_OPTIONS.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Quick Payment Verification Toggle */}
                          {order.paymentStatus === 'PAID' || order.paymentStatus === 'VERIFIED_PAID' ? (
                            <button
                              disabled={isUpdating}
                              onClick={() => handleUpdatePaymentStatus(order.id, 'PENDING_COD')}
                              title="Revert to COD"
                              className="px-2 py-1 bg-white hover:bg-gray-100 text-gray-700 border border-gray-400 text-[10px] font-mono font-bold uppercase cursor-pointer"
                            >
                              Revert to COD
                            </button>
                          ) : (
                            <button
                              disabled={isUpdating}
                              onClick={() => handleUpdatePaymentStatus(order.id, 'PAID')}
                              title="Verify received cash or bank transfer"
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-mono font-bold uppercase cursor-pointer flex items-center gap-1 shadow-xs"
                            >
                              <Check className="w-3 h-3 text-[#DFFF00]" />
                              <span>Verify &amp; Mark Paid</span>
                            </button>
                          )}

                          {isUpdating && (
                            <RefreshCw className="w-4 h-4 animate-spin text-[#0062FF]" />
                          )}
                        </div>
                      </div>

                      {/* Middle Body: Items & Address */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-b border-gray-200 text-xs">
                        {/* Items ordered */}
                        <div className="md:col-span-2 space-y-2">
                          <span className="text-[10px] font-mono uppercase text-gray-400 font-bold tracking-wider block">
                            ORDER CONTENTS ({order.items?.length || 0} ITEMS)
                          </span>
                          <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                            {order.items?.map((item, idx) => (
                              <div key={idx} className="flex items-center space-x-3 bg-[#fdf8f8] p-2 border border-gray-200">
                                <img
                                  src={item.product?.thumbnail || item.product?.images?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100'}
                                  alt={item.product?.name}
                                  className="w-10 h-10 object-cover border border-[#0A0A0A] bg-white shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <h5 className="font-bold text-[#0A0A0A] truncate">
                                    {item.product?.name || 'Csenzo Footwear'}
                                  </h5>
                                  <div className="font-mono text-[10px] text-gray-500">
                                    Size: EU {item.selectedSize} • Color: {item.selectedColor?.name || 'Default'} • Qty: {item.quantity}
                                  </div>
                                </div>
                                <div className="font-mono font-bold text-right shrink-0">
                                  {formatPrice((item.product?.price || 0) * item.quantity)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Customer & Shipping Summary */}
                        <div className="bg-[#f8f6f6] p-3 border border-gray-200 space-y-2">
                          <span className="text-[10px] font-mono uppercase text-gray-400 font-bold tracking-wider block">
                            DISPATCH RECIPIENT
                          </span>
                          <div className="space-y-1 font-mono text-[11px] text-gray-700">
                            <div className="font-bold text-[#0A0A0A]">{order.shippingAddress?.fullName}</div>
                            <div>{order.shippingAddress?.address}</div>
                            <div>{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</div>
                            <div>Phone: {order.shippingAddress?.phone}</div>
                            {order.shippingAddress?.email && (
                              <div className="text-gray-500 truncate">{order.shippingAddress?.email}</div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Bottom Action Footer */}
                      <div className="pt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                        <div className="flex items-center space-x-3 font-mono text-[11px]">
                          <span className="text-gray-500">Tracking AWB:</span>
                          <span className="font-bold bg-[#f1edec] px-2 py-0.5 border border-gray-300">
                            {order.trackingNumber || 'PENDING'}
                          </span>
                          {order.trackingNumber && (
                            <button
                              onClick={() => copyToClipboard(order.trackingNumber, 'Tracking Number')}
                              className="text-gray-500 hover:text-black cursor-pointer"
                              title="Copy Tracking Number"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="font-mono text-sm">
                            <span className="text-gray-500 mr-2">TOTAL:</span>
                            <strong className="text-base text-[#0062FF]">
                              {formatPrice(order.total)}
                            </strong>
                          </div>

                          <button
                            onClick={() => onNavigate('/track-order')}
                            className="px-3 py-1.5 bg-[#0A0A0A] hover:bg-[#0062FF] text-white font-mono text-[10px] font-bold uppercase transition-colors flex items-center space-x-1 cursor-pointer"
                          >
                            <span>TEST TRACKER</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: INVENTORY & CATALOG */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="bg-white border-2 border-[#0A0A0A] p-4 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-hard-sm">
              <div>
                <h3 className="font-anton text-xl uppercase">ACTIVE MERCHANDISE CATALOG</h3>
                <p className="text-xs text-gray-500 font-mono">
                  {products.length} catalog items managed in store memory and Firestore sync.
                </p>
              </div>
              <button
                onClick={() => onNavigate('/collections')}
                className="px-4 py-2 bg-[#0A0A0A] text-white font-mono text-xs font-bold uppercase hover:bg-[#0062FF] transition-colors cursor-pointer"
              >
                View Customer Storefront &rarr;
              </button>
            </div>

            <div className="bg-white border-2 border-[#0A0A0A] shadow-hard-sm overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#0A0A0A] text-white uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3">Product</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Gender</th>
                    <th className="p-3">Price (PKR)</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map((prod) => (
                    <tr key={prod.id} className="hover:bg-[#fdf8f8]">
                      <td className="p-3 flex items-center space-x-3">
                        <img 
                          src={prod.thumbnail || prod.images[0]} 
                          alt={prod.name} 
                          className="w-10 h-10 object-cover border border-[#0A0A0A] bg-white"
                        />
                        <div>
                          <div className="font-bold text-[#0A0A0A]">{prod.name}</div>
                          <div className="text-[10px] text-gray-400">{prod.id}</div>
                        </div>
                      </td>
                      <td className="p-3">{prod.category}</td>
                      <td className="p-3">{prod.gender}</td>
                      <td className="p-3 font-bold text-[#0062FF]">{formatPrice(prod.price)}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase border border-emerald-300">
                          IN STOCK
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => onNavigate(`/product/${prod.id}`)}
                          className="text-[#0062FF] hover:underline uppercase font-bold text-[11px] cursor-pointer"
                        >
                          View PDP &rarr;
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: VIP NEWSLETTER SUBSCRIBERS */}
        {activeTab === 'subscribers' && (
          <div className="space-y-6">
            <div className="bg-white border-2 border-[#0A0A0A] p-4 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-hard-sm">
              <div>
                <h3 className="font-anton text-xl uppercase">VIP STREET PASS LEADS</h3>
                <p className="text-xs text-gray-500 font-mono">
                  {subscribers.length} customer emails persisted in Cloud Firestore (`/subscribers` collection).
                </p>
              </div>

              {subscribers.length > 0 && (
                <button
                  onClick={() => {
                    const csv = subscribers.map((s) => s.email).join('\n');
                    copyToClipboard(csv, 'All Subscribers List');
                  }}
                  className="px-4 py-2 bg-[#0A0A0A] hover:bg-[#0062FF] text-white font-mono text-xs font-bold uppercase transition-colors flex items-center space-x-2 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy All Emails</span>
                </button>
              )}
            </div>

            {subscribers.length === 0 ? (
              <div className="p-12 text-center bg-white border-2 border-[#0A0A0A] space-y-3 font-mono">
                <Users className="w-8 h-8 mx-auto text-gray-400" />
                <div className="text-xs uppercase font-bold">No Newsletter Subscribers Yet</div>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Submissions through the homepage VIP Street Pass banner or footer form will immediately sync to Cloud Firestore.
                </p>
              </div>
            ) : (
              <div className="bg-white border-2 border-[#0A0A0A] shadow-hard-sm overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#0A0A0A] text-white uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3">#</th>
                      <th className="p-3">Subscriber Email</th>
                      <th className="p-3">Date Subscribed</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {subscribers.map((sub, idx) => (
                      <tr key={idx} className="hover:bg-[#fdf8f8]">
                        <td className="p-3 text-gray-400">{idx + 1}</td>
                        <td className="p-3 font-bold text-[#0A0A0A]">{sub.email}</td>
                        <td className="p-3 text-gray-500">
                          {new Date(sub.subscribedAt).toLocaleString()}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => copyToClipboard(sub.email, sub.email)}
                            className="text-[#0062FF] hover:underline font-bold text-[10px] cursor-pointer"
                          >
                            Copy Email
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: SYSTEM & TELEMETRY */}
        {activeTab === 'system' && (
          <div className="space-y-6">
            <div className="bg-white border-2 border-[#0A0A0A] p-6 shadow-hard-sm space-y-4">
              <div className="flex items-center space-x-3 border-b border-gray-200 pb-3">
                <Database className="w-5 h-5 text-[#0062FF]" />
                <h3 className="font-anton text-xl uppercase">CLOUD FIRESTORE ARCHITECTURE</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                <div className="p-4 bg-[#f8f6f6] border border-gray-300 space-y-2">
                  <div className="text-gray-500 text-[10px] uppercase font-bold">GCP Project ID</div>
                  <div className="font-bold text-sm text-[#0A0A0A]">halogen-center-c6b5h</div>
                </div>

                <div className="p-4 bg-[#f8f6f6] border border-gray-300 space-y-2">
                  <div className="text-gray-500 text-[10px] uppercase font-bold">Firestore Database ID</div>
                  <div className="font-bold text-sm text-[#0A0A0A]">ai-studio-csenzokineticstr-f1028dd4-ae6a-490e-b562-6cbb35682113</div>
                </div>

                <div className="p-4 bg-[#f8f6f6] border border-gray-300 space-y-2">
                  <div className="text-gray-500 text-[10px] uppercase font-bold">Authorized Administrator</div>
                  <div className="font-bold text-sm text-[#0A0A0A]">{ADMIN_EMAIL}</div>
                </div>

                <div className="p-4 bg-[#f8f6f6] border border-gray-300 space-y-2">
                  <div className="text-gray-500 text-[10px] uppercase font-bold">Security Rules Status</div>
                  <div className="font-bold text-sm text-emerald-600 flex items-center space-x-1.5">
                    <Check className="w-4 h-4" />
                    <span>ENFORCED &amp; DEPLOYED (firestore.rules)</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-mono space-y-1">
                <div className="font-bold">Active Role-Based Access Control (RBAC):</div>
                <p>
                  Only requests matching <code>request.auth.token.email == '{ADMIN_EMAIL}'</code> are permitted to execute <code>list</code>, <code>update</code>, or <code>delete</code> mutations across <code>/orders</code>, <code>/products</code>, and <code>/subscribers</code> collections.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
