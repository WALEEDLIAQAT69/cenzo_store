import React, { useState } from 'react';
import { STORE_LOCATIONS } from '../data/stores';
import { PinDrop, Phone, Schedule, SearchIcon, NavigationIcon } from '../components/Icons';

export const StoreLocatorPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const cities = ['All', 'Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan'];

  const filteredStores = STORE_LOCATIONS.filter((store) => {
    const matchesCity = selectedCity === 'All' || store.city === selectedCity;
    const matchesSearch =
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCity && matchesSearch;
  });

  return (
    <div className="w-full flex flex-col bg-[#fdf8f8]">
      {/* Header */}
      <section className="w-full px-4 sm:px-8 lg:px-12 py-10 bg-[#ebe7e6] border-b-2 border-[#0A0A0A]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-[#004ccb] mb-1">
            <PinDrop className="w-5 h-5" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest">NATIONWIDE RETAIL GRID</span>
          </div>
          <h1 className="font-anton text-4xl sm:text-5xl uppercase text-black">
            FIND A CSENZO &times; NDURE STORE
          </h1>
          <p className="text-xs sm:text-sm text-[#444748] mt-2 max-w-2xl">
            Visit any of our flagship retail outlets across Pakistan for instant size fittings, 30-day exchanges, and exclusive in-store sneaker drops.
          </p>
        </div>
      </section>

      {/* Main Filter & Stores Grid */}
      <section className="w-full px-4 sm:px-8 lg:px-12 py-10 max-w-7xl mx-auto">
        {/* City Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-2 transition-all cursor-pointer ${
                selectedCity === city
                  ? 'bg-black text-white border-black shadow-hard-sm'
                  : 'bg-white text-black border-gray-300 hover:border-black'
              }`}
            >
              {city}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative mb-8 max-w-md">
          <SearchIcon className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="SEARCH BY MALL, AREA OR CITY..."
            className="w-full pl-9 pr-3 py-2.5 text-xs font-bold uppercase border-2 border-[#0A0A0A] bg-white outline-none focus:border-[#004ccb]"
          />
        </div>

        {/* Stores Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStores.map((store) => (
            <div
              key={store.id}
              className="bg-white border-2 border-[#0A0A0A] p-5 flex flex-col justify-between shadow-hard-sm hover:shadow-hard transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-anton text-lg uppercase text-black leading-tight">
                    {store.name}
                  </h3>
                  <span className="px-2 py-0.5 bg-[#004ccb] text-white text-[9px] font-mono font-bold uppercase">
                    {store.city}
                  </span>
                </div>

                <p className="text-xs text-[#444748] mb-2 font-medium leading-relaxed">
                  {store.address}
                </p>

                <p className="text-[11px] text-[#747878] italic mb-4">
                  Landmark: {store.landmark}
                </p>
              </div>

              <div className="pt-3 border-t border-[#e5e2e1] space-y-2 text-xs">
                <div className="flex items-center gap-2 text-[#444748]">
                  <Schedule className="w-4 h-4 text-black" />
                  <span>{store.hours}</span>
                </div>
                <div className="flex items-center gap-2 text-[#004ccb]">
                  <Phone className="w-4 h-4" />
                  <a href={`tel:${store.phone}`} className="font-mono font-bold hover:underline">
                    {store.phone}
                  </a>
                </div>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${store.name} ${store.city}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 w-full py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider text-center flex items-center justify-center gap-2 hover:bg-[#004ccb] transition-colors"
                >
                  <NavigationIcon className="w-3.5 h-3.5" />
                  <span>DIRECTIONS IN GOOGLE MAPS</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
