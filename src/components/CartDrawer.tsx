import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShoppingBag, Tag, Check, Truck } from 'lucide-react';
import { CartItem } from '../types';
import { formatPrice } from '../utils/format';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQuantity: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onProceedToCheckout: (couponDiscount: number, appliedCode: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [couponError, setCouponError] = useState<string | null>(null);

  if (!isOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 2500;
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const freeShippingMet = subtotal >= FREE_SHIPPING_THRESHOLD;
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const shippingFee = items.length === 0 ? 0 : freeShippingMet ? 0 : 150;

  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponInput.trim().toUpperCase();
    if (code === 'CSENZO10') {
      setAppliedCoupon(code);
      setDiscountPercent(10);
      setCouponError(null);
    } else if (code === 'STREET20') {
      setAppliedCoupon(code);
      setDiscountPercent(20);
      setCouponError(null);
    } else if (code === 'HASAN15') {
      setAppliedCoupon(code);
      setDiscountPercent(15);
      setCouponError(null);
    } else {
      setCouponError('Invalid coupon code. Try CSENZO10 or STREET20');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscountPercent(0);
    setCouponInput('');
    setCouponError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      {/* Drawer Body */}
      <div 
        id="cart-slideout-drawer"
        className="relative ml-auto w-full max-w-md bg-white h-full flex flex-col justify-between border-l-2 border-[#0A0A0A] shadow-2xl z-10"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b-2 border-[#0A0A0A] flex items-center justify-between bg-[#fdf8f8]">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-[#0A0A0A]" />
            <h2 className="font-anton text-xl uppercase tracking-wide">
              YOUR SHOPPING BAG ({items.reduce((s, i) => s + i.quantity, 0)})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 border border-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Free Shipping Progress Meter */}
        <div className="bg-[#1c1b1b] text-white p-3 text-xs">
          <div className="flex items-center justify-between mb-1 font-bold">
            <span className="flex items-center space-x-1.5">
              <Truck className="w-3.5 h-3.5 text-[#0062FF]" />
              <span>
                {freeShippingMet 
                  ? '🎉 YOU UNLOCKED FREE DELIVERY!' 
                  : `Add ${formatPrice(amountToFreeShipping)} more for FREE DELIVERY`}
              </span>
            </span>
            <span className="text-[10px] text-gray-400 font-mono">
              RS. {Math.min(subtotal, FREE_SHIPPING_THRESHOLD)} / {FREE_SHIPPING_THRESHOLD}
            </span>
          </div>
          <div className="w-full bg-gray-700 h-1.5 overflow-hidden">
            <div 
              className="bg-[#0062FF] h-full transition-all duration-300"
              style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-[#e5e2e1]">
          {items.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-[#F4F4F6] border-2 border-[#0A0A0A] flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-[#747878]" />
              </div>
              <h3 className="font-anton text-xl uppercase text-[#0A0A0A]">
                YOUR BAG IS EMPTY
              </h3>
              <p className="text-xs text-[#747878] max-w-xs mx-auto">
                No streetwear kicks in your bag yet. Check out the latest Hasan Raheem Capsule drop or trending runners.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-[#0A0A0A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#0062FF] transition-colors cursor-pointer"
              >
                START SHOPPING
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.cartItemId} className="py-4 flex space-x-3.5 group">
                {/* Thumbnail */}
                <div className="w-20 h-20 shrink-0 bg-[#F4F4F6] border border-[#0A0A0A] overflow-hidden">
                  <img
                    src={item.product.thumbnail}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <h4 className="font-grotesk font-bold text-xs text-[#0A0A0A] line-clamp-1 pr-2">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.cartItemId)}
                        className="text-gray-400 hover:text-[#E60000] p-0.5 transition-colors cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center space-x-2 text-[11px] text-[#444748] mt-0.5">
                      <span className="font-semibold">Size: EU {item.selectedSize}</span>
                      <span>&bull;</span>
                      <span className="flex items-center space-x-1">
                        <span 
                          className="w-2.5 h-2.5 rounded-full inline-block border border-gray-400" 
                          style={{ backgroundColor: item.selectedColor.hex }}
                        />
                        <span>{item.selectedColor.name}</span>
                      </span>
                    </div>
                  </div>

                  {/* Quantity and Price */}
                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-dashed border-[#e5e2e1]">
                    <div className="flex items-center border border-[#0A0A0A]">
                      <button
                        onClick={() => onUpdateQuantity(item.cartItemId, item.quantity - 1)}
                        className="px-2 py-0.5 text-xs font-bold hover:bg-[#0A0A0A] hover:text-white transition-colors cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-2.5 py-0.5 text-xs font-mono font-bold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                        className="px-2 py-0.5 text-xs font-bold hover:bg-[#0A0A0A] hover:text-white transition-colors cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-anton text-sm text-[#0A0A0A]">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Voucher & Checkout */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 bg-[#fdf8f8] border-t-2 border-[#0A0A0A] space-y-3.5">
            {/* Coupon Code Input */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2 bg-emerald-50 border border-emerald-500 text-xs text-emerald-800">
                  <div className="flex items-center space-x-1.5 font-bold">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>CODE {appliedCoupon} APPLIED ({discountPercent}% OFF)</span>
                  </div>
                  <button 
                    onClick={removeCoupon}
                    className="text-[#E60000] font-bold text-[10px] uppercase hover:underline cursor-pointer"
                  >
                    REMOVE
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 absolute left-2.5 top-3 text-gray-400" />
                    <input
                      type="text"
                      placeholder="DISCOUNT CODE (e.g. CSENZO10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-xs border border-[#0A0A0A] uppercase placeholder:normal-case font-mono bg-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#0A0A0A] text-white text-xs font-bold uppercase hover:bg-[#0062FF] transition-colors cursor-pointer"
                  >
                    APPLY
                  </button>
                </form>
              )}
              {couponError && (
                <p className="text-[10px] text-[#E60000] mt-1 font-semibold">{couponError}</p>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-[#444748] pt-2 border-t border-[#e5e2e1]">
              <div className="flex justify-between">
                <span>Bag Subtotal</span>
                <span className="font-semibold text-[#0A0A0A]">{formatPrice(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-[#E60000] font-bold">
                  <span>Voucher Discount</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="font-semibold text-[#0A0A0A]">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-700 font-bold">FREE</span>
                  ) : (
                    formatPrice(shippingFee)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base font-anton text-[#0A0A0A] pt-2 border-t border-[#0A0A0A]">
                <span>ESTIMATED TOTAL</span>
                <span className="text-lg">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            {/* Checkout Action */}
            <button
              id="cart-drawer-checkout-btn"
              onClick={() => onProceedToCheckout(discountAmount, appliedCoupon || '')}
              className="w-full py-4 bg-[#0A0A0A] text-white text-xs font-bold tracking-[0.08em] uppercase hover:bg-[#0062FF] hover:shadow-hard transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
