import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User } from 'firebase/auth';
import { 
  ShieldCheck, 
  Lock, 
  Check, 
  X, 
  ExternalLink, 
  LogOut, 
  Package, 
  KeyRound, 
  ShieldAlert, 
  RefreshCw, 
  Sparkles,
  UserCheck,
  Copy,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Order } from '../types';
import { formatPrice } from '../utils/format';
import { 
  isAdminUser, 
  ADMIN_EMAIL, 
  getUserOrdersFromFirestore 
} from '../services/firebaseStore';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  isLoggingIn: boolean;
  onLogin: () => Promise<void>;
  onLogout: () => Promise<void>;
  onNavigate: (path: string) => void;
  allLocalOrders?: Order[];
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  user,
  isLoggingIn,
  onLogin,
  onLogout,
  onNavigate,
  allLocalOrders = [],
}) => {
  const [activeTab, setActiveTab] = useState<'account' | 'orders' | 'security'>('account');
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState<boolean>(false);
  const [copiedUid, setCopiedUid] = useState<boolean>(false);

  const isAdmin = isAdminUser(user);

  // Load user orders whenever modal opens or user logs in
  useEffect(() => {
    if (isOpen && user) {
      setIsLoadingOrders(true);
      getUserOrdersFromFirestore(user.uid, user.email || undefined)
        .then((remoteOrders) => {
          // Merge with any local orders for this email to guarantee immediate visibility
          const userEmail = (user.email || '').toLowerCase().trim();
          const localMatches = allLocalOrders.filter(
            (o) => (o.shippingAddress?.email || '').toLowerCase().trim() === userEmail
          );

          const combined = [...remoteOrders];
          const existingIds = new Set(combined.map((o) => o.id));

          for (const loc of localMatches) {
            if (!existingIds.has(loc.id)) {
              combined.push(loc);
              existingIds.add(loc.id);
            }
          }

          setUserOrders(combined);
        })
        .catch((err) => {
          console.warn('Could not load user orders:', err);
        })
        .finally(() => {
          setIsLoadingOrders(false);
        });
    } else {
      setUserOrders([]);
    }
  }, [isOpen, user, allLocalOrders]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyUid = () => {
    if (user?.uid) {
      navigator.clipboard?.writeText(user.uid);
      setCopiedUid(true);
      setTimeout(() => setCopiedUid(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      <div 
        id="auth-modal-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          id="auth-modal-container"
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="bg-white border-2 border-[#0A0A0A] shadow-[8px_8px_0px_0px_#0A0A0A] w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden text-[#0A0A0A]"
        >
          {/* Top Bar / Header */}
          <div className="bg-[#0A0A0A] text-white px-5 py-3.5 flex items-center justify-between border-b border-[#0A0A0A]">
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 bg-[#DFFF00]"></div>
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#DFFF00]">
                CSENZO × NDURE SECURITY CORE
              </span>
            </div>
            <button
              id="auth-modal-close-btn"
              onClick={onClose}
              className="p-1 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Close authentication modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* User NOT Authenticated: Login View */}
          {!user ? (
            <div className="p-6 md:p-8 space-y-6 overflow-y-auto">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-[#f1edec] border border-[#0A0A0A] mb-1">
                  <Lock className="w-7 h-7 text-[#0062FF]" />
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tight font-display text-[#0A0A0A]">
                  KINETIC MEMBER ACCESS
                </h2>
                <p className="text-xs text-gray-600 max-w-sm mx-auto leading-relaxed">
                  Authenticate with your Google identity to unlock order history tracking, rapid dispatch privileges, and member-only capsule access.
                </p>
              </div>

              {/* Primary Google Login Button */}
              <div className="pt-2">
                <button
                  id="auth-google-login-btn"
                  onClick={async () => {
                    await onLogin();
                  }}
                  disabled={isLoggingIn}
                  className={`w-full py-3.5 px-4 bg-[#0A0A0A] text-white font-mono font-bold text-xs uppercase tracking-wider border-2 border-[#0A0A0A] flex items-center justify-center space-x-3 transition-all cursor-pointer shadow-[4px_4px_0px_0px_#0062FF] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none ${
                    isLoggingIn ? 'opacity-70 cursor-wait' : 'hover:bg-[#0062FF]'
                  }`}
                >
                  {isLoggingIn ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-[#DFFF00]" />
                      <span>INITIALIZING SECURE SESSION...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                        />
                      </svg>
                      <span>CONTINUE WITH GOOGLE AUTH</span>
                    </>
                  )}
                </button>
              </div>

              {/* Security Features Breakdown */}
              <div className="border border-gray-200 bg-[#fbf9f9] p-4 space-y-3">
                <span className="text-[10px] font-mono uppercase font-bold text-gray-500 tracking-wider block">
                  SECURITY &amp; PRIVACY GUARANTEES
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-start space-x-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-gray-700">OpenID Connect + TLS 1.3 Transport Security</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-gray-700">Zero-Trust ABAC Firestore Database Shield</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-gray-700">No passwords stored on servers</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-gray-700">Automatic Session Invalidation upon sign-out</span>
                  </div>
                </div>
              </div>

              {/* Store Admin Notice */}
              <div className="p-3 bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start space-x-2.5">
                <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold font-mono text-[11px] uppercase">
                    STORE MANAGER CLEARANCE
                  </p>
                  <p className="text-[11px] text-amber-800">
                    Signing in with the designated store administrator address (<span className="font-mono font-bold text-black">{ADMIN_EMAIL}</span>) automatically unlocks the Operations Fulfillment Console.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* User IS Authenticated: Account & Security Hub */
            <div className="flex flex-col flex-1 overflow-hidden">
              {/* Profile Bar */}
              <div className="p-5 border-b border-gray-200 bg-[#f8f6f6] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-3.5">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="w-12 h-12 rounded-none border-2 border-[#0A0A0A] shadow-xs"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-[#0A0A0A] text-[#DFFF00] font-black text-lg flex items-center justify-center border-2 border-[#0A0A0A]">
                      {(user.displayName || user.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-[#0A0A0A]">
                        {user.displayName || 'Kinetic Member'}
                      </span>
                      {isAdmin ? (
                        <span className="px-2 py-0.5 bg-[#DFFF00] text-black font-mono font-bold text-[9px] uppercase border border-[#0A0A0A]">
                          ADMINISTRATOR
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-black text-white font-mono font-bold text-[9px] uppercase">
                          VIP MEMBER
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-600 font-mono">
                      {user.email}
                    </div>
                    <div className="flex items-center space-x-2 text-[10px] text-emerald-700 font-mono font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>EMAIL VERIFIED VIA GOOGLE</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-end sm:self-center">
                  {isAdmin && (
                    <button
                      id="auth-enter-admin-btn"
                      onClick={() => {
                        onClose();
                        onNavigate('/admin');
                      }}
                      className="px-3 py-1.5 bg-[#DFFF00] text-black hover:bg-black hover:text-white border border-[#0A0A0A] font-mono font-bold text-[11px] uppercase transition-colors cursor-pointer flex items-center space-x-1"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>ADMIN CONSOLE</span>
                    </button>
                  )}
                  <button
                    id="auth-logout-btn"
                    onClick={async () => {
                      await onLogout();
                      onClose();
                    }}
                    className="px-3 py-1.5 bg-white hover:bg-red-50 text-red-600 hover:text-red-700 border border-gray-300 font-mono font-bold text-[11px] uppercase transition-colors cursor-pointer flex items-center space-x-1"
                    title="Sign out of this device"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>SIGN OUT</span>
                  </button>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-gray-200 bg-white px-5 pt-2 text-xs font-mono font-bold uppercase">
                <button
                  id="auth-tab-account"
                  onClick={() => setActiveTab('account')}
                  className={`pb-2.5 px-3 border-b-2 cursor-pointer transition-all ${
                    activeTab === 'account'
                      ? 'border-[#0A0A0A] text-[#0A0A0A]'
                      : 'border-transparent text-gray-500 hover:text-black'
                  }`}
                >
                  OVERVIEW
                </button>
                <button
                  id="auth-tab-orders"
                  onClick={() => setActiveTab('orders')}
                  className={`pb-2.5 px-3 border-b-2 cursor-pointer transition-all flex items-center space-x-1.5 ${
                    activeTab === 'orders'
                      ? 'border-[#0A0A0A] text-[#0A0A0A]'
                      : 'border-transparent text-gray-500 hover:text-black'
                  }`}
                >
                  <span>MY ORDERS</span>
                  {userOrders.length > 0 && (
                    <span className="bg-[#0A0A0A] text-[#DFFF00] px-1.5 py-0.2 text-[9px]">
                      {userOrders.length}
                    </span>
                  )}
                </button>
                <button
                  id="auth-tab-security"
                  onClick={() => setActiveTab('security')}
                  className={`pb-2.5 px-3 border-b-2 cursor-pointer transition-all flex items-center space-x-1 ${
                    activeTab === 'security'
                      ? 'border-[#0A0A0A] text-[#0A0A0A]'
                      : 'border-transparent text-gray-500 hover:text-black'
                  }`}
                >
                  <ShieldCheck className="w-3 h-3 text-[#0062FF]" />
                  <span>SECURITY &amp; ACCESS</span>
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-5 md:p-6 overflow-y-auto flex-1 space-y-4">
                {/* TAB 1: OVERVIEW */}
                {activeTab === 'account' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-4 border border-gray-200 bg-[#fbf9f9]">
                        <span className="text-[10px] font-mono text-gray-500 uppercase font-bold block">
                          MEMBERSHIP STATUS
                        </span>
                        <div className="text-base font-black font-display text-[#0A0A0A] mt-1">
                          {isAdmin ? 'OPERATIONS ADMINISTRATOR' : 'KINETIC VIP LEVEL 1'}
                        </div>
                        <p className="text-[11px] text-gray-600 mt-1">
                          {isAdmin
                            ? 'Full permissions to inspect consignments, update payment statuses, and edit catalogue.'
                            : 'Priority order routing and exclusive drop reservations active.'}
                        </p>
                      </div>

                      <div className="p-4 border border-gray-200 bg-[#fbf9f9]">
                        <span className="text-[10px] font-mono text-gray-500 uppercase font-bold block">
                          RECORDED ORDERS
                        </span>
                        <div className="text-base font-black font-display text-[#0A0A0A] mt-1">
                          {userOrders.length} {userOrders.length === 1 ? 'CONSIGNMENT' : 'CONSIGNMENTS'}
                        </div>
                        <button
                          onClick={() => setActiveTab('orders')}
                          className="text-[11px] text-[#0062FF] font-mono font-bold mt-1 hover:underline inline-flex items-center space-x-1"
                        >
                          <span>View order history</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Fast Track Box */}
                    <div className="border-2 border-[#0A0A0A] p-4 bg-[#f8f6f6] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#0A0A0A] flex items-center space-x-1.5">
                          <Package className="w-4 h-4 text-[#0062FF]" />
                          <span>LIVE CONSIGNMENT RADAR</span>
                        </span>
                        <p className="text-[11px] text-gray-600">
                          Search any order ID or tracking slip number nationwide across TCS &amp; Trax networks.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          onClose();
                          onNavigate('/track-order');
                        }}
                        className="px-3.5 py-2 bg-[#0A0A0A] text-white hover:bg-[#0062FF] font-mono text-xs font-bold uppercase transition-colors cursor-pointer shrink-0"
                      >
                        OPEN TRACKER
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB 2: MY ORDERS */}
                {activeTab === 'orders' && (
                  <div className="space-y-3">
                    {isLoadingOrders ? (
                      <div className="py-8 text-center text-gray-500 font-mono text-xs flex flex-col items-center justify-center space-y-2">
                        <RefreshCw className="w-5 h-5 animate-spin text-[#0062FF]" />
                        <span>SYNCHRONIZING SECURE ORDER HISTORY...</span>
                      </div>
                    ) : userOrders.length === 0 ? (
                      <div className="py-8 text-center border border-dashed border-gray-300 p-6 space-y-2">
                        <Package className="w-8 h-8 text-gray-400 mx-auto" />
                        <p className="font-bold text-xs uppercase tracking-wider text-gray-700">
                          NO ORDERS RECORDED UNDER THIS ACCOUNT YET
                        </p>
                        <p className="text-[11px] text-gray-500 max-w-sm mx-auto">
                          Orders placed with <span className="font-mono text-black">{user.email}</span> will appear here automatically with live tracking states.
                        </p>
                        <button
                          onClick={() => {
                            onClose();
                            onNavigate('/collections');
                          }}
                          className="mt-2 px-4 py-2 bg-[#0A0A0A] text-white font-mono text-xs font-bold uppercase hover:bg-[#0062FF] transition-colors"
                        >
                          EXPLORE CATALOGUE
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {userOrders.map((ord) => (
                          <div
                            key={ord.id}
                            className="p-3.5 border border-[#0A0A0A] bg-white hover:bg-[#fafafa] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                          >
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-mono text-xs font-black text-[#0A0A0A]">
                                  {ord.id}
                                </span>
                                <span className="text-[10px] font-mono text-gray-500">
                                  {ord.date}
                                </span>
                                {ord.paymentStatus === 'PAID' || ord.paymentStatus === 'VERIFIED_PAID' ? (
                                  <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[9px] font-mono font-bold uppercase border border-emerald-300">
                                    PAID ONLINE
                                  </span>
                                ) : (
                                  <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 text-[9px] font-mono font-bold uppercase border border-amber-300">
                                    COD DUE
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-gray-600">
                                {ord.items?.length || 0} items &bull; Total:{' '}
                                <span className="font-bold text-black font-mono">
                                  {formatPrice(ord.total || 0)}
                                </span>
                              </div>
                              <div className="text-[11px] font-mono text-[#0062FF] font-bold">
                                Status: {ord.status}
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                onClose();
                                onNavigate(`/track-order?q=${encodeURIComponent(ord.id)}`);
                              }}
                              className="px-3 py-1.5 bg-[#0A0A0A] text-white hover:bg-[#0062FF] text-[10px] font-mono font-bold uppercase transition-colors shrink-0 flex items-center justify-center space-x-1"
                            >
                              <span>TRACK RADAR</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 3: SECURITY & ACCESS */}
                {activeTab === 'security' && (
                  <div className="space-y-4 text-xs">
                    <div className="border border-gray-200 p-4 space-y-3 bg-[#fbf9f9]">
                      <span className="text-[10px] font-mono uppercase font-bold text-gray-500 tracking-wider block">
                        AUTHENTICATION CREDENTIALS
                      </span>
                      
                      <div className="space-y-2 font-mono text-[11px]">
                        <div className="flex items-center justify-between py-1 border-b border-gray-200">
                          <span className="text-gray-600">Identity Provider:</span>
                          <span className="font-bold text-black">Google Identity Services (OIDC)</span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-gray-200">
                          <span className="text-gray-600">Token Format:</span>
                          <span className="font-bold text-black">JSON Web Token (RFC 7519 / RS256)</span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-gray-200">
                          <span className="text-gray-600">User UID:</span>
                          <div className="flex items-center space-x-1.5">
                            <span className="text-gray-800 truncate max-w-[140px]">{user.uid}</span>
                            <button
                              onClick={handleCopyUid}
                              className="p-1 hover:bg-gray-200 cursor-pointer"
                              title="Copy UID"
                            >
                              {copiedUid ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-gray-200">
                          <span className="text-gray-600">Access Privilege:</span>
                          <span className={`font-bold ${isAdmin ? 'text-emerald-700' : 'text-[#0062FF]'}`}>
                            {isAdmin ? 'LEVEL-3 ROOT ADMINISTRATOR' : 'LEVEL-1 REGISTERED CUSTOMER'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-1">
                          <span className="text-gray-600">Database Defense:</span>
                          <span className="font-bold text-emerald-700">Zero-Trust ABAC (Verified Rules)</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-start space-x-2.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <p className="font-bold font-mono text-[11px] uppercase">
                          ACTIVE CRYPTOGRAPHIC SESSION
                        </p>
                        <p className="text-[11px] text-emerald-800">
                          All outgoing requests are bound to this authenticated browser token. Signing out terminates your session across this origin immediately.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
