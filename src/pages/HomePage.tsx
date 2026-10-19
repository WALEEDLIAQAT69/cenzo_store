import React from 'react';
import { HeroBanner } from '../components/HeroBanner';
import { CategoryGrid } from '../components/CategoryGrid';
import { Gender, Product } from '../types';
import { Zap, Sparkles, Shield, ArrowRight } from 'lucide-react';
import { formatPrice } from '../utils/format';

interface HomePageProps {
  onNavigate: (path: string) => void;
  onSelectCategory: (gender: Gender | 'All' | 'Capsule' | 'Sale') => void;
  featuredProducts: Product[];
  onSelectProduct: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSelectCategory,
  featuredProducts,
  onSelectProduct,
}) => {
  return (
    <div className="w-full">
      {/* Hero Banner with Hasan Raheem Drop Highlights */}
      <HeroBanner
        onShopCapsule={() => onNavigate('/hasan-raheem-collection')}
        onShopAll={() => onNavigate('/men')}
      />

      {/* Category Grid Shortcuts */}
      <CategoryGrid onSelectCategory={(cat) => {
        if (cat === 'Capsule') {
          onNavigate('/hasan-raheem-collection');
        } else if (cat === 'Sale') {
          onNavigate('/sale');
        } else if (cat === 'Men') {
          onNavigate('/men');
        } else if (cat === 'Women') {
          onNavigate('/women');
        } else if (cat === 'Kids') {
          onNavigate('/kids');
        } else if (cat === 'All') {
          onNavigate('/collections');
        } else {
          onNavigate('/collections');
        }
      }} />

      {/* Limited Edition Featured Releases */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 border-b-2 border-[#0A0A0A] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#FF3366] animate-ping inline-block"></span>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#FF3366]">
                EXCLUSIVE ARCHIVE RELEASES
              </span>
            </div>
            <h2 className="font-anton text-3xl sm:text-4xl uppercase text-[#0A0A0A] tracking-tight mt-1">
              CURRENT STREET DROPS
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/men')}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0062FF] hover:text-[#0A0A0A] transition-colors cursor-pointer"
          >
            <span>EXPLORE ALL 540+ STYLES</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.slice(0, 4).map((product) => (
            <div
              key={product.id}
              onClick={() => onSelectProduct(product)}
              className="bg-[#F4F4F6] border border-[#0A0A0A] p-3 flex flex-col justify-between group cursor-pointer hover:shadow-hard transition-all"
            >
              <div className="relative aspect-square bg-white border border-[#0A0A0A] overflow-hidden mb-3">
                {product.isCapsule ? (
                  <span className="absolute top-2 left-2 z-10 bg-[#FF3366] text-white px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest">
                    CAPSULE DROP
                  </span>
                ) : product.discountPercent ? (
                  <span className="absolute top-2 left-2 z-10 bg-[#E60000] text-white px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest">
                    -{product.discountPercent}% OFF
                  </span>
                ) : (
                  <span className="absolute top-2 left-2 z-10 bg-[#0A0A0A] text-white px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest">
                    NEW
                  </span>
                )}
                <img
                  src={product.thumbnail}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-[#747878] tracking-wider block">
                  {product.gender} • {product.category}
                </span>
                <h3 className="font-anton text-base uppercase text-[#0A0A0A] line-clamp-1 group-hover:text-[#0062FF] transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-baseline justify-between mt-2 pt-2 border-t border-[#e5e2e1]">
                  <span className="font-anton text-base text-[#0A0A0A]">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs text-[#747878] line-through font-mono">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Street Philosophy / Kinetic Craft Section */}
      <section className="bg-[#0A0A0A] text-white py-16 px-4 lg:px-8 border-y-2 border-[#0A0A0A] my-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="p-6 bg-[#161616] border border-white/20 space-y-3 shadow-hard-sm">
            <Zap className="w-8 h-8 text-[#DFFF00]" />
            <h3 className="font-anton text-2xl uppercase tracking-wide">
              KINETIC AIR-FLEX CUSHIONING
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Engineered with dual-density high-rebound foam compounds that absorb pavement shock and deliver instant spring-back energy across Pakistani terrains.
            </p>
          </div>

          <div className="p-6 bg-[#161616] border border-[#FF3366] space-y-3 shadow-hard-pink">
            <Sparkles className="w-8 h-8 text-[#FF3366]" />
            <h3 className="font-anton text-2xl uppercase tracking-wide">
              HASAN RAHEEM CAPSULE 02
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Karachi coastal indie rhythms meet Lahore's raw industrial concrete sneaker culture. Custom archival leather, neon pink hand-stitch detailing, and graphic lyric insoles.
            </p>
          </div>

          <div className="p-6 bg-[#161616] border border-white/20 space-y-3 shadow-hard-sm">
            <Shield className="w-8 h-8 text-[#0062FF]" />
            <h3 className="font-anton text-2xl uppercase tracking-wide">
              NATIONWIDE COD & 200+ STORES
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Order risk-free with Cash on Delivery (COD) anywhere in Pakistan or walk into any of our 200+ flagship retail outlets for 30-day hassle-free size exchanges.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
