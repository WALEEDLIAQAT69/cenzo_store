import React from 'react';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { formatPrice } from '../utils/format';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: Product[];
  onRemoveFromWishlist: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlist,
  onRemoveFromWishlist,
  onSelectProduct,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      {/* Drawer */}
      <div 
        id="wishlist-slideout-drawer"
        className="relative ml-auto w-full max-w-md bg-white h-full flex flex-col justify-between border-l-2 border-[#0A0A0A] shadow-2xl z-10"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b-2 border-[#0A0A0A] flex items-center justify-between bg-[#fdf8f8]">
          <div className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-[#FF3366] fill-[#FF3366]" />
            <h2 className="font-anton text-xl uppercase tracking-wide">
              SAVED KICKS ({wishlist.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 border border-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-[#e5e2e1]">
          {wishlist.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-[#F4F4F6] border-2 border-[#0A0A0A] flex items-center justify-center">
                <Heart className="w-8 h-8 text-[#747878]" />
              </div>
              <h3 className="font-anton text-xl uppercase text-[#0A0A0A]">
                NO SAVED KICKS YET
              </h3>
              <p className="text-xs text-[#747878] max-w-xs mx-auto">
                Tap the heart icon on any sneaker to bookmark pairs for later or compare colorways.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-[#0A0A0A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#0062FF] transition-colors cursor-pointer"
              >
                EXPLORE CATALOG
              </button>
            </div>
          ) : (
            wishlist.map((product) => (
              <div key={product.id} className="py-4 flex space-x-3.5 group">
                <div 
                  onClick={() => {
                    onSelectProduct(product);
                    onClose();
                  }}
                  className="w-20 h-20 shrink-0 bg-[#F4F4F6] border border-[#0A0A0A] overflow-hidden cursor-pointer"
                >
                  <img
                    src={product.thumbnail}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <h4 
                        onClick={() => {
                          onSelectProduct(product);
                          onClose();
                        }}
                        className="font-grotesk font-bold text-xs text-[#0A0A0A] hover:text-[#0062FF] cursor-pointer line-clamp-1 pr-2"
                      >
                        {product.name}
                      </h4>
                      <button
                        onClick={() => onRemoveFromWishlist(product)}
                        className="text-gray-400 hover:text-[#E60000] p-0.5 transition-colors cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[11px] text-gray-500">
                      {product.gender} &bull; {product.category}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#e5e2e1]">
                    <span className="font-anton text-sm text-[#0A0A0A]">
                      {formatPrice(product.price)}
                    </span>

                    <button
                      onClick={() => {
                        onSelectProduct(product);
                        onClose();
                      }}
                      className="px-3 py-1.5 bg-[#0A0A0A] text-white text-[10px] font-bold uppercase tracking-wider hover:bg-[#0062FF] transition-colors flex items-center space-x-1 cursor-pointer"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>VIEW & BUY</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {wishlist.length > 0 && (
          <div className="p-4 bg-[#fdf8f8] border-t-2 border-[#0A0A0A]">
            <button
              onClick={onClose}
              className="w-full py-3 bg-white border border-[#0A0A0A] text-[#0A0A0A] text-xs font-bold uppercase tracking-wider hover:bg-[#0A0A0A] hover:text-white transition-colors cursor-pointer"
            >
              CONTINUE BROWSING
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
