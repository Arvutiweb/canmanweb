'use client';
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

// Uus header - CANMAN ARVUTID heleda kastiga
interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  onOpenServicesModal?: () => void;
}

export function Header({ searchQuery, setSearchQuery, onOpenServicesModal }: HeaderProps) {
  const { cartCount, setIsCartOpen } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setIsMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

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

        <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-1 text-sm font-medium">
          <button onClick={() => scrollTo('pood')} className="px-3 py-2 rounded-lg bg-sky-100 text-[#0e4da4] hover:bg-sky-200 transition">
            Pood
          </button>
          {onOpenServicesModal && (
            <button
              onClick={() => {
                setIsMenuOpen(false);
                onOpenServicesModal();
              }}
              className="px-3 py-2 rounded-lg bg-sky-100 text-[#0e4da4] hover:bg-sky-200 transition"
            >
              Teenused
            </button>
          )}
          <button onClick={() => scrollTo('tarkvara')} className="px-3 py-2 rounded-lg bg-sky-100 text-[#0e4da4] hover:bg-sky-200 transition">
            Tarkvara arendused
          </button>
          <a href="#kontakt" onClick={() => setIsMenuOpen(false)} className="px-3 py-2 rounded-lg bg-sky-100 text-[#0e4da4] hover:bg-sky-200 transition">
            Kontakt
          </a>
        </nav>

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
        <button onClick={() => setIsCartOpen(true)} className="relative bg-[#0e4da4] text-white rounded-full px-5 py-2.5 text-[13px] font-semibold hover:bg-[#0a3a7d] transition flex items-center gap-2">
          <span>🛒</span> Korv
          {cartCount > 0 && <span className="bg-white text-[#0e4da4] text-[11px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">{cartCount}</span>}
        </button>

        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition"
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {isMenuOpen && (
        <nav aria-label="Mobile navigation" className="lg:hidden border-t border-slate-200 px-4 py-2">
          <button onClick={() => scrollTo('pood')} className="block w-full text-left px-3 py-2.5 rounded-lg bg-sky-100 text-[#0e4da4] hover:bg-sky-200 mb-1">
            Pood
          </button>
          {onOpenServicesModal && (
            <button
              onClick={() => {
                setIsMenuOpen(false);
                onOpenServicesModal();
              }}
              className="block w-full text-left px-3 py-2.5 rounded-lg bg-sky-100 text-[#0e4da4] hover:bg-sky-200 mb-1"
            >
              Teenused
            </button>
          )}
          <button onClick={() => scrollTo('tarkvara')} className="block w-full text-left px-3 py-2.5 rounded-lg bg-sky-100 text-[#0e4da4] hover:bg-sky-200 mb-1">
            Tarkvara arendused
          </button>
          <a href="#kontakt" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2.5 rounded-lg bg-sky-100 text-[#0e4da4] hover:bg-sky-200">
            Kontakt
          </a>
        </nav>
      )}
      
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
