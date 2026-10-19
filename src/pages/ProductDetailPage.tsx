import React, { useState } from 'react';
import { Product, ProductColor } from '../types';
import { formatPrice } from '../utils/format';
import { 
  FlameIcon, 
  LayersIcon, 
  CheckIcon, 
  ZoomIcon, 
  Straighten, 
  CreditCardIcon, 
  RocketLaunch, 
  Schedule, 
  SyncAlt, 
  Star, 
  ShoppingBagIcon, 
  LocalShipping, 
  AddIcon,
  CloseIcon
} from '../components/Icons';

interface ProductDetailPageProps {
  product: Product;
  onAddToCart: (product: Product, size: number, color: ProductColor, quantity?: number) => void;
  onBuyNow: (product: Product, size: number, color: ProductColor, quantity?: number) => void;
  onNavigate: (path: string) => void;
  onSelectProduct: (product: Product) => void;
  allProducts: Product[];
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  onAddToCart,
  onBuyNow,
  onNavigate,
  onSelectProduct,
  allProducts,
}) => {
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);
  const [selectedColor, setSelectedColor] = useState<ProductColor>(
    product.colors[0] || { name: 'Off-White / Neon Pink', hex: '#FF3366' }
  );
  const [selectedSize, setSelectedSize] = useState<number>(42);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'story' | 'specs' | 'reviews'>('story');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const galleryImages = product.images && product.images.length > 0 
    ? product.images 
    : [
        product.thumbnail,
        'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=900&q=80',
      ];

  const handleAdd = () => {
    onAddToCart(product, selectedSize, selectedColor, quantity);
    setToastMessage(`Added ${product.name} • Size ${selectedSize} to bag`);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const handleInstantBuy = () => {
    onBuyNow(product, selectedSize, selectedColor, quantity);
  };

  // Recommendations for "Complete The Look"
  const crossSellProducts = allProducts.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="w-full flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#000000] text-white px-5 py-3 border border-white shadow-hard flex items-center gap-3 animate-bounce">
          <span className="w-2.5 h-2.5 rounded-full bg-[#DFFF00]"></span>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-white">Added to Bag</p>
            <p className="text-[11px] text-gray-300">{toastMessage}</p>
          </div>
        </div>
      )}

      {/* Breadcrumbs & Capsule Drop Flash Header */}
      <div className="w-full bg-[#f1edec] px-4 sm:px-8 lg:px-12 py-2.5 flex flex-wrap items-center justify-between gap-2 border-b border-[#c4c7c7]">
        <nav className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#444748] font-mono">
          <button onClick={() => onNavigate('/')} className="hover:text-black cursor-pointer">
            Home
          </button>
          <span className="text-[#747878]">/</span>
          <button onClick={() => onNavigate('/hasan-raheem-collection')} className="text-[#FF3366] font-bold hover:underline cursor-pointer">
            Hasan Raheem Collection
          </button>
          <span className="text-[#747878]">/</span>
          <span className="text-[#000000] font-bold">{product.name}</span>
        </nav>
        <div className="flex items-center gap-2 bg-[#000000] text-white px-3 py-1 border border-[#0A0A0A]">
          <span className="w-2 h-2 rounded-full bg-[#FF3366] animate-ping"></span>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#DFFF00] font-bold">
            Capsule Drop 02 / Limited Archive
          </span>
        </div>
      </div>

      {/* Main Product Section: Split Gallery & Purchase Module */}
      <div className="w-full px-4 sm:px-8 lg:px-12 py-8 bg-[#fdf8f8]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: Sneaker Visual Gallery (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Main Stage Image Container */}
            <div className="relative w-full aspect-square bg-[#F4F4F6] border-2 border-[#0A0A0A] overflow-hidden group shadow-hard-sm">
              {/* Top Badges Overlay */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
                <span className="bg-[#FF3366] text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest border border-[#000000] shadow-sm">
                  Exclusive Capsule Drop 02
                </span>
                <span className="bg-[#E60000] text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest border border-[#000000] flex items-center gap-1">
                  <FlameIcon className="w-3.5 h-3.5" />
                  <span>Selling Fast</span>
                </span>
              </div>

              {/* Hasan Raheem Monogram Seal Badge */}
              <div className="absolute top-4 right-4 z-10 w-12 h-12 bg-[#000000] text-[#DFFF00] flex flex-col items-center justify-center border border-[#FF3366] shadow-[3px_3px_0px_#FF3366]">
                <span className="font-anton text-lg leading-none">HR</span>
                <span className="text-[7px] font-mono uppercase tracking-tighter text-white">Edition</span>
              </div>

              {/* Primary Active Sneaker Image */}
              <img
                src={galleryImages[activeImageIdx] || product.thumbnail}
                alt={product.name}
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />

              {/* Zoom Callout Button */}
              <button
                aria-label="Expand Image"
                onClick={() => window.open(galleryImages[activeImageIdx] || product.thumbnail, '_blank')}
                className="absolute bottom-4 right-4 bg-white/90 text-[#000000] p-2 border border-[#000000] shadow-[2px_2px_0px_#000000] hover:bg-[#000000] hover:text-white transition-colors cursor-pointer"
              >
                <ZoomIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Thumbnail Gallery Grid */}
            <div className="grid grid-cols-4 gap-3">
              {galleryImages.slice(0, 4).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`aspect-square bg-[#F4F4F6] border-2 overflow-hidden p-1 transition-all cursor-pointer ${
                    activeImageIdx === idx
                      ? 'border-[#000000] shadow-[3px_3px_0px_#000000]'
                      : 'border-gray-300 hover:border-[#000000]'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} angle ${idx + 1}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>

            {/* Sneaker Tech Spec Micro-Badges */}
            <div className="grid grid-cols-3 gap-3 bg-[#f7f3f2] p-4 border border-[#0A0A0A] mt-2">
              <div className="flex items-center gap-3">
                <LayersIcon className="w-6 h-6 text-[#004ccb]" />
                <div>
                  <p className="text-[9px] font-mono uppercase text-[#747878] font-bold">Midsole</p>
                  <p className="text-xs font-bold text-[#000000]">Ultra-EVA Foam</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CheckIcon className="w-6 h-6 text-[#FF3366]" />
                <div>
                  <p className="text-[9px] font-mono uppercase text-[#747878] font-bold">Upper Material</p>
                  <p className="text-xs font-bold text-[#000000]">Archival Leather</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-[#000000] text-[#DFFF00] flex items-center justify-center font-bold text-xs">
                  O
                </div>
                <div>
                  <p className="text-[9px] font-mono uppercase text-[#747878] font-bold">Traction Pattern</p>
                  <p className="text-xs font-bold text-[#000000]">Non-Marking Cup</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Purchase Module & Spec Details (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {/* Header & Identity */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#747878]">
                  Style Code: ND-HR-CRT-02
                </span>
                <div className="flex items-center gap-1 bg-[#ebe7e6] px-2 py-0.5 border border-gray-300">
                  <div className="flex text-[#000000]">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[11px] font-bold text-[#000000]">5.0 (89)</span>
                </div>
              </div>

              <h1 className="font-anton text-3xl sm:text-4xl uppercase text-[#000000] tracking-wide leading-none">
                {product.name}
              </h1>
              <p className="text-sm text-[#444748] uppercase tracking-wider mt-1 font-semibold">
                {product.subtitle || 'Off-White / Neon Pink Stitch Edition'}
              </p>
            </div>

            {/* Pricing & BNPL Callout */}
            <div className="bg-[#f7f3f2] p-4 border border-[#0A0A0A] flex flex-col gap-2 shadow-hard-sm">
              <div className="flex items-baseline gap-3">
                <span className="font-anton text-3xl text-[#000000]">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-base text-[#747878] line-through font-mono">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                {product.discountPercent && (
                  <span className="bg-[#E60000] text-white px-2 py-0.5 text-[10px] font-bold uppercase">
                    -{product.discountPercent}% OFF
                  </span>
                )}
              </div>

              <div className="bg-white p-2.5 border border-[#c4c7c7] flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <CreditCardIcon className="w-4 h-4 text-[#004ccb]" />
                  <p className="text-[#1c1b1b]">
                    Or 3 interest-free monthly payments of <strong className="text-[#000000]">Rs. {Math.round(product.price / 3).toLocaleString()}</strong>
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold uppercase font-mono">
                  <span className="bg-[#f1edec] px-1.5 py-0.5 text-[#004ccb]">Yeylo</span>
                  <span className="bg-[#f1edec] px-1.5 py-0.5 text-[#E60000]">JazzCash</span>
                </div>
              </div>
            </div>

            {/* Colorway Selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-wider text-[#000000] font-bold">
                  Colorway: <span className="text-[#FF3366]">{selectedColor.name}</span>
                </span>
                <span className="text-[10px] uppercase text-[#747878] font-semibold">3 Variants</span>
              </div>
              <div className="flex items-center gap-2">
                {[
                  { name: 'Off-White / Neon Pink', hex: '#FF3366', sub: 'Off-White/Pink' },
                  { name: 'Phantom Black / Acid Green', hex: '#DFFF00', sub: 'Phantom Black' },
                  { name: 'Retro Cream / Cobalt', hex: '#004ccb', sub: 'Retro Cobalt' },
                ].map((col) => {
                  const isSelected = selectedColor.name === col.name;
                  return (
                    <button
                      key={col.name}
                      onClick={() => setSelectedColor({ name: col.name, hex: col.hex })}
                      className={`p-1 border-2 transition-all flex items-center gap-2 cursor-pointer ${
                        isSelected
                          ? 'bg-[#000000] text-white border-[#000000] shadow-[2px_2px_0px_#FF3366]'
                          : 'bg-[#f1edec] text-[#000000] border-[#c4c7c7] hover:bg-[#ebe7e6]'
                      }`}
                    >
                      <div className="w-6 h-6 border border-gray-400 flex items-center justify-center bg-white">
                        <div className="w-3 h-3" style={{ backgroundColor: col.hex }}></div>
                      </div>
                      <span className="text-[10px] uppercase pr-2 font-bold hidden sm:inline">
                        {col.sub}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size Picker Module */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider text-[#000000] font-bold">
                    Select Size (EU/PK):
                  </span>
                  <span className="text-[10px] font-mono text-[#E60000] font-bold animate-pulse">
                    ● Only 3 pairs left in size {selectedSize}
                  </span>
                </div>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="text-[10px] uppercase tracking-wider text-[#004ccb] underline font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Straighten className="w-3.5 h-3.5" />
                  <span>Size Guide</span>
                </button>
              </div>

              {/* Size Buttons Matrix */}
              <div className="grid grid-cols-7 gap-1.5">
                {[
                  { eu: 39, us: 'US 6.5' },
                  { eu: 40, us: 'US 7.5' },
                  { eu: 41, us: 'US 8' },
                  { eu: 42, us: 'US 9' },
                  { eu: 43, us: 'US 10' },
                  { eu: 44, us: 'US 11' },
                ].map((s) => {
                  const isActive = selectedSize === s.eu;
                  return (
                    <button
                      key={s.eu}
                      onClick={() => setSelectedSize(s.eu)}
                      className={`h-12 flex flex-col items-center justify-center border-2 transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#000000] text-white border-[#000000] shadow-[2px_2px_0px_#004ccb]'
                          : 'bg-[#f1edec] text-[#000000] border-[#c4c7c7] hover:bg-[#ebe7e6]'
                      }`}
                    >
                      <span className="font-bold text-sm leading-tight">{s.eu}</span>
                      <span className={`text-[8px] uppercase leading-none font-mono ${isActive ? 'text-[#DFFF00]' : 'text-[#747878]'}`}>
                        {s.us}
                      </span>
                    </button>
                  );
                })}

                {/* Sold out size */}
                <button
                  disabled
                  className="h-12 flex flex-col items-center justify-center bg-[#ebe7e6] border border-[#c4c7c7] opacity-40 cursor-not-allowed relative overflow-hidden"
                >
                  <span className="font-bold text-sm text-[#747878]">45</span>
                  <span className="text-[8px] font-mono text-[#747878] uppercase">SOLD</span>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-0.5 bg-[#747878] transform rotate-45"></div>
                  </div>
                </button>
              </div>
            </div>

            {/* Quantity & Purchase Action Buttons */}
            <div className="flex flex-col gap-2.5 pt-2">
              <div className="flex gap-2.5">
                {/* Stepper */}
                <div className="w-28 h-12 bg-[#f1edec] border-2 border-[#000000] flex items-center justify-between px-2">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-7 h-7 flex items-center justify-center text-black hover:bg-white font-bold text-lg cursor-pointer"
                  >
                    −
                  </button>
                  <span className="font-bold text-sm text-black font-mono">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                    className="w-7 h-7 flex items-center justify-center text-black hover:bg-white font-bold text-lg cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Main CTA: Add to Bag */}
                <button
                  onClick={handleAdd}
                  className="flex-1 h-12 bg-[#000000] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#004ccb] transition-all shadow-hard-sm active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
                >
                  <ShoppingBagIcon className="w-4 h-4" />
                  <span>ADD TO BAG • {formatPrice(product.price * quantity)}</span>
                </button>
              </div>

              {/* Fast COD Checkout Button */}
              <button
                onClick={handleInstantBuy}
                className="w-full h-12 bg-[#004ccb] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#000000] transition-all shadow-hard-sm cursor-pointer"
              >
                <LocalShipping className="w-4 h-4" />
                <span>BUY NOW VIA CASH ON DELIVERY</span>
              </button>
            </div>

            {/* Delivery & Service Perks Ticker Box */}
            <div className="bg-[#f7f3f2] border border-[#0A0A0A] p-4 flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <RocketLaunch className="w-5 h-5 text-[#000000] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs uppercase font-bold text-[#000000]">Free Nationwide Shipping</p>
                  <p className="text-[11px] text-[#444748]">Eligible automatically on all Hasan Raheem Capsule items.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Schedule className="w-5 h-5 text-[#000000] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs uppercase font-bold text-[#000000]">Estimated Delivery: 2-4 Business Days</p>
                  <p className="text-[11px] text-[#444748]">Express dispatch from Lahore central warehouse.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <SyncAlt className="w-5 h-5 text-[#000000] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs uppercase font-bold text-[#000000]">Easy 30-Day Exchange</p>
                  <p className="text-[11px] text-[#444748]">Hassle-free swap at any of our 200+ Ndure retail locations nationwide.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Narrative Drop Marquee Strip */}
      <div className="w-full bg-[#000000] text-white py-3 overflow-hidden border-y-2 border-[#0A0A0A] my-8">
        <div className="flex whitespace-nowrap gap-8 uppercase font-anton text-lg sm:text-xl tracking-wider text-gray-300">
          <span className="text-[#DFFF00]">NDURE × HASAN RAHEEM</span>
          <span>•</span>
          <span>INDEPENDENT SOUND MEETS INDUSTRIAL STREETWEAR</span>
          <span>•</span>
          <span className="text-[#FF3366]">CAPSULE DROP 02</span>
          <span>•</span>
          <span>CRAFTED FOR EVERYDAY REBELS</span>
          <span>•</span>
          <span className="text-[#DFFF00]">NDURE × HASAN RAHEEM</span>
          <span>•</span>
          <span>INDEPENDENT SOUND MEETS INDUSTRIAL STREETWEAR</span>
        </div>
      </div>

      {/* Tabbed Specifications, Drop Story & Social Proof Section */}
      <div className="w-full px-4 sm:px-8 lg:px-12 mb-16">
        <div className="max-w-7xl mx-auto">
          {/* Tab Controls */}
          <div className="flex flex-wrap items-center gap-1 bg-[#f1edec] p-1 border-2 border-[#0A0A0A]">
            <button
              onClick={() => setActiveTab('story')}
              className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'story'
                  ? 'bg-[#000000] text-white shadow-sm'
                  : 'bg-transparent text-[#444748] hover:text-[#000000]'
              }`}
            >
              The Story Behind The Drop
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'specs'
                  ? 'bg-[#000000] text-white shadow-sm'
                  : 'bg-transparent text-[#444748] hover:text-[#000000]'
              }`}
            >
              Materials &amp; Tech Specs
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'reviews'
                  ? 'bg-[#000000] text-white shadow-sm'
                  : 'bg-transparent text-[#444748] hover:text-[#000000]'
              }`}
            >
              Customer Reviews (89)
            </button>
          </div>

          {/* Tab 1: Story Behind Drop */}
          {activeTab === 'story' && (
            <div className="bg-white p-6 sm:p-10 border-2 border-t-0 border-[#0A0A0A] shadow-hard-sm">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 flex flex-col gap-4">
                  <span className="text-xs font-mono uppercase tracking-widest text-[#FF3366] font-bold">
                    Artist Perspective
                  </span>
                  <blockquote className="font-anton text-2xl sm:text-3xl text-[#000000] uppercase leading-tight">
                    "Karachi's coastal indie rhythms crashing into Lahore's raw concrete sneaker culture. We built this silhouette for those who create on their own frequencies."
                  </blockquote>
                  <p className="text-xs sm:text-sm text-[#444748] leading-relaxed">
                    Co-designed from scratch over nine months of prototyping between Karachi recording studios and Ndure's craft development facility in Gulberg III, Lahore. The HR Court Low strips away orthodox basketball bulk in favor of an aerodynamic low-profile chassis with exaggerated industrial contrast seams and customized typographic lyric inserts.
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <div className="w-12 h-12 bg-[#000000] text-white flex items-center justify-center font-anton text-xl border border-[#FF3366]">
                      HR
                    </div>
                    <div>
                      <p className="font-bold text-sm uppercase text-[#000000]">Hasan Raheem</p>
                      <p className="text-[11px] text-[#747878] uppercase tracking-wider">Musician &amp; Capsule Creative Lead</p>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div className="relative w-full aspect-4/5 bg-[#F4F4F6] border-2 border-[#0A0A0A] overflow-hidden shadow-[4px_4px_0px_#FF3366]">
                    <img
                      src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80"
                      alt="Hasan Raheem studio session"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-3 left-3 bg-[#000000] text-[#DFFF00] px-3 py-1 text-[10px] font-mono uppercase font-bold tracking-wider">
                      Studio Session 04 / Lahore
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Materials & Tech Specs */}
          {activeTab === 'specs' && (
            <div className="bg-white p-6 sm:p-10 border-2 border-t-0 border-[#0A0A0A] shadow-hard-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#f7f3f2] p-5 border border-[#0A0A0A] flex flex-col gap-2">
                  <span className="font-anton text-2xl text-[#004ccb]">01</span>
                  <h3 className="font-anton text-lg uppercase text-[#000000]">Upper Architecture</h3>
                  <p className="text-xs text-[#444748] leading-relaxed">
                    Hand-selected archival grade tumbled leather layered with micro-perforated toe vamp for maximum tropical breathability. High-tensile neon pink bonded thread with double-row backstitching.
                  </p>
                  <ul className="text-[11px] font-bold uppercase tracking-wider text-[#000000] space-y-1 pt-2">
                    <li>• 1.4mm Full-Grain Spec</li>
                    <li>• Gusseted Anti-Slip Tongue</li>
                    <li>• Memory Foam Collar Lining</li>
                  </ul>
                </div>

                <div className="bg-[#f7f3f2] p-5 border border-[#0A0A0A] flex flex-col gap-2">
                  <span className="font-anton text-2xl text-[#FF3366]">02</span>
                  <h3 className="font-anton text-lg uppercase text-[#000000]">Internal Ride Dynamics</h3>
                  <p className="text-xs text-[#444748] leading-relaxed">
                    Dual-density molded EVA midsole core engineered to absorb high impact on cracked asphalt surfaces without bottoming out over continuous 14-hour daily wear.
                  </p>
                  <ul className="text-[11px] font-bold uppercase tracking-wider text-[#000000] space-y-1 pt-2">
                    <li>• Custom Polyurethane Footbed</li>
                    <li>• Energy-Return Metatarsal Pod</li>
                    <li>• Zero-Break-in Construction</li>
                  </ul>
                </div>

                <div className="bg-[#f7f3f2] p-5 border border-[#0A0A0A] flex flex-col gap-2">
                  <span className="font-anton text-2xl text-[#000000]">03</span>
                  <h3 className="font-anton text-lg uppercase text-[#000000]">Sole &amp; Grip Utility</h3>
                  <p className="text-xs text-[#444748] leading-relaxed">
                    Non-marking solid rubber cupsole poured with custom herringbone siping inspired by classic 80s indoor tennis courts, providing unshakeable grip on slick surfaces.
                  </p>
                  <ul className="text-[11px] font-bold uppercase tracking-wider text-[#000000] space-y-1 pt-2">
                    <li>• Non-Marking Compound</li>
                    <li>• Perimeter 360-degree Stitch</li>
                    <li>• High-Abrasion Rubber Wall</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Customer Reviews */}
          {activeTab === 'reviews' && (
            <div className="bg-white p-6 sm:p-10 border-2 border-t-0 border-[#0A0A0A] shadow-hard-sm">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-[#e5e2e1]">
                <div className="flex items-center gap-6">
                  <div className="flex flex-col">
                    <span className="font-anton text-5xl leading-none text-[#000000]">5.0</span>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-[#747878] font-bold mt-1">
                      Based on 89 Verified Orders
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex text-[#000000]">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs uppercase text-[#004ccb] font-bold">100% of reviewers recommend this shoe</p>
                  </div>
                </div>
                <button 
                  onClick={() => alert('Review portal will open after verified delivery confirmation.')}
                  className="bg-[#000000] text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-[#004ccb] transition-colors shadow-hard-sm cursor-pointer"
                >
                  Write A Review
                </button>
              </div>

              {/* Real Customer UGC Photo Strip */}
              <div className="my-6">
                <p className="text-xs font-bold uppercase text-[#000000] mb-3">Buyer On-Foot Looks:</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=400&q=80',
                    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=400&q=80',
                    'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=400&q=80',
                    'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=400&q=80',
                  ].map((img, i) => (
                    <div key={i} className="aspect-square bg-[#F4F4F6] border border-[#0A0A0A] overflow-hidden">
                      <img src={img} alt="Customer on foot review" className="w-full h-full object-cover hover:scale-105 transition-transform" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Review Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#f7f3f2] p-4 border border-[#0A0A0A] flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-[#000000]">Bilal K. • Karachi</span>
                    <span className="text-[10px] text-[#747878]">2 days ago</span>
                  </div>
                  <div className="flex text-[#000000]">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs font-bold text-[#000000]">"Exceeded all expectations. Quality rivals Rs. 25K international kicks."</p>
                  <p className="text-xs text-[#444748]">
                    The off-white tumbled leather is butter soft out of the box. Size 42 fits true to size. Delivery took only 48 hours to Clifton. 10/10 collab!
                  </p>
                  <span className="text-[10px] font-mono uppercase text-[#004ccb] font-bold mt-1">✓ Verified Ndure Purchaser</span>
                </div>

                <div className="bg-[#f7f3f2] p-4 border border-[#0A0A0A] flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-[#000000]">Zainab M. • Lahore</span>
                    <span className="text-[10px] text-[#747878]">5 days ago</span>
                  </div>
                  <div className="flex text-[#000000]">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs font-bold text-[#000000]">"Neon pink stitching pops insanely hard under streetlights."</p>
                  <p className="text-xs text-[#444748]">
                    Got pairs for both my brother and myself. The insole comfort is ridiculous, super bouncy EVA sole. Hope they drop more colorways soon.
                  </p>
                  <span className="text-[10px] font-mono uppercase text-[#004ccb] font-bold mt-1">✓ Verified Ndure Purchaser</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Complete The Look / Cross-Sell */}
      <div className="w-full px-4 sm:px-8 lg:px-12 mb-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#FF3366] font-bold">Curated Styling</span>
              <h2 className="font-anton text-2xl sm:text-3xl uppercase text-[#000000] tracking-wide">
                Complete The Look
              </h2>
            </div>
            <button
              onClick={() => onNavigate('/hasan-raheem-collection')}
              className="text-xs uppercase tracking-wider text-[#004ccb] font-bold hover:text-[#000000] transition-colors cursor-pointer"
            >
              View Entire Capsule &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {crossSellProducts.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectProduct(item)}
                className="bg-[#F4F4F6] border-2 border-[#0A0A0A] p-3 flex flex-col justify-between group cursor-pointer hover:shadow-hard transition-all"
              >
                <div className="relative aspect-square overflow-hidden bg-white border border-[#0A0A0A] mb-3">
                  <span className="absolute top-2 left-2 z-10 bg-[#000000] text-white px-2 py-0.5 text-[9px] font-bold uppercase">
                    Capsule Drop
                  </span>
                  <img
                    src={item.thumbnail}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <p className="text-[10px] uppercase text-[#747878] font-bold">{item.category}</p>
                  <h3 className="font-anton text-sm uppercase text-[#000000] line-clamp-1 group-hover:text-[#004ccb]">
                    {item.name}
                  </h3>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#e5e2e1]">
                    <span className="font-anton text-sm text-[#000000]">{formatPrice(item.price)}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(item, item.sizes[0] || 42, item.colors[0]);
                      }}
                      className="w-7 h-7 bg-[#000000] text-white flex items-center justify-center hover:bg-[#004ccb] transition-colors cursor-pointer"
                      title="Quick Add"
                    >
                      <AddIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Size Guide Modal Dialog */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white border-2 border-[#0A0A0A] p-6 sm:p-8 shadow-hard relative">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#0A0A0A]">
              <div className="flex items-center gap-2">
                <Straighten className="w-5 h-5 text-[#000000]" />
                <h3 className="font-anton text-xl uppercase text-[#000000]">SNEAKER SIZE CHART</h3>
              </div>
              <button
                onClick={() => setIsSizeGuideOpen(false)}
                className="p-1 hover:bg-gray-100 text-black cursor-pointer"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-[#444748] mb-4">
              The HR Signature Court Low fits true to standard European/Pakistani shoe sizes. If you have wide feet or fall between sizes, we recommend sizing up one half step.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs uppercase font-mono">
                <thead className="bg-[#000000] text-white">
                  <tr>
                    <th className="p-2.5">PK / EU</th>
                    <th className="p-2.5">US MEN</th>
                    <th className="p-2.5">UK</th>
                    <th className="p-2.5">FOOT LENGTH (CM)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="bg-[#f7f3f2]">
                    <td className="p-2 font-bold text-[#000000]">39</td>
                    <td className="p-2">6.5</td>
                    <td className="p-2">6.0</td>
                    <td className="p-2">24.5 cm</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-[#000000]">40</td>
                    <td className="p-2">7.5</td>
                    <td className="p-2">7.0</td>
                    <td className="p-2">25.3 cm</td>
                  </tr>
                  <tr className="bg-[#f7f3f2]">
                    <td className="p-2 font-bold text-[#000000]">41</td>
                    <td className="p-2">8.0</td>
                    <td className="p-2">7.5</td>
                    <td className="p-2">26.0 cm</td>
                  </tr>
                  <tr className="bg-[#ebe7e6] font-bold text-[#000000]">
                    <td className="p-2 text-[#004ccb]">42 (Popular)</td>
                    <td className="p-2">9.0</td>
                    <td className="p-2">8.5</td>
                    <td className="p-2">26.8 cm</td>
                  </tr>
                  <tr className="bg-[#f7f3f2]">
                    <td className="p-2 font-bold text-[#000000]">43</td>
                    <td className="p-2">10.0</td>
                    <td className="p-2">9.5</td>
                    <td className="p-2">27.5 cm</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-[#000000]">44</td>
                    <td className="p-2">11.0</td>
                    <td className="p-2">10.5</td>
                    <td className="p-2">28.3 cm</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsSizeGuideOpen(false)}
                className="bg-[#000000] text-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-[#004ccb] transition-colors cursor-pointer"
              >
                Got It, Back to Sneaker
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
