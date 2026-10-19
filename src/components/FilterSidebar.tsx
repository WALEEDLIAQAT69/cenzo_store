import React from 'react';
import { Filter, RotateCcw, X } from 'lucide-react';
import { FilterState, Gender } from '../types';

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  totalResults: number;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  isOpenMobile,
  onCloseMobile,
  totalResults,
}) => {
  const genders: (Gender | 'All')[] = ['All', 'Men', 'Women', 'Kids', 'Unisex'];
  const categories = ['All', 'Sneakers', 'Running', 'Casual', 'High-Tops', 'Sliders & Slides', 'Capsule', 'Apparel'];
  const sizes = [36, 37, 38, 39, 40, 41, 42, 43, 44, 45];
  const priceBrackets = [
    { label: 'All Prices', min: 0, max: 15000 },
    { label: 'Under Rs. 3,500', min: 0, max: 3500 },
    { label: 'Rs. 3,500 – Rs. 5,000', min: 3500, max: 5000 },
    { label: 'Rs. 5,000 – Rs. 7,500', min: 5000, max: 7500 },
    { label: 'Rs. 7,500+', min: 7500, max: 15000 },
  ];

  const toggleSize = (size: number) => {
    const exists = filters.sizes.includes(size);
    const newSizes = exists
      ? filters.sizes.filter((s) => s !== size)
      : [...filters.sizes, size];
    onFilterChange({ sizes: newSizes });
  };

  const content = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b-2 border-[#0A0A0A]">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-[#0A0A0A]" />
          <h3 className="font-anton text-lg uppercase tracking-wide">FILTERS & REFINE</h3>
        </div>
        <button
          onClick={onResetFilters}
          className="text-[11px] font-bold uppercase tracking-wider text-[#FF3366] hover:underline flex items-center space-x-1 cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>RESET</span>
        </button>
      </div>

      {/* Gender Division */}
      <div className="space-y-2.5">
        <label className="block text-xs font-bold uppercase tracking-wider text-[#0A0A0A]">
          GENDER / DIVISION
        </label>
        <div className="flex flex-wrap gap-1.5">
          {genders.map((g) => {
            const isSelected = filters.gender === g;
            return (
              <button
                key={g}
                onClick={() => onFilterChange({ gender: g })}
                className={`px-3 py-1.5 text-xs font-bold border uppercase transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]'
                    : 'bg-white text-[#0A0A0A] border-[#c4c7c7] hover:border-[#0A0A0A]'
                }`}
              >
                {g}
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Categories */}
      <div className="space-y-2.5">
        <label className="block text-xs font-bold uppercase tracking-wider text-[#0A0A0A]">
          CATEGORY
        </label>
        <div className="space-y-1">
          {categories.map((cat) => {
            const isSelected = (filters.category === cat) || (cat === 'All' && !filters.category);
            return (
              <button
                key={cat}
                onClick={() => onFilterChange({ category: cat === 'All' ? '' : cat })}
                className={`w-full text-left px-2.5 py-1.5 text-xs font-semibold uppercase flex items-center justify-between transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#0A0A0A] text-white'
                    : 'hover:bg-[#f1edec] text-[#444748]'
                }`}
              >
                <span>{cat}</span>
                {isSelected && <span className="text-[10px] font-mono">&bull;</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Size Grid */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#0A0A0A]">
            SIZE (EU FOOTWEAR)
          </label>
          {filters.sizes.length > 0 && (
            <span className="text-[10px] font-mono text-[#0062FF]">
              {filters.sizes.length} selected
            </span>
          )}
        </div>
        <div className="grid grid-cols-5 gap-1.5">
          {sizes.map((sz) => {
            const isSelected = filters.sizes.includes(sz);
            return (
              <button
                key={sz}
                onClick={() => toggleSize(sz)}
                className={`py-2 text-xs font-bold border transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#0062FF] text-white border-[#0062FF]'
                    : 'bg-white text-[#0A0A0A] border-[#c4c7c7] hover:border-[#0A0A0A]'
                }`}
              >
                {sz}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Brackets */}
      <div className="space-y-2.5">
        <label className="block text-xs font-bold uppercase tracking-wider text-[#0A0A0A]">
          PRICE RANGE (PKR)
        </label>
        <div className="space-y-1">
          {priceBrackets.map((bracket) => {
            const isSelected = 
              filters.priceRange[0] === bracket.min && filters.priceRange[1] === bracket.max;
            return (
              <button
                key={bracket.label}
                onClick={() => onFilterChange({ priceRange: [bracket.min, bracket.max] })}
                className={`w-full text-left px-2.5 py-1.5 text-xs font-medium flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-[#0A0A0A] text-white font-bold'
                    : 'text-[#444748] hover:bg-[#f1edec]'
                }`}
              >
                <span>{bracket.label}</span>
                {isSelected && <span className="text-[9px] font-bold">ACTIVE</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-2 pt-4 border-t border-[#e5e2e1]">
        <label className="flex items-center space-x-2.5 cursor-pointer py-1">
          <input
            type="checkbox"
            checked={filters.discountOnly}
            onChange={(e) => onFilterChange({ discountOnly: e.target.checked })}
            className="w-4 h-4 rounded-none accent-[#E60000] cursor-pointer"
          />
          <span className="text-xs font-bold uppercase text-[#E60000]">
            SALE & DISCOUNTED ONLY
          </span>
        </label>

        <label className="flex items-center space-x-2.5 cursor-pointer py-1">
          <input
            type="checkbox"
            checked={filters.capsuleOnly}
            onChange={(e) => onFilterChange({ capsuleOnly: e.target.checked })}
            className="w-4 h-4 rounded-none accent-[#FF3366] cursor-pointer"
          />
          <span className="text-xs font-bold uppercase text-[#FF3366]">
            HASAN RAHEEM CAPSULE ONLY
          </span>
        </label>

        <label className="flex items-center space-x-2.5 cursor-pointer py-1">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => onFilterChange({ inStockOnly: e.target.checked })}
            className="w-4 h-4 rounded-none accent-[#0A0A0A] cursor-pointer"
          />
          <span className="text-xs font-bold uppercase text-[#0A0A0A]">
            IN-STOCK ONLY
          </span>
        </label>
      </div>

      {/* Total match indicator */}
      <div className="p-3 bg-[#f1edec] border border-[#e5e2e1] text-center">
        <span className="text-xs font-bold text-[#0A0A0A] uppercase tracking-wider">
          {totalResults} PRODUCTS FOUND
        </span>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside id="catalog-filter-sidebar" className="hidden lg:block w-64 shrink-0 bg-white p-5 border-2 border-[#0A0A0A] h-fit sticky top-28">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs" 
            onClick={onCloseMobile}
          />

          {/* Drawer content */}
          <div className="relative ml-auto w-full max-w-xs bg-white h-full overflow-y-auto p-6 border-l-2 border-[#0A0A0A] shadow-2xl">
            <button
              onClick={onCloseMobile}
              className="absolute top-4 right-4 p-2 border border-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="mt-4">
              {content}
            </div>
            <button
              onClick={onCloseMobile}
              className="mt-6 w-full py-3 bg-[#0A0A0A] text-white font-bold text-xs uppercase tracking-wider"
            >
              VIEW {totalResults} RESULTS
            </button>
          </div>
        </div>
      )}
    </>
  );
};
