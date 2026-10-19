import React, { useState } from 'react';
import { X, Search, Package, CheckCircle2, Truck, Clock, MapPin } from 'lucide-react';
import { Order } from '../types';
import { formatPrice } from '../utils/format';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  recentOrders: Order[];
  initialTrackingQuery?: string;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  isOpen,
  onClose,
  recentOrders,
  initialTrackingQuery = '',
}) => {
  const [query, setQuery] = useState(initialTrackingQuery || (recentOrders[0]?.trackingNumber || 'CS-92841-PK'));
  const [searched, setSearched] = useState(true);

  if (!isOpen) return null;

  // Search in recent orders or fallback to demo order
  const foundOrder: Order = recentOrders.find(
    (o) => o.trackingNumber.toUpperCase() === query.trim().toUpperCase()
  ) || {
    id: 'DEMO-ORD-101',
    trackingNumber: query.trim().toUpperCase() || 'CS-92841-PK',
    date: 'Sep 20, 2026',
    items: [
      {
        cartItemId: 'demo-1',
        product: {
          id: 'cs-hr-01',
          name: 'HR-01 CYBER SPEED RUNNER',
          slug: 'hr-01',
          subtitle: 'Hasan Raheem Signature Capsule Edition',
          category: 'Capsule',
          gender: 'Men',
          price: 6999,
          thumbnail: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=900&q=80',
          images: [],
          colors: [{ name: 'Neon Pink / Cyber Black', hex: '#FF3366' }],
          sizes: [42],
          stockBySize: { 42: 4 },
          rating: 4.9,
          reviewCount: 148,
          tags: [],
          description: '',
          features: [],
          specs: { upperMaterial: '', soleMaterial: '', closureType: '', insole: '', origin: '' },
        },
        selectedSize: 42,
        selectedColor: { name: 'Neon Pink / Cyber Black', hex: '#FF3366' },
        quantity: 1,
      },
    ],
    shippingAddress: {
      fullName: 'Ali Raza',
      email: 'ali.raza@example.com',
      phone: '0300 8472910',
      address: 'House 42, Sector Y, DHA Phase 3',
      city: 'Lahore',
      postalCode: '54000',
    },
    paymentMethod: 'cod',
    paymentTitle: 'Cash on Delivery (COD)',
    paymentStatus: 'PENDING_COD',
    subtotal: 6999,
    shippingFee: 0,
    discountAmount: 0,
    total: 6999,
    status: 'Dispatched (TCS/Trax)',
    estimatedDelivery: 'Tomorrow by 5:00 PM',
  };

  const steps = [
    { title: 'Order Placed & Verified', date: 'Sep 20, 10:14 AM', completed: true },
    { title: 'Warehouse Packed & Barcoded', date: 'Sep 20, 02:40 PM', completed: true },
    { title: 'Dispatched via TCS Express Logistics', date: 'Sep 20, 08:30 PM', completed: true, current: true },
    { title: 'Out for Delivery with Courier Rider', date: 'Estimated Sep 22, 11:00 AM', completed: false },
    { title: 'Delivered to Doorstep', date: 'Pending Delivery', completed: false },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div 
        id="order-tracker-modal"
        className="bg-white border-2 border-[#0A0A0A] shadow-hard max-w-2xl w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 border border-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 text-[#0062FF] mb-1">
          <Package className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-widest">NATIONWIDE LOGISTICS</span>
        </div>

        <h2 className="font-anton text-2xl sm:text-3xl uppercase text-[#0A0A0A] mb-2">
          TRACK YOUR CSENZO ORDER
        </h2>
        <p className="text-xs text-[#444748] mb-6">
          Enter your Tracking ID (provided via SMS / Email) to inspect live courier movement across Pakistan.
        </p>

        {/* Search input */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. CS-92841-PK or phone number"
              className="w-full pl-9 pr-3 py-2.5 text-xs font-mono border border-[#0A0A0A] uppercase bg-white"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#0A0A0A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#0062FF] transition-colors cursor-pointer"
          >
            TRACK
          </button>
        </form>

        {/* Quick sample buttons if available */}
        <div className="flex items-center space-x-2 text-[11px] mb-6 text-gray-500 overflow-x-auto pb-1">
          <span className="font-bold shrink-0">SAMPLE TRACKING CODES:</span>
          {['CS-92841-PK', 'CS-78492-PK', 'CS-61102-PK'].map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => {
                setQuery(code);
                setSearched(true);
              }}
              className="px-2 py-0.5 bg-[#F4F4F6] border border-gray-300 font-mono text-[10px] hover:border-[#0A0A0A] cursor-pointer"
            >
              {code}
            </button>
          ))}
        </div>

        {searched && (
          <div className="space-y-6 pt-4 border-t-2 border-[#0A0A0A]">
            {/* Status Header Card */}
            <div className="p-4 bg-[#F4F4F6] border border-[#0A0A0A] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">
                  TRACKING NUMBER
                </span>
                <span className="font-mono text-base font-bold text-[#0062FF]">
                  {foundOrder.trackingNumber}
                </span>
                <p className="text-xs text-[#444748] mt-0.5">
                  Destination: <span className="font-bold text-[#0A0A0A]">{foundOrder.shippingAddress.city}, Pakistan</span>
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="px-2.5 py-1 bg-emerald-600 text-white font-bold text-[10px] uppercase inline-block">
                  {foundOrder.status}
                </span>
                <p className="text-xs text-gray-600 mt-1">
                  Est. Delivery: <span className="font-bold text-[#0A0A0A]">{foundOrder.estimatedDelivery}</span>
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-4 pl-2">
              <h4 className="font-anton text-sm uppercase tracking-wider text-[#0A0A0A]">
                DELIVERY PROGRESS TIMELINE
              </h4>

              <div className="relative border-l-2 border-[#0A0A0A] ml-3 space-y-6 pb-2">
                {steps.map((step, idx) => (
                  <div key={idx} className="relative pl-6">
                    {/* Circle mark */}
                    <div 
                      className={`absolute -left-[9px] top-0.5 w-4 h-4 rounded-none border-2 flex items-center justify-center ${
                        step.completed
                          ? 'bg-[#0062FF] border-[#0062FF] text-white'
                          : 'bg-white border-gray-400 text-transparent'
                      }`}
                    >
                      {step.completed && <CheckCircle2 className="w-3 h-3" />}
                    </div>

                    <div>
                      <h5 className={`text-xs font-bold uppercase ${step.current ? 'text-[#0062FF]' : 'text-[#0A0A0A]'}`}>
                        {step.title}
                        {step.current && (
                          <span className="ml-2 px-1.5 py-0.2 text-[9px] bg-[#0062FF] text-white font-mono">
                            LIVE
                          </span>
                        )}
                      </h5>
                      <p className="text-[11px] text-gray-500 font-mono mt-0.5">{step.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Items summary */}
            <div className="p-3 bg-[#fdf8f8] border border-[#e5e2e1] space-y-2">
              <h5 className="font-bold text-xs uppercase text-[#0A0A0A]">
                PARCEL CONTENTS ({foundOrder.items.length} ITEM)
              </h5>
              {foundOrder.items.map((it, i) => (
                <div key={i} className="flex justify-between items-center text-xs">
                  <span>{it.product.name} (EU {it.selectedSize}) x{it.quantity}</span>
                  <span className="font-anton">{formatPrice(it.product.price * it.quantity)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
