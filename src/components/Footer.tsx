import React, { useState } from 'react';
import { Mail, Phone, MapPin, ArrowRight, ShieldCheck, Check, Instagram, Facebook, Youtube } from 'lucide-react';
import { saveSubscriberToFirestore } from '../services/firebaseStore';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailToSave = newsletterEmail.trim();
    if (emailToSave) {
      try {
        await Promise.allSettled([
          saveSubscriberToFirestore(emailToSave),
          fetch('/api/newsletter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emailToSave }),
          })
        ]);
      } catch (err) {
        console.error(err);
      }
      setSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <footer id="csenzo-footer" className="bg-[#0A0A0A] text-white border-t-2 border-[#0A0A0A] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Top Newsletter Strip */}
        <div className="bg-[#161616] border-2 border-white/20 p-6 sm:p-8 mb-16 flex flex-col md:flex-row items-center justify-between gap-6 shadow-hard-blue">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-[10px] font-mono text-[#DFFF00] uppercase tracking-widest font-bold">
              VIP STREET PASS
            </span>
            <h3 className="font-anton text-2xl sm:text-3xl uppercase tracking-wide text-white">
              GET 10% OFF YOUR FIRST ORDER
            </h3>
            <p className="text-xs text-gray-400 max-w-md">
              Subscribe to unlock secret capsule drops, restock alerts, and exclusive Hasan Raheem tour merchandise access.
            </p>
          </div>

          <div className="w-full md:w-auto min-w-[320px]">
            {subscribed ? (
              <div className="bg-emerald-950 border border-emerald-500 p-3 text-emerald-300 text-xs flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>You're in! Use coupon code <strong className="text-white font-mono">NDUREFIRST</strong> or <strong className="text-white font-mono">CSENZO10</strong> at checkout.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="ENTER YOUR EMAIL..."
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full px-3.5 py-3 text-xs bg-[#0A0A0A] border border-white/30 text-white placeholder:text-gray-500 font-mono uppercase focus:border-[#0062FF] outline-none"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#0062FF] hover:bg-[#FF3366] text-white font-bold text-xs uppercase tracking-wider transition-colors shrink-0 flex items-center space-x-1 cursor-pointer"
                >
                  <span>JOIN</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* 4 Columns Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10 text-xs">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="font-anton text-3xl tracking-wider text-white uppercase">
                CSENZO
              </span>
              <span className="ml-1.5 px-1.5 py-0.5 text-[9px] font-bold bg-[#FF3366] text-white tracking-widest uppercase">
                STREET
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Engineered kinetic footwear crafted for raw urban street velocity and modern movers across Pakistan. High impact silhouettes with zero compromises on comfort.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a href="#" className="p-2 bg-white/10 hover:bg-[#0062FF] transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-white/10 hover:bg-[#0062FF] transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-white/10 hover:bg-[#0062FF] transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Divisions */}
          <div className="space-y-3">
            <h4 className="font-anton text-sm uppercase tracking-wider text-[#DFFF00]">
              COLLECTIONS &amp; DROPS
            </h4>
            <ul className="space-y-2 text-gray-300 font-medium">
              <li>
                <button 
                  onClick={() => onNavigate('/hasan-raheem-collection')} 
                  className="hover:text-[#FF3366] transition-colors cursor-pointer flex items-center space-x-1.5"
                >
                  <span>Hasan Raheem Signature Capsule</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF3366]"></span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('/collections/men')} 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Men’s Athletic &amp; Chunky Sneakers
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('/collections/women')} 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Women’s Knit &amp; Running Series
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('/collections/kids')} 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Kids’ Velocity &amp; School Trainers
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('/collections/sale')} 
                  className="text-[#E60000] hover:underline font-bold cursor-pointer"
                >
                  End of Season Clearance (Up to 50% Off)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care */}
          <div className="space-y-3">
            <h4 className="font-anton text-sm uppercase tracking-wider text-[#0062FF]">
              CUSTOMER ASSISTANCE
            </h4>
            <ul className="space-y-2 text-gray-300 font-medium">
              <li>
                <button 
                  onClick={() => onNavigate('/track-order')} 
                  className="hover:text-white transition-colors cursor-pointer flex items-center space-x-1.5"
                >
                  <span>Track Your Consignment</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('/stores')} 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Find a Store (8 Cities in Pakistan)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('/admin')} 
                  className="text-[#DFFF00] hover:underline font-mono font-bold text-[11px] uppercase transition-colors cursor-pointer flex items-center space-x-1"
                >
                  <ShieldCheck className="w-3 h-3 text-[#DFFF00]" />
                  <span>Admin Operations Hub</span>
                </button>
              </li>
              <li>
                <span className="text-gray-400">Cash on Delivery (COD) Nationwide</span>
              </li>
              <li>
                <span className="text-gray-400">30-Day Easy In-Store Exchanges</span>
              </li>
              <li>
                <span className="text-gray-400">Warranty &amp; Genuine Guarantee</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Official Contact */}
          <div className="space-y-3">
            <h4 className="font-anton text-sm uppercase tracking-wider text-white">
              CONTACT &amp; HELPLINE
            </h4>
            <div className="space-y-2 text-gray-300">
              <div className="flex items-start space-x-2">
                <Phone className="w-4 h-4 text-[#0062FF] shrink-0 mt-0.5" />
                <div>
                  <span className="block font-mono font-bold text-white">+92 300 1234567</span>
                  <span className="text-[10px] text-gray-400">Mon - Sat (10:00 AM - 08:00 PM)</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#FF3366] shrink-0" />
                <span className="font-mono">care@csenzo.com</span>
              </div>

              <div className="flex items-start space-x-2 pt-1">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-[11px] text-gray-400">
                  Headquarters: 42-B, Industrial Park, Gulberg III, Lahore, Pakistan
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Payments & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div className="flex items-center space-x-2 text-gray-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>PAYMENT ACCEPTED: CASH ON DELIVERY (COD) • VISA • MASTERCARD • JAZZCASH • EASYPAISA • YEYLO BNPL</span>
          </div>

          <div className="font-mono text-[11px] text-center sm:text-right">
            &copy; 2026 CSENZO STREETWEAR &amp; FOOTWEAR. ALL RIGHTS RESERVED.
          </div>
        </div>
      </div>
    </footer>
  );
};
