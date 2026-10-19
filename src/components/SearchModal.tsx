import React, { useState } from 'react';
import { X, Search, ArrowRight, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { formatPrice } from '../utils/format';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const popularTags = [
    'Hasan Raheem',
    'Chunky',
    'Triple White',
    'Retro Runner',
    'Slides',
    'High-Top',
    'Hoodie',
  ];

  const results = searchTerm.trim() === '' 
    ? [] 
    : products.filter((p) => {
        const query = searchTerm.toLowerCase();
        return (
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.gender.toLowerCase().includes(query) ||
          p.tags.some((t) => t.toLowerCase().includes(query)) ||
          p.description.toLowerCase().includes(query)
        );
      });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/80 backdrop-blur-xs pt-16 sm:pt-24">
      <div 
        id="search-modal-container"
        className="bg-white border-2 border-[#0A0A0A] shadow-hard max-w-3xl w-full p-6 relative max-h-[85vh] flex flex-col"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 border border-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Search Header */}
        <div className="flex items-center space-x-2 text-[#0062FF] mb-2">
          <Search className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-widest">RAPID CATALOG SEARCH</span>
        </div>

        {/* Big Input Bar */}
        <div className="relative mb-4">
          <input
            autoFocus
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="TYPE SNEAKER NAME, CATEGORY OR TAG (e.g. HASAN RAHEEM, CHUNKY)..."
            className="w-full p-3.5 text-sm sm:text-base font-bold uppercase border-2 border-[#0A0A0A] bg-white placeholder:text-gray-400 focus:border-[#0062FF] outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-3.5 text-xs text-gray-500 hover:text-[#0A0A0A] font-bold cursor-pointer"
            >
              CLEAR
            </button>
          )}
        </div>

        {/* Popular Tags */}
        <div className="flex flex-wrap items-center gap-2 mb-6 text-xs">
          <span className="font-bold text-gray-500 uppercase text-[10px] tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#FF3366]" />
            TRENDING SEARCHES:
          </span>
          {popularTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSearchTerm(tag)}
              className="px-2.5 py-1 bg-[#F4F4F6] border border-gray-300 hover:border-[#0A0A0A] uppercase text-[11px] font-medium transition-colors cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Search Results Area */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#e5e2e1] pr-1">
          {searchTerm.trim() === '' ? (
            <div className="py-12 text-center text-gray-400 text-xs uppercase tracking-wider font-mono">
              Start typing to see instant sneaker matches...
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <p className="font-anton text-lg uppercase text-[#0A0A0A]">
                NO SNEAKERS FOUND FOR "{searchTerm}"
              </p>
              <p className="text-xs text-gray-500">
                Try searching for "Hasan Raheem", "Running", "Sneakers", or "White".
              </p>
            </div>
          ) : (
            results.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  onSelectProduct(product);
                  onClose();
                }}
                className="py-3 flex items-center justify-between hover:bg-[#F4F4F6] px-2 cursor-pointer transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-14 h-14 bg-white border border-[#0A0A0A] overflow-hidden shrink-0">
                    <img
                      src={product.thumbnail}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    {product.isCapsule && (
                      <span className="text-[9px] font-bold text-[#FF3366] uppercase tracking-wider block">
                        HASAN RAHEEM CAPSULE
                      </span>
                    )}
                    <h4 className="font-anton text-sm uppercase text-[#0A0A0A] group-hover:text-[#0062FF] transition-colors">
                      {product.name}
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      {product.gender} • {product.category}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-right">
                  <div>
                    <span className="font-anton text-sm text-[#0A0A0A] block">
                      {formatPrice(product.price)}
                    </span>
                    {product.discountPercent && product.discountPercent > 0 && (
                      <span className="text-[10px] font-bold text-[#E60000]">
                        -{product.discountPercent}% OFF
                      </span>
                    )}
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#0A0A0A] group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
