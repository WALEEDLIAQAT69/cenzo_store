import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  ShoppingBag, 
  Zap, 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  Ruler, 
  ChevronDown, 
  ChevronUp, 
  Star,
  Check
} from 'lucide-react';
import { Product, ProductColor } from '../types';
import { formatPrice } from '../utils/format';
import { SizeGuideModal } from './SizeGuideModal';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: number, color: ProductColor, quantity: number) => void;
  onBuyNow: (product: Product, size: number, color: ProductColor, quantity: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
  isWishlisted,
  onToggleWishlist,
}) => {
  if (!product) return null;

  const [selectedImage, setSelectedImage] = useState<string>(product.images[0] || product.thumbnail);
  const [selectedSize, setSelectedSize] = useState<number>(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState<boolean>(false);
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);

  // Accordion state
  const [openAccordion, setOpenAccordion] = useState<string>('specs');

  const inStock = (product.stockBySize[selectedSize] ?? 0) > 0;
  const currentStock = product.stockBySize[selectedSize] ?? 0;

  const handleAdd = () => {
    if (!inStock) return;
    onAddToCart(product, selectedSize, selectedColor, quantity);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  const handleBuy = () => {
    if (!inStock) return;
    onBuyNow(product, selectedSize, selectedColor, quantity);
  };

  const toggleAccordion = (section: string) => {
    setOpenAccordion(openAccordion === section ? '' : section);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
        <div 
          id="product-detail-modal"
          className="bg-white border-2 border-[#0A0A0A] shadow-hard max-w-5xl w-full my-auto max-h-[95vh] overflow-y-auto relative"
        >
          {/* Close Button */}
          <button
            id="pdp-modal-close-btn"
            onClick={onClose}
            className="absolute top-4 right-4 z-30 p-2 bg-white border border-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Left Image Gallery (Cols 7) */}
            <div className="lg:col-span-7 bg-[#F4F4F6] p-4 sm:p-6 border-b lg:border-b-0 lg:border-r-2 border-[#0A0A0A] flex flex-col justify-between">
              {/* Main Image */}
              <div className="relative aspect-square w-full bg-[#ebe7e6] overflow-hidden mb-4 border border-[#0A0A0A]">
                {product.isCapsule && (
                  <span className="absolute top-4 left-4 z-20 px-3 py-1 bg-[#FF3366] text-white font-anton text-xs uppercase shadow-hard-sm">
                    HASAN RAHEEM CAPSULE
                  </span>
                )}
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Thumbnails Row */}
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(imgUrl)}
                    className={`aspect-square border-2 transition-all overflow-hidden bg-white cursor-pointer ${
                      selectedImage === imgUrl ? 'border-[#0062FF] shadow-hard-sm' : 'border-transparent hover:border-[#0A0A0A]'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`${product.name} angle ${idx + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Product Specs & Purchase Engine (Cols 5) */}
            <div className="lg:col-span-5 p-6 lg:p-8 flex flex-col justify-between space-y-6">
              <div>
                {/* Micro Category & Rating */}
                <div className="flex items-center justify-between text-xs text-[#444748] font-bold uppercase tracking-wider mb-2">
                  <span>{product.gender} • {product.category}</span>
                  <div className="flex items-center space-x-1 text-[#0A0A0A]">
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <span>({product.reviewCount})</span>
                  </div>
                </div>

                {/* Product Title & Subtitle */}
                <h1 className="font-anton text-2xl sm:text-3xl uppercase tracking-tight text-[#0A0A0A] leading-tight mb-1">
                  {product.name}
                </h1>
                <p className="text-xs text-[#747878] font-medium mb-4">
                  {product.subtitle}
                </p>

                {/* Price Display */}
                <div className="flex items-baseline space-x-3 pb-4 border-b border-[#e5e2e1]">
                  <span className="font-anton text-3xl text-[#0A0A0A]">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <>
                      <span className="font-mono text-sm text-gray-500 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                      <span className="px-2 py-0.5 bg-[#E60000] text-white text-[10px] font-bold uppercase">
                        SAVE {product.discountPercent}%
                      </span>
                    </>
                  )}
                </div>

                {/* Color Selector */}
                <div className="py-4 border-b border-[#e5e2e1] space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                    <span>COLORWAY:</span>
                    <span className="text-[#0062FF]">{selectedColor.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {product.colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color)}
                        className={`w-7 h-7 border-2 transition-transform cursor-pointer ${
                          selectedColor.name === color.name
                            ? 'border-[#0A0A0A] scale-110 shadow-hard-sm'
                            : 'border-transparent hover:scale-105'
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Size Selector with Size Guide button */}
                <div className="py-4 border-b border-[#e5e2e1] space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                    <span>SELECT SIZE (EU):</span>
                    <button
                      onClick={() => setSizeGuideOpen(true)}
                      className="text-[#0062FF] hover:underline flex items-center space-x-1 cursor-pointer"
                    >
                      <Ruler className="w-3.5 h-3.5" />
                      <span>SIZE GUIDE</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-5 gap-2">
                    {product.sizes.map((size) => {
                      const sizeInStock = (product.stockBySize[size] ?? 0) > 0;
                      const isSelected = selectedSize === size;

                      return (
                        <button
                          key={size}
                          disabled={!sizeInStock}
                          onClick={() => setSelectedSize(size)}
                          className={`py-2 text-xs font-bold border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#0A0A0A] text-white border-[#0A0A0A] shadow-hard-sm'
                              : sizeInStock
                              ? 'bg-white text-[#0A0A0A] border-[#c4c7c7] hover:border-[#0A0A0A]'
                              : 'bg-transparent text-gray-400 border-gray-200 line-through opacity-40 cursor-not-allowed'
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>

                  {/* Stock Status Indicator */}
                  <div className="text-[11px] pt-1">
                    {inStock ? (
                      <span className="text-emerald-700 font-bold flex items-center space-x-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block animate-pulse"></span>
                        <span>IN STOCK • Only {currentStock} pairs available in size {selectedSize}</span>
                      </span>
                    ) : (
                      <span className="text-[#E60000] font-bold">
                        OUT OF STOCK in size {selectedSize}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="py-4 border-b border-[#e5e2e1] flex items-center space-x-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0A0A0A]">
                    QUANTITY:
                  </span>
                  <div className="flex items-center border border-[#0A0A0A]">
                    <button
                      disabled={quantity <= 1}
                      onClick={() => setQuantity(quantity - 1)}
                      className="px-3 py-1 text-sm font-bold hover:bg-[#0A0A0A] hover:text-white transition-colors disabled:opacity-30 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 font-mono font-bold text-xs">
                      {quantity}
                    </span>
                    <button
                      disabled={quantity >= currentStock}
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-1 text-sm font-bold hover:bg-[#0A0A0A] hover:text-white transition-colors disabled:opacity-30 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Main Action Buttons */}
                <div className="pt-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <button
                      id="pdp-btn-add-to-bag"
                      disabled={!inStock}
                      onClick={handleAdd}
                      className="flex-1 py-4 bg-[#0A0A0A] text-white font-bold text-xs tracking-[0.08em] uppercase hover:bg-[#0062FF] hover:shadow-hard transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                    >
                      {addedSuccess ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span>ADDED TO BAG!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" />
                          <span>ADD TO BAG</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => onToggleWishlist(product)}
                      className={`p-4 border-2 border-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-colors cursor-pointer ${
                        isWishlisted ? 'text-[#FF3366]' : 'text-[#0A0A0A]'
                      }`}
                      title={isWishlisted ? 'Remove Wishlist' : 'Add to Wishlist'}
                    >
                      <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-[#FF3366]' : ''}`} />
                    </button>
                  </div>

                  <button
                    id="pdp-btn-buy-now"
                    disabled={!inStock}
                    onClick={handleBuy}
                    className="w-full py-4 bg-[#0062FF] text-white font-bold text-xs tracking-[0.08em] uppercase hover:bg-[#004ccb] hover:shadow-hard transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                  >
                    <Zap className="w-4 h-4" />
                    <span>BUY IT NOW (EXPRESS CHECKOUT)</span>
                  </button>
                </div>

                {/* Delivery Guarantee Notice */}
                <div className="mt-4 p-3 bg-[#f1edec] border border-[#e5e2e1] space-y-1.5 text-xs text-[#444748]">
                  <div className="flex items-center space-x-2 font-bold text-[#0A0A0A]">
                    <Truck className="w-4 h-4 text-[#0062FF]" />
                    <span>Cash on Delivery (COD) Available Nationwide</span>
                  </div>
                  <p className="text-[11px] pl-6 text-[#747878]">
                    Standard delivery in 2-4 working days via TCS/Trax. Free shipping on orders over Rs. 2,500.
                  </p>
                </div>

                {/* Expandable Accordions */}
                <div className="mt-6 border-t border-[#0A0A0A] divide-y divide-[#e5e2e1] text-xs">
                  {/* Tech Specs */}
                  <div>
                    <button
                      onClick={() => toggleAccordion('specs')}
                      className="w-full py-3 flex items-center justify-between font-bold uppercase tracking-wider text-[#0A0A0A] cursor-pointer"
                    >
                      <span>TECH SPECS & MATERIALS</span>
                      {openAccordion === 'specs' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    {openAccordion === 'specs' && (
                      <div className="pb-4 space-y-2 text-[#444748]">
                        <p>{product.description}</p>
                        <ul className="list-disc list-inside space-y-1 pt-2">
                          {product.features.map((feat, idx) => (
                            <li key={idx}>{feat}</li>
                          ))}
                        </ul>
                        <div className="grid grid-cols-2 gap-2 pt-3 font-mono text-[11px]">
                          <div><span className="font-bold text-[#0A0A0A]">UPPER:</span> {product.specs.upperMaterial}</div>
                          <div><span className="font-bold text-[#0A0A0A]">SOLE:</span> {product.specs.soleMaterial}</div>
                          <div><span className="font-bold text-[#0A0A0A]">INSOLE:</span> {product.specs.insole}</div>
                          <div><span className="font-bold text-[#0A0A0A]">ORIGIN:</span> {product.specs.origin}</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 15 Days Exchange Policy */}
                  <div>
                    <button
                      onClick={() => toggleAccordion('returns')}
                      className="w-full py-3 flex items-center justify-between font-bold uppercase tracking-wider text-[#0A0A0A] cursor-pointer"
                    >
                      <span>15-DAY RETURN & EXCHANGE POLICY</span>
                      {openAccordion === 'returns' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    {openAccordion === 'returns' && (
                      <div className="pb-4 text-xs text-[#444748] space-y-1.5 leading-relaxed">
                        <p>
                          We offer a hassle-free 15-day return and size exchange policy across all our 8 retail stores nationwide or via courier pickup.
                        </p>
                        <p>
                          Articles must be in unworn condition with original tags and packaging intact.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Size Guide Modal Sub-component */}
      <SizeGuideModal 
        isOpen={sizeGuideOpen} 
        onClose={() => setSizeGuideOpen(false)} 
      />
    </>
  );
};
