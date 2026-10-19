import React, { useState, useMemo } from 'react';
import { Product, ProductColor, FilterState } from '../types';
import { formatPrice } from '../utils/format';
import { 
  Tune, 
  ChevronRight, 
  LocalShipping, 
  PublishedWithChanges, 
  Favorite, 
  Star, 
  GridView, 
  ViewComfy, 
  ChevronLeft, 
  Verified, 
  WorkspacePremium, 
  PinDrop 
} from '../components/Icons';

interface CollectionPageProps {
  currentCategory: string; // 'men' | 'women' | 'kids' | 'hasan-raheem-collection' | 'sale'
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, size: number, color: ProductColor) => void;
  wishlistIds: Set<string>;
  onToggleWishlist: (product: Product) => void;
  onNavigate: (path: string) => void;
  onOpenSizeGuide?: () => void;
}

export const CollectionPage: React.FC<CollectionPageProps> = ({
  currentCategory,
  products,
  onSelectProduct,
  onAddToCart,
  wishlistIds,
  onToggleWishlist,
  onNavigate,
  onOpenSizeGuide = () => alert('Standard Pakistani & European shoe sizing: True to size. Fits 39-45 EU.'),
}) => {
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('All Footwear');
  const [selectedSizes, setSelectedSizes] = useState<number[]>([40, 41]);
  const [priceMax, setPriceMax] = useState<number>(12000);
  const [selectedColors, setSelectedColors] = useState<string[]>(['Jet Black']);
  const [discountFilter, setDiscountFilter] = useState<string>('20%');
  const [sortBy, setSortBy] = useState<string>('Bestselling');
  const [gridCols, setGridCols] = useState<3 | 4>(3);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Derive title based on current path
  const pageTitle = useMemo(() => {
    switch (currentCategory) {
      case 'hasan-raheem-collection':
        return 'HASAN RAHEEM CAPSULE 02';
      case 'women':
        return "WOMEN'S FOOTWEAR & LIFESTYLE";
      case 'kids':
        return "KIDS' STREET & VELOCITY SNEAKERS";
      case 'sale':
        return 'END OF SEASON CLEARANCE (UP TO 50% OFF)';
      case 'men':
      default:
        return "MEN'S FOOTWEAR & SNEAKERS";
    }
  }, [currentCategory]);

  const categoryPills = [
    { label: 'All Footwear', count: 542 },
    { label: 'Sneakers & Athleisure', count: 188 },
    { label: 'Peshawari & Traditional', count: 64, dot: '#DFFF00' },
    { label: 'Casual Loafers', count: 82 },
    { label: 'Formal & Dress', count: 76 },
    { label: 'Slides & Chappals', count: 94 },
    { label: 'Hasan Raheem Drop', count: 38, highlight: true },
  ];

  // Filtering products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Gender / Category filter
    if (currentCategory === 'hasan-raheem-collection') {
      result = result.filter((p) => p.isCapsule);
    } else if (currentCategory === 'sale') {
      result = result.filter((p) => p.isSale || (p.discountPercent && p.discountPercent > 0));
    } else if (currentCategory === 'women') {
      result = result.filter((p) => p.gender === 'Women' || p.gender === 'Unisex');
    } else if (currentCategory === 'kids') {
      result = result.filter((p) => p.gender === 'Kids');
    } else if (currentCategory === 'men') {
      result = result.filter((p) => p.gender === 'Men' || p.gender === 'Unisex');
    }

    // Subcategory pill filter
    if (selectedSubCategory !== 'All Footwear') {
      if (selectedSubCategory === 'Hasan Raheem Drop') {
        result = result.filter((p) => p.isCapsule);
      } else if (selectedSubCategory === 'Peshawari & Traditional') {
        result = result.filter((p) => p.category === 'Casual' || p.tags.includes('Peshawari') || p.tags.includes('Traditional'));
      } else if (selectedSubCategory === 'Sneakers & Athleisure') {
        result = result.filter((p) => p.category === 'Sneakers' || p.category === 'Running');
      } else if (selectedSubCategory === 'Slides & Chappals') {
        result = result.filter((p) => p.category === 'Sliders & Slides');
      }
    }

    // Price Max
    result = result.filter((p) => p.price <= priceMax);

    // Sorting
    if (sortBy === 'Price: Low to High') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'Price: High to Low') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'New Arrivals') {
      result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    } else if (sortBy === 'Customer Rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, currentCategory, selectedSubCategory, priceMax, sortBy]);

  const handleClearFilters = () => {
    setSelectedSubCategory('All Footwear');
    setSelectedSizes([]);
    setPriceMax(12000);
    setSelectedColors([]);
  };

  return (
    <div className="flex flex-col w-full">
      {/* BREADCRUMBS */}
      <div className="w-full px-4 sm:px-8 lg:px-12 py-3 bg-[#ffffff] border-b border-[#e5e2e1]">
        <nav className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#444748] font-mono">
          <button onClick={() => onNavigate('/')} className="hover:text-[#000000] transition-colors cursor-pointer">
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="hover:text-[#000000] cursor-pointer">
            {currentCategory === 'hasan-raheem-collection' ? 'Collab' : currentCategory.toUpperCase()}
          </span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#000000] font-bold">All Shoes</span>
        </nav>
      </div>

      {/* COLLECTION HERO BANNER */}
      <section className="w-full px-4 sm:px-8 lg:px-12 py-8 sm:py-10 bg-[#ebe7e6] relative overflow-hidden border-b-2 border-[#0A0A0A]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#000000] text-white px-2.5 py-1 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#DFFF00] animate-pulse"></span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#DFFF00] font-bold">
                SS26 CATALOGUE
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#c9c6c5]">
                / 540+ STYLES AVAILABLE
              </span>
            </div>
            <h1 className="font-anton text-3xl sm:text-5xl lg:text-6xl uppercase text-[#000000] tracking-tight leading-none mb-2">
              {pageTitle}
            </h1>
            <p className="text-sm sm:text-base text-[#444748] max-w-2xl">
              Engineered for urban streets and traditional heritage. High-rebound sole technologies meet pure Pakistani craftsmanship.
            </p>
          </div>

          {/* Quick Delivery & Authentic Perk Badges */}
          <div className="flex items-center gap-3 bg-white px-4 py-2.5 shadow-sm border border-[#0A0A0A]">
            <div className="flex items-center gap-2">
              <LocalShipping className="w-5 h-5 text-[#004ccb]" />
              <div>
                <span className="block text-[11px] font-bold uppercase text-[#000000]">Free Shipping</span>
                <span className="block text-[10px] text-[#444748]">Orders &gt; Rs. 3,000</span>
              </div>
            </div>
            <div className="h-6 w-px bg-[#c4c7c7] mx-1"></div>
            <div className="flex items-center gap-2">
              <PublishedWithChanges className="w-5 h-5 text-[#E60000]" />
              <div>
                <span className="block text-[11px] font-bold uppercase text-[#000000]">30-Day Return</span>
                <span className="block text-[10px] text-[#444748]">Hassle-free exchange</span>
              </div>
            </div>
          </div>
        </div>

        {/* QUICK CATEGORY PILLS BAR */}
        <div className="max-w-7xl mx-auto mt-6 pt-4 border-t border-[#c4c7c7]">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
            {categoryPills.map((pill) => {
              const isActive = selectedSubCategory === pill.label;
              return (
                <button
                  key={pill.label}
                  onClick={() => setSelectedSubCategory(pill.label)}
                  className={`px-3.5 py-1.5 text-xs uppercase tracking-wider whitespace-nowrap font-bold transition-all cursor-pointer border ${
                    pill.highlight
                      ? 'bg-[#FF3366] text-white border-[#FF3366] shadow-sm'
                      : isActive
                      ? 'bg-[#000000] text-white border-[#000000] shadow-sm'
                      : 'bg-white text-[#1c1b1b] border-[#c4c7c7] hover:bg-[#000000] hover:text-white'
                  }`}
                >
                  {pill.dot && <span className="inline-block w-1.5 h-1.5 rounded-full mr-1.5" style={{ backgroundColor: pill.dot }}></span>}
                  {pill.label} ({pill.count})
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* MAIN CATALOG SECTION (Two-Column Layout) */}
      <div className="w-full px-4 sm:px-8 lg:px-12 py-8 bg-[#fdf8f8]">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 items-start">
          
          {/* LEFT SIDEBAR FILTERS */}
          <aside className="w-full lg:w-72 flex-shrink-0 bg-white p-5 border-2 border-[#0A0A0A] shadow-hard-sm">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#e5e2e1]">
              <div className="flex items-center gap-1.5">
                <Tune className="w-5 h-5 text-[#000000]" />
                <span className="font-anton text-xl uppercase text-[#000000]">Filters</span>
              </div>
              <button
                onClick={handleClearFilters}
                className="text-xs uppercase tracking-wider text-[#E60000] hover:underline font-bold cursor-pointer"
              >
                Clear All
              </button>
            </div>

            {/* Filter: Categories */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs uppercase text-[#000000]">Category</span>
              </div>
              <div className="flex flex-col gap-1.5 text-xs">
                {[
                  { name: 'Sneakers & Sport', count: 188 },
                  { name: 'Peshawari Chappal', count: 64 },
                  { name: 'Loafers & Slip-ons', count: 82 },
                  { name: 'Formal & Lace-ups', count: 76 },
                  { name: 'Slides & Comfort', count: 94 },
                  { name: 'Outdoor Boots', count: 38 },
                ].map((cat) => (
                  <label key={cat.name} className="flex items-center justify-between cursor-pointer py-0.5 group">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedSubCategory === cat.name || (selectedSubCategory === 'All Footwear' && cat.name.includes('Sneakers'))}
                        onChange={() => setSelectedSubCategory(cat.name)}
                        className="w-4 h-4 accent-[#000000] rounded-none cursor-pointer"
                      />
                      <span className="text-[#1c1b1b] group-hover:text-[#004ccb] transition-colors">{cat.name}</span>
                    </div>
                    <span className="text-[11px] text-[#747878] font-mono">{cat.count}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filter: Shoe Size (EU) */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs uppercase text-[#000000]">Shoe Size (EU)</span>
                <button
                  onClick={onOpenSizeGuide}
                  className="text-[10px] uppercase tracking-wider text-[#004ccb] underline cursor-pointer"
                >
                  Size Guide
                </button>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {[39, 40, 41, 42, 43, 44, 45].map((sz) => {
                  const isSelected = selectedSizes.includes(sz);
                  return (
                    <button
                      key={sz}
                      onClick={() => {
                        setSelectedSizes((prev) =>
                          prev.includes(sz) ? prev.filter((s) => s !== sz) : [...prev, sz]
                        );
                      }}
                      className={`h-9 flex items-center justify-center text-xs font-bold transition-colors cursor-pointer border ${
                        isSelected
                          ? 'bg-[#000000] text-white border-[#000000]'
                          : 'bg-[#F4F4F6] text-[#1c1b1b] border-[#c4c7c7] hover:bg-[#000000] hover:text-white'
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
                <button
                  disabled
                  className="h-9 flex items-center justify-center text-xs font-bold bg-[#ebe7e6] text-[#c4c7c7] cursor-not-allowed border border-[#c4c7c7] relative"
                >
                  <span className="line-through">46</span>
                </button>
              </div>
            </div>

            {/* Filter: Price Range */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs uppercase text-[#000000]">Price Range</span>
                <span className="text-[10px] font-mono font-bold text-[#004ccb]">PKR</span>
              </div>
              <input
                type="range"
                min="1500"
                max="15000"
                step="500"
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full accent-[#000000] cursor-pointer mb-2"
              />
              <div className="flex items-center gap-2 text-xs">
                <div className="flex-1 bg-[#F4F4F6] px-2.5 py-1 border border-[#c4c7c7]">
                  <span className="block text-[9px] uppercase text-[#747878]">Min</span>
                  <span className="font-bold text-[#000000]">Rs. 1,500</span>
                </div>
                <span className="text-[#747878]">-</span>
                <div className="flex-1 bg-[#F4F4F6] px-2.5 py-1 border border-[#c4c7c7]">
                  <span className="block text-[9px] uppercase text-[#747878]">Max</span>
                  <span className="font-bold text-[#000000]">Rs. {priceMax.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Filter: Color Palette */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs uppercase text-[#000000]">Color Palette</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { name: 'Jet Black', hex: '#000000' },
                  { name: 'Optical White', hex: '#ffffff' },
                  { name: 'Navy Blue', hex: '#0B2545' },
                  { name: 'Camel Tan', hex: '#B08968' },
                  { name: 'Olive Green', hex: '#58641D' },
                  { name: 'Carbon Grey', hex: '#6c757d' },
                ].map((color) => {
                  const isChecked = selectedColors.includes(color.name);
                  return (
                    <button
                      key={color.name}
                      onClick={() =>
                        setSelectedColors((prev) =>
                          prev.includes(color.name)
                            ? prev.filter((c) => c !== color.name)
                            : [...prev, color.name]
                        )
                      }
                      className="w-7 h-7 border border-[#0A0A0A] relative flex items-center justify-center cursor-pointer shadow-xs"
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {isChecked && (
                        <span
                          className={`text-xs font-bold ${
                            color.hex === '#ffffff' ? 'text-black' : 'text-white'
                          }`}
                        >
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter: Special Offers */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs uppercase text-[#000000]">Special Offers</span>
              </div>
              <div className="flex flex-col gap-1 text-xs">
                {['50% Off & More', '30% Off Deals', '20% Off Season Starter'].map((deal) => (
                  <label key={deal} className="flex items-center gap-2 cursor-pointer py-0.5">
                    <input
                      type="checkbox"
                      checked={deal.includes(discountFilter)}
                      onChange={() => setDiscountFilter(deal.split('%')[0] + '%')}
                      className="w-4 h-4 accent-[#E60000] rounded-none cursor-pointer"
                    />
                    <span className={`font-semibold ${deal.includes('50%') ? 'text-[#E60000]' : 'text-[#1c1b1b]'}`}>
                      {deal}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Collab Quick Banner */}
            <div className="mt-6 p-4 bg-[#FF3366] text-white border border-[#0A0A0A] shadow-hard-sm">
              <span className="text-[9px] font-mono uppercase tracking-widest block text-[#DFFF00] font-bold">
                LIMITED CAPSULE
              </span>
              <h4 className="font-anton text-xl uppercase text-white leading-tight mt-1 mb-1">
                NDURE x HASAN RAHEEM
              </h4>
              <p className="text-xs text-white/90 mb-3">
                Exclusive stage runners, retro courts &amp; tour streetwear drops.
              </p>
              <button
                onClick={() => onNavigate('/hasan-raheem-collection')}
                className="inline-block bg-[#000000] text-white px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-colors cursor-pointer"
              >
                Explore Drop
              </button>
            </div>
          </aside>

          {/* RIGHT CATALOG AREA */}
          <div className="flex-1 w-full flex flex-col">
            {/* TOOLBAR */}
            <div className="w-full bg-white p-3.5 sm:p-4 mb-6 border-2 border-[#0A0A0A] shadow-hard-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                <span>
                  Showing <strong className="text-[#004ccb]">1 - {filteredProducts.length}</strong> of 542 Styles
                </span>
                <span className="text-gray-300">|</span>
                <span className="text-[10px] font-mono text-[#DFFF00] bg-[#000000] px-1.5 py-0.5">
                  SS26 READY
                </span>
              </div>

              {/* Sort & Grid Controls */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <div className="flex items-center gap-1.5 bg-[#F4F4F6] px-2.5 py-1 border border-[#0A0A0A]">
                  <span className="text-[10px] uppercase font-bold text-[#747878]">Sort By:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent text-xs font-bold uppercase tracking-wider text-[#000000] outline-none cursor-pointer"
                  >
                    <option>Bestselling</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>New Arrivals</option>
                    <option>Customer Rating</option>
                  </select>
                </div>

                <div className="flex items-center border border-[#0A0A0A]">
                  <button
                    onClick={() => setGridCols(3)}
                    className={`p-1.5 transition-colors cursor-pointer ${
                      gridCols === 3 ? 'bg-[#000000] text-white' : 'hover:bg-gray-100 text-[#000000]'
                    }`}
                    title="3 Column Grid"
                  >
                    <GridView className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setGridCols(4)}
                    className={`p-1.5 transition-colors cursor-pointer ${
                      gridCols === 4 ? 'bg-[#000000] text-white' : 'hover:bg-gray-100 text-[#000000]'
                    }`}
                    title="Compact View"
                  >
                    <ViewComfy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* PRODUCT GRID */}
            <div className={`grid grid-cols-1 md:grid-cols-2 ${gridCols === 4 ? 'xl:grid-cols-4' : 'xl:grid-cols-3'} gap-6`}>
              {filteredProducts.map((product) => {
                const isWishlisted = wishlistIds.has(product.id);
                return (
                  <div
                    key={product.id}
                    className="group bg-[#F4F4F6] border-2 border-[#0A0A0A] flex flex-col relative transition-all duration-200 hover:shadow-hard"
                  >
                    {/* Badge */}
                    <div className="absolute top-0 left-0 z-20 flex flex-col gap-0.5">
                      {product.isCapsule ? (
                        <span className="bg-[#FF3366] text-white text-[9px] font-bold uppercase px-2 py-0.5 tracking-widest">
                          HR CAPSULE
                        </span>
                      ) : product.discountPercent ? (
                        <span className="bg-[#E60000] text-white text-[9px] font-bold uppercase px-2 py-0.5 tracking-widest">
                          SALE -{product.discountPercent}%
                        </span>
                      ) : (
                        <span className="bg-[#000000] text-white text-[9px] font-bold uppercase px-2 py-0.5 tracking-widest">
                          AUTHENTIC LEATHER
                        </span>
                      )}
                    </div>

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(product);
                      }}
                      aria-label="Add to Wishlist"
                      className="absolute top-2 right-2 z-20 w-8 h-8 bg-white border border-[#0A0A0A] flex items-center justify-center hover:bg-black hover:text-white transition-colors cursor-pointer"
                    >
                      <Favorite className={`w-4 h-4 ${isWishlisted ? 'text-[#FF3366] fill-[#FF3366]' : 'text-[#444748]'}`} />
                    </button>

                    {/* Image Container with 1-click Quick Size Selector */}
                    <div 
                      onClick={() => onSelectProduct(product)}
                      className="relative w-full aspect-square bg-white border-b-2 border-[#0A0A0A] overflow-hidden cursor-pointer"
                    >
                      <img
                        src={product.thumbnail}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />

                      {/* Quick Size Select Bar on Card Hover */}
                      <div 
                        onClick={(e) => e.stopPropagation()}
                        className="absolute bottom-0 inset-x-0 bg-[#000000]/95 text-white p-2.5 translate-y-full group-hover:translate-y-0 transition-transform duration-200 flex flex-col gap-1 z-10"
                      >
                        <span className="text-[9px] font-mono uppercase tracking-wider text-[#DFFF00] font-bold">
                          Quick Size Select:
                        </span>
                        <div className="flex items-center justify-between gap-1">
                          {[40, 41, 42, 43, 44].map((size) => (
                            <button
                              key={size}
                              onClick={() => onAddToCart(product, size, product.colors[0])}
                              className="flex-1 py-1 text-center bg-white text-black text-[10px] font-bold hover:bg-[#004ccb] hover:text-white transition-colors cursor-pointer"
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Product Details */}
                    <div 
                      onClick={() => onSelectProduct(product)}
                      className="p-4 flex flex-col flex-1 bg-white cursor-pointer"
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] uppercase tracking-wider text-[#747878] font-semibold">
                          {product.subtitle || `${product.gender}'s Footwear`}
                        </span>
                        <div className="flex items-center gap-0.5 text-[#004ccb]">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="text-[11px] font-bold text-[#000000]">{product.rating}</span>
                          <span className="text-[10px] text-[#747878]">({product.reviewCount})</span>
                        </div>
                      </div>

                      <h3 className="font-anton text-base uppercase text-[#000000] line-clamp-1 mb-1.5 group-hover:text-[#004ccb] transition-colors">
                        {product.name}
                      </h3>

                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="font-anton text-base text-[#000000]">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs line-through text-[#747878] font-mono">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                        {product.isCapsule && (
                          <span className="text-[9px] bg-[#dbe1ff] text-[#00174b] px-1 py-0.5 font-bold uppercase">
                            Pay in 3 via Yeylo
                          </span>
                        )}
                      </div>

                      <div className="mt-auto flex items-center justify-between pt-2 border-t border-[#e5e2e1] text-[10px] uppercase text-[#747878]">
                        <span>{product.colors[0]?.name || 'Standard Colorway'}</span>
                        <span className="bg-[#F4F4F6] border border-gray-300 px-1.5 py-0.5 text-black font-semibold">
                          {product.isCapsule ? 'Limited Drop' : 'High Rebound'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* BOTTOM PAGINATION */}
            <div className="w-full mt-10 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 border-2 border-[#0A0A0A] shadow-hard-sm">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="flex items-center gap-1 px-4 py-2 bg-[#F4F4F6] text-[#000000] text-xs font-bold uppercase tracking-wider hover:bg-[#000000] hover:text-white transition-colors disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-1 text-xs">
                {[1, 2, 3].map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 flex items-center justify-center font-bold border transition-colors cursor-pointer ${
                      currentPage === page
                        ? 'bg-[#000000] text-white border-[#000000]'
                        : 'bg-[#F4F4F6] text-[#000000] border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <span className="px-2 text-gray-400">...</span>
                <button
                  onClick={() => setCurrentPage(23)}
                  className="w-9 h-9 flex items-center justify-center font-bold bg-[#F4F4F6] text-[#000000] border border-gray-300 hover:bg-gray-200 cursor-pointer"
                >
                  23
                </button>
              </div>

              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                className="flex items-center gap-1 px-4 py-2 bg-[#000000] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#004ccb] transition-colors cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* EDITORIAL SNEAKER FEATURE HIGHLIGHT */}
      <section className="w-full px-4 sm:px-8 lg:px-12 py-12 bg-white border-t-2 border-[#0A0A0A]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-[#F4F4F6] border-2 border-[#0A0A0A] p-6 flex flex-col justify-between shadow-hard-sm">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#004ccb] font-bold">
                PROPRIETARY FOAM
              </span>
              <h4 className="font-anton text-2xl uppercase text-[#000000] mt-1 mb-2">
                NDURE AIR-FLEX TECH
              </h4>
              <p className="text-xs text-[#444748] leading-relaxed">
                Engineered dual-density compression foam provides high shock absorption tailored for all-day commutes across Pakistani metropolitan terrains.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-[#000000] text-xs uppercase font-bold">
              <span>Tested for 500,000 Paces</span>
              <Verified className="w-4 h-4 text-[#004ccb]" />
            </div>
          </div>

          <div className="bg-[#F4F4F6] border-2 border-[#0A0A0A] p-6 flex flex-col justify-between shadow-hard-sm">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#E60000] font-bold">
                HERITAGE CRAFT
              </span>
              <h4 className="font-anton text-2xl uppercase text-[#0A0A0A] mt-1 mb-2">
                KP LEATHER WORKSHOP
              </h4>
              <p className="text-xs text-[#444748] leading-relaxed">
                Each pair of Ndure Traditional Peshawari chappals is hand-stitched by master artisans using premium full-grain buffalo leather and vulcanized tyre tread.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-[#000000] text-xs uppercase font-bold">
              <span>100% Genuine Certified</span>
              <WorkspacePremium className="w-4 h-4 text-[#E60000]" />
            </div>
          </div>

          <div className="bg-[#F4F4F6] border-2 border-[#0A0A0A] p-6 flex flex-col justify-between shadow-hard-sm">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#DFFF00] bg-[#000000] px-1.5 py-0.5 inline-block font-bold">
                FAST DISPATCH
              </span>
              <h4 className="font-anton text-2xl uppercase text-[#000000] mt-1 mb-2">
                NATIONWIDE EXPRESS
              </h4>
              <p className="text-xs text-[#444748] leading-relaxed">
                2-4 business days express delivery covering Karachi, Lahore, Islamabad, Peshawar, Multan, Faisalabad, and 200+ cities with Cash on Delivery.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-[#004ccb] text-xs uppercase font-bold">
              <span>Real-Time SMS Tracking</span>
              <PinDrop className="w-4 h-4" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
