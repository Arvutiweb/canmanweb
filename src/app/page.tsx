'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Header } from '../components/Header';
import { CategorySidebar } from '../components/CategorySidebar';
import { FiltersBar } from '../components/FiltersBar';
import ProductGrid from '../components/ProductGrid';
import { ProductModal } from '../components/ProductModal';
import { CartDrawer } from '../components/CartDrawer';
import { CheckoutModal } from '../components/CheckoutModal';
import { InvoiceView } from '../components/InvoiceView';
import { ServicesModal } from '../components/ServicesModal';
import { Footer } from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';
import { useThemePalette } from '../context/ThemePaletteContext';
import { allProducts as PRODUCTS } from '../data/productCatalog';
import { matchesProductFilter, normalizeProductCondition } from '../lib/productFilters';
import { getMainCategoryName } from '../lib/productCategories';
import { Product, Condition, OrderDetails } from '../types';
import {
  Wrench,
  Truck,
  MapPin,
  ChevronRight,
  ShieldCheck,
  Server,
  Cpu,
  Laptop,
  CheckCircle2,
  Phone,
  Mail,
  Clock,
  Sparkles,
  Bot,
  Network,
  HardDrive,
  Briefcase,
  ArrowRight,
  Headphones,
  Check,
  Zap,
  ShoppingBag,
  ShoppingCart,
  ExternalLink,
  Search,
  Settings,
  Code2,
  Database,
  Calculator,
} from 'lucide-react';

const safeLower = (v: any) => String(v || '').toLowerCase();
const safeStr = (v: any) => String(v || '');
const local = (et: string, en: string, lang: string) => lang === 'en' ? en : et;
const DEFAULT_CATEGORY_STORAGE_KEY = 'canman_default_home_category';
const MAIN_CATEGORIES = Array.from(new Set((PRODUCTS as any[]).map(getMainCategoryName)));

type NavigatorWithBrave = Navigator & {
  brave?: {
    isBrave?: () => Promise<boolean>;
  };
};

export default function Home() {
  const { t, lang } = useLanguage();
  const { palette } = useThemePalette();
  const [selectedL1, setSelectedL1] = useState<string | null>(null);
  const [selectedL2, setSelectedL2] = useState<string | null>(null);
  const [selectedL3, setSelectedL3] = useState<string | null>(null);
  const [defaultCategory, setDefaultCategory] = useState<string | null>(MAIN_CATEGORIES[0] || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [conditionFilter, setConditionFilter] = useState<'all' | Condition>('all');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(0);
  const [sortBy, setSortBy] = useState('popular');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<OrderDetails | null>(null);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  // Quick IT Service request state for contact section
  const [serviceFormSubmitted, setServiceFormSubmitted] = useState(false);
  const [serviceName, setServiceName] = useState('');
  const [servicePhone, setServicePhone] = useState('+372 ');
  const [serviceIssue, setServiceIssue] = useState('');
  const [serviceFormError, setServiceFormError] = useState('');
  const [isSubmittingServiceRequest, setIsSubmittingServiceRequest] = useState(false);
  const [serviceAttachment, setServiceAttachment] = useState<File | null>(null);
  const serviceAttachmentInput = useRef<HTMLInputElement>(null);
  const [serviceLocation, setServiceLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);
  const [serviceLocationMessage, setServiceLocationMessage] = useState('');
  const [processorFilter, setProcessorFilter] = useState('');
  const [memoryFilter, setMemoryFilter] = useState('');
  const [diskFilter, setDiskFilter] = useState('');
  const [operatingSystemFilter, setOperatingSystemFilter] = useState('');

  useEffect(() => {
    try {
      const savedCategory = localStorage.getItem(DEFAULT_CATEGORY_STORAGE_KEY);
      if (savedCategory && MAIN_CATEGORIES.includes(savedCategory)) {
        setDefaultCategory(savedCategory);
      } else if (MAIN_CATEGORIES[0]) {
        localStorage.setItem(DEFAULT_CATEGORY_STORAGE_KEY, MAIN_CATEGORIES[0]);
      }
    } catch {
      // The in-memory default remains available when storage is disabled.
    }
  }, []);

  const handleSetDefaultCategory = (category: string) => {
    setDefaultCategory(category);
    try {
      localStorage.setItem(DEFAULT_CATEGORY_STORAGE_KEY, category);
    } catch {
      // The selection still applies until the page is reloaded.
    }
  };

  const handleSelectCategory = (l1: string | null, l2: string | null, l3: string | null) => {
    setSelectedL1(l1);
    setSelectedL2(l2);
    setSelectedL3(l3);
  };

  const handleResetFilters = () => {
    setSelectedL1(null);
    setSelectedL2(null);
    setSelectedL3(null);
    setSearchQuery('');
    setConditionFilter('all');
    setSelectedBrand('');
    setMinPrice(0);
    setMaxPrice(0);
    setSortBy('popular');
    setProcessorFilter('');
    setMemoryFilter('');
    setDiskFilter('');
    setOperatingSystemFilter('');
  };

  const availableBrands = useMemo(() => {
    const brandsSet = new Set<string>();
    (PRODUCTS as any[]).forEach((p: any) => {
      if (p.brand) brandsSet.add(String(p.brand));
    });
    return Array.from(brandsSet).sort();
  }, []);

  const filteredProducts = useMemo(() => {
    return (PRODUCTS as any[]).filter((p: any) => {
      if (searchQuery.trim()) {
        const query = safeLower(searchQuery);
        const matchesTitle = safeLower(p.title || p.name).includes(query);
        const matchesBrand = safeLower(p.brand).includes(query);
        const matchesSpecs = safeLower(p.shortSpec || p.shortDescription || p.description).includes(query);
        const matchesCat = safeLower(p.categoryL1 || p.topCategory || p.category).includes(query)
          || safeLower(p.categoryL2 || p.subCategory).includes(query)
          || safeLower(p.categoryL3 || p.sub2Category || p.categoryPath?.[2]).includes(query);
        if (!matchesTitle && !matchesBrand && !matchesSpecs && !matchesCat) return false;
      }
      if (selectedL1) {
        const sel = safeLower(selectedL1);
        const pL1 = safeLower(p.categoryL1 || p.topCategory || p.category);
        if (sel.includes('desktop kasutatud')) {
          if (!pL1.startsWith('desktop kasutatud')) return false;
        } else {
          if (pL1 !== sel) return false;
        }
      }
      if (selectedL2) {
        const sel = safeLower(selectedL2);
        const pL1 = safeLower(p.categoryL1 || p.topCategory || p.category);
        const pL2 = safeLower(p.categoryL2 || p.subCategory);
        if (!pL1.includes(sel) && !pL2.includes(sel)) return false;
      }
      const productL3 = p.categoryL3 || p.sub2Category || p.categoryPath?.[2];
      if (selectedL3 && safeLower(productL3) !== safeLower(selectedL3)) return false;
      if (conditionFilter !== 'all' && normalizeProductCondition(p.condition) !== conditionFilter) return false;
      if (selectedBrand && String(p.brand) !== selectedBrand) return false;
      if (minPrice > 0 && Number(p.price) < minPrice) return false;
      if (maxPrice > 0 && Number(p.price) > maxPrice) return false;
      if (!matchesProductFilter(p, 'cpu', processorFilter)) return false;
      if (!matchesProductFilter(p, 'ram', memoryFilter)) return false;
      if (!matchesProductFilter(p, 'storage', diskFilter)) return false;
      if (!matchesProductFilter(p, 'os', operatingSystemFilter)) return false;
      return true;
    }).sort((a: any, b: any) => {
      if (sortBy === 'price-asc') return Number(a.price) - Number(b.price);
      if (sortBy === 'price-desc') return Number(b.price) - Number(a.price);
      if (sortBy === 'name-asc') return safeStr(a.title || a.name).localeCompare(safeStr(b.title || b.name));
      if (sortBy === 'popular') return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
      return 0;
    });
  }, [searchQuery, selectedL1, selectedL2, selectedL3, conditionFilter, selectedBrand, minPrice, maxPrice, sortBy, processorFilter, memoryFilter, diskFilter, operatingSystemFilter]);

  const displayedProducts = useMemo(() => {
    const categoryFilteredProducts = !selectedL1 && !selectedL2 && !selectedL3 && !searchQuery.trim() && defaultCategory
      ? filteredProducts.filter((product: any) => getMainCategoryName(product) === defaultCategory)
      : filteredProducts;
    return categoryFilteredProducts;
  }, [filteredProducts, selectedL1, selectedL2, selectedL3, searchQuery, defaultCategory]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleServiceSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServiceFormError('');

    if (serviceAttachment && serviceAttachment.size > 3 * 1024 * 1024) {
      setServiceFormError(t('help_attachment_error'));
      return;
    }

    setIsSubmittingServiceRequest(true);

    try {
      const formData = new FormData();
      formData.set('name', serviceName.trim());
      formData.set('phone', servicePhone.trim());
      formData.set('issue', serviceIssue.trim());
      const brave = (navigator as NavigatorWithBrave).brave;
      if (brave?.isBrave) {
        try {
          if (await brave.isBrave()) formData.set('browser', 'Brave');
        } catch (error) {
          console.warn('Unable to detect Brave; browser identification will use the user-agent.', error);
        }
      }
      if (serviceAttachment) formData.set('attachment', serviceAttachment);
      if (serviceLocation) {
        formData.set('latitude', String(serviceLocation.latitude));
        formData.set('longitude', String(serviceLocation.longitude));
      }

      const response = await fetch('/api/service-request', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        setServiceFormError(t('help_send_error'));
        return;
      }

      setServiceFormSubmitted(true);
    } catch {
      setServiceFormError(t('help_send_error'));
    } finally {
      setIsSubmittingServiceRequest(false);
    }
  };

  const handleShareLocation = () => {
    setServiceLocationMessage('');
    if (!navigator.geolocation) {
      setServiceLocationMessage(t('help_location_unavailable'));
      return;
    }

    setIsRequestingLocation(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setServiceLocation({ latitude: coords.latitude, longitude: coords.longitude });
        setServiceLocationMessage(t('help_location_shared'));
        setIsRequestingLocation(false);
      },
      () => {
        setServiceLocation(null);
        setServiceLocationMessage(t('help_location_denied'));
        setIsRequestingLocation(false);
      },
      { enableHighAccuracy: false, maximumAge: 60_000, timeout: 10_000 },
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#ebf5f6] text-slate-900 selection:bg-cyan-500 selection:text-white">
      {/* Sticky Header with IT/AI Subtle Background & Full Navigation */}
      <Header />

      {/* ============================================================== */}
      {/* HERO SECTION: PRIMARY FOCUS ON IT SERVICES & TECH EXPERTISE */}
      {/* ============================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-[#0e274e] text-white pt-10 pb-16 lg:py-20 rounded-b-[36px] sm:rounded-b-[48px] lg:rounded-b-[56px] shadow-2xl border-b border-cyan-500/30">
        {/* Subtle Cyber Grid & Glowing Orbs Background */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hero-circuit" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#38bdf8" strokeWidth="0.5" />
                <circle cx="0" cy="0" r="1.5" fill="#38bdf8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-circuit)" />
          </svg>
        </div>
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>{t('hero_badge')}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-[38px] font-bold tracking-tight leading-snug text-sky-200/90">
                {t('hero_title_1')}<span className="text-sky-400 font-extrabold">{t('hero_title_highlight')}</span>{t('hero_title_2')}
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                {t('hero_subtitle')}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => scrollTo('teenused')}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold px-6 py-3 rounded-xl text-sm transition shadow-lg shadow-cyan-500/25 flex items-center gap-2 active:scale-95"
                >
                  <Wrench className="w-4 h-4" />
                  <span>{t('btn_services')}</span>
                </button>

                <button
                  onClick={() => scrollTo('software-solutions')}
                  className="bg-white/10 hover:bg-white/15 text-white border border-white/20 font-semibold px-5 py-3 rounded-xl text-sm transition flex items-center gap-2"
                >
                  <Bot className="w-4 h-4 text-cyan-300" />
                  <span>{t('btn_software_solutions')}</span>
                </button>

                <button
                  onClick={() => scrollTo('pood')}
                  className="bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 font-medium px-4 py-3 rounded-xl text-sm transition flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4 text-slate-400" />
                  <span>{t('btn_shop')}</span>
                </button>
              </div>

              {/* Fast Trust Indicators */}
              <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-slate-800 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400 shrink-0" />
                  <span>{t('trust_diag')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{t('trust_warranty')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{t('trust_location')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>{t('trust_callout')}</span>
                </div>
              </div>
            </div>

            {/* Right Fast IT-Help Request Card */}
            <div className="lg:col-span-5">
              <div
                className="border border-cyan-500/30 rounded-2xl p-6 shadow-2xl backdrop-blur-md relative overflow-hidden transition-colors duration-200"
                style={{ backgroundColor: palette.helpPanel }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                      <Headphones className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white">{t('help_title')}</h3>
                      <p className="text-[11px] text-slate-400">{t('help_subtitle')}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse">
                    {t('help_badge')}
                  </span>
                </div>

                {serviceFormSubmitted ? (
                  <div className="py-6 text-center space-y-3">
                    <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                    <h4 className="font-bold text-white text-base">{t('help_success_title')}</h4>
                    <p className="text-xs text-slate-300">
                      {t('help_success_body')}
                    </p>
                    <a
                      href="tel:+3725652062"
                      className="inline-flex items-center gap-2 text-cyan-400 font-bold text-xs hover:underline mt-2"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Helista: +372 5652 062</span>
                    </a>
                  </div>
                ) : (
                  <form onSubmit={handleServiceSubmit} className="space-y-3">
                    {serviceFormError && (
                      <p role="alert" className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-200">
                        {serviceFormError}
                      </p>
                    )}
                    <div>
                      <label className="block text-[11px] font-medium text-slate-300 mb-1">
                        {t('help_name_label')}
                      </label>
                      <input
                        type="text"
                        required
                        value={serviceName}
                        onChange={(e) => setServiceName(e.target.value)}
                        placeholder={t('help_name_placeholder')}
                        style={{ backgroundColor: palette.helpInputBackground, color: palette.helpInputText }}
                        className="help-form-field w-full border border-slate-700 rounded-lg px-3 py-2 text-xs outline-none focus:border-cyan-400 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-300 mb-1">
                        {t('help_phone_label')}
                      </label>
                      <input
                        type="tel"
                        required
                        value={servicePhone}
                        onChange={(e) => setServicePhone(e.target.value)}
                        placeholder="+372 5XX XXXXX"
                        style={{ backgroundColor: palette.helpInputBackground, color: palette.helpInputText }}
                        className="help-form-field w-full border border-slate-700 rounded-lg px-3 py-2 text-xs outline-none focus:border-cyan-400 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-300 mb-1">
                        {t('help_issue_label')}
                      </label>
                      <input
                        type="text"
                        value={serviceIssue}
                        onChange={(e) => setServiceIssue(e.target.value)}
                        placeholder={t('help_issue_placeholder')}
                        style={{ backgroundColor: palette.helpInputBackground, color: palette.helpInputText }}
                        className="help-form-field w-full border border-slate-700 rounded-lg px-3 py-2 text-xs outline-none focus:border-cyan-400 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-300 mb-1" htmlFor="service-attachment">
                        {t('help_attachment_label')}
                      </label>
                      <input
                        ref={serviceAttachmentInput}
                        id="service-attachment"
                        type="file"
                        accept="image/jpeg,image/png,image/webp,application/pdf"
                        onChange={(event) => {
                          const file = event.target.files?.[0] ?? null;
                          setServiceAttachment(file);
                          if (file && file.size > 3 * 1024 * 1024) {
                            setServiceFormError(t('help_attachment_error'));
                          } else {
                            setServiceFormError('');
                          }
                        }}
                        className="hidden"
                      />
                      <div className="flex min-w-0 items-center gap-3 text-xs">
                        <button
                          type="button"
                          onClick={() => serviceAttachmentInput.current?.click()}
                          className="shrink-0 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-2 text-xs font-bold text-slate-950 transition hover:from-cyan-400 hover:to-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                        >
                          {t('help_choose_file')}
                        </button>
                        <span className="min-w-0 truncate text-slate-300" aria-live="polite">
                          {serviceAttachment?.name || t('help_no_file_selected')}
                        </span>
                      </div>
                      <p className="mt-1 text-[10px] text-slate-500">{t('help_attachment_hint')}</p>
                    </div>

                    <div className="space-y-1">
                      <button
                        type="button"
                        onClick={handleShareLocation}
                        disabled={isRequestingLocation}
                        className="rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-2 text-[11px] font-bold text-slate-950 shadow-md transition hover:from-cyan-400 hover:to-blue-500 disabled:cursor-wait disabled:opacity-70"
                      >
                        {isRequestingLocation ? t('help_location_requesting') : t('help_location_button')}
                      </button>
                      {serviceLocationMessage && (
                        <p role="status" className="text-[10px] text-slate-400">{serviceLocationMessage}</p>
                      )}
                      <p className="text-[10px] leading-relaxed text-slate-500">{t('help_data_notice')}</p>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingServiceRequest}
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:cursor-wait disabled:opacity-70 text-slate-950 font-bold py-2.5 rounded-lg text-xs transition shadow-md flex items-center justify-center gap-2 mt-2"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>{isSubmittingServiceRequest ? t('help_sending') : t('help_submit')}</span>
                    </button>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2">
                      <span>{t('help_call_text')}</span>
                      <a href="tel:+3725652062" className="text-cyan-400 font-bold hover:underline flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        +372 5652 062
                      </a>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 1. IT SERVICES SECTION (#teenused): PRIMARY FOCUS */}
      {/* ============================================================== */}
      <section id="teenused" className="py-16 bg-[#f0f7f8] border-b border-teal-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#0e4da4] tracking-widest uppercase bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              {local('PÕHITEENUSED', 'CORE SERVICES', lang)}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
              {local('Kõik IT-teenused ja arvutiremont ühest kohast', 'All IT Services & Computer Repairs in One Place', lang)}
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              {local('Pakume kiiret ja professionaalset IT-tuge nii eraisikutele kui ka ettevõtetele. Tule Canman töökotta või telli tehnik kohale.', 'We provide fast, professional IT support for individuals and businesses. Visit the Canman workshop or book an on-site technician.', lang)}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Service 1: Arvutite & Sülearvutite Remont */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-blue-400 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#0e4da4] flex items-center justify-center mb-4 group-hover:bg-[#0e4da4] group-hover:text-white transition-colors">
                  <Laptop className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">{local('Arvutite & Sülearvutite Remont', 'Desktop & Laptop Repair', lang)}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {local('Riistvaraline diagnostika, ekraanide ja klaviatuuride vahetus, emaplaadi jootetööd, toitepesade remont ning vedelikukahjustuste likvideerimine.', 'Hardware diagnostics, screen and keyboard replacements, motherboard soldering, charging port repairs, and liquid damage repair.', lang)}
                </p>
                <ul className="text-xs text-slate-700 space-y-1.5 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{local('Diagnostika 15 € (remondil tasuta)', 'Diagnostics €15 (free with repair)', lang)}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{local('Enamik varuosi kohapeal laos olemas', 'Most spare parts in stock', lang)}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{local('Garantiiga teostus 24–48h', 'Repairs with warranty in 24–48 hours', lang)}</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => setIsServicesOpen(true)}
                className="w-full py-2.5 px-4 bg-white border border-slate-300 text-slate-800 rounded-xl text-xs font-semibold hover:bg-[#0e4da4] hover:text-white hover:border-[#0e4da4] transition-colors flex items-center justify-center gap-1.5"
              >
                <span>{local('Vaata hinnakirja & detaile', 'View prices & details', lang)}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Service 2: Äriklindi IT-Haldus (Outsourcing) */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-blue-400 transition-all flex flex-col justify-between group border-t-4 border-t-[#0e4da4]">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#0e4da4] flex items-center justify-center mb-4 group-hover:bg-[#0e4da4] group-hover:text-white transition-colors">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-lg text-slate-900">{local('Ärikliendi IT-haldus', 'Business IT Support', lang)}</h3>
                  <span className="text-[10px] font-bold bg-[#0e4da4] text-white px-2 py-0.5 rounded-full">B2B</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {local('Terviklik IT-osakonna asendusteenus väike- ja keskmistele ettevõtetele. Töökohtade hooldus, serverite monitooring, kasutajatugi ja riistvarahaldus.', 'Complete outsourced IT department for small and medium-sized businesses, including workstation maintenance, server monitoring, user support, and hardware management.', lang)}
                </p>
                <ul className="text-xs text-slate-700 space-y-1.5 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{local('Ennetav hooldus ja kiire kaughaldustugi', 'Preventive maintenance and fast remote support', lang)}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{local('Microsoft 365, e-post ja litsentsid', 'Microsoft 365, email, and licensing', lang)}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{local('Fikseeritud kuutasu ilma üllatusteta', 'Fixed monthly fee with no surprises', lang)}</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => scrollTo('arikliendile')}
                className="w-full py-2.5 px-4 bg-[#0e4da4] text-white rounded-xl text-xs font-semibold hover:bg-blue-800 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>{local('Tutvu äripakettidega', 'Explore business plans', lang)}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Service 3: Tehniku Väljakutse & Kohapealne Tugi */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-blue-400 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#0e4da4] flex items-center justify-center mb-4 group-hover:bg-[#0e4da4] group-hover:text-white transition-colors">
                  <Truck className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">{local('Tehniku väljakutse (Tallinn & Harjumaa)', 'On-site Technician (Tallinn & Harju County)', lang)}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {local('Kogenud IT-spetsialisti kohaletulek kontorisse või koju. Printerite, võrguseadmete, uute arvutite paigaldus ja tõrgete likvideerimine kohapeal.', 'An experienced IT specialist visits your home or office to set up printers, network equipment, and computers or troubleshoot issues on-site.', lang)}
                </p>
                <ul className="text-xs text-slate-700 space-y-1.5 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{local('Tunnitasu: 35 € / tund', 'Hourly rate: €35', lang)}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{local('Kohapealne võrgu ja printerite seadistus', 'On-site network and printer setup', lang)}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{local('Võimalus seade töökotta remonti toimetada', 'Workshop repairs also available', lang)}</span>
                  </li>
                </ul>
              </div>
              <a
                href="tel:+3725652062"
                className="w-full py-2.5 px-4 bg-white border border-slate-300 text-slate-800 rounded-xl text-xs font-semibold hover:bg-[#0e4da4] hover:text-white hover:border-[#0e4da4] transition-colors flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{local('Telli väljakutse: 5652 062', 'Book a visit: 5652 062', lang)}</span>
              </a>
            </div>

            {/* Service 4: Tolmupuhastus & Jahutushooldus */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-blue-400 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#0e4da4] flex items-center justify-center mb-4 group-hover:bg-[#0e4da4] group-hover:text-white transition-colors">
                  <Cpu className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">{local('Tolmust puhastus & termopasta', 'Dust Cleaning & Thermal Paste', lang)}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {local('Arvuti kuumeneb või ventilaator undab? Põhjalik tolmust puhastus ja tipptasemel termopasta (Arctic MX-4/MX-6) vahetus pikendab arvuti eluiga märgatavalt.', 'Is your computer overheating or noisy? A thorough clean and premium thermal paste replacement (Arctic MX-4/MX-6) can significantly extend its life.', lang)}
                </p>
                <ul className="text-xs text-slate-700 space-y-1.5 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{local('Lauaarvutid: 25 €', 'Desktop PCs: €25', lang)}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{local('Sülearvutid: 30 € – 40 €', 'Laptops: €30–€40', lang)}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{local('Vaiksem töö ja madalamad temperatuurid', 'Quieter operation and lower temperatures', lang)}</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => setIsServicesOpen(true)}
                className="w-full py-2.5 px-4 bg-white border border-slate-300 text-slate-800 rounded-xl text-xs font-semibold hover:bg-[#0e4da4] hover:text-white hover:border-[#0e4da4] transition-colors flex items-center justify-center gap-1.5"
              >
                <span>{local('Broneeri hooldus', 'Book maintenance', lang)}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Service 5: Andmete Taastamine & Varundus */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-blue-400 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#0e4da4] flex items-center justify-center mb-4 group-hover:bg-[#0e4da4] group-hover:text-white transition-colors">
                  <HardDrive className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">{local('Andmete taastamine & varundus', 'Data Recovery & Backup', lang)}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {local('Kustutatud failide, vigaste kõvaketaste (HDD), SSD ketaste ja mälukaartide andmete päästmine. Automaatsete pilvevarunduste seadistus ettevõtetele.', 'Recovery of deleted files and data from damaged HDDs, SSDs, and memory cards. Automated cloud backup setup for businesses.', lang)}
                </p>
                <ul className="text-xs text-slate-700 space-y-1.5 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{local('Andmete päästmine alates 30 €', 'Data recovery from €30', lang)}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{local('Andmete turvaline kloonimine uuele SSD-le', 'Secure data cloning to a new SSD', lang)}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{local('100% konfidentsiaalsus garanteeritud', '100% confidentiality guaranteed', lang)}</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => setIsServicesOpen(true)}
                className="w-full py-2.5 px-4 bg-white border border-slate-300 text-slate-800 rounded-xl text-xs font-semibold hover:bg-[#0e4da4] hover:text-white hover:border-[#0e4da4] transition-colors flex items-center justify-center gap-1.5"
              >
                <span>{local('Küsi andmete taastamist', 'Request data recovery', lang)}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Service 6: AI-Tööriistad & Töövoogude Automatiseerimine */}
            <div className="bg-gradient-to-br from-slate-900 to-[#0e3b7a] text-white border border-cyan-500/30 rounded-2xl p-6 hover:shadow-xl transition-all flex flex-col justify-between group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />
              <div>
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center mb-4">
                  <Bot className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-lg text-white">{local('AI & töövoogude automatiseerimine', 'AI & Workflow Automation', lang)}</h3>
                  <span className="text-[10px] font-bold bg-cyan-500 text-slate-950 px-2 py-0.5 rounded-full">{local('UUS', 'NEW', lang)}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {local('Aitame ettevõtetel integreerida kaasaegseid AI-tööriistu, Microsoft Copilot lahendusi ja automatiseerida rutiinseid andmetöötluse protsesse.', 'We help businesses adopt modern AI tools and Microsoft Copilot, and automate routine data processing.', lang)}
                </p>
                <ul className="text-xs text-slate-200 space-y-1.5 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{local('Kohalikud & pilvepõhised AI mudelid', 'Local & cloud-based AI models', lang)}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{local('Töövoogude automatiseerimine', 'Workflow automation', lang)}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{local('Praktiline koolitus ja konsultatsioon', 'Practical training and consulting', lang)}</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => scrollTo('kontakt')}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 rounded-xl text-xs font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5"
              >
                <span>{local('Küsi AI konsultatsiooni', 'Request an AI consultation', lang)}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SOFTWARE SOLUTIONS */}
      <section id="software-solutions" className="scroll-mt-24 border-b border-blue-900/10 bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#0e4da4]">
              {local('TARKVARALAHENDUSED', 'SOFTWARE SOLUTIONS', lang)}
            </span>
            <h2 className="mt-3 text-2xl font-extrabold text-slate-900 sm:text-3xl">
              {local('Tarkvara, veebilehed ja nutikas automatiseerimine', 'Software, websites, and practical automation', lang)}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {local(
                'Seadistame ja arendame töökindlaid lahendusi, mis ühendavad sinu arvuti, veebilehe ja igapäevased töövood.',
                'We configure and build reliable solutions that connect your computer, website, and everyday workflows.',
                lang,
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <article className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50 p-6 transition-all hover:border-blue-400 hover:shadow-lg">
              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-[#0e4da4] transition-colors group-hover:bg-[#0e4da4] group-hover:text-white">
                  <Settings className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-slate-900">{local('Windowsi seadistamine ja varundus', 'Windows setup and backup automation', lang)}</h3>
                <p className="mb-4 text-xs leading-relaxed text-slate-600">
                  {local(
                    'Seadistame Windowsi, kasutajakontod, programmid ja turvaseaded. Automatiseerime failide ja oluliste andmete varukoopiate tegemise.',
                    'We configure Windows, user accounts, applications, and security settings, and automate backups of files and important data.',
                    lang,
                  )}
                </p>
              </div>
              <button onClick={() => scrollTo('kontakt')} className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-800 transition-colors hover:border-[#0e4da4] hover:bg-[#0e4da4] hover:text-white">
                {local('Küsi pakkumist', 'Request a quote', lang)} <ChevronRight className="h-4 w-4" />
              </button>
            </article>

            <article className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50 p-6 transition-all hover:border-blue-400 hover:shadow-lg">
              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-[#0e4da4] transition-colors group-hover:bg-[#0e4da4] group-hover:text-white">
                  <Code2 className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-slate-900">{local('WordPressi haldamine ja arendamine', 'WordPress maintenance and development', lang)}</h3>
                <p className="mb-4 text-xs leading-relaxed text-slate-600">
                  {local(
                    'Hooldame ja arendame WordPressi kodulehti: uuendused, varukoopiad, turvalisus, veaparandused ja uued funktsioonid.',
                    'We maintain and develop WordPress websites, including updates, backups, security, bug fixes, and new features.',
                    lang,
                  )}
                </p>
              </div>
              <button onClick={() => scrollTo('kontakt')} className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-800 transition-colors hover:border-[#0e4da4] hover:bg-[#0e4da4] hover:text-white">
                {local('Küsi pakkumist', 'Request a quote', lang)} <ChevronRight className="h-4 w-4" />
              </button>
            </article>

            <article className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50 p-6 transition-all hover:border-blue-400 hover:shadow-lg">
              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-[#0e4da4] transition-colors group-hover:bg-[#0e4da4] group-hover:text-white">
                  <Database className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-slate-900">{local('WordPressi andmete automatiseerimine', 'WordPress data automation', lang)}</h3>
                <p className="mb-4 text-xs leading-relaxed text-slate-600">
                  {local(
                    'Automatiseerime WordPressi kodulehe andmete lisamist ja muutmist, et korduvad sisuhalduse ülesanded oleksid kiiremad ja täpsemad.',
                    'We automate adding and updating website data in WordPress, making repetitive content-management tasks faster and more accurate.',
                    lang,
                  )}
                </p>
              </div>
              <button onClick={() => scrollTo('kontakt')} className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-800 transition-colors hover:border-[#0e4da4] hover:bg-[#0e4da4] hover:text-white">
                {local('Küsi pakkumist', 'Request a quote', lang)} <ChevronRight className="h-4 w-4" />
              </button>
            </article>

            <article className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50 p-6 transition-all hover:border-blue-400 hover:shadow-lg">
              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-[#0e4da4] transition-colors group-hover:bg-[#0e4da4] group-hover:text-white">
                  <Code2 className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-slate-900">{local('Reacti ja Next.js kodulehed', 'React and Next.js websites', lang)}</h3>
                <p className="mb-4 text-xs leading-relaxed text-slate-600">
                  {local(
                    'Loome kiired ja tänapäevased Reacti ja Next.js veebilehed ning arendame olemasolevaid lahendusi edasi.',
                    'We build fast, modern websites with React and Next.js and continue developing existing solutions.',
                    lang,
                  )}
                </p>
              </div>
              <button onClick={() => scrollTo('kontakt')} className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-800 transition-colors hover:border-[#0e4da4] hover:bg-[#0e4da4] hover:text-white">
                {local('Küsi pakkumist', 'Request a quote', lang)} <ChevronRight className="h-4 w-4" />
              </button>
            </article>

            <article className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50 p-6 transition-all hover:border-blue-400 hover:shadow-lg">
              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-[#0e4da4] transition-colors group-hover:bg-[#0e4da4] group-hover:text-white">
                  <Calculator className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-slate-900">{local('Raamatupidamise ja kodulehe sidumine', 'Accounting and website integration', lang)}</h3>
                <p className="mb-4 text-xs leading-relaxed text-slate-600">
                  {local(
                    'Seome raamatupidamisprogrammi ja kodulehe andmed, et vähendada käsitsi sisestamist ning hoida info süsteemide vahel kooskõlas.',
                    'We connect accounting software with website data to reduce manual entry and keep information consistent across systems.',
                    lang,
                  )}
                </p>
              </div>
              <button onClick={() => scrollTo('kontakt')} className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-800 transition-colors hover:border-[#0e4da4] hover:bg-[#0e4da4] hover:text-white">
                {local('Küsi pakkumist', 'Request a quote', lang)} <ChevronRight className="h-4 w-4" />
              </button>
            </article>

            <article className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50 p-6 transition-all hover:border-blue-400 hover:shadow-lg">
              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-[#0e4da4] transition-colors group-hover:bg-[#0e4da4] group-hover:text-white">
                  <ShoppingCart className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-slate-900">{local('E-poe arendamine ja hooldus', 'E-commerce development and maintenance', lang)}</h3>
                <p className="mb-4 text-xs leading-relaxed text-slate-600">
                  {local(
                    'Arendame ja hooldame e-poode ning aitame toodete, tellimuste, maksete ja muude vajalike funktsioonide seadistamisega.',
                    'We develop and maintain online stores and help configure products, orders, payments, and other essential features.',
                    lang,
                  )}
                </p>
              </div>
              <button onClick={() => scrollTo('kontakt')} className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-800 transition-colors hover:border-[#0e4da4] hover:bg-[#0e4da4] hover:text-white">
                {local('Küsi pakkumist', 'Request a quote', lang)} <ChevronRight className="h-4 w-4" />
              </button>
            </article>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. ÄRIKLIENDILE SECTION (#arikliendile): IT-HALDUS ETTEVÕTETELE */}
      {/* ============================================================== */}
      <section id="arikliendile" className="py-16 bg-slate-900 text-white border-b border-slate-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold text-cyan-400 tracking-widest uppercase bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-800/60">
                {local('ÄRIKLIENDI LAHENDUSED', 'BUSINESS SOLUTIONS', lang)}
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                {local('Terve IT-osakonna tugi ilma palgatöötaja kuludeta', 'Full IT department support without the cost of an in-house hire', lang)}
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                {local('Canman Systems OÜ pakub väike- ja keskmise suurusega ettevõtetele lepingulist IT-täisteenust. Me tagame, et Sinu kontori arvutid, printerid, serverid ja võrk töötavad sujuvalt iga päev.', 'Canman Systems OÜ provides managed IT services for small and medium-sized businesses. We keep your office computers, printers, servers, and network running smoothly every day.', lang)}
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
                  <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-white">{local('Kiire reageerimisaeg (SLA)', 'Fast response times (SLA)', lang)}</h4>
                    <p className="text-xs text-slate-400">{local('Kaugabi algus 15 minuti jooksul, kriitiliste rikete korral tehnik kohal 1-2 tunniga.', 'Remote support starts within 15 minutes; for critical failures, a technician can be on-site within 1–2 hours.', lang)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
                  <Server className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-white">{local('Ennetav monitooring & turvalisus', 'Proactive monitoring & security', lang)}</h4>
                    <p className="text-xs text-slate-400">{local('Jälgime riistvara tervist, varunduste õnnestumist ja turvapaiku enne, kui rike tööd takistab.', 'We monitor hardware health, backup status, and security updates before problems disrupt your work.', lang)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
                  <ShoppingBag className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-white">{local('Arvutipargi soodne uuendamine', 'Cost-effective hardware upgrades', lang)}</h4>
                    <p className="text-xs text-slate-400">{local('Lepingulistele klientidele e-poe arvutid ja varuosad erihinnaga ning seadistatud kujul.', 'Contract customers receive special pricing on shop computers and parts, configured and ready to use.', lang)}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <a
                  href="tel:+3725652062"
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 py-3 rounded-xl text-xs transition shadow-lg shadow-cyan-500/20 flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>{local('Helista ja küsi pakkumist', 'Call us for a quote', lang)}</span>
                </a>
                <button
                  onClick={() => scrollTo('kontakt')}
                  className="bg-white/10 hover:bg-white/20 text-white px-5 py-3 rounded-xl text-xs font-semibold transition"
                >
                  {local('Saada hinnapäring', 'Request a quote', lang)}
                </button>
              </div>
            </div>

            {/* Right Comparison Box */}
            <div className="lg:col-span-6">
              <div className="bg-gradient-to-br from-slate-800/90 to-slate-900 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl">
                <h3 className="font-bold text-lg text-white mb-6 border-b border-slate-700 pb-3 flex items-center justify-between">
                  <span>{local('Mida Canman IT-haldus sisaldab?', 'What is included in Canman IT support?', lang)}</span>
                  <span className="text-xs text-cyan-400 font-semibold">{local('Täisteenus', 'Full service', lang)}</span>
                </h3>

                <div className="space-y-4 text-xs text-slate-300">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <span className="font-medium">{local('Töökoha kaughaldus ja kasutajatugi', 'Remote workstation management and user support', lang)}</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1"><Check className="w-4 h-4" /> {local('Sisaldub', 'Included', lang)}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <span className="font-medium">{local('Viirusetõrje & turvavärskenduste haldus', 'Antivirus and security update management', lang)}</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1"><Check className="w-4 h-4" /> {local('Sisaldub', 'Included', lang)}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <span className="font-medium">{local('Automaatne andmete pilvevarundus', 'Automated cloud backups', lang)}</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1"><Check className="w-4 h-4" /> {local('Sisaldub', 'Included', lang)}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <span className="font-medium">{local('Kontori võrgu, ruuterite ja WiFi optimeerimine', 'Office network, router, and Wi-Fi optimization', lang)}</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1"><Check className="w-4 h-4" /> {local('Sisaldub', 'Included', lang)}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <span className="font-medium">{local('Tehniku väljasõidud Tallinna piires', 'Technician visits in Tallinn', lang)}</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1"><Check className="w-4 h-4" /> {local('Prioriteetne', 'Priority', lang)}</span>
                  </div>
                  <div className="flex items-center justify-between pb-1">
                    <span className="font-medium">{local('Asendusseadmed remondi ajaks', 'Loan devices during repairs', lang)}</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1"><Check className="w-4 h-4" /> {local('Tasuta', 'Free', lang)}</span>
                  </div>
                </div>

                <div className="mt-8 bg-cyan-950/40 border border-cyan-800/50 rounded-xl p-4 text-center">
                  <p className="text-xs text-slate-300 mb-2">{local('Äripakettide kuutasu alates:', 'Business plans from:', lang)}</p>
                  <div className="text-3xl font-black text-cyan-400">15 € <span className="text-xs font-normal text-slate-400">{local('/ arvuti kuus', '/ computer per month', lang)}</span></div>
                  <p className="text-[11px] text-slate-400 mt-1">{local('Lõplik hind sõltub seadmete arvust ja reageerimisajast.', 'Final pricing depends on the number of devices and response time.', lang)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. HINNAKIRI SECTION (#hinnakiri): TRANSPARENT PRICE LIST */}
      {/* ============================================================== */}
      <section id="hinnakiri" className="py-16 bg-[#ebf5f6] border-b border-teal-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#0e4da4] tracking-widest uppercase bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              {local('LÄBIPAISTEV HINNASTUS', 'TRANSPARENT PRICING', lang)}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
              {local('Standardtööde ja IT-Abi Hinnakiri', 'Standard Service & IT Support Price List', lang)}
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              {local('Kõik hinnad on selged ja läbipaistvad. Enne remondi alustamist kooskõlastame alati maksumuse.', 'Our pricing is clear and transparent. We always confirm the cost before starting a repair.', lang)}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-slate-900 text-sm">{local('Arvuti diagnostika', 'Computer diagnostics', lang)}</h4>
                  <span className="font-extrabold text-[#0e4da4] text-base">15 €</span>
                </div>
                <p className="text-xs text-slate-500">{local('Rikke tuvastamine ja remondi eelarve. Remonditöö tellimisel on diagnostika tasuta!', 'Fault identification and repair estimate. Diagnostics are free when you order a repair!', lang)}</p>
              </div>
              <span className="text-[11px] text-emerald-600 font-medium mt-3">{local('Valmib: samal või järgmisel päeval', 'Ready: same or next day', lang)}</span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-slate-900 text-sm">{local('Windows / Linux paigaldus', 'Windows / Linux installation', lang)}</h4>
                  <span className="font-extrabold text-[#0e4da4] text-base">25 € – 50 €</span>
                </div>
                <p className="text-xs text-slate-500">{local('Uus puhas operatsioonisüsteem, draiverid, viirusetõrje ja vajalikud baasprogrammid.', 'Fresh operating system installation with drivers, antivirus, and essential software.', lang)}</p>
              </div>
              <span className="text-[11px] text-emerald-600 font-medium mt-3">{local('Valmib: 24h jooksul', 'Ready within 24 hours', lang)}</span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-slate-900 text-sm">{local('Tolmust puhastus + termopasta', 'Dust cleaning + thermal paste', lang)}</h4>
                  <span className="font-extrabold text-[#0e4da4] text-base">25 € – 40 €</span>
                </div>
                <p className="text-xs text-slate-500">{local('Jahutussüsteemi hooldus laua- ja sülearvutitele. Kõrgekvaliteetne termopasta.', 'Cooling system maintenance for desktops and laptops with high-quality thermal paste.', lang)}</p>
              </div>
              <span className="text-[11px] text-emerald-600 font-medium mt-3">{local('Valmib: 1 tööpäev', 'Ready in 1 business day', lang)}</span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-slate-900 text-sm">{local('Kiire SSD paigaldus', 'Quick SSD installation', lang)}</h4>
                  <span className="font-extrabold text-[#0e4da4] text-base">40 €</span>
                </div>
                <p className="text-xs text-slate-500">{local('Uue kiire SSD paigaldus ja vanade andmete ning süsteemi 1:1 kloonimine.', 'Install a fast new SSD and clone your existing data and system 1:1.', lang)}</p>
              </div>
              <span className="text-[11px] text-emerald-600 font-medium mt-3">{local('Arvuti muutub 5–10x kiiremaks', 'Make your computer 5–10x faster', lang)}</span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-slate-900 text-sm">{local('Tehniku väljasõit Tallinnas', 'On-site technician in Tallinn', lang)}</h4>
                  <span className="font-extrabold text-[#0e4da4] text-base">35 € / tund</span>
                </div>
                <p className="text-xs text-slate-500">{local('IT-spetsialisti visiit koju või kontorisse. Võrgu, ruuteri ja printerite häälestus.', 'An IT specialist visits your home or office to configure your network, router, and printers.', lang)}</p>
              </div>
              <span className="text-[11px] text-emerald-600 font-medium mt-3">{local('Tallinn ja lähivallad', 'Tallinn and nearby areas', lang)}</span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-slate-900 text-sm">{local('Andmete taastamine', 'Data recovery', lang)}</h4>
                  <span className="font-extrabold text-[#0e4da4] text-base">alates 30 €</span>
                </div>
                <p className="text-xs text-slate-500">{local('Kustutatud failide või rikkis kõvaketaste andmete päästmine laboris.', 'Lab recovery of deleted files or data from damaged hard drives.', lang)}</p>
              </div>
              <span className="text-[11px] text-emerald-600 font-medium mt-3">{local('Tasuta esmane hinnang', 'Free initial assessment', lang)}</span>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => setIsServicesOpen(true)}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#0e4da4] hover:underline"
            >
              <span>{local('Ava täielik hinnakiri ja garantiitingimused', 'View the full price list and warranty terms', lang)}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. E-POOD SECTION (#pood): HARDWARE, REFURBISHED PCS & PARTS */}
      {/* ============================================================== */}
      <section id="pood" className="min-h-[75vh] border-b border-teal-900/10 bg-[#edf6f7] py-10 sm:py-12">
        <main className="mx-auto w-full max-w-[1600px] px-4 sm:px-6">
          <div className="mb-6 flex flex-col gap-5 rounded-2xl bg-gradient-to-r from-[#0e4da4] to-[#0c3a7a] p-5 text-white shadow-lg sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <h2 className="flex shrink-0 flex-col leading-none">
              <span className="text-xs font-semibold tracking-[0.24em] text-sky-200 sm:text-sm">
                {t('shop_title')}
              </span>
              <span className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">{local('Pood', 'Shop', lang)}</span>
            </h2>
            <label className="relative block w-full sm:max-w-2xl sm:flex-1">
              <span className="sr-only">{t('search_placeholder')}</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={t('shop_search')}
                className="w-full rounded-xl border border-white/30 bg-white py-3.5 pl-12 pr-4 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:ring-4 focus:ring-sky-300/30 sm:py-4"
              />
            </label>
          </div>

          {/* Catalog Layout: Left Category Sidebar + Right Product Grid */}
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <div className="w-full lg:w-72 lg:shrink-0">
              <CategorySidebar
                selectedL1={selectedL1}
                selectedL2={selectedL2}
                selectedL3={selectedL3}
                onSelectCategory={handleSelectCategory}
                defaultCategory={defaultCategory}
                onSetDefaultCategory={handleSetDefaultCategory}
                products={PRODUCTS as any}
                minPrice={minPrice}
                maxPrice={maxPrice}
                setMinPrice={setMinPrice}
                setMaxPrice={setMaxPrice}
                processorFilter={processorFilter}
                setProcessorFilter={setProcessorFilter}
                memoryFilter={memoryFilter}
                setMemoryFilter={setMemoryFilter}
                diskFilter={diskFilter}
                setDiskFilter={setDiskFilter}
                operatingSystemFilter={operatingSystemFilter}
                setOperatingSystemFilter={setOperatingSystemFilter}
                conditionFilter={conditionFilter}
                setConditionFilter={setConditionFilter}
              />
            </div>
            <div className="flex-1 min-w-0 w-full overflow-hidden">
              <FiltersBar
                sortBy={sortBy}
                setSortBy={setSortBy}
                selectedBrand={selectedBrand}
                setSelectedBrand={setSelectedBrand}
                availableBrands={availableBrands}
                onReset={handleResetFilters}
              />
              <ProductGrid
                products={displayedProducts as any}
                onSelectProduct={(p: any) => setSelectedProduct(p)}
                onResetFilters={handleResetFilters}
                maxRows={6}
              />
            </div>
          </div>
        </main>
      </section>

      {/* ============================================================== */}
      {/* 5. ABOUT US SECTION (#meist): CANMAN OÜ & WORKSHOP */}
      {/* ============================================================== */}
      <section id="meist" className="py-16 bg-[#ebf5f6] border-b border-teal-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold text-[#0e4da4] tracking-widest uppercase bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                {local('ETTEVÕTTEST', 'ABOUT US', lang)}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {local('Canman Systems OÜ — 20+ aastat IT-kogemust Tallinnas', 'Canman Systems OÜ — 20+ Years of IT Experience in Tallinn', lang)}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                {local('Asutatud eesmärgiga pakkuda klientidele ausat, kiiret ja tehniliselt kompromissitut IT-abi. Meie töökoda Tallinnas Kristiine linnaosas (Lille 14) on spetsialiseerunud arvutite, sülearvutite ja serverite komponenttasandi remondile ja hooldusele.', 'Founded to provide customers with honest, fast, and technically uncompromising IT support. Our workshop in the Kristiine district of Tallinn (Lille 14) specializes in component-level repairs and maintenance for computers, laptops, and servers.', lang)}
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                {local('Lisaks IT-teenustele kontrollime ja taastame äriklassi arvuteid (Dell Latitude & OptiPlex, Lenovo ThinkPad & ThinkCentre, HP EliteBook), andes neile uue elu ja kindla garantii.', 'Alongside our IT services, we inspect and refurbish business-class computers (Dell Latitude & OptiPlex, Lenovo ThinkPad & ThinkCentre, HP EliteBook), giving them a new lease on life with a dependable warranty.', lang)}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-teal-900/10 text-center">
                  <div className="text-2xl font-black text-[#0e4da4]">20+</div>
                  <div className="text-xs text-slate-500 mt-1">{local('Aastat kogemust', 'Years of experience', lang)}</div>
                </div>
                <div className="p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-teal-900/10 text-center">
                  <div className="text-2xl font-black text-[#0e4da4]">10 000+</div>
                  <div className="text-xs text-slate-500 mt-1">{local('Hooldatud seadet', 'Devices serviced', lang)}</div>
                </div>
                <div className="p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-teal-900/10 text-center">
                  <div className="text-2xl font-black text-[#0e4da4]">100%</div>
                  <div className="text-xs text-slate-500 mt-1">{local('Rahulolugarantii', 'Customer satisfaction', lang)}</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-4">
              <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">{local('Canman Kvaliteedilubadus', 'The Canman Quality Promise', lang)}</h3>
                    <p className="text-xs text-slate-400">{local('Läbipaistev ja usaldusväärne IT-partner', 'A transparent and reliable IT partner', lang)}</p>
                  </div>
                </div>

                <ul className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span><strong>{local('Aus diagnostika:', 'Honest diagnostics:', lang)}</strong> {local('me ei vaheta detaile, mis ei vaja vahetamist. Enne remonti räägime täpse hinna.', 'we never replace parts unnecessarily. We confirm the exact price before repairs.', lang)}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span><strong>{local('Andmete puutumatus:', 'Data privacy:', lang)}</strong> {local('Sinu failid, fotod ja äriandmed on kaitstud rangete privaatsusreeglitega.', 'Your files, photos, and business data are protected by strict privacy practices.', lang)}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span><strong>{local('Ametlik arve ja garantii:', 'Official invoice and warranty:', lang)}</strong> {local('era- ja äriklientidele käibemaksuga arve ning kuni 2-aastane garantii.', 'VAT invoices for private and business customers, plus a warranty of up to 2 years.', lang)}</span>
                  </li>
                </ul>

                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>{local('Asukoht:', 'Location:', lang)} Lille 14-4, Tallinn</span>
                  <a href="tel:+3725652062" className="text-cyan-400 font-bold hover:underline">
                    {local('Tel:', 'Phone:', lang)} +372 5652 062
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. CONTACT & LOCATION SECTION (#kontakt) */}
      {/* ============================================================== */}
      <section id="kontakt" className="py-16 bg-[#e2f0f2] border-b border-teal-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#0e4da4] tracking-widest uppercase bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              {local('VÕTA ÜHENDUST', 'GET IN TOUCH', lang)}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
              {local('Tule kohale või saada meile päring', 'Visit Our Workshop or Send an Inquiry', lang)}
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              {local('Asume mugavas asukohas Lille tänaval Tallinnas. Tasuta parkimine otse maja ees.', 'We are conveniently located on Lille Street in Tallinn, with free parking right outside.', lang)}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Box 1: Workshop Address */}
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-teal-900/10 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0e4da4] flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900">{local('Arvutitöökoda Tallinnas', 'Computer Workshop in Tallinn', lang)}</h3>
              <div className="text-xs text-slate-600 space-y-1.5 leading-relaxed">
                <p className="font-semibold text-slate-800">Lille 14-4, Tallinn 10614, Harjumaa</p>
                <p>{local('Kristiine linnaosa (Telliskivi ja Paldiski mnt lähedal)', 'Kristiine district (near Telliskivi and Paldiski Road)', lang)}</p>
                <p className="text-emerald-600 font-medium pt-1">✓ {local('Tasuta kliendiparkimine otse maja ees', 'Free customer parking right outside', lang)}</p>
              </div>
              <a
                href="https://maps.google.com/?q=Lille+14,+Tallinn"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0e4da4] hover:underline pt-2"
              >
                <span>{local('Ava Google Mapsis', 'Open in Google Maps', lang)}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Box 2: Opening Hours & Phone */}
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-teal-900/10 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0e4da4] flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900">{local('Lahtiolekuajad & Telefon', 'Opening Hours & Phone', lang)}</h3>
              <div className="text-xs text-slate-600 space-y-2">
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span>{local('Esmaspäev – Reede:', 'Monday – Friday:', lang)}</span>
                  <span className="font-bold text-slate-800">10:00 – 18:00</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span>{local('Laupäev – Pühapäev:', 'Saturday – Sunday:', lang)}</span>
                  <span className="text-slate-400">{local('Kokkuleppel / Suletud', 'By appointment / Closed', lang)}</span>
                </div>
                <div className="pt-2">
                  <span className="block text-slate-500 mb-1">{local('Kiire telefonitugi:', 'Quick phone support:', lang)}</span>
                  <a href="tel:+3725652062" className="text-lg font-black text-[#0e4da4] hover:underline flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    +372 5652 062
                  </a>
                </div>
              </div>
            </div>

            {/* Box 3: Email & Business Details */}
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-teal-900/10 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0e4da4] flex items-center justify-center">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900">{local('E-post & Ettevõtte info', 'Email & Business Details', lang)}</h3>
              <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
                <div>
                  <span className="block text-slate-500 mb-0.5">{local('Kirjuta meile:', 'Email us:', lang)}</span>
                  <a href="mailto:canman.systems@gmail.com" className="font-bold text-[#0e4da4] hover:underline text-sm">
                    canman.systems@gmail.com
                  </a>
                </div>
                <div className="pt-2 border-t border-slate-100 space-y-0.5">
                  <p><strong>Canman Systems OÜ</strong></p>
                  <p>{local('Registrikood:', 'Registration code:', lang)} 12147369</p>
                  <p>{local('KMKR number:', 'VAT number:', lang)} EE101478366</p>
                  <p>{local('Pank:', 'Bank:', lang)} LHV EE517700771001586069</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer onOpenServicesModal={() => setIsServicesOpen(true)} />

      {/* Modals & Drawers */}
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      <CartDrawer onOpenCheckout={() => setIsCheckoutOpen(true)} />
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderCompleted={(order) => {
          setIsCheckoutOpen(false);
          setCompletedOrder(order);
        }}
      />
      {completedOrder && <InvoiceView order={completedOrder} onClose={() => setCompletedOrder(null)} />}
      <ServicesModal isOpen={isServicesOpen} onClose={() => setIsServicesOpen(false)} />
    </div>
  );
}
