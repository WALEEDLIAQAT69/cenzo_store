import React, { useState } from 'react';
import { X, MapPin, Phone, Clock, Search, Navigation } from 'lucide-react';
import { STORE_LOCATIONS } from '../data/stores';

interface StoreLocatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StoreLocatorModal: React.FC<StoreLocatorModalProps> = ({ isOpen, onClose }) => {
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div 
        id="store-locator-modal"
        className="bg-white border-2 border-[#0A0A0A] shadow-hard max-w-3xl w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 border border-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 text-[#0062FF] mb-1">
          <MapPin className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-widest">RETAIL NETWORK</span>
        </div>

        <h2 className="font-anton text-2xl sm:text-3xl uppercase text-[#0A0A0A] mb-2">
          CSENZO STORE LOCATOR (PAKISTAN)
        </h2>
        <p className="text-xs text-[#444748] mb-6">
          Visit any of our 8 flagship retail stores across major cities for instant size fittings, exchanges, and exclusive in-store drops.
        </p>

        {/* City Filter Tabs */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider border transition-colors cursor-pointer ${
                selectedCity === city
                  ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]'
                  : 'bg-white text-[#0A0A0A] border-[#c4c7c7] hover:border-[#0A0A0A]'
              }`}
            >
              {city}
            </button>
          ))}
        </div>

        {/* Search bar */}
        <div className="relative mb-6">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="SEARCH BY MALL, AREA OR CITY..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-[#0A0A0A] uppercase bg-white"
          />
        </div>

        {/* Store Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredStores.map((store) => (
            <div
              key={store.id}
              className="p-4 bg-[#F4F4F6] border border-[#0A0A0A] space-y-2.5 flex flex-col justify-between hover:shadow-hard-sm transition-all"
            >
              <div>
                <div className="flex items-start justify-between">
                  <h4 className="font-anton text-base uppercase text-[#0A0A0A]">
                    {store.name}
                  </h4>
                  <span className="px-2 py-0.5 bg-[#0062FF] text-white font-mono text-[9px] font-bold uppercase">
                    {store.city}
                  </span>
                </div>

                <p className="text-xs text-[#444748] mt-1 font-medium">
                  {store.address}
                </p>

                <p className="text-[11px] text-[#747878] italic">
                  Landmark: {store.landmark}
                </p>
              </div>

              <div className="pt-2 border-t border-[#e5e2e1] space-y-1.5 text-[11px] text-[#444748]">
                <div className="flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#0A0A0A]" />
                  <span>{store.hours}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#0062FF]" />
                  <a href={`tel:${store.phone}`} className="font-mono hover:underline">
                    {store.phone}
                  </a>
                </div>
              </div>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${store.name} ${store.city}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 w-full py-2 bg-white border border-[#0A0A0A] text-[#0A0A0A] text-[11px] font-bold uppercase text-center flex items-center justify-center space-x-1.5 hover:bg-[#0A0A0A] hover:text-white transition-colors cursor-pointer"
              >
                <Navigation className="w-3 h-3" />
                <span>OPEN DIRECTIONS IN MAPS</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
