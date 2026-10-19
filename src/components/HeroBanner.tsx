import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Zap, Truck, RotateCcw } from 'lucide-react';

interface HeroBannerProps {
  onShopCapsule: () => void;
  onShopAll: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onShopCapsule, onShopAll }) => {
  return (
    <div id="hero-banner-section" className="relative bg-[#0A0A0A] text-white border-b-2 border-[#0A0A0A] overflow-hidden">
      {/* Background Graphic Grid */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(#444 1px, transparent 1px), linear-gradient(90deg, #444 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-[#FF3366] text-white text-[11px] font-bold tracking-widest uppercase flex items-center gap-1.5 shadow-hard-sm">
                <Sparkles className="w-3.5 h-3.5" />
                OFFICIAL COLLABORATION
              </span>
              <span className="px-3 py-1 bg-white/10 text-white text-[11px] font-mono tracking-wider uppercase border border-white/20">
                AUTUMN / WINTER 2026
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="font-anton text-5xl sm:text-6xl lg:text-7xl uppercase leading-[0.95] tracking-tight text-white">
                BREAK THE <br />
                <span className="text-[#FF3366] underline decoration-4 decoration-[#0062FF]">SPEED OF SOUND</span>
              </h1>
              <p className="font-grotesk text-sm sm:text-base text-gray-300 max-w-xl leading-relaxed pt-2">
                The exclusive <span className="text-white font-bold">Hasan Raheem x csenzo Capsule</span> is here. High-energy architectural street kicks designed for live-stage endurance and midnight city velocity.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                id="hero-btn-shop-capsule"
                onClick={onShopCapsule}
                className="px-8 py-4 bg-[#FF3366] text-white text-xs sm:text-sm font-bold tracking-[0.08em] uppercase hover:bg-[#e02657] hover:shadow-hard-blue transition-all flex items-center space-x-3 cursor-pointer"
              >
                <span>SHOP HASAN RAHEEM CAPSULE</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-btn-explore-catalog"
                onClick={onShopAll}
                className="px-8 py-4 bg-transparent border-2 border-white text-white text-xs sm:text-sm font-bold tracking-[0.08em] uppercase hover:bg-white hover:text-[#0A0A0A] hover:shadow-hard transition-all cursor-pointer"
              >
                EXPLORE ALL SNEAKERS
              </button>
            </div>

            {/* Micro Stats */}
            <div className="pt-6 border-t border-white/15 grid grid-cols-3 gap-4 text-left">
              <div>
                <span className="font-anton text-2xl text-[#DFFF00]">100%</span>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Authentic Quality</p>
              </div>
              <div>
                <span className="font-anton text-2xl text-[#0062FF]">COD</span>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Cash on Delivery</p>
              </div>
              <div>
                <span className="font-anton text-2xl text-[#FF3366]">15-DAY</span>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Easy Exchange</p>
              </div>
            </div>
          </div>

          {/* Hero Image Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative border-2 border-white/20 bg-[#161616] p-4 group">
              {/* Product Badge */}
              <div className="absolute top-6 left-6 z-20">
                <span className="px-3 py-1.5 bg-[#0062FF] text-white font-anton tracking-wider text-xs uppercase shadow-hard-sm">
                  HR-01 CYBER RUNNER // LIMITED
                </span>
              </div>

              <div className="aspect-square overflow-hidden bg-[#1c1b1b] relative">
                <img
                  src="https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1000&q=80"
                  alt="Hasan Raheem x csenzo Capsule Sneaker"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                
                {/* Visual price tag overlay */}
                <div className="absolute bottom-4 right-4 bg-[#0A0A0A] border border-white/20 px-3 py-2 text-right">
                  <span className="text-[10px] font-mono text-gray-400 block line-through">Rs. 9,499</span>
                  <span className="font-anton text-lg text-white">RS. 6,999</span>
                  <span className="block text-[9px] font-bold text-[#FF3366]">SAVE 26%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Strip */}
      <div className="bg-[#141414] border-t border-white/10 py-3.5 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold text-gray-300">
          <div className="flex items-center space-x-2.5">
            <Truck className="w-4 h-4 text-[#0062FF] shrink-0" />
            <span>Free Delivery Over Rs. 2,500</span>
          </div>
          <div className="flex items-center space-x-2.5">
            <Zap className="w-4 h-4 text-[#DFFF00] shrink-0" />
            <span>Cash on Delivery (COD)</span>
          </div>
          <div className="flex items-center space-x-2.5">
            <RotateCcw className="w-4 h-4 text-[#FF3366] shrink-0" />
            <span>15-Days Free Exchange</span>
          </div>
          <div className="flex items-center space-x-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>100% Genuine Materials</span>
          </div>
        </div>
      </div>
    </div>
  );
};
