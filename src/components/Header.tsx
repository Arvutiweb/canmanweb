'use client';

import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Wrench,
  ShoppingBag,
  Briefcase,
  Info,
  Phone,
  Search,
  Menu,
  X,
  Sparkles,
  Bot,
  Receipt,
  Headphones,
} from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  onOpenServicesModal?: () => void;
}

export function Header({ searchQuery, setSearchQuery, onOpenServicesModal }: HeaderProps) {
  const { cartCount, setIsCartOpen } = useCart();
  const { lang, setLang, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-xl border-b border-cyan-500/20 text-white shadow-xl relative overflow-hidden transition-all">
      {/* Subtle IT / AI Theme Background with Circuit & Neural Pattern */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.14]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="it-ai-circuit-grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path
                d="M 10 10 L 30 10 L 40 20 L 70 20 M 10 70 L 40 70 L 50 60 L 70 60 M 20 40 L 60 40"
                stroke="#38bdf8"
                strokeWidth="0.8"
                fill="none"
              />
              <circle cx="10" cy="10" r="2" fill="#38bdf8" />
              <circle cx="70" cy="20" r="2" fill="#818cf8" />
              <circle cx="10" cy="70" r="2" fill="#818cf8" />
              <circle cx="70" cy="60" r="2" fill="#38bdf8" />
              <circle cx="40" cy="40" r="2.5" fill="#06b6d4" />
              <path
                d="M 40 20 L 40 40 L 50 60"
                stroke="#06b6d4"
                strokeWidth="0.6"
                strokeDasharray="2 2"
                fill="none"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#it-ai-circuit-grid)" />
        </svg>

        {/* Ambient Glowing Tech/AI Orbs */}
        <div className="absolute -top-10 left-1/4 w-80 h-24 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-10 right-1/4 w-80 h-24 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Main Top Header Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 relative z-10">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo & Brand Identity */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 sm:gap-3 group focus:outline-none shrink-0"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-200">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-950 rounded-full animate-pulse" title="Süsteemid ja tugi aktiivne" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-wider canman-logo-shift">
                  CANMAN
                </span>
                <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-cyan-300" />
                  IT & AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-wide hidden sm:block">
                {t('tagline')}
              </p>
            </div>
          </a>

          {/* Desktop Navigation Menu (Primary focus: IT Services & Solutions) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-[13px] font-medium text-slate-300">
            {/* IT Teenused (Primary) */}
            <button
              onClick={() => scrollTo('teenused')}
              className="px-3 py-2 rounded-lg hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5 text-cyan-300 font-semibold"
            >
              <Wrench className="w-4 h-4 text-cyan-400" />
              <span>{t('nav_services')}</span>
            </button>

            {/* Ärikliendile (Business IT Outsourcing) */}
            <button
              onClick={() => scrollTo('arikliendile')}
              className="px-3 py-2 rounded-lg hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5"
            >
              <Briefcase className="w-4 h-4 text-slate-400" />
              <span>{t('nav_business')}</span>
            </button>

            {/* E-Pood (Hardware & Refurbished) */}
            <button
              onClick={() => scrollTo('pood')}
              className="px-3 py-2 rounded-lg hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5"
            >
              <ShoppingBag className="w-4 h-4 text-slate-400" />
              <span>{t('nav_shop')}</span>
            </button>

            {/* Hinnakiri */}
            <button
              onClick={() => scrollTo('hinnakiri')}
              className="px-3 py-2 rounded-lg hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5"
            >
              <Receipt className="w-4 h-4 text-slate-400" />
              <span>{t('nav_pricing')}</span>
            </button>

            {/* Meist */}
            <button
              onClick={() => scrollTo('meist')}
              className="px-3 py-2 rounded-lg hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5"
            >
              <Info className="w-4 h-4 text-slate-400" />
              <span>{t('nav_about')}</span>
            </button>

            {/* Kontakt */}
            <button
              onClick={() => scrollTo('kontakt')}
              className="px-3 py-2 rounded-lg hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5"
            >
              <Phone className="w-4 h-4 text-slate-400" />
              <span>{t('nav_contact')}</span>
            </button>
          </nav>

          {/* Right Header Actions: Search, Phone CTA, Language Switcher & Cart */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Quick Search on Desktop */}
            <div className="relative hidden xl:block w-40 2xl:w-48">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('search_placeholder')}
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-full pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-400 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            </div>

            {/* Direct Phone / IT Support CTA - Fits in one single line */}
            <a
              href="tel:+3725652062"
              className="inline-flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold px-3 py-1.5 rounded-full text-xs transition shadow-md shadow-cyan-500/20 active:scale-95 whitespace-nowrap shrink-0"
              title="IT kiirabi ja nõustamine"
            >
              <Headphones className="w-3.5 h-3.5 text-slate-950 shrink-0" />
              <span className="whitespace-nowrap font-bold">+372 5652 062</span>
            </a>

            {/* Language Selector with Flags (ET / EN) right before the Cart */}
            <div className="flex items-center bg-slate-900/90 border border-slate-700/80 rounded-full p-0.5 text-xs shrink-0 shadow-inner">
              <button
                type="button"
                onClick={() => setLang('et')}
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold transition-all ${
                  lang === 'et'
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Eesti keel"
              >
                <span className="text-[13px] leading-none">🇪🇪</span>
                <span className="text-[11px] font-extrabold">ET</span>
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold transition-all ${
                  lang === 'en'
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="English"
              >
                <span className="text-[13px] leading-none">🇬🇧</span>
                <span className="text-[11px] font-extrabold">EN</span>
              </button>
            </div>

            {/* IT Services Button */}
            <button
              onClick={() => onOpenServicesModal?.()}
              className="relative bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 hover:text-cyan-100 rounded-full px-3 sm:px-3.5 py-1.5 text-xs font-semibold transition border border-cyan-500/30 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap shrink-0"
              title="IT Services"
            >
              <Wrench className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">IT Services</span>
            </button>

            <button
              onClick={() => scrollTo('arikliendile')}
              className="hidden lg:flex items-center gap-1.5 whitespace-nowrap rounded-full border border-sky-400/40 bg-sky-400/10 px-3 py-1.5 text-xs font-semibold text-sky-200 transition hover:bg-sky-400/20 hover:text-white"
            >
              <Sparkles className="h-4 w-4 shrink-0" />
              <span>Software solutions</span>
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-sky-200 bg-sky-300 px-3 py-1.5 text-xs font-semibold text-slate-950 transition hover:bg-sky-200 sm:gap-2 sm:px-3.5"
              title="Ava ostukorv"
            >
              <ShoppingBag className="w-4 h-4 shrink-0 text-slate-950" />
              <span className="hidden sm:inline">{t('nav_cart')}</span>
              {cartCount > 0 && (
                <span className="bg-cyan-500 text-slate-950 text-[11px] font-bold px-1.5 py-0.2 rounded-full min-w-[18px] text-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 transition shrink-0"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-slate-800 space-y-2 animate-in fade-in slide-in-from-top-2">
            {/* Mobile Search */}
            <div className="relative mb-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('search_placeholder')}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 outline-none focus:border-cyan-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-medium">
              <button
                onClick={() => scrollTo('teenused')}
                className="flex items-center gap-2 p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-800/40 text-cyan-300 hover:bg-cyan-900/50"
              >
                <Wrench className="w-4 h-4 text-cyan-400" />
                <span>{t('nav_services')}</span>
              </button>

              <button
                onClick={() => scrollTo('arikliendile')}
                className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 hover:bg-slate-800"
              >
                <Briefcase className="w-4 h-4 text-slate-400" />
                <span>{t('nav_business')}</span>
              </button>

              <button
                onClick={() => scrollTo('arikliendile')}
                className="flex items-center gap-2 p-2.5 rounded-lg bg-sky-950/40 border border-sky-800/40 text-sky-200 hover:bg-sky-900/50"
              >
                <Sparkles className="w-4 h-4 text-sky-300" />
                <span>Software solutions</span>
              </button>

              <button
                onClick={() => scrollTo('pood')}
                className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 hover:bg-slate-800"
              >
                <ShoppingBag className="w-4 h-4 text-slate-400" />
                <span>{t('nav_shop')}</span>
              </button>

              <button
                onClick={() => scrollTo('hinnakiri')}
                className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 hover:bg-slate-800"
              >
                <Receipt className="w-4 h-4 text-slate-400" />
                <span>{t('nav_pricing')}</span>
              </button>

              <button
                onClick={() => scrollTo('meist')}
                className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 hover:bg-slate-800"
              >
                <Info className="w-4 h-4 text-slate-400" />
                <span>{t('nav_about')}</span>
              </button>

              <button
                onClick={() => scrollTo('kontakt')}
                className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 hover:bg-slate-800"
              >
                <Phone className="w-4 h-4 text-slate-400" />
                <span>{t('nav_contact')}</span>
              </button>
            </div>

            <div className="pt-2 flex items-center justify-between gap-2">
              <a
                href="tel:+3725652062"
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold py-2 rounded-lg text-xs text-center flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>+372 5652 062</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
