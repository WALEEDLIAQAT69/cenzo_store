import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Banknote, 
  Smartphone, 
  CheckCircle2, 
  Package, 
  ArrowRight,
  Printer,
  Lock,
  Sparkles,
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';
import { CartItem, Order, PaymentMethod, PaymentStatus, ShippingAddress } from '../types';
import { formatPrice } from '../utils/format';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  appliedDiscount: number;
  appliedCouponCode?: string;
  initialPaymentMethod?: PaymentMethod;
  onOrderPlaced: (order: Order) => void;
  onTrackOrderDirectly: (trackingNumber: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  appliedDiscount,
  appliedCouponCode,
  initialPaymentMethod = 'cod',
  onOrderPlaced,
  onTrackOrderDirectly,
}) => {
  if (!isOpen) return null;

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: 'Ali Raza',
    email: 'ali.raza@example.com',
    phone: '0300 8472910',
    address: 'House 42, Street 7, Sector Y, DHA Phase 3',
    city: 'Lahore',
    postalCode: '54000',
    notes: 'Please call before delivery',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(initialPaymentMethod);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStep, setSubmissionStep] = useState<string>('');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [copiedId, setCopiedId] = useState<boolean>(false);

  // Online Card input state
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '4532 8821 9012 3456',
    cardName: 'ALI RAZA',
    expiry: '09/28',
    cvv: '841',
  });

  // Mobile Wallet input state
  const [walletDetails, setWalletDetails] = useState({
    provider: 'easypaisa' as 'easypaisa' | 'jazzcash',
    accountNumber: '0300-8472910',
    accountCnic: '35201-8491024-1',
  });

  // Form validation
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const PAKISTAN_CITIES = [
    'Lahore',
    'Karachi',
    'Islamabad',
    'Rawalpindi',
    'Faisalabad',
    'Multan',
    'Peshawar',
    'Sialkot',
    'Gujranwala',
    'Quetta',
    'Hyderabad',
    'Abbottabad',
    'Bahawalpur',
    'Sargodha',
    'Gujrat',
    'Sheikhupura',
    'Mirpur (AJK)',
  ];

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingFee = subtotal >= 2500 ? 0 : 150;
  // Extra 5% instant discount when paying online
  const onlineBonus = paymentMethod === 'card' ? Math.round(subtotal * 0.05) : 0;
  const total = Math.max(0, subtotal - appliedDiscount - onlineBonus + shippingFee);

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!shippingAddress.fullName.trim()) errors.fullName = 'Recipient name is required';
    if (!shippingAddress.email.trim() || !shippingAddress.email.includes('@')) errors.email = 'Valid email is required';
    if (!shippingAddress.phone.trim() || shippingAddress.phone.length < 10) errors.phone = 'Valid phone number is required (03XX...)';
    if (!shippingAddress.address.trim()) errors.address = 'Street delivery address is required';
    if (!shippingAddress.city) errors.city = 'City selection is required';

    if (paymentMethod === 'card') {
      if (!cardDetails.cardNumber.trim()) errors.cardNumber = 'Card number required';
      if (!cardDetails.expiry.trim()) errors.expiry = 'MM/YY required';
      if (!cardDetails.cvv.trim()) errors.cvv = 'CVV required';
    }

    if (paymentMethod === 'wallet') {
      if (!walletDetails.accountNumber.trim()) errors.accountNumber = 'Mobile account number required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Multi-stage verification simulation for payment transparency
    if (paymentMethod === 'card') {
      setSubmissionStep('Connecting to Visa / Mastercard 3D-Secure 2.0 Gateway...');
    } else if (paymentMethod === 'wallet') {
      setSubmissionStep(`Sending OTP confirmation to ${walletDetails.accountNumber}...`);
    } else if (paymentMethod === 'bnpl') {
      setSubmissionStep('Processing first 1/3 installment via Yeylo BNPL...');
    } else {
      setSubmissionStep('Reserving inventory & booking Cash on Delivery consignment...');
    }

    setTimeout(() => {
      if (paymentMethod === 'card' || paymentMethod === 'wallet' || paymentMethod === 'bnpl') {
        setSubmissionStep('Payment Authorized & Settled! Generating Transaction Receipt...');
      } else {
        setSubmissionStep('Consignment Confirmed for Dispatch with Courier...');
      }

      setTimeout(() => {
        const randomTrackId = `CS-${Math.floor(10000 + Math.random() * 90000)}-PK`;
        const isOnlinePaid = paymentMethod === 'card' || paymentMethod === 'wallet' || paymentMethod === 'bnpl';
        const paymentStatus: PaymentStatus = isOnlinePaid ? 'PAID' : 'PENDING_COD';
        
        let paymentTitle = 'Cash on Delivery (COD)';
        let transactionId: string | undefined = undefined;

        if (paymentMethod === 'card') {
          paymentTitle = 'Visa / Mastercard Online Card';
          transactionId = `TXN-VISA-${Math.floor(100000 + Math.random() * 900000)}`;
        } else if (paymentMethod === 'wallet') {
          paymentTitle = `${walletDetails.provider === 'easypaisa' ? 'EasyPaisa' : 'JazzCash'} Mobile Wallet`;
          transactionId = `TXN-EP-${Math.floor(100000 + Math.random() * 900000)}`;
        } else if (paymentMethod === 'bnpl') {
          paymentTitle = 'Yeylo BNPL (Split in 3)';
          transactionId = `TXN-YEYLO-${Math.floor(100000 + Math.random() * 900000)}`;
        }

        const newOrder: Order = {
          id: `ORD-${Date.now()}`,
          trackingNumber: randomTrackId,
          date: new Date().toLocaleDateString('en-PK', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          }),
          items: [...items],
          shippingAddress: { ...shippingAddress },
          paymentMethod,
          paymentTitle,
          paymentStatus,
          transactionId,
          subtotal,
          shippingFee,
          discountAmount: appliedDiscount + onlineBonus,
          couponCode: appliedCouponCode,
          total,
          status: 'Order Placed',
          estimatedDelivery: '2 to 4 Business Days',
          createdAtIso: new Date().toISOString(),
          trackingEvents: [
            {
              status: 'Order Placed',
              description: isOnlinePaid 
                ? `Order placed and fully paid online (${paymentTitle}). Txn: ${transactionId}`
                : 'Order booked under Cash on Delivery (COD). Total due upon parcel arrival.',
              timestamp: new Date().toISOString(),
              location: 'Csenzo Central Warehouse, Lahore'
            }
          ]
        };

        setCompletedOrder(newOrder);
        setIsSubmitting(false);
        setSubmissionStep('');
        onOrderPlaced(newOrder);
      }, 700);
    }, 900);
  };

  const copyTracking = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
      <div 
        id="checkout-modal-window"
        className="bg-white border-2 border-[#0A0A0A] shadow-hard max-w-4xl w-full my-auto max-h-[92vh] overflow-y-auto relative text-[#0A0A0A]"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 border border-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-colors cursor-pointer"
          title="Close Checkout"
        >
          <X className="w-5 h-5" />
        </button>

        {completedOrder ? (
          /* Order Confirmation Screen with Clear Payment Status */
          <div className="p-6 sm:p-10 text-center space-y-6">
            <div className={`w-16 h-16 mx-auto border-2 flex items-center justify-center ${
              completedOrder.paymentStatus === 'PAID' 
                ? 'bg-emerald-100 border-emerald-600 text-emerald-600' 
                : 'bg-amber-100 border-amber-600 text-amber-700'
            }`}>
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 bg-[#0A0A0A] text-[#DFFF00] text-[11px] font-mono font-bold uppercase tracking-widest inline-block">
                CONSIGNMENT BOOKED &amp; REGISTERED
              </span>
              <h2 className="font-anton text-3xl sm:text-4xl uppercase text-[#0A0A0A]">
                SHUKRIYA FOR SHOPPING WITH CSENZO!
              </h2>
              <p className="text-xs text-[#444748] max-w-md mx-auto">
                Your order <strong className="text-black font-mono">{completedOrder.id}</strong> has been logged. 
                Confirmation SMS dispatched to <strong className="text-black">{completedOrder.shippingAddress.phone}</strong>.
              </p>
            </div>

            {/* Crucial Payment Status Confirmation Box */}
            <div className="max-w-md mx-auto">
              {completedOrder.paymentStatus === 'PAID' ? (
                <div className="bg-emerald-50 border-2 border-emerald-600 p-4 text-left space-y-2 shadow-hard-sm">
                  <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
                    <div className="flex items-center space-x-1.5 font-bold text-emerald-900 text-xs uppercase font-mono">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>PAYMENT STATUS: 100% PAID ONLINE</span>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-600 text-white font-mono font-bold text-[9px] uppercase tracking-wider">
                      SETTLED
                    </span>
                  </div>
                  
                  <div className="font-mono text-xs text-emerald-950 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-emerald-800">Method:</span>
                      <strong className="text-black">{completedOrder.paymentTitle}</strong>
                    </div>
                    {completedOrder.transactionId && (
                      <div className="flex justify-between">
                        <span className="text-emerald-800">Transaction ID:</span>
                        <strong className="text-black">{completedOrder.transactionId}</strong>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-emerald-800">Amount Paid:</span>
                      <strong className="text-black text-sm">{formatPrice(completedOrder.total)}</strong>
                    </div>
                  </div>

                  <div className="p-2 bg-white/80 border border-emerald-300 text-[11px] text-emerald-900 font-mono">
                    ✓ <strong>Zero Balance Due on Arrival.</strong> The delivery rider will request a signature or OTP only.
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50 border-2 border-amber-600 p-4 text-left space-y-2 shadow-hard-sm">
                  <div className="flex items-center justify-between pb-2 border-b border-amber-200">
                    <div className="flex items-center space-x-1.5 font-bold text-amber-900 text-xs uppercase font-mono">
                      <Banknote className="w-4 h-4 text-amber-700" />
                      <span>PAYMENT STATUS: CASH ON DELIVERY</span>
                    </div>
                    <span className="px-2 py-0.5 bg-amber-600 text-white font-mono font-bold text-[9px] uppercase tracking-wider">
                      COD PENDING
                    </span>
                  </div>

                  <div className="font-mono text-xs text-amber-950 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-amber-800">Collection Mode:</span>
                      <strong className="text-black">Cash upon Doorstep Delivery</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-amber-800">Exact Cash Due:</span>
                      <strong className="text-black text-sm">{formatPrice(completedOrder.total)}</strong>
                    </div>
                  </div>

                  <div className="p-2 bg-white/80 border border-amber-300 text-[11px] text-amber-900 font-mono">
                    ⚠ <strong>Rider Cash Collection:</strong> Please keep the exact amount of {formatPrice(completedOrder.total)} ready in cash for TCS / Leopards courier.
                  </div>
                </div>
              )}
            </div>

            {/* Consignment Tracking Info */}
            <div className="bg-[#F4F4F6] border-2 border-[#0A0A0A] p-5 max-w-md mx-auto text-left space-y-3 shadow-hard-sm">
              <div className="flex items-center justify-between pb-3 border-b border-[#e5e2e1]">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#747878] block">OFFICIAL TRACKING NUMBER</span>
                  <span className="font-mono font-bold text-base text-[#0062FF]">
                    {completedOrder.trackingNumber}
                  </span>
                </div>
                <button
                  onClick={() => copyTracking(completedOrder.trackingNumber)}
                  className="px-2.5 py-1 bg-white border border-[#0A0A0A] hover:bg-black hover:text-white text-xs font-mono font-bold flex items-center space-x-1 cursor-pointer"
                >
                  {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId ? 'COPIED' : 'COPY'}</span>
                </button>
              </div>

              <div className="space-y-1 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-[#747878]">Delivery City:</span>
                  <strong className="text-black">{completedOrder.shippingAddress.city}, Pakistan</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#747878]">Estimated Delivery:</span>
                  <strong className="text-black">{completedOrder.estimatedDelivery}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#747878]">Articles Booked:</span>
                  <strong className="text-black">{completedOrder.items.length} item(s)</strong>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  onClose();
                  onTrackOrderDirectly(completedOrder.trackingNumber);
                }}
                className="px-6 py-3.5 bg-[#0062FF] hover:bg-[#004ccb] text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-2 shadow-hard-sm cursor-pointer"
              >
                <Package className="w-4 h-4" />
                <span>TRACK CONSIGNMENT STATUS NOW</span>
              </button>

              <button
                onClick={() => window.print()}
                className="px-5 py-3.5 bg-white hover:bg-gray-100 border-2 border-[#0A0A0A] text-[#0A0A0A] text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>PRINT RECEIPT / INVOICE</span>
              </button>

              <button
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-3.5 text-gray-500 hover:text-black text-xs font-mono uppercase font-bold cursor-pointer"
              >
                Return to Store
              </button>
            </div>
          </div>
        ) : (
          /* Main Checkout Form Screen */
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left: Input Form (Cols 7) */}
            <div className="lg:col-span-7 p-6 sm:p-8 space-y-6">
              <div className="space-y-1 pb-4 border-b-2 border-[#0A0A0A]">
                <div className="flex items-center space-x-2 text-xs font-mono text-[#0062FF] font-bold uppercase tracking-widest">
                  <ShieldCheck className="w-4 h-4" />
                  <span>256-BIT SSL ENCRYPTED GATEWAY</span>
                </div>
                <h2 className="font-anton text-2xl sm:text-3xl uppercase tracking-wide">
                  SECURE CHECKOUT
                </h2>
              </div>

              <form onSubmit={handlePlaceOrder} className="space-y-6">
                {/* 1. Recipient Information */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A0A0A] pb-1 border-b border-[#e5e2e1]">
                    1. RECIPIENT &amp; CONTACT
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-[#444748] mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.fullName}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                        className={`w-full p-2.5 text-xs border bg-white ${formErrors.fullName ? 'border-red-500 bg-red-50' : 'border-[#0A0A0A]'}`}
                        placeholder="e.g. Ali Raza"
                      />
                      {formErrors.fullName && <p className="text-[10px] text-red-500 mt-0.5">{formErrors.fullName}</p>}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-[#444748] mb-1">
                        Mobile Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={shippingAddress.phone}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                        className={`w-full p-2.5 text-xs border bg-white font-mono ${formErrors.phone ? 'border-red-500 bg-red-50' : 'border-[#0A0A0A]'}`}
                        placeholder="0300 1234567"
                      />
                      {formErrors.phone && <p className="text-[10px] text-red-500 mt-0.5">{formErrors.phone}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#444748] mb-1">
                      Email Address (For Order Tracking &amp; Receipt) *
                    </label>
                    <input
                      type="email"
                      value={shippingAddress.email}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
                      className={`w-full p-2.5 text-xs border bg-white ${formErrors.email ? 'border-red-500 bg-red-50' : 'border-[#0A0A0A]'}`}
                      placeholder="name@domain.com"
                    />
                    {formErrors.email && <p className="text-[10px] text-red-500 mt-0.5">{formErrors.email}</p>}
                  </div>
                </div>

                {/* 2. Destination Address */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A0A0A] pb-1 border-b border-[#e5e2e1]">
                    2. SHIPPING DESTINATION
                  </h3>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#444748] mb-1">
                      Complete Street Address (House/Plot #, Street, Sector) *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.address}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                      className={`w-full p-2.5 text-xs border bg-white ${formErrors.address ? 'border-red-500 bg-red-50' : 'border-[#0A0A0A]'}`}
                      placeholder="e.g. House 42, Street 7, Sector Y, DHA Phase 3"
                    />
                    {formErrors.address && <p className="text-[10px] text-red-500 mt-0.5">{formErrors.address}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-[#444748] mb-1">
                        City *
                      </label>
                      <select
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                        className="w-full p-2.5 text-xs border border-[#0A0A0A] bg-white font-medium cursor-pointer"
                      >
                        {PAKISTAN_CITIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-[#444748] mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.postalCode}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                        className="w-full p-2.5 text-xs border border-[#0A0A0A] bg-white font-mono"
                        placeholder="54000"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Payment Method Selection */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-1 border-b border-[#e5e2e1]">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A0A0A]">
                      3. PAYMENT METHOD &amp; CONFIRMATION
                    </h3>
                    <span className="text-[10px] font-mono uppercase text-gray-500">
                      CLEAR SETTLEMENT STATUS
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {/* Cash on Delivery */}
                    <div 
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-3.5 border-2 cursor-pointer transition-all ${
                        paymentMethod === 'cod' ? 'border-[#0A0A0A] bg-[#f7f3f2] shadow-hard-sm' : 'border-gray-200 bg-white hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-start">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'cod'}
                          onChange={() => setPaymentMethod('cod')}
                          className="mt-0.5 accent-[#0A0A0A]"
                        />
                        <div className="ml-3 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase text-[#0A0A0A] flex items-center gap-1.5">
                              <Banknote className="w-4 h-4 text-emerald-600" />
                              Cash on Delivery (COD)
                            </span>
                            <span className="px-2 py-0.5 bg-gray-200 text-gray-800 text-[9px] font-mono font-bold uppercase">
                              UNPAID UNTIL ARRIVAL
                            </span>
                          </div>
                          <p className="text-[11px] text-[#747878] mt-1">
                            Pay in cash to the TCS / Leopards courier rider when sneakers are delivered.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Online Credit / Debit Card */}
                    <div 
                      onClick={() => setPaymentMethod('card')}
                      className={`p-3.5 border-2 cursor-pointer transition-all ${
                        paymentMethod === 'card' ? 'border-[#0A0A0A] bg-[#f7f3f2] shadow-hard-sm' : 'border-gray-200 bg-white hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-start">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'card'}
                          onChange={() => setPaymentMethod('card')}
                          className="mt-0.5 accent-[#0A0A0A]"
                        />
                        <div className="ml-3 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase text-[#0A0A0A] flex items-center gap-1.5">
                              <CreditCard className="w-4 h-4 text-[#0062FF]" />
                              Credit / Debit Card (Visa / Mastercard)
                            </span>
                            <span className="px-2 py-0.5 bg-emerald-600 text-white text-[9px] font-mono font-bold uppercase">
                              100% PAID • EXTRA 5% OFF
                            </span>
                          </div>
                          <p className="text-[11px] text-[#747878] mt-1">
                            Instant online settlement with 3D-Secure 2.0 authentication.
                          </p>

                          {/* Interactive Card Inputs when active */}
                          {paymentMethod === 'card' && (
                            <div className="mt-3 p-3 bg-white border border-[#0A0A0A] space-y-2 text-xs font-mono animate-fade-in" onClick={(e) => e.stopPropagation()}>
                              <div className="flex justify-between items-center text-[10px] text-gray-500 pb-1 border-b border-gray-200">
                                <span>SECURE CARD TERMINAL</span>
                                <button
                                  type="button"
                                  onClick={() => setCardDetails({
                                    cardNumber: '4532 9812 4021 8819',
                                    cardName: 'ALI RAZA',
                                    expiry: '12/28',
                                    cvv: '912'
                                  })}
                                  className="text-[#0062FF] hover:underline font-bold uppercase cursor-pointer"
                                >
                                  Use Demo Visa Card &rarr;
                                </button>
                              </div>

                              <div>
                                <label className="block text-[10px] uppercase font-bold text-gray-600 mb-0.5">Card Number</label>
                                <input
                                  type="text"
                                  value={cardDetails.cardNumber}
                                  onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                                  className="w-full p-2 border border-gray-400 bg-white font-mono text-xs"
                                  placeholder="4532 •••• •••• ••••"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[10px] uppercase font-bold text-gray-600 mb-0.5">Expires</label>
                                  <input
                                    type="text"
                                    value={cardDetails.expiry}
                                    onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                                    className="w-full p-2 border border-gray-400 bg-white font-mono text-xs"
                                    placeholder="MM/YY"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] uppercase font-bold text-gray-600 mb-0.5">CVV / CVC</label>
                                  <input
                                    type="password"
                                    value={cardDetails.cvv}
                                    onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                                    maxLength={4}
                                    className="w-full p-2 border border-gray-400 bg-white font-mono text-xs"
                                    placeholder="•••"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Mobile Wallet EasyPaisa / JazzCash */}
                    <div 
                      onClick={() => setPaymentMethod('wallet')}
                      className={`p-3.5 border-2 cursor-pointer transition-all ${
                        paymentMethod === 'wallet' ? 'border-[#0A0A0A] bg-[#f7f3f2] shadow-hard-sm' : 'border-gray-200 bg-white hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-start">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'wallet'}
                          onChange={() => setPaymentMethod('wallet')}
                          className="mt-0.5 accent-[#0A0A0A]"
                        />
                        <div className="ml-3 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase text-[#0A0A0A] flex items-center gap-1.5">
                              <Smartphone className="w-4 h-4 text-[#FF3366]" />
                              EasyPaisa / JazzCash Mobile Wallet
                            </span>
                            <span className="px-2 py-0.5 bg-emerald-600 text-white text-[9px] font-mono font-bold uppercase">
                              100% PAID • INSTANT
                            </span>
                          </div>
                          <p className="text-[11px] text-[#747878] mt-1">
                            Direct debit from your mobile account with instant OTP authorization.
                          </p>

                          {paymentMethod === 'wallet' && (
                            <div className="mt-3 p-3 bg-white border border-[#0A0A0A] space-y-2 text-xs font-mono animate-fade-in" onClick={(e) => e.stopPropagation()}>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => setWalletDetails({ ...walletDetails, provider: 'easypaisa' })}
                                  className={`flex-1 py-1.5 border text-center font-bold text-[11px] cursor-pointer ${
                                    walletDetails.provider === 'easypaisa' ? 'bg-emerald-600 text-white border-emerald-700' : 'bg-white border-gray-300'
                                  }`}
                                >
                                  EasyPaisa
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setWalletDetails({ ...walletDetails, provider: 'jazzcash' })}
                                  className={`flex-1 py-1.5 border text-center font-bold text-[11px] cursor-pointer ${
                                    walletDetails.provider === 'jazzcash' ? 'bg-red-600 text-white border-red-700' : 'bg-white border-gray-300'
                                  }`}
                                >
                                  JazzCash
                                </button>
                              </div>

                              <div>
                                <label className="block text-[10px] uppercase font-bold text-gray-600 mb-0.5">Mobile Account #</label>
                                <input
                                  type="text"
                                  value={walletDetails.accountNumber}
                                  onChange={(e) => setWalletDetails({ ...walletDetails, accountNumber: e.target.value })}
                                  className="w-full p-2 border border-gray-400 bg-white font-mono text-xs"
                                  placeholder="0300-1234567"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit button on mobile */}
                <div className="lg:hidden pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-[#0A0A0A] text-white text-xs font-bold tracking-widest uppercase hover:bg-[#0062FF] hover:shadow-hard transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span>{submissionStep || 'PROCESSING ORDER & PAYMENT...'}</span>
                    ) : (
                      <>
                        <span>PLACE ORDER • {formatPrice(total)}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Right Summary: Items & Totals (Cols 5) */}
            <div className="lg:col-span-5 bg-[#F4F4F6] p-6 sm:p-8 flex flex-col justify-between border-t-2 lg:border-t-0 lg:border-l-2 border-[#0A0A0A]">
              <div>
                <h3 className="font-anton text-xl uppercase tracking-wide text-[#0A0A0A] pb-3 border-b-2 border-[#0A0A0A] mb-4">
                  ORDER SUMMARY ({items.reduce((s, i) => s + i.quantity, 0)} ITEMS)
                </h3>

                {/* Items preview */}
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1 divide-y divide-[#e5e2e1]">
                  {items.map((it) => (
                    <div key={it.cartItemId} className="pt-3 first:pt-0 flex items-center space-x-3">
                      <div className="w-14 h-14 shrink-0 bg-white border border-[#0A0A0A] overflow-hidden">
                        <img
                          src={it.product.thumbnail || it.product.images[0]}
                          alt={it.product.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs text-[#0A0A0A] truncate">
                          {it.product.name}
                        </h4>
                        <p className="text-[11px] text-gray-500 font-mono">
                          Size: EU {it.selectedSize} &bull; Qty: {it.quantity}
                        </p>
                      </div>
                      <div className="font-mono font-bold text-xs">
                        {formatPrice(it.product.price * it.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 pt-4 mt-4 border-t border-[#e5e2e1] text-xs font-mono">
                  <div className="flex justify-between text-[#444748]">
                    <span>Articles Subtotal:</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>

                  <div className="flex justify-between text-[#444748]">
                    <span>Nationwide Express Courier:</span>
                    <span className={shippingFee === 0 ? 'text-emerald-700 font-bold' : ''}>
                      {shippingFee === 0 ? 'FREE EXPRESS' : formatPrice(shippingFee)}
                    </span>
                  </div>

                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-red-600 font-bold">
                      <span>Promo Coupon ({appliedCouponCode}):</span>
                      <span>-{formatPrice(appliedDiscount)}</span>
                    </div>
                  )}

                  {onlineBonus > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>Online Card Bonus (5% OFF):</span>
                      <span>-{formatPrice(onlineBonus)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-baseline pt-3 border-t-2 border-[#0A0A0A] text-base">
                    <span className="font-anton uppercase tracking-wider text-[#0A0A0A]">
                      TOTAL PAYABLE:
                    </span>
                    <span className="font-anton text-2xl text-[#0062FF]">
                      {formatPrice(total)}
                    </span>
                  </div>

                  {/* Payment Settlement Expectation Pill */}
                  <div className="mt-2 p-2.5 bg-white border border-[#0A0A0A] text-[11px]">
                    <div className="font-bold uppercase text-gray-700 text-[10px] tracking-wider mb-0.5">
                      Selected Settlement Mode:
                    </div>
                    {paymentMethod === 'cod' ? (
                      <div className="text-amber-800 font-bold flex items-center space-x-1">
                        <Banknote className="w-3.5 h-3.5 text-amber-600" />
                        <span>Cash on Delivery &bull; Pay {formatPrice(total)} upon arrival</span>
                      </div>
                    ) : (
                      <div className="text-emerald-700 font-bold flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Paid in Full Now &bull; 0 balance due on arrival</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Desktop Submit Button */}
              <div className="hidden lg:block pt-6">
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#0A0A0A] text-white text-xs font-bold tracking-widest uppercase hover:bg-[#0062FF] hover:shadow-hard transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                      <span>{submissionStep || 'PROCESSING ORDER & PAYMENT...'}</span>
                    </div>
                  ) : (
                    <>
                      <span>CONFIRM &amp; PLACE ORDER • {formatPrice(total)}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
