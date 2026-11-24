'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useThemePalette } from '../context/ThemePaletteContext';
import {
  Wrench,
  ShoppingBag,
  Briefcase,
  Info,
  Phone,
  Menu,
  X,
  Receipt,
  Headphones,
  BookOpen,
  Newspaper,
  FileText,
  HelpCircle,
  Lightbulb,
  MapPin,
  Clock,
} from 'lucide-react';

export function Header() {
  const { cartCount, setIsCartOpen } = useCart();
  const { lang, setLang, t } = useLanguage();
  const { palette } = useThemePalette();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    window.requestAnimationFrame(() => {
      const element = document.getElementById(id);
      if (!element) return;
      const headerHeight = document.querySelector('header')?.getBoundingClientRect().height ?? 0;
      const top = window.scrollY + element.getBoundingClientRect().top - headerHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  };

  return (
    <header
      className="sticky top-0 z-50 shadow-md relative transition-all border-b border-[#5c4720]/80"
      style={{ backgroundColor: palette.header || '#6F5627', color: '#F2D6C5' }}
    >
      {/* ============================================================== */}
      {/* ROW 1: Logo, Primary Navigation & Fast Actions (Kitsas riba)   */}
      {/* ============================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-1 relative z-10">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo - Uus kitsas formaat */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 group focus:outline-none shrink-0"
            title="Canman IT-teenused ja arvutipood"
          >
            <Image
              src="/images/logo_canman_värvi.jpg"
              alt="Canman IT-teenused ja arvutid"
              width={500}
              height={205}
              priority
              className="h-8 sm:h-9 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
            />
          </a>

          {/* Row 1: Primary Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 text-[13px] font-semibold text-[#F2D6C5]">
            <button
              onClick={() => scrollTo('pood')}
              className="px-2.5 py-1 rounded-md hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5 text-[#d99b26]"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#d99b26]" />
              <span>{t('nav_shop')}</span>
            </button>

            <button
              onClick={() => scrollTo('teenused')}
              className="px-2.5 py-1 rounded-md hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5"
            >
              <Wrench className="w-3.5 h-3.5 text-[#F2D6C5]/80" />
              <span>{t('nav_services')}</span>
            </button>

            <button
              onClick={() => scrollTo('arikliendile')}
              className="px-2.5 py-1 rounded-md hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5"
            >
              <Briefcase className="w-3.5 h-3.5 text-[#F2D6C5]/80" />
              <span>{t('nav_business')}</span>
            </button>

            <button
              onClick={() => scrollTo('hinnakiri')}
              className="px-2.5 py-1 rounded-md hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5"
            >
              <Receipt className="w-3.5 h-3.5 text-[#F2D6C5]/80" />
              <span>{t('nav_pricing')}</span>
            </button>

            <button
              onClick={() => scrollTo('meist')}
              className="px-2.5 py-1 rounded-md hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5"
            >
              <Info className="w-3.5 h-3.5 text-[#F2D6C5]/80" />
              <span>{t('nav_about')}</span>
            </button>

            <button
              onClick={() => scrollTo('help-request')}
              className="px-2.5 py-1 rounded-md hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5 text-[#F2D6C5]/80" />
              <span>{t('nav_contact')}</span>
            </button>
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Ostukorv — Elav sinepikollane aktsent */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-[#d99b26] hover:bg-[#bf8319] px-3 py-1 text-xs font-bold text-slate-950 transition shadow-sm active:scale-95"
              title="Ava ostukorv"
            >
              <ShoppingBag className="w-3.5 h-3.5 shrink-0 text-slate-950" />
              <span className="hidden sm:inline">{t('nav_cart')}</span>
              {cartCount > 0 && (
                <span className="bg-slate-950 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full min-w-[16px] text-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Direct Phone / IT Support CTA */}
            <a
              href="tel:+3725652062"
              className="hidden sm:inline-flex items-center gap-1.5 bg-[#87682f] hover:bg-[#9a7736] text-[#F2D6C5] font-bold px-3 py-1 rounded-full text-xs transition border border-[#d99b26]/40 active:scale-95 whitespace-nowrap shrink-0 shadow-sm"
              title="IT kiirabi ja nõustamine"
            >
              <Headphones className="w-3.5 h-3.5 text-[#d99b26] shrink-0" />
              <span className="whitespace-nowrap font-bold">+372 5652 062</span>
            </a>

            {/* Language Selector */}
            <div className="flex items-center gap-0.5 rounded-full border border-[#87682f]/60 bg-[#5c4720]/70 p-0.5 text-xs shrink-0 shadow-inner">
              <button
                type="button"
                onClick={() => setLang('et')}
                className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-bold transition-all ${
                  lang === 'et'
                    ? 'bg-[#F2D6C5] text-[#4a391a] shadow-sm'
                    : 'text-[#F2D6C5]/70 hover:text-white'
                }`}
                title="Eesti keel"
              >
                <svg aria-hidden="true" viewBox="0 0 18 12" className="h-2.5 w-3.5 overflow-hidden rounded-xs">
                  <path fill="#4891D9" d="M0 0h18v4H0z" />
                  <path fill="#111" d="M0 4h18v4H0z" />
                  <path fill="#FFF" d="M0 8h18v4H0z" />
                </svg>
                <span className="hidden sm:inline">ET</span>
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-bold transition-all ${
                  lang === 'en'
                    ? 'bg-[#F2D6C5] text-[#4a391a] shadow-sm'
                    : 'text-[#F2D6C5]/70 hover:text-white'
                }`}
                title="English"
              >
                <svg aria-hidden="true" viewBox="0 0 60 30" className="h-2.5 w-4 overflow-hidden rounded-xs">
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
              className="lg:hidden p-1.5 rounded-lg bg-[#5c4720] text-[#F2D6C5] hover:text-white hover:bg-[#87682f] transition shrink-0"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* ROW 2: SEO, Knowledge & Content Sub-menu (Teine rida)          */}
      {/* ============================================================== */}
      <div className="border-t border-[#5c4720] bg-[#5c4720]/80 py-1 text-xs text-[#F2D6C5]/90 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 lg:gap-5 flex-wrap">
            <button
              onClick={() => scrollTo('arvutiopetus')}
              className="hover:text-white hover:underline flex items-center gap-1 transition"
            >
              <BookOpen className="w-3 h-3 text-[#d99b26]" />
              <span className="font-medium">Arvutiõpetus & Nipid</span>
            </button>

            <button
              onClick={() => scrollTo('uudised')}
              className="hover:text-white hover:underline flex items-center gap-1 transition"
            >
              <Newspaper className="w-3 h-3 text-[#d99b26]" />
              <span className="font-medium">Arvutiuudised</span>
            </button>

            <button
              onClick={() => scrollTo('blogi')}
              className="hover:text-white hover:underline flex items-center gap-1 transition"
            >
              <FileText className="w-3 h-3 text-[#d99b26]" />
              <span className="font-medium">IT Blogi</span>
            </button>

            <button
              onClick={() => scrollTo('ostujuhend')}
              className="hover:text-white hover:underline flex items-center gap-1 transition"
            >
              <Lightbulb className="w-3 h-3 text-[#d99b26]" />
              <span className="font-medium">Ostujuhendid</span>
            </button>

            <button
              onClick={() => scrollTo('kkk')}
              className="hover:text-white hover:underline flex items-center gap-1 transition"
            >
              <HelpCircle className="w-3 h-3 text-[#d99b26]" />
              <span className="font-medium">KKK</span>
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-3 text-[11px] text-[#F2D6C5]/75">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#d99b26]" />
              <span>Lille 14-4, Tallinn</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#d99b26]" />
              <span>E–R 09:00–18:00</span>
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden p-3 border-t border-[#5c4720] bg-[#6F5627] space-y-2 animate-in fade-in slide-in-from-top-2 text-xs">
          <div className="grid grid-cols-2 gap-2 font-medium">
            <button
              onClick={() => scrollTo('pood')}
              className="flex items-center gap-2 p-2 rounded-lg bg-[#5c4720] border border-[#87682f]/40 text-[#d99b26] hover:bg-[#87682f]"
            >
              <ShoppingBag className="w-4 h-4 text-[#d99b26]" />
              <span>{t('nav_shop')}</span>
            </button>

            <button
              onClick={() => scrollTo('teenused')}
              className="flex items-center gap-2 p-2 rounded-lg bg-[#5c4720] border border-[#87682f]/40 text-[#F2D6C5] hover:bg-[#87682f]"
            >
              <Wrench className="w-4 h-4 text-[#F2D6C5]/80" />
              <span>{t('nav_services')}</span>
            </button>

            <button
              onClick={() => scrollTo('arikliendile')}
              className="flex items-center gap-2 p-2 rounded-lg bg-[#5c4720] border border-[#87682f]/40 text-[#F2D6C5] hover:bg-[#87682f]"
            >
              <Briefcase className="w-4 h-4 text-[#F2D6C5]/80" />
              <span>{t('nav_business')}</span>
            </button>

            <button
              onClick={() => scrollTo('hinnakiri')}
              className="flex items-center gap-2 p-2 rounded-lg bg-[#5c4720] border border-[#87682f]/40 text-[#F2D6C5] hover:bg-[#87682f]"
            >
              <Receipt className="w-4 h-4 text-[#F2D6C5]/80" />
              <span>{t('nav_pricing')}</span>
            </button>

            <button
              onClick={() => scrollTo('meist')}
              className="flex items-center gap-2 p-2 rounded-lg bg-[#5c4720] border border-[#87682f]/40 text-[#F2D6C5] hover:bg-[#87682f]"
            >
              <Info className="w-4 h-4 text-[#F2D6C5]/80" />
              <span>{t('nav_about')}</span>
            </button>

            <button
              onClick={() => scrollTo('help-request')}
              className="flex items-center gap-2 p-2 rounded-lg bg-[#5c4720] border border-[#87682f]/40 text-[#F2D6C5] hover:bg-[#87682f]"
            >
              <Phone className="w-4 h-4 text-[#F2D6C5]/80" />
              <span>{t('nav_contact')}</span>
            </button>
          </div>

          <div className="pt-2 border-t border-[#5c4720]/80">
            <p className="text-[11px] font-bold text-[#d99b26] mb-1.5">SEO & Teemad:</p>
            <div className="grid grid-cols-2 gap-1.5 text-[11px] text-[#F2D6C5]/90">
              <button onClick={() => scrollTo('arvutiopetus')} className="text-left py-1 hover:underline">📚 Arvutiõpetus & Nipid</button>
              <button onClick={() => scrollTo('uudised')} className="text-left py-1 hover:underline">📰 Arvutiuudised</button>
              <button onClick={() => scrollTo('blogi')} className="text-left py-1 hover:underline">✍️ IT Blogi</button>
              <button onClick={() => scrollTo('ostujuhend')} className="text-left py-1 hover:underline">💡 Ostujuhendid</button>
              <button onClick={() => scrollTo('kkk')} className="text-left py-1 hover:underline">❓ KKK</button>
            </div>
          </div>

          <div className="pt-2">
            <a
              href="tel:+3725652062"
              className="w-full bg-[#d99b26] hover:bg-[#bf8319] text-slate-950 font-bold py-2 rounded-lg text-xs text-center flex items-center justify-center gap-1.5 whitespace-nowrap"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Helista: +372 5652 062</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
