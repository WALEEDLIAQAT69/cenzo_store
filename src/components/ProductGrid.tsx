import React, { useState } from 'react';
import { SlidersHorizontal, Grid2X2, Grid3X3, LayoutGrid, X } from 'lucide-react';
import { FilterState, Product, ProductColor } from '../types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onOpenMobileFilter: () => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, size: number, color: ProductColor) => void;
  wishlistIds: Set<string>;
  onToggleWishlist: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  filters,
  onFilterChange,
  onOpenMobileFilter,
  onQuickView,
  onAddToCart,
  wishlistIds,
  onToggleWishlist,
}) => {
  const [columns, setColumns] = useState<3 | 4>(3);

  const sortOptions = [
    { value: 'featured', label: 'FEATURED / RECOMMENDED' },
    { value: 'price-asc', label: 'PRICE: LOW TO HIGH' },
    { value: 'price-desc', label: 'PRICE: HIGH TO LOW' },
    { value: 'newest', label: 'NEWEST DROPS' },
    { value: 'rating', label: 'HIGHEST RATED' },
    { value: 'discount', label: 'BIGGEST DISCOUNT' },
  ];

  return (
    <div className="flex-1 min-w-0">
      {/* Top Toolbar */}
      <div className="bg-white p-4 border-2 border-[#0A0A0A] mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-hard-sm">
        {/* Left: Mobile filter button + count */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenMobileFilter}
            className="lg:hidden flex items-center space-x-1.5 px-3 py-2 bg-[#0A0A0A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#0062FF] transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>FILTER & REFINE</span>
          </button>

          <span className="text-xs font-bold uppercase text-[#0A0A0A] tracking-wider">
            SHOWING <span className="font-mono text-[#0062FF]">{products.length}</span> ARTICLES
          </span>
        </div>

        {/* Right: Sort & Grid View Switcher */}
        <div className="flex items-center space-x-4 self-end sm:self-auto">
          {/* Sort Dropdown */}
          <div className="flex items-center space-x-2">
            <label className="text-[11px] font-bold uppercase text-[#444748] hidden md:inline">
              SORT BY:
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
              className="px-2.5 py-1.5 text-xs font-bold uppercase border border-[#0A0A0A] bg-white cursor-pointer focus:outline-none focus:border-[#0062FF]"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Grid column toggles (desktop) */}
          <div className="hidden sm:flex items-center border border-[#0A0A0A]">
            <button
              onClick={() => setColumns(3)}
              className={`p-1.5 transition-colors cursor-pointer ${
                columns === 3 ? 'bg-[#0A0A0A] text-white' : 'hover:bg-gray-100 text-[#0A0A0A]'
              }`}
              title="3 Columns"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setColumns(4)}
              className={`p-1.5 transition-colors cursor-pointer ${
                columns === 4 ? 'bg-[#0A0A0A] text-white' : 'hover:bg-gray-100 text-[#0A0A0A]'
              }`}
              title="4 Columns"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {(filters.category || filters.sizes.length > 0 || filters.discountOnly || filters.capsuleOnly || filters.searchQuery) && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-[10px] font-bold uppercase text-[#747878] tracking-wider">
            ACTIVE FILTERS:
          </span>

          {filters.category && (
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-white border border-[#0A0A0A] text-xs font-bold uppercase">
              <span>{filters.category}</span>
              <button 
                onClick={() => onFilterChange({ category: '' })} 
                className="hover:text-red-500 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.capsuleOnly && (
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-[#FF3366] text-white text-xs font-bold uppercase">
              <span>Hasan Raheem Capsule</span>
              <button 
                onClick={() => onFilterChange({ capsuleOnly: false })} 
                className="cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.discountOnly && (
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-[#E60000] text-white text-xs font-bold uppercase">
              <span>Sale Items Only</span>
              <button 
                onClick={() => onFilterChange({ discountOnly: false })} 
                className="cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.sizes.map((sz) => (
            <span 
              key={sz} 
              className="inline-flex items-center space-x-1 px-2.5 py-1 bg-white border border-[#0A0A0A] text-xs font-bold uppercase"
            >
              <span>Size {sz}</span>
              <button
                onClick={() =>
                  onFilterChange({
                    sizes: filters.sizes.filter((s) => s !== sz),
                  })
                }
                className="hover:text-red-500 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {filters.searchQuery && (
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-[#0062FF] text-white text-xs font-bold uppercase">
              <span>"{filters.searchQuery}"</span>
              <button 
                onClick={() => onFilterChange({ searchQuery: '' })} 
                className="cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Product Cards Grid */}
      {products.length === 0 ? (
        <div className="bg-white border-2 border-[#0A0A0A] p-12 text-center space-y-4 shadow-hard-sm">
          <h3 className="font-anton text-2xl uppercase text-[#0A0A0A]">
            NO MATCHING ARTICLES FOUND
          </h3>
          <p className="text-xs text-[#747878] max-w-sm mx-auto">
            We couldn't find any footwear matching your exact combination of filters. Try clearing some filters or changing your size selection.
          </p>
          <button
            onClick={() =>
              onFilterChange({
                gender: 'All',
                category: '',
                sizes: [],
                discountOnly: false,
                capsuleOnly: false,
                inStockOnly: false,
                searchQuery: '',
                priceRange: [0, 15000],
              })
            }
            className="px-6 py-3 bg-[#0A0A0A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#0062FF] transition-colors cursor-pointer"
          >
            RESET ALL FILTERS
          </button>
        </div>
      ) : (
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 ${
            columns === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
          } gap-5 sm:gap-6`}
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
              onAddToCart={onAddToCart}
              isWishlisted={wishlistIds.has(product.id)}
              onToggleWishlist={onToggleWishlist}
            />
          ))}
        </div>
      )}
    </div>
  );
};
