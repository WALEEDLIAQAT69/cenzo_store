import React, { useState } from 'react';
import { Order } from '../types';
import { formatPrice } from '../utils/format';
import { findOrderInFirestore } from '../services/firebaseStore';
import { 
  CheckCircle2, 
  CreditCard, 
  Banknote, 
  ShieldCheck, 
  AlertTriangle 
} from 'lucide-react';
import { 
  LocalShipping, 
  Verified, 
  TagIcon, 
  SmartphoneIcon, 
  ArrowForward, 
  ContentCopy, 
  Package2, 
  CheckIcon, 
  Inventory2, 
  NavigationIcon, 
  HomeIcon, 
  EditLocationAlt, 
  PinDrop, 
  SupportAgent, 
  HelpOutline, 
  ChevronRight,
  SyncAlt
} from '../components/Icons';

interface TrackOrderPageProps {
  onNavigate: (path: string) => void;
  recentOrders: Order[];
}

export const TrackOrderPage: React.FC<TrackOrderPageProps> = ({
  onNavigate,
  recentOrders,
}) => {
  const [orderIdInput, setOrderIdInput] = useState<string>('#ND-882314');
  const [phoneInput, setPhoneInput] = useState<string>('0301-4458921');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedAWB, setCopiedAWB] = useState<boolean>(false);

  // Active tracked order (from recent orders, or query API)
  const [activeOrder, setActiveOrder] = useState<Order>(
    recentOrders.find((o) => o.id === '#ND-882314') || recentOrders[0] || {
      id: '#ND-882314',
      trackingNumber: '7719203841',
      date: '18 Oct 2026',
      items: [],
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
      subtotal: 6499,
      shippingFee: 0,
      discountAmount: 0,
      total: 6499,
      status: 'Out for Delivery',
      estimatedDelivery: 'Today by 6:00 PM',
    }
  );

  const handleLookup = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Check Cloud Firestore first for persistent real-time orders
      const firestoreOrder = await findOrderInFirestore(orderIdInput.trim());
      if (firestoreOrder) {
        setActiveOrder(firestoreOrder);
        return;
      }

      // 2. Query backend API
      const res = await fetch(`/api/orders/track?query=${encodeURIComponent(orderIdInput.trim())}`);
      if (res.ok) {
        const found = await res.json();
        setActiveOrder(found);
      } else {
        // 3. Search in local recent orders
        const match = recentOrders.find(
          (o) =>
            o.id.toLowerCase() === orderIdInput.trim().toLowerCase() ||
            o.trackingNumber === orderIdInput.trim()
        );
        if (match) {
          setActiveOrder(match);
        } else {
          alert(`No shipment found for ${orderIdInput}. Displaying active verified tracking simulation.`);
        }
      }
    } catch {
      // Fallback
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  const handleFillOrder = (id: string, phone: string) => {
    setOrderIdInput(id);
    setPhoneInput(phone);
    setIsLoading(true);
    setTimeout(() => {
      const match = recentOrders.find((o) => o.id === id);
      if (match) setActiveOrder(match);
      setIsLoading(false);
    }, 400);
  };

  const copyAWB = () => {
    navigator.clipboard.writeText(activeOrder.trackingNumber || '7719203841');
    setCopiedAWB(true);
    setTimeout(() => setCopiedAWB(false), 2000);
  };

  return (
    <div className="w-full flex flex-col">
      {/* Brand Ticker Bar */}
      <div className="w-full bg-[#F4F4F6] py-2 px-4 sm:px-8 lg:px-12 border-b border-[#0A0A0A] overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[#444748] text-xs uppercase tracking-widest font-mono">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#004ccb] animate-ping"></span>
            <span className="font-bold text-black">LIVE DISPATCH RADAR</span>
            <span className="hidden md:inline text-gray-400">|</span>
            <span className="hidden md:inline">SAME DAY DISPATCH FOR PUNJAB &amp; SINDH METROS</span>
          </div>
          <div className="flex items-center gap-4 font-semibold text-[11px]">
            <span className="hidden sm:inline">OFFICIAL CARRIERS: TCS • LEOPARDS • CALL COURIER</span>
            <span className="text-[#004ccb] font-bold">UAN: 042-35880175</span>
          </div>
        </div>
      </div>

      {/* Page Header & Hero Lead */}
      <section className="w-full px-4 sm:px-8 lg:px-12 pt-8 sm:pt-12 pb-6 bg-[#fdf8f8]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b-2 border-[#0A0A0A]">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#DFFF00] text-black text-xs font-mono uppercase font-bold tracking-wider mb-2 border border-black">
                <span>SELF-SERVICE PORTAL</span>
                <LocalShipping className="w-3.5 h-3.5" />
              </div>
              <h1 className="font-anton text-4xl sm:text-5xl lg:text-6xl uppercase text-black tracking-tight leading-none">
                TRACK YOUR ORDER
              </h1>
              <p className="text-sm text-[#444748] mt-2 max-w-2xl">
                Enter your Order ID and Phone Number to check real-time courier status and delivery updates across Pakistan.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-[#f1edec] px-4 py-3 border border-[#0A0A0A] shadow-hard-sm">
              <Verified className="w-6 h-6 text-[#004ccb]" />
              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase text-black">NDURE FULFILLMENT PROMISE</span>
                <span className="text-xs text-[#444748]">30-Day Easy In-Store &amp; Online Exchange</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Tracking Lookup & Live Demo Layout */}
      <section className="w-full px-4 sm:px-8 lg:px-12 pb-16 bg-[#fdf8f8]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Search Form & Quick Filters (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Tracking Form Card */}
            <div className="bg-[#F4F4F6] p-6 border-2 border-[#0A0A0A] shadow-hard">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#e5e2e1]">
                <h2 className="font-anton text-xl uppercase text-black">SHIPMENT LOOKUP</h2>
                <span className="text-[10px] font-mono uppercase bg-black text-white px-2 py-0.5 font-bold">
                  EXPRESS ROUTE
                </span>
              </div>

              <form onSubmit={handleLookup} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs uppercase font-bold text-black mb-1">
                    ORDER ID / TRACKING NUMBER
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={orderIdInput}
                      onChange={(e) => setOrderIdInput(e.target.value)}
                      placeholder="E.G. #ND-882314"
                      required
                      className="w-full h-11 px-3 bg-white text-black text-xs font-mono uppercase tracking-wider border-2 border-[#0A0A0A] outline-none focus:border-[#004ccb]"
                    />
                    <TagIcon className="w-4 h-4 absolute right-3 top-3.5 text-gray-400" />
                  </div>
                  <p className="text-[10px] text-[#747878] mt-1">Found in your SMS / order confirmation email</p>
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-black mb-1">
                    PHONE NUMBER OR EMAIL
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      placeholder="03XX-XXXXXXX"
                      required
                      className="w-full h-11 px-3 bg-white text-black text-xs font-mono uppercase tracking-wider border-2 border-[#0A0A0A] outline-none focus:border-[#004ccb]"
                    />
                    <SmartphoneIcon className="w-4 h-4 absolute right-3 top-3.5 text-gray-400" />
                  </div>
                  <p className="text-[10px] text-[#747878] mt-1">Must match phone number registered at checkout</p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-[#004ccb] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-hard-sm"
                >
                  {isLoading ? (
                    <>
                      <SyncAlt className="w-4 h-4 animate-spin" />
                      <span>FETCHING COURIER SATELLITE DATA...</span>
                    </>
                  ) : (
                    <>
                      <span>TRACK SHIPMENT</span>
                      <ArrowForward className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Simulation buttons */}
              <div className="mt-6 pt-4 border-t border-[#e5e2e1] bg-[#ebe7e6] p-3 border border-gray-300">
                <span className="text-[10px] font-mono uppercase font-bold text-black block mb-2">
                  SAMPLE SHIPMENT SIMULATIONS:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => handleFillOrder('#ND-882314', '0301-4458921')}
                    className="px-2 py-1 bg-white text-black text-[10px] font-mono uppercase border border-black hover:bg-black hover:text-white transition-colors cursor-pointer"
                  >
                    #ND-882314 (Out for Delivery)
                  </button>
                  <button
                    onClick={() => handleFillOrder('#ND-991204', '0322-9012344')}
                    className="px-2 py-1 bg-white text-black text-[10px] font-mono uppercase border border-black hover:bg-black hover:text-white transition-colors cursor-pointer"
                  >
                    #ND-991204 (Transit Hub)
                  </button>
                </div>
              </div>
            </div>

            {/* Carrier Info Banner */}
            <div className="bg-[#ebe7e6] p-4 border-2 border-[#0A0A0A] flex items-center justify-between shadow-hard-sm">
              <div className="flex items-center gap-3">
                <LocalShipping className="w-7 h-7 text-[#004ccb]" />
                <div>
                  <p className="text-xs font-bold uppercase text-black">INTEGRATED LOGISTICS MESH</p>
                  <p className="text-xs text-[#444748]">Direct API link with TCS, Leopards &amp; Call Courier</p>
                </div>
              </div>
              <span className="font-anton text-2xl text-black opacity-25">PK</span>
            </div>
          </div>

          {/* Right Column: Live Tracking Status Showcase (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Order Identity Top Strip */}
            <div className="bg-black text-white p-5 border-2 border-[#0A0A0A] shadow-hard flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-[#DFFF00] text-black text-[9px] font-mono font-bold uppercase">
                    Active Shipment
                  </span>
                  <span className="text-[10px] font-mono text-gray-400 uppercase">Order ID</span>
                </div>
                <h3 className="font-anton text-2xl uppercase tracking-wider text-white">
                  {activeOrder.id}
                </h3>
                <p className="text-xs text-gray-300 mt-0.5">
                  Placed on {activeOrder.date} • {activeOrder.items?.length || 1} Item(s) •{' '}
                  <span className="text-[#DFFF00] font-bold">
                    {activeOrder.paymentTitle || 'Cash on Delivery'} ({formatPrice(activeOrder.total)})
                  </span>
                </p>
              </div>

              <div className="sm:text-right flex sm:flex-col items-center sm:items-end justify-between">
                <span className="text-[10px] uppercase font-mono text-gray-400">Live Status</span>
                <span className="inline-flex items-center gap-1.5 text-xs uppercase bg-[#004ccb] text-white px-3 py-1 font-bold mt-1 shadow-xs">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#DFFF00] animate-pulse"></span>
                  {activeOrder.status || 'Out for Delivery'}
                </span>
              </div>
            </div>

            {/* Crucial Verified Payment Status Banner */}
            {activeOrder.paymentStatus === 'PAID' || (activeOrder.paymentMethod && activeOrder.paymentMethod !== 'cod') ? (
              <div className="bg-emerald-50 border-2 border-emerald-600 p-4 shadow-hard-sm text-emerald-950 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
                  <div className="flex items-center gap-1.5 font-bold uppercase text-emerald-900 tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>PAYMENT CONFIRMED: 100% PAID ONLINE</span>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-600 text-white font-bold text-[9px] uppercase tracking-widest">
                    SETTLED &amp; VERIFIED
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-emerald-700">Settled Via:</span>{' '}
                    <strong className="text-black">{activeOrder.paymentTitle || 'Online Card / Gateway'}</strong>
                  </div>
                  {activeOrder.transactionId && (
                    <div>
                      <span className="text-emerald-700">Gateway Ref:</span>{' '}
                      <strong className="text-black font-mono">{activeOrder.transactionId}</strong>
                    </div>
                  )}
                </div>
                <div className="mt-2 pt-2 border-t border-emerald-200/60 text-[11px] text-emerald-800">
                  ✓ <strong>Zero Balance Due Upon Handover.</strong> The courier rider will request recipient signature or mobile OTP verification only.
                </div>
              </div>
            ) : (
              <div className="bg-amber-50 border-2 border-amber-600 p-4 shadow-hard-sm text-amber-950 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-amber-200">
                  <div className="flex items-center gap-1.5 font-bold uppercase text-amber-900 tracking-wider">
                    <Banknote className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>PAYMENT STATUS: CASH ON DELIVERY (COD)</span>
                  </div>
                  <span className="px-2 py-0.5 bg-amber-600 text-white font-bold text-[9px] uppercase tracking-widest">
                    PAYABLE ON ARRIVAL
                  </span>
                </div>
                <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px]">
                  <div>
                    <span className="text-amber-800">Payment Due to Rider:</span>{' '}
                    <strong className="text-black text-sm">{formatPrice(activeOrder.total)}</strong>
                  </div>
                  <div className="text-[10px] text-amber-700">
                    Carrier: TCS Express &bull; COD Account Verified
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-amber-200/60 text-[11px] text-amber-900">
                  ⚠ <strong>Action Required:</strong> Please keep exact cash of {formatPrice(activeOrder.total)} ready for the delivery rider upon arrival.
                </div>
              </div>
            )}

            {/* Carrier Details Box */}
            <div className="bg-[#F4F4F6] p-4 border-2 border-[#0A0A0A] grid grid-cols-1 sm:grid-cols-3 gap-4 shadow-hard-sm">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#747878] block mb-1">COURIER PARTNER</span>
                <div className="flex items-center gap-1.5">
                  <Package2 className="w-4 h-4 text-[#004ccb]" />
                  <span className="font-anton text-sm uppercase text-black">TCS Express</span>
                </div>
                <span className="text-[10px] text-[#747878] block mt-0.5">Air Cargo Priority</span>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-[#747878] block mb-1">TRACKING AWB #</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-sm font-bold text-black tracking-wide">
                    {activeOrder.trackingNumber || '7719203841'}
                  </span>
                  <button
                    onClick={copyAWB}
                    className="text-gray-500 hover:text-black transition-colors cursor-pointer"
                    title="Copy AWB"
                  >
                    <ContentCopy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-[10px] text-[#004ccb] font-bold block mt-0.5">
                  {copiedAWB ? 'Copied to Clipboard!' : `${activeOrder.shippingAddress?.city || 'Karachi'} Hub`}
                </span>
              </div>

              <div className="bg-white p-2.5 border border-[#0A0A0A]">
                <span className="text-[10px] font-mono uppercase text-[#747878] block mb-1">ESTIMATED DELIVERY</span>
                <span className="font-anton text-sm uppercase text-[#E60000] block">
                  {activeOrder.estimatedDelivery || 'TODAY BY 6:00 PM'}
                </span>
                <span className="text-[10px] text-[#444748] block mt-0.5">Rider: Tariq M. (Verified)</span>
              </div>
            </div>

            {/* Interactive Stepper / Progress Bar */}
            <div className="bg-white p-6 border-2 border-[#0A0A0A] shadow-hard-sm">
              <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#e5e2e1]">
                <h4 className="font-anton text-base uppercase text-black">SHIPMENT LIFECYCLE</h4>
                <span className="text-[10px] font-mono uppercase font-bold text-[#004ccb] flex items-center gap-1">
                  <SyncAlt className="w-3 h-3" />
                  <span>LIVE SYNCED</span>
                </span>
              </div>

              {/* Step 1: Confirmed */}
              <div className="relative flex items-start gap-4 pb-6">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-black text-white flex items-center justify-center shrink-0 border border-black">
                    <CheckIcon className="w-4 h-4" />
                  </div>
                  <div className="w-0.5 h-full bg-black mt-1"></div>
                </div>
                <div className="pt-0.5 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <span className="font-bold text-xs uppercase text-black">1. Order Confirmed</span>
                    <span className="text-[10px] font-mono text-[#747878]">{activeOrder.date} &bull; Verified</span>
                  </div>
                  <p className="text-xs text-[#444748] mt-0.5">
                    Order verified &amp; queued for warehouse collection. 
                    Payment: {activeOrder.paymentTitle} {activeOrder.paymentStatus === 'PAID' ? '(Paid Online)' : '(Cash on Delivery)'}.
                  </p>
                </div>
              </div>

              {/* Step 2: Picked & Packed */}
              <div className="relative flex items-start gap-4 pb-6">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-black text-white flex items-center justify-center shrink-0 border border-black">
                    <Inventory2 className="w-4 h-4" />
                  </div>
                  <div className="w-0.5 h-full bg-black mt-1"></div>
                </div>
                <div className="pt-0.5 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <span className="font-bold text-xs uppercase text-black">2. Picked &amp; Packed</span>
                    <span className="text-[10px] font-mono text-[#747878]">Lahore Hub &bull; Sealed</span>
                  </div>
                  <p className="text-xs text-[#444748] mt-0.5">
                    Lahore Fulfillment Hub (Gulberg III). Quality check approved and boxed with protective seal.
                  </p>
                </div>
              </div>

              {/* Step 3: Handed to Courier */}
              <div className="relative flex items-start gap-4 pb-6">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-black text-white flex items-center justify-center shrink-0 border border-black">
                    <LocalShipping className="w-4 h-4" />
                  </div>
                  <div className="w-0.5 h-full bg-[#004ccb] mt-1"></div>
                </div>
                <div className="pt-0.5 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <span className="font-bold text-xs uppercase text-black">3. In Transit (Inter-City Dispatch)</span>
                    <span className="text-[10px] font-mono text-[#747878]">TCS Cargo Mesh</span>
                  </div>
                  <p className="text-xs text-[#444748] mt-0.5">
                    Dispatched from Lahore Air Cargo terminal to {activeOrder.shippingAddress?.city || 'destination'} sorting center.
                  </p>
                </div>
              </div>

              {/* Step 4: Out for Delivery (Active) */}
              <div className="relative flex items-start gap-4 pb-6">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-[#004ccb] text-white flex items-center justify-center shrink-0 shadow-md">
                    <NavigationIcon className="w-4 h-4 animate-bounce" />
                  </div>
                  <div className="w-0.5 h-full bg-gray-300 mt-1"></div>
                </div>
                <div className="pt-0.5 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs uppercase text-[#004ccb]">4. Out for Delivery</span>
                      <span className="px-1.5 py-0.5 bg-[#DFFF00] text-black text-[9px] font-bold uppercase font-mono">
                        Active
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#004ccb] font-bold">Local Courier Unit</span>
                  </div>
                  <p className="text-xs text-[#000000] mt-0.5 font-medium">
                    {activeOrder.shippingAddress?.city || 'City'} Hub - Package loaded onto delivery route van. Courier Tariq M. will contact via SMS/Call prior to arrival.
                  </p>
                </div>
              </div>

              {/* Step 5: Delivered */}
              <div className="relative flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-gray-200 text-gray-500 flex items-center justify-center shrink-0 border border-gray-300">
                    <HomeIcon className="w-4 h-4" />
                  </div>
                </div>
                <div className="pt-0.5 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <span className="font-bold text-xs uppercase text-gray-500">5. Final Delivery</span>
                    <span className="text-[10px] font-mono text-gray-400">
                      {activeOrder.paymentStatus === 'PAID' ? 'No Cash Due' : 'COD Payment Due'}
                    </span>
                  </div>
                  <p className="text-xs text-[#747878] mt-0.5">
                    {activeOrder.paymentStatus === 'PAID' || (activeOrder.paymentMethod && activeOrder.paymentMethod !== 'cod') ? (
                      <span className="text-emerald-800 font-medium">
                        Payment settled online. Parcel will be handed over upon recipient OTP verification or signature.
                      </span>
                    ) : (
                      <span>
                        Please keep exact amount of <strong>{formatPrice(activeOrder.total)}</strong> cash ready for courier rider.
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Dynamic Ordered Items Summary */}
            <div className="bg-[#F4F4F6] p-4 border-2 border-[#0A0A0A] shadow-hard-sm">
              <div className="flex items-center justify-between mb-3 pb-1 border-b border-gray-300">
                <span className="text-xs uppercase font-bold text-black">
                  PACKAGE CONTENTS ({activeOrder.items?.length || 1} ITEM{(activeOrder.items?.length || 1) > 1 ? 'S' : ''})
                </span>
                <span className="text-xs font-mono font-bold text-[#004ccb]">
                  Total: {formatPrice(activeOrder.total)}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeOrder.items && activeOrder.items.length > 0 ? (
                  activeOrder.items.map((it, idx) => (
                    <div key={it.cartItemId || idx} className="flex items-center gap-3 bg-white p-2.5 border border-[#0A0A0A]">
                      <img
                        src={it.product.thumbnail || it.product.images?.[0] || 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=150&q=80'}
                        alt={it.product.name}
                        className="w-14 h-14 object-cover border border-gray-300 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-anton text-xs uppercase truncate text-black">{it.product.name}</p>
                        <p className="text-[10px] text-[#747878] uppercase font-mono">
                          Size: {it.selectedSize} &bull; Qty: {it.quantity}
                        </p>
                        <p className="font-anton text-xs text-black mt-0.5">{formatPrice(it.product.price * it.quantity)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center gap-3 bg-white p-2.5 border border-[#0A0A0A]">
                    <img
                      src="https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=150&q=80"
                      alt="Apex Runner"
                      className="w-14 h-14 object-cover border border-gray-300 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-anton text-xs uppercase truncate text-black">APEX STREET RUNNER</p>
                      <p className="text-[10px] text-[#747878] uppercase font-mono">Size: 42 (9 UK) &bull; Stealth Black</p>
                      <p className="font-anton text-xs text-black mt-0.5">{formatPrice(activeOrder.total)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Help & Self-Service Support Grid */}
      <section className="w-full px-4 sm:px-8 lg:px-12 py-12 bg-[#ebe7e6] border-t-2 border-[#0A0A0A]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-3 border-b border-[#0A0A0A]">
            <div>
              <span className="text-xs font-mono uppercase font-bold text-[#004ccb]">INSTANT ACTIONS</span>
              <h2 className="font-anton text-3xl uppercase text-black">CUSTOMER SELF-SERVICE &amp; FAQ</h2>
            </div>
            <p className="text-xs text-[#444748] max-w-md mt-2 md:mt-0">
              Solve the most common delivery questions instantly or connect directly with our logistics team.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white p-6 border-2 border-[#0A0A0A] shadow-hard-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 bg-black text-white flex items-center justify-center mb-4">
                  <EditLocationAlt className="w-5 h-5" />
                </div>
                <h3 className="font-anton text-lg uppercase text-black mb-2">
                  MODIFY DELIVERY ADDRESS?
                </h3>
                <p className="text-xs text-[#444748] mb-4 leading-relaxed">
                  Need to update your delivery address or contact number? Address changes are supported before the parcel reaches the destination city hub.
                </p>
              </div>
              <button
                onClick={() => alert('Please contact official helpline 042-35880175 with your Order ID to divert your dispatch route immediately.')}
                className="w-full h-11 bg-[#F4F4F6] text-black text-xs font-bold uppercase hover:bg-black hover:text-white transition-colors border border-black flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>REQUEST ADDRESS EDIT</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-6 border-2 border-[#0A0A0A] shadow-hard-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 bg-[#004ccb] text-white flex items-center justify-center mb-4">
                  <SyncAlt className="w-5 h-5" />
                </div>
                <h3 className="font-anton text-lg uppercase text-black mb-2">
                  30-DAY STORE EXCHANGES
                </h3>
                <p className="text-xs text-[#444748] mb-4 leading-relaxed">
                  Size not fitting right? Walk into any of our 200+ NDURE retail outlets across Pakistan with your order invoice and unworn shoes for an instant size swap.
                </p>
              </div>
              <button
                onClick={() => onNavigate('/store-locator')}
                className="w-full h-11 bg-[#F4F4F6] text-black text-xs font-bold uppercase hover:bg-black hover:text-white transition-colors border border-black flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>FIND NEAREST STORE</span>
                <PinDrop className="w-4 h-4" />
              </button>
            </div>

            {/* Card 3 */}
            <div className="bg-black text-white p-6 border-2 border-black shadow-hard-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 bg-[#DFFF00] text-black flex items-center justify-center mb-4">
                  <SupportAgent className="w-5 h-5" />
                </div>
                <h3 className="font-anton text-lg uppercase text-white mb-2">
                  CALL LOGISTICS DESK
                </h3>
                <p className="text-xs text-gray-300 mb-4 leading-relaxed">
                  Speaking to a real representative is easy. Have your Order ID ready for immediate dispatch escalation.
                </p>
                <div className="bg-white/10 p-3 border border-white/20 mb-4">
                  <p className="text-[10px] font-mono text-[#DFFF00] uppercase font-bold">OFFICIAL HELPLINE</p>
                  <a href="tel:04235880175" className="font-anton text-xl uppercase text-white tracking-wide hover:text-[#DFFF00] block font-mono">
                    042-35880175
                  </a>
                  <span className="text-[10px] text-gray-400 block">Mon – Sat: 9:00 AM – 6:00 PM PKT</span>
                </div>
              </div>
              <a
                href="mailto:help@ndure.com"
                className="w-full h-11 bg-[#DFFF00] text-black text-xs font-bold uppercase hover:bg-[#004ccb] hover:text-white transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>SEND EMAIL TICKET</span>
              </a>
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="mt-8 bg-white p-6 border-2 border-[#0A0A0A] shadow-hard-sm">
            <h3 className="font-anton text-xl uppercase text-black mb-4 flex items-center gap-2">
              <HelpOutline className="w-5 h-5 text-[#004ccb]" />
              <span>FREQUENTLY ASKED TRACKING QUESTIONS</span>
            </h3>
            <div className="space-y-3 text-xs">
              <details className="group bg-[#F4F4F6] p-4 border border-[#0A0A0A] cursor-pointer">
                <summary className="font-bold uppercase text-black flex items-center justify-between list-none">
                  <span>When will I receive my courier tracking number?</span>
                  <span className="text-black group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-[#444748] mt-2 leading-relaxed">
                  As soon as your package leaves our central Lahore Fulfillment warehouse, you will automatically receive an SMS containing your tracking AWB link from TCS, Leopards, or Call Courier.
                </p>
              </details>

              <details className="group bg-[#F4F4F6] p-4 border border-[#0A0A0A] cursor-pointer">
                <summary className="font-bold uppercase text-black flex items-center justify-between list-none">
                  <span>Can I inspect or try on the shoes before paying the rider?</span>
                  <span className="text-black group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-[#444748] mt-2 leading-relaxed">
                  Per courier policy across Pakistan, sealed cash-on-delivery parcels cannot be opened before payment is handed to the rider. However, you can instantly test fit afterward and utilize our 30-day no-hassle return or in-store exchange service.
                </p>
              </details>

              <details className="group bg-[#F4F4F6] p-4 border border-[#0A0A0A] cursor-pointer">
                <summary className="font-bold uppercase text-black flex items-center justify-between list-none">
                  <span>What happens if I miss the courier's delivery attempt?</span>
                  <span className="text-black group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-[#444748] mt-2 leading-relaxed">
                  Couriers will make up to two re-delivery attempts on subsequent working days. You will receive an automated text allowing you to reschedule the delivery window or collect from the nearest local carrier franchise.
                </p>
              </details>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
