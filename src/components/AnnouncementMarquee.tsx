import React from 'react';

export const AnnouncementMarquee: React.FC = () => {
  const items = [
    'FREE SHIPPING ON ALL ORDERS OVER RS. 2,500',
    'CASH ON DELIVERY (COD) AVAILABLE NATIONWIDE',
    'HASAN RAHEEM X CSENZO CAPSULE DROP IS NOW LIVE',
    'EASY 15-DAYS EXCHANGE & HASSLE-FREE RETURNS',
    'SAME DAY DISPATCH FOR LAHORE, KARACHI & ISLAMABAD',
  ];

  return (
    <div 
      id="announcement-marquee" 
      className="bg-[#0A0A0A] text-white py-2 overflow-hidden border-b border-[#222222] select-none text-[11px] font-bold tracking-[0.12em] uppercase"
    >
      <div className="flex whitespace-nowrap animate-marquee">
        {[...items, ...items].map((text, idx) => (
          <div key={idx} className="flex items-center mx-6">
            <span className="inline-block w-1.5 h-1.5 bg-[#FF3366] mr-3"></span>
            <span>{text}</span>
            <span className="inline-block w-1.5 h-1.5 bg-[#0062FF] ml-3"></span>
          </div>
        ))}
      </div>
    </div>
  );
};
