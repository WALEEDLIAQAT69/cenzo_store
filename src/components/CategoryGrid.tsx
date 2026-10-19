import React from 'react';
import { ArrowRight, Flame } from 'lucide-react';
import { Gender } from '../types';

interface CategoryGridProps {
  onSelectCategory: (gender: Gender | 'All' | 'Capsule' | 'Sale') => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onSelectCategory }) => {
  const categories = [
    {
      id: 'Men',
      title: 'MEN’S STREET KICKS',
      subtitle: 'CHUNKY, RUNNERS & CASUALS',
      image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80',
      badge: 'POPULAR',
      action: () => onSelectCategory('Men'),
    },
    {
      id: 'Capsule',
      title: 'HASAN RAHEEM CAPSULE',
      subtitle: 'EXCLUSIVE LIMITED STAGE DROP',
      image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
      badge: 'SPECIAL DROP',
      highlight: true,
      action: () => onSelectCategory('Capsule'),
    },
    {
      id: 'Women',
      title: 'WOMEN’S MOVEMENT',
      subtitle: 'LIGHTWEIGHT KNIT & TRAINERS',
      image: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&w=800&q=80',
      badge: 'TRENDING',
      action: () => onSelectCategory('Women'),
    },
    {
      id: 'Kids',
      title: 'KIDS’ URBAN VELOCITY',
      subtitle: 'TOUGH PLAYGROUND TESTED',
      image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=800&q=80',
      badge: 'NEW',
      action: () => onSelectCategory('Kids'),
    },
  ];

  return (
    <section id="category-navigation-section" className="py-12 bg-[#fdf8f8] border-b border-[#e5e2e1]">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b-2 border-[#0A0A0A]">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-[#0062FF] tracking-widest uppercase mb-1">
              <Flame className="w-4 h-4 text-[#FF3366]" />
              <span>COLLECTIONS ARCHIVE</span>
            </div>
            <h2 className="font-anton text-3xl sm:text-4xl text-[#0A0A0A] uppercase tracking-tight">
              EXPLORE BY DIVISION
            </h2>
          </div>
          <button
            onClick={() => onSelectCategory('All')}
            className="text-xs font-bold uppercase tracking-wider text-[#0A0A0A] hover:text-[#0062FF] flex items-center space-x-1 mt-2 sm:mt-0 group cursor-pointer"
          >
            <span>VIEW COMPLETE CATALOG</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={cat.action}
              className={`group relative bg-white border-2 cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
                cat.highlight
                  ? 'border-[#FF3366] hover:shadow-hard-pink'
                  : 'border-[#0A0A0A] hover:shadow-hard'
              }`}
            >
              {/* Badge */}
              <div className="absolute top-3 left-3 z-10">
                <span
                  className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${
                    cat.highlight
                      ? 'bg-[#FF3366] text-white'
                      : 'bg-[#0A0A0A] text-white'
                  }`}
                >
                  {cat.badge}
                </span>
              </div>

              {/* Image container */}
              <div className="aspect-[4/5] overflow-hidden bg-[#F4F4F6] relative">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              </div>

              {/* Content bottom */}
              <div className="absolute bottom-0 inset-x-0 p-4 text-white">
                <p className="text-[10px] text-gray-300 tracking-widest font-mono uppercase">
                  {cat.subtitle}
                </p>
                <h3 className="font-anton text-xl sm:text-2xl uppercase tracking-wide mt-1 flex items-center justify-between">
                  <span>{cat.title}</span>
                  <ArrowRight className="w-4 h-4 transform -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#FF3366]" />
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
