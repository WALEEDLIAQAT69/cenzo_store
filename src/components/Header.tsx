import React, { useState } from 'react';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  MapPin, 
  Package, 
  Menu, 
  X, 
  Phone,
  Flame,
  Sparkles,
  User as UserIcon,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { Gender } from '../types';
import { formatPrice } from '../utils/format';
import { isAdminUser } from '../services/firebaseStore';

interface HeaderProps {
  activePath?: string;
  onNavigate: (path: string) => void;
  cartCount: number;
  cartTotal: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenSearch: () => void;
  onOpenAuth?: () => void;
  user?: any;
  isLoggingIn?: boolean;
  onLogin?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activePath = '/',
  onNavigate,
  cartCount,
  cartTotal,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenSearch,
  onOpenAuth,
  user,
  isLoggingIn = false,
  onLogin,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'HOME' },
    { path: '/collections/men', label: 'MEN' },
    { path: '/collections/women', label: 'WOMEN' },
    { path: '/collections/kids', label: 'KIDS' },
    { 
      path: '/hasan-raheem-collection', 
      label: 'HASAN RAHEEM CAPSULE', 
      isCapsule: true, 
      badge: 'LIMITED' 
    },
    { 
      path: '/collections/sale', 
      label: 'SALE UP TO 50%', 
      isSale: true 
    },
  ];

  const handleNavClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b-2 border-[#0A0A0A]">
      {/* Top Utility Bar */}
      <div className="bg-[#f1edec] border-b border-[#e5e2e1] text-[11px] font-semibold text-[#444748] px-4 lg:px-8 py-1.5 hidden md:flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <button 
            id="header-btn-store-locator"
            onClick={() => onNavigate('/stores')}
            className="flex items-center space-x-1.5 hover:text-[#0A0A0A] transition-colors cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-[#0A0A0A]" />
            <span>STORE LOCATOR (8 NATIONWIDE)</span>
          </button>
          <button 
            id="header-btn-track-order"
            onClick={() => onNavigate('/track-order')}
            className="flex items-center space-x-1.5 hover:text-[#0A0A0A] transition-colors cursor-pointer"
          >
            <Package className="w-3.5 h-3.5 text-[#0062FF]" />
            <span>TRACK YOUR ORDER</span>
          </button>
          <button 
            id="header-btn-admin-portal"
            onClick={() => onNavigate('/admin')}
            className={`flex items-center space-x-1 px-2 py-0.5 border font-mono font-bold text-[10px] uppercase transition-all cursor-pointer ${
              activePath === '/admin'
                ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]'
                : user?.email === 'waleedliaqat69@gmail.com'
                  ? 'bg-[#DFFF00] text-black border-[#0A0A0A] hover:bg-black hover:text-white shadow-xs'
                  : 'bg-white hover:bg-[#0A0A0A] hover:text-white border-[#0A0A0A]'
            }`}
            title="Store Administration & Order Fulfillment Console"
          >
            <ShieldCheck className="w-3 h-3 text-[#0062FF]" />
            <span>ADMIN CONSOLE</span>
          </button>
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-1.5 px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-mono font-bold tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span>FIRESTORE: LIVE</span>
          </div>
          <a 
            href="tel:+923001234567" 
            className="flex items-center space-x-1 hover:text-[#0A0A0A] transition-colors"
          >
            <Phone className="w-3 h-3" />
            <span>HELPLINE: +92 300 1234567</span>
          </a>
          <span className="text-[#c4c7c7]">|</span>
          <div className="flex items-center space-x-1 text-[#0A0A0A] font-bold">
            <span>PKR (RS.)</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 h-18 md:h-20 flex items-center justify-between">
        {/* Left Mobile Menu + Brand Logo */}
        <div className="flex items-center space-x-4">
          <button
            id="header-mobile-menu-trigger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 md:hidden border border-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-colors cursor-pointer"
            aria-label="Open menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* CSENZO LOGO */}
          <button 
            id="header-brand-logo"
            onClick={() => handleNavClick('/')} 
            className="text-left group cursor-pointer"
          >
            <div className="flex items-center">
              <span className="font-anton text-3xl md:text-4xl tracking-wider text-[#0A0A0A] uppercase transition-colors">
                CSENZO
              </span>
              <span className="ml-1.5 px-1.5 py-0.5 text-[9px] font-bold bg-[#FF3366] text-white tracking-widest uppercase">
                STREET
              </span>
            </div>
            <p className="text-[9px] tracking-[0.2em] uppercase font-bold text-[#747878] -mt-1 hidden sm:block">
              Kinetic Footwear Lab
            </p>
          </button>
        </div>

        {/* Center Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-7">
          {navItems.map((item) => {
            const isActive = activePath === item.path;
            
            if (item.isCapsule) {
              return (
                <button
                  key={item.path}
                  id={`nav-item-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => handleNavClick(item.path)}
                  className={`relative px-3 py-1.5 text-xs font-bold tracking-[0.08em] uppercase transition-all flex items-center space-x-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-[#FF3366] text-white shadow-hard-sm'
                      : 'border border-[#FF3366] text-[#FF3366] hover:bg-[#FF3366] hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-300 animate-pulse"></span>
                </button>
              );
            }

            if (item.isSale) {
              return (
                <button
                  key={item.path}
                  id={`nav-item-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => handleNavClick(item.path)}
                  className={`relative text-xs font-bold tracking-[0.08em] uppercase text-[#E60000] flex items-center space-x-1 hover:opacity-80 transition-opacity cursor-pointer ${
                    isActive ? 'border-b-2 border-[#E60000] pb-1 font-extrabold' : ''
                  }`}
                >
                  <Flame className="w-3.5 h-3.5 fill-[#E60000]" />
                  <span>{item.label}</span>
                </button>
              );
            }

            return (
              <button
                key={item.path}
                id={`nav-item-${item.label.toLowerCase()}`}
                onClick={() => handleNavClick(item.path)}
                className={`text-xs font-bold tracking-[0.08em] uppercase text-[#0A0A0A] hover:text-[#0062FF] transition-colors py-2 cursor-pointer relative ${
                  isActive ? 'border-b-2 border-[#0A0A0A]' : ''
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Actions (Search, Wishlist, Bag) */}
        <div className="flex items-center space-x-3">
          {/* Quick Search */}
          <button
            id="header-btn-search"
            onClick={onOpenSearch}
            className="flex items-center space-x-2 px-3 py-2 border border-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-all text-xs font-bold cursor-pointer"
            title="Search sneakers"
          >
            <Search className="w-4 h-4" />
            <span className="hidden md:inline uppercase tracking-wider text-[11px]">SEARCH</span>
          </button>

          {/* Wishlist */}
          <button
            id="header-btn-wishlist"
            onClick={onOpenWishlist}
            className="p-2 border border-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-all relative cursor-pointer"
            title="Your saved kicks"
          >
            <Heart className="w-4 h-4" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#FF3366] text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* User Account / Google Login with Firebase */}
          {user ? (
            <button
              id="header-btn-user"
              onClick={() => {
                if (onOpenAuth) onOpenAuth();
                else if (onLogout) onLogout();
              }}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 border border-[#0A0A0A] text-xs font-bold transition-all cursor-pointer ${
                isAdminUser(user) ? 'bg-[#DFFF00] text-black hover:bg-black hover:text-white' : 'bg-[#f1edec] hover:bg-white'
              }`}
              title={`Signed in as ${user.email}. Click for Account & Security Clearances.`}
            >
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || 'User'} className="w-5 h-5 rounded-none border border-[#0A0A0A]" referrerPolicy="no-referrer" />
              ) : (
                <UserIcon className="w-3.5 h-3.5 text-[#0A0A0A]" />
              )}
              <span className="hidden xl:inline text-[11px] max-w-[90px] truncate">{user.displayName || user.email?.split('@')[0]}</span>
              {isAdminUser(user) ? (
                <span className="text-[9px] font-mono font-bold px-1 bg-black text-[#DFFF00]">ADMIN</span>
              ) : (
                <ShieldCheck className="w-3 h-3 text-[#0062FF]" />
              )}
            </button>
          ) : (
            <button
              id="header-btn-login"
              onClick={() => {
                if (onOpenAuth) onOpenAuth();
                else if (onLogin) onLogin();
              }}
              disabled={isLoggingIn}
              className={`hidden sm:flex items-center space-x-1 px-2.5 py-2 border border-[#0A0A0A] bg-white transition-all text-xs font-bold cursor-pointer ${
                isLoggingIn ? 'opacity-60 cursor-wait' : 'hover:bg-[#0A0A0A] hover:text-white shadow-xs'
              }`}
              title="Kinetic Member Authentication &amp; Google Sign In"
            >
              <UserIcon className={`w-3.5 h-3.5 ${isLoggingIn ? 'animate-spin' : ''}`} />
              <span className="text-[10px] tracking-wider uppercase">
                {isLoggingIn ? 'CONNECTING...' : 'SIGN IN'}
              </span>
            </button>
          )}

          {/* Bag / Cart */}
          <button
            id="header-btn-cart"
            onClick={() => onNavigate('/cart')}
            className="flex items-center space-x-2 bg-[#0A0A0A] text-white px-3.5 py-2 hover:bg-[#0062FF] hover:shadow-hard-sm transition-all text-xs font-bold cursor-pointer"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#FF3366] text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <div className="hidden sm:flex flex-col text-left leading-none">
              <span className="text-[10px] uppercase tracking-wider text-gray-300">BAG</span>
              <span className="text-xs font-bold text-white mt-0.5">
                {cartTotal > 0 ? formatPrice(cartTotal) : 'RS. 0'}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div 
          id="mobile-navigation-drawer"
          className="lg:hidden border-t-2 border-[#0A0A0A] bg-[#fdf8f8] px-4 py-6 space-y-4"
        >
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`text-left p-3 text-xs font-bold tracking-wider uppercase border border-[#0A0A0A] ${
                  item.isCapsule 
                    ? 'bg-[#FF3366] text-white border-[#FF3366]' 
                    : item.isSale 
                    ? 'bg-[#E60000] text-white border-[#E60000]'
                    : activePath === item.path 
                    ? 'bg-[#0A0A0A] text-white' 
                    : 'bg-white text-[#0A0A0A]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-[#e5e2e1] space-y-2 text-xs font-semibold">
            {/* Account & Security Hub */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenAuth) onOpenAuth();
              }}
              className="w-full flex items-center justify-between p-2.5 bg-white border border-[#0A0A0A] font-mono text-xs font-bold"
            >
              <span className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-[#0062FF]" />
                <span>
                  {user ? (
                    <>
                      ACCOUNT: <span className="text-black font-normal">{user.displayName || user.email?.split('@')[0]}</span>
                      {isAdminUser(user) && <span className="ml-1 px-1 bg-[#DFFF00] text-black text-[9px]">ADMIN</span>}
                    </>
                  ) : (
                    'MEMBER SIGN IN / SECURITY'
                  )}
                </span>
              </span>
              <span className="text-[10px] font-mono font-bold bg-[#0A0A0A] text-white px-2 py-0.5 uppercase">
                {user ? 'PROFILE' : 'AUTH'}
              </span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('/stores');
              }}
              className="w-full flex items-center justify-between p-2.5 bg-white border border-[#e5e2e1]"
            >
              <span className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Store Locator (Pakistan)</span>
              </span>
              <span className="text-gray-400">&rarr;</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('/track-order');
              }}
              className="w-full flex items-center justify-between p-2.5 bg-white border border-[#e5e2e1]"
            >
              <span className="flex items-center space-x-2">
                <Package className="w-4 h-4 text-[#0062FF]" />
                <span>Track Your Order</span>
              </span>
              <span className="text-gray-400">&rarr;</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('/admin');
              }}
              className="w-full flex items-center justify-between p-2.5 bg-[#f1edec] border border-[#0A0A0A]"
            >
              <span className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-[#0062FF]" />
                <span className="font-bold">Admin Console</span>
              </span>
              <span className="text-[10px] font-mono font-bold bg-[#0A0A0A] text-white px-2 py-0.5 uppercase">OPEN</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('/cart');
              }}
              className="w-full flex items-center justify-between p-2.5 bg-[#0A0A0A] text-white border border-[#0A0A0A]"
            >
              <span className="flex items-center space-x-2">
                <ShoppingBag className="w-4 h-4" />
                <span>View Shopping Bag ({cartCount})</span>
              </span>
              <span className="text-gray-400">&rarr;</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
