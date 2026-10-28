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
  Menu,
  X,
  Sparkles,
  Bot,
  Receipt,
  Headphones,
} from 'lucide-react';

export function Header() {
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
                <span className="hidden text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 sm:flex items-center gap-1">
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

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
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

            {/* Direct Phone / IT Support CTA */}
            <a
              href="tel:+3725652062"
              className="hidden sm:inline-flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold px-3 py-1.5 rounded-full text-xs transition shadow-md shadow-cyan-500/20 active:scale-95 whitespace-nowrap shrink-0"
              title="IT kiirabi ja nõustamine"
            >
              <Headphones className="w-3.5 h-3.5 text-slate-950 shrink-0" />
              <span className="whitespace-nowrap font-bold">+372 5652 062</span>
            </a>

            {/* Language Selector */}
            <div className="flex items-center gap-0.5 rounded-full border border-slate-700/80 bg-slate-900/90 p-0.5 text-xs shrink-0 shadow-inner sm:gap-1 sm:p-1">
              <button
                type="button"
                onClick={() => setLang('et')}
                className={`flex items-center gap-1 px-1.5 py-1.5 rounded-full text-xs font-bold transition-all sm:gap-1.5 sm:px-2.5 ${
                  lang === 'et'
                    ? 'bg-white text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Eesti keel"
              >
                <svg aria-hidden="true" viewBox="0 0 18 12" className="h-3 w-[18px] overflow-hidden rounded-sm">
                  <path fill="#4891D9" d="M0 0h18v4H0z" />
                  <path fill="#111" d="M0 4h18v4H0z" />
                  <path fill="#FFF" d="M0 8h18v4H0z" />
                </svg>
                <span className="hidden sm:inline">ET</span>
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`flex items-center gap-1 px-1.5 py-1.5 rounded-full text-xs font-bold transition-all sm:gap-1.5 sm:px-2.5 ${
                  lang === 'en'
                    ? 'bg-white text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="English"
              >
                <svg aria-hidden="true" viewBox="0 0 60 30" className="h-3 w-5 overflow-hidden rounded-sm">
                  <clipPath id="uk-flag-clip"><path d="M0 0h60v30H0z" /></clipPath>
                  <g clipPath="url(#uk-flag-clip)">
                    <path fill="#012169" d="M0 0h60v30H0z" />
                    <path stroke="#FFF" strokeWidth="6" d="m0 0 60 30M60 0 0 30" />
                    <path stroke="#C8102E" strokeWidth="2" d="m0 0 60 30M60 0 0 30" />
                    <path stroke="#FFF" strokeWidth="10" d="M30 0v30M0 15h60" />
                    <path stroke="#C8102E" strokeWidth="6" d="M30 0v30M0 15h60" />
                  </g>
                </svg>
                <span className="hidden sm:inline">EN</span>
              </button>
            </div>

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
