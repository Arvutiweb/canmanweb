'use client';
import React from 'react';
import { useCart } from '../context/CartContext';

// Uus header - CANMAN ARVUTID heleda kastiga
interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  onOpenServicesModal?: () => void;
}

export function Header({ searchQuery, setSearchQuery }: HeaderProps) {
  const { cartCount, setIsCartOpen } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-3 flex items-center justify-between gap-4">
        {/* Logo / Nimi heledas kastis */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 shadow-sm">
            <h1 className="font-black text-[15px] tracking-[0.15em] text-[#0e4da4] leading-none">CANMAN ARVUTID</h1>
            <p className="text-[10px] tracking-widest text-slate-400 font-medium -mt-0.5">KASUTATUD ARVUTID • GARANTII</p>
          </div>
          <div className="hidden lg:block h-8 w-px bg-slate-200 mx-2"></div>
          <div className="hidden lg:block text-[11px] text-slate-500 leading-tight">
            <div className="font-semibold text-slate-700">E-pood</div>
            <div>{new Date().getFullYear()} kollektsioon</div>
          </div>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-[500px] hidden md:block">
          <div className="relative">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Otsi tooteid, nt. Dell i5, 16GB..."
              className="w-full bg-slate-50 border border-slate-200 rounded-full pl-10 pr-4 py-2.5 text-[13px] outline-none focus:bg-white focus:border-[#0e4da4]/30 focus:ring-4 focus:ring-[#0e4da4]/10 transition"
            />
            <span className="absolute left-3.5 top-2.5 text-slate-400">⌕</span>
          </div>
        </div>

        {/* Cart */}
        <button onClick={() => setIsCartOpen(true)} className="relative bg-slate-900 text-white rounded-full px-5 py-2.5 text-[13px] font-semibold hover:bg-black transition flex items-center gap-2">
          <span>🛒</span> Korv
          {cartCount > 0 && <span className="bg-white text-slate-900 text-[11px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">{cartCount}</span>}
        </button>
      </div>
      
      {/* Mobile search */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Otsi tooteid..."
            className="w-full bg-slate-50 border border-slate-200 rounded-full pl-10 pr-4 py-2.5 text-[13px] outline-none focus:bg-white focus:border-[#0e4da4]/30 transition"
          />
          <span className="absolute left-3.5 top-2.5 text-slate-400">⌕</span>
        </div>
      </div>
    </header>
  );
}
