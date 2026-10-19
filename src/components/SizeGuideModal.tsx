import React from 'react';
import { X, Ruler } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const chart = [
    { eu: 36, uk: 3.5, usMen: 4.5, usWomen: 5.5, cm: 22.5 },
    { eu: 37, uk: 4.0, usMen: 5.0, usWomen: 6.0, cm: 23.0 },
    { eu: 38, uk: 5.0, usMen: 6.0, usWomen: 7.0, cm: 24.0 },
    { eu: 39, uk: 6.0, usMen: 6.5, usWomen: 8.0, cm: 24.5 },
    { eu: 40, uk: 6.5, usMen: 7.5, usWomen: 8.5, cm: 25.0 },
    { eu: 41, uk: 7.5, usMen: 8.5, usWomen: 9.5, cm: 26.0 },
    { eu: 42, uk: 8.0, usMen: 9.0, usWomen: 10.0, cm: 26.5 },
    { eu: 43, uk: 9.0, usMen: 10.0, usWomen: 11.0, cm: 27.5 },
    { eu: 44, uk: 9.5, usMen: 10.5, usWomen: 11.5, cm: 28.0 },
    { eu: 45, uk: 10.5, usMen: 11.5, usWomen: 12.5, cm: 29.0 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div 
        id="size-guide-modal"
        className="bg-white border-2 border-[#0A0A0A] shadow-hard max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 border border-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 text-[#0062FF] mb-1">
          <Ruler className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-widest">FITTING INTELLIGENCE</span>
        </div>
        <h2 className="font-anton text-2xl sm:text-3xl text-[#0A0A0A] uppercase tracking-wide mb-2">
          CSENZO FOOTWEAR SIZE CHART
        </h2>
        <p className="text-xs text-[#444748] mb-6">
          All csenzo sneakers are built on standard European sizing lasts. If you are between sizes, we recommend sizing up for chunky sneakers and true-to-size for knit runners.
        </p>

        {/* Table */}
        <div className="overflow-x-auto border border-[#0A0A0A] mb-6">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#0A0A0A] text-white">
              <tr>
                <th className="p-2.5 font-bold uppercase">EU SIZE</th>
                <th className="p-2.5 font-bold uppercase">UK</th>
                <th className="p-2.5 font-bold uppercase">US MEN</th>
                <th className="p-2.5 font-bold uppercase">US WOMEN</th>
                <th className="p-2.5 font-bold uppercase text-[#DFFF00]">CM LENGTH</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e2e1]">
              {chart.map((row) => (
                <tr key={row.eu} className="hover:bg-[#f1edec] transition-colors">
                  <td className="p-2.5 font-bold text-[#0A0A0A]">{row.eu}</td>
                  <td className="p-2.5">{row.uk}</td>
                  <td className="p-2.5">{row.usMen}</td>
                  <td className="p-2.5">{row.usWomen}</td>
                  <td className="p-2.5 font-bold text-[#0062FF]">{row.cm} cm</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* How to measure */}
        <div className="bg-[#F4F4F6] p-4 border border-[#e5e2e1] space-y-2">
          <h4 className="font-bold text-xs uppercase tracking-wider text-[#0A0A0A]">
            HOW TO MEASURE YOUR FOOT LENGTH:
          </h4>
          <ol className="text-xs text-[#444748] space-y-1 list-decimal list-inside">
            <li>Place a sheet of blank paper against a flat wall.</li>
            <li>Stand on the paper with your heel firmly touching the wall.</li>
            <li>Mark the tip of your longest toe with a pencil.</li>
            <li>Measure distance from wall to mark in centimeters (CM) and match to table above.</li>
          </ol>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-3 bg-[#0A0A0A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#0062FF] transition-colors cursor-pointer"
        >
          GOT IT — RETURN TO PRODUCT
        </button>
      </div>
    </div>
  );
};
