import React, { useState } from 'react';
import { Heart, Check } from 'lucide-react';
import { Product, ProductColor } from '../types';
import { formatPrice } from '../utils/format';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, size: number, color: ProductColor) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
}) => {
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0]);
  const [addedSize, setAddedSize] = useState<number | null>(null);

  const handleQuickAdd = (e: React.MouseEvent, size: number) => {
    e.stopPropagation();
    onAddToCart(product, size, selectedColor);
    setAddedSize(size);
    setTimeout(() => {
      setAddedSize(null);
    }, 1600);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleWishlist(product);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => onQuickView(product)}
      className="group relative bg-[#F4F4F6] border border-transparent hover:border-[#0A0A0A] hover:shadow-hard transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      {/* Top Image Container with Badges & Wishlist */}
      <div className="relative aspect-[4/5] sm:aspect-square w-full bg-[#ebe7e6] overflow-hidden">
        {/* Badges top-left */}
        <div className="absolute top-2.5 left-2.5 z-20 flex flex-col items-start gap-1">
          {product.isCapsule && (
            <span className="px-2 py-0.5 bg-[#FF3366] text-white text-[10px] font-anton tracking-wider uppercase shadow-hard-sm">
              CAPSULE DROP
            </span>
          )}
          {product.discountPercent && product.discountPercent > 0 ? (
            <span className="px-2 py-0.5 bg-[#E60000] text-white text-[10px] font-anton tracking-wider uppercase">
              SALE -{product.discountPercent}%
            </span>
          ) : product.isNew ? (
            <span className="px-2 py-0.5 bg-[#0A0A0A] text-white text-[10px] font-anton tracking-wider uppercase">
              NEW RELEASE
            </span>
          ) : null}
        </div>

        {/* Wishlist Button top-right */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-2.5 right-2.5 z-20 p-2 bg-white/90 hover:bg-white border border-[#0A0A0A] transition-colors cursor-pointer ${
            isWishlisted ? 'text-[#FF3366]' : 'text-[#0A0A0A]'
          }`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#FF3366]' : ''}`} />
        </button>

        {/* Primary Shoe Image */}
        <img
          src={product.thumbnail}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Slide-Up Quick Size Picker (visible on desktop hover or mobile interaction) */}
        <div 
          onClick={(e) => e.stopPropagation()}
          className="absolute inset-x-0 bottom-0 bg-[#0A0A0A]/95 text-white p-2.5 transform translate-y-full group-hover:translate-y-0 transition-transform duration-200 z-30"
        >
          <div className="flex items-center justify-between mb-1.5 px-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-300">
              1-CLICK SELECT SIZE (EU)
            </span>
            <span className="text-[9px] font-mono text-[#DFFF00]">INSTANT ADD</span>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {product.sizes.slice(0, 7).map((size) => {
              const inStock = (product.stockBySize[size] ?? 0) > 0;
              const isJustAdded = addedSize === size;

              return (
                <button
                  key={size}
                  disabled={!inStock}
                  onClick={(e) => handleQuickAdd(e, size)}
                  className={`py-1 text-[11px] font-bold border transition-colors cursor-pointer flex items-center justify-center ${
                    isJustAdded
                      ? 'bg-emerald-500 text-white border-emerald-500'
                      : inStock
                      ? 'bg-white text-[#0A0A0A] border-white hover:bg-[#0062FF] hover:text-white hover:border-[#0062FF]'
                      : 'bg-transparent text-gray-500 border-gray-700 opacity-40 line-through cursor-not-allowed'
                  }`}
                  title={inStock ? `Add Size ${size}` : `Size ${size} Out of Stock`}
                >
                  {isJustAdded ? <Check className="w-3 h-3" /> : size}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Product Details info */}
      <div className="p-3.5 flex flex-col justify-between flex-grow">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-[11px] text-[#444748] mb-1 font-semibold uppercase tracking-wider">
            <span>{product.gender} • {product.category}</span>
            <span className="text-[#0A0A0A] font-bold">★ {product.rating}</span>
          </div>

          {/* Title */}
          <h3 className="font-grotesk font-bold text-sm text-[#0A0A0A] line-clamp-1 group-hover:text-[#0062FF] transition-colors">
            {product.name}
          </h3>

          <p className="text-[11px] text-[#747878] line-clamp-1 mb-2">
            {product.subtitle}
          </p>
        </div>

        {/* Bottom row: Colors + Price */}
        <div className="pt-2 border-t border-[#e5e2e1] flex items-center justify-between">
          {/* Color swatches */}
          <div className="flex items-center space-x-1.5" onClick={(e) => e.stopPropagation()}>
            {product.colors.map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color)}
                className={`w-3.5 h-3.5 border transition-transform cursor-pointer ${
                  selectedColor.name === color.name
                    ? 'border-[#0A0A0A] scale-125'
                    : 'border-transparent hover:scale-110'
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>

          {/* Price */}
          <div className="text-right">
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[11px] font-mono text-gray-500 line-through mr-1.5">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            <span className="font-anton text-base text-[#0A0A0A]">
              {formatPrice(product.price)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
