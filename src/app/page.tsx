'use client';

import React, { useState, useMemo } from 'react';
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
import { allProducts as PRODUCTS } from '../data/productCatalog';
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
  ExternalLink,
  Search,
} from 'lucide-react';

const safeLower = (v: any) => String(v || '').toLowerCase();
const safeStr = (v: any) => String(v || '');

export default function Home() {
  const { t, lang } = useLanguage();
  const [selectedL1, setSelectedL1] = useState<string | null>(null);
  const [selectedL2, setSelectedL2] = useState<string | null>(null);
  const [selectedL3, setSelectedL3] = useState<string | null>(null);
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
  const [servicePhone, setServicePhone] = useState('');
  const [serviceIssue, setServiceIssue] = useState('');
  const [serviceFormError, setServiceFormError] = useState('');
  const [isSubmittingServiceRequest, setIsSubmittingServiceRequest] = useState(false);
  const [processorFilter, setProcessorFilter] = useState('');
  const [memoryFilter, setMemoryFilter] = useState('');
  const [diskFilter, setDiskFilter] = useState('');
  const [operatingSystemFilter, setOperatingSystemFilter] = useState('');

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
        const matchesCat = safeLower(p.categoryL1 || p.topCategory || p.category).includes(query) || safeLower(p.categoryL2 || p.subCategory).includes(query);
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
      if (selectedL3 && p.categoryL3 && safeLower(p.categoryL3) !== safeLower(selectedL3)) return false;
      if (conditionFilter !== 'all' && p.condition !== conditionFilter) return false;
      if (selectedBrand && String(p.brand) !== selectedBrand) return false;
      if (minPrice > 0 && Number(p.price) < minPrice) return false;
      if (maxPrice > 0 && Number(p.price) > maxPrice) return false;
      if (processorFilter && safeLower(p.specs?.cpu || p.cpu) !== safeLower(processorFilter)) return false;
      if (memoryFilter && safeLower(p.specs?.ram || p.ram) !== safeLower(memoryFilter)) return false;
      if (diskFilter && safeLower(p.specs?.storage || p.storage) !== safeLower(diskFilter)) return false;
      if (operatingSystemFilter && safeLower(p.specs?.os || p.os) !== safeLower(operatingSystemFilter)) return false;
      return true;
    }).sort((a: any, b: any) => {
      if (sortBy === 'price-asc') return Number(a.price) - Number(b.price);
      if (sortBy === 'price-desc') return Number(b.price) - Number(a.price);
      if (sortBy === 'name-asc') return safeStr(a.title || a.name).localeCompare(safeStr(b.title || b.name));
      if (sortBy === 'popular') return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
      return 0;
    });
  }, [searchQuery, selectedL1, selectedL2, selectedL3, conditionFilter, selectedBrand, minPrice, maxPrice, sortBy, processorFilter, memoryFilter, diskFilter, operatingSystemFilter]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleServiceSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServiceFormError('');
    setIsSubmittingServiceRequest(true);

    try {
      const response = await fetch('/api/service-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: serviceName.trim(),
          phone: servicePhone.trim(),
          issue: serviceIssue.trim(),
        }),
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
                  onClick={() => scrollTo('arikliendile')}
                  className="bg-white/10 hover:bg-white/15 text-white border border-white/20 font-semibold px-5 py-3 rounded-xl text-sm transition flex items-center gap-2"
                >
                  <Briefcase className="w-4 h-4 text-cyan-300" />
                  <span>{t('btn_business')}</span>
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
              <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-6 shadow-2xl backdrop-blur-md relative overflow-hidden">
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
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400 transition"
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
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400 transition"
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
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400 transition"
                      />
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
              PÕHITEENUSED
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
              Kõik IT-teenused ja arvutiremont ühest kohast
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Pakume kiiret ja professionaalset IT-tuge nii eraisikutele kui ka ettevõtetele. Tule Canman töökotta või telli tehnik kohale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Service 1: Arvutite & Sülearvutite Remont */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-blue-400 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#0e4da4] flex items-center justify-center mb-4 group-hover:bg-[#0e4da4] group-hover:text-white transition-colors">
                  <Laptop className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">Arvutite & Sülearvutite Remont</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Riistvaraline diagnostika, ekraanide ja klaviatuuride vahetus, emaplaadi jootetööd, toitepesade remont ning vedelikukahjustuste likvideerimine.
                </p>
                <ul className="text-xs text-slate-700 space-y-1.5 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Diagnostika 15 € (remondil tasuta)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Enamik varuosi kohapeal laos olemas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Garantiiga teostus 24–48h</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => setIsServicesOpen(true)}
                className="w-full py-2.5 px-4 bg-white border border-slate-300 text-slate-800 rounded-xl text-xs font-semibold hover:bg-[#0e4da4] hover:text-white hover:border-[#0e4da4] transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Vaata hinnakirja & detaile</span>
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
                  <h3 className="font-bold text-lg text-slate-900">Äriklindi IT-Haldus</h3>
                  <span className="text-[10px] font-bold bg-[#0e4da4] text-white px-2 py-0.5 rounded-full">B2B</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Terviklik IT-osakonna asendusteenus väike- ja keskmistele ettevõtetele. Töökohtade hooldus, serverite monitooring, kasutajatugi ja riistvarahaldus.
                </p>
                <ul className="text-xs text-slate-700 space-y-1.5 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Ennetav hooldus ja kiire kaughaldustugi</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Microsoft 365, e-post ja litsentsid</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Fikseeritud kuutasu ilma üllatusteta</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => scrollTo('arikliendile')}
                className="w-full py-2.5 px-4 bg-[#0e4da4] text-white rounded-xl text-xs font-semibold hover:bg-blue-800 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Tutvu äripakettidega</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Service 3: Tehniku Väljakutse & Kohapealne Tugi */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-blue-400 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#0e4da4] flex items-center justify-center mb-4 group-hover:bg-[#0e4da4] group-hover:text-white transition-colors">
                  <Truck className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">Tehniku Väljakutse (Tallinn & Harjumaa)</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Kogenud IT-spetsialisti kohaletulek kontorisse või koju. Printerite, võrguseadmete, uute arvutite paigaldus ja tõrgete likvideerimine kohapeal.
                </p>
                <ul className="text-xs text-slate-700 space-y-1.5 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Tunnitasu: 35 € / tund</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Kohapealne võrgu ja printerite seadistus</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Võimalus seade töökotta remonti toimetada</span>
                  </li>
                </ul>
              </div>
              <a
                href="tel:+3725652062"
                className="w-full py-2.5 px-4 bg-white border border-slate-300 text-slate-800 rounded-xl text-xs font-semibold hover:bg-[#0e4da4] hover:text-white hover:border-[#0e4da4] transition-colors flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Telli väljakutse: 5652 062</span>
              </a>
            </div>

            {/* Service 4: Tolmupuhastus & Jahutushooldus */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-blue-400 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#0e4da4] flex items-center justify-center mb-4 group-hover:bg-[#0e4da4] group-hover:text-white transition-colors">
                  <Cpu className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">Tolmust Puhastus & Termopasta</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Arvuti kuumeneb või ventilaator undab? Põhjalik tolmust puhastus ja tipptasemel termopasta (Arctic MX-4/MX-6) vahetus pikendab arvuti eluiga märgatavalt.
                </p>
                <ul className="text-xs text-slate-700 space-y-1.5 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Lauaarvutid: 25 €</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Sülearvutid: 30 € – 40 €</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Vaiksem töö ja madalamad temperatuurid</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => setIsServicesOpen(true)}
                className="w-full py-2.5 px-4 bg-white border border-slate-300 text-slate-800 rounded-xl text-xs font-semibold hover:bg-[#0e4da4] hover:text-white hover:border-[#0e4da4] transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Broneeri hooldus</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Service 5: Andmete Taastamine & Varundus */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-blue-400 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#0e4da4] flex items-center justify-center mb-4 group-hover:bg-[#0e4da4] group-hover:text-white transition-colors">
                  <HardDrive className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">Andmete Taastamine & Varundus</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Kustutatud failide, vigaste kõvaketaste (HDD), SSD ketaste ja mälukaartide andmete päästmine. Automaatsete pilvevarunduste seadistus ettevõtetele.
                </p>
                <ul className="text-xs text-slate-700 space-y-1.5 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Andmete päästmine alates 30 €</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Andmete turvaline kloonimine uuele SSD-le</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>100% konfidentsiaalsus garanteeritud</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => setIsServicesOpen(true)}
                className="w-full py-2.5 px-4 bg-white border border-slate-300 text-slate-800 rounded-xl text-xs font-semibold hover:bg-[#0e4da4] hover:text-white hover:border-[#0e4da4] transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Küsi andmete taastamist</span>
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
                  <h3 className="font-bold text-lg text-white">AI & Töövoogude Automatiseerimine</h3>
                  <span className="text-[10px] font-bold bg-cyan-500 text-slate-950 px-2 py-0.5 rounded-full">UUS</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Aitame ettevõtetel integreerida kaasaegseid AI-tööriistu, Microsoft Copilot lahendusi ja automatiseerida rutiinseid andmetöötluse protsesse.
                </p>
                <ul className="text-xs text-slate-200 space-y-1.5 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>Kohalikud & pilvepõhised AI mudelid</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>Töövoogude automatiseerimine</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>Praktiline koolitus ja konsultatsioon</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => scrollTo('kontakt')}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 rounded-xl text-xs font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5"
              >
                <span>Küsi AI konsultatsiooni</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. ÄRIKLIENDILE SECTION (#arikliendile): IT-HALDUS ETTEVÕTETELE */}
      {/* ============================================================== */}
      <section id="arikliendile" className="py-16 bg-slate-900 text-white border-b border-slate-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold text-cyan-400 tracking-widest uppercase bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-800/60">
                ÄRIKLIENDI LAHENDUSED
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Terve IT-osakonna tugi ilma palgatöötaja kuludeta
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Canman Systems OÜ pakub väike- ja keskmise suurusega ettevõtetele lepingulist IT-täisteenust. Me tagame, et Sinu kontori arvutid, printerid, serverid ja võrk töötavad sujuvalt iga päev.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
                  <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-white">Kiire reageerimisaeg (SLA)</h4>
                    <p className="text-xs text-slate-400">Kaugabi algus 15 minuti jooksul, kriitiliste rikete korral tehnik kohal 1-2 tunniga.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
                  <Server className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-white">Ennetav monitooring & Turvalisus</h4>
                    <p className="text-xs text-slate-400">Jälgime riistvara tervist, varunduste õnnestumist ja turvapaiku enne, kui rike tööd takistab.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
                  <ShoppingBag className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-white">Arvutipargi soodne uuendamine</h4>
                    <p className="text-xs text-slate-400">Lepingulistele klientidele e-poe arvutid ja varuosad erihinnaga ning seadistatud kujul.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <a
                  href="tel:+3725652062"
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 py-3 rounded-xl text-xs transition shadow-lg shadow-cyan-500/20 flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>Helista ja küsi pakkumist</span>
                </a>
                <button
                  onClick={() => scrollTo('kontakt')}
                  className="bg-white/10 hover:bg-white/20 text-white px-5 py-3 rounded-xl text-xs font-semibold transition"
                >
                  Saada hinnapäring
                </button>
              </div>
            </div>

            {/* Right Comparison Box */}
            <div className="lg:col-span-6">
              <div className="bg-gradient-to-br from-slate-800/90 to-slate-900 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl">
                <h3 className="font-bold text-lg text-white mb-6 border-b border-slate-700 pb-3 flex items-center justify-between">
                  <span>Mida Canman IT-haldus sisaldab?</span>
                  <span className="text-xs text-cyan-400 font-semibold">Täisteenus</span>
                </h3>

                <div className="space-y-4 text-xs text-slate-300">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <span className="font-medium">Töökoha kaughaldus ja kasutajatugi</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1"><Check className="w-4 h-4" /> Sisaldub</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <span className="font-medium">Viirusetõrje & Turvavärskenduste haldus</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1"><Check className="w-4 h-4" /> Sisaldub</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <span className="font-medium">Automaatne andmete pilvevarundus</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1"><Check className="w-4 h-4" /> Sisaldub</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <span className="font-medium">Kontori võrgu, ruuterite ja WiFi optimeerimine</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1"><Check className="w-4 h-4" /> Sisaldub</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <span className="font-medium">Tehniku väljasõidud Tallinna piires</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1"><Check className="w-4 h-4" /> Prioriteetne</span>
                  </div>
                  <div className="flex items-center justify-between pb-1">
                    <span className="font-medium">Asendusseadmed remondi ajaks</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1"><Check className="w-4 h-4" /> Tasuta</span>
                  </div>
                </div>

                <div className="mt-8 bg-cyan-950/40 border border-cyan-800/50 rounded-xl p-4 text-center">
                  <p className="text-xs text-slate-300 mb-2">Äripakettide kuutasu alates:</p>
                  <div className="text-3xl font-black text-cyan-400">15 € <span className="text-xs font-normal text-slate-400">/ arvuti kuus</span></div>
                  <p className="text-[11px] text-slate-400 mt-1">Lõplik hind sõltub seadmete arvust ja reageerimisajast.</p>
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
              LÄBIPAISTEV HINNASTUS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
              Standardtööde ja IT-Abi Hinnakiri
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Kõik hinnad on selged ja läbipaistvad. Enne remondi alustamist kooskõlastame alati maksumuse.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-slate-900 text-sm">Arvuti diagnostika</h4>
                  <span className="font-extrabold text-[#0e4da4] text-base">15 €</span>
                </div>
                <p className="text-xs text-slate-500">Rikke tuvastamine ja remondi eelarve. Remonditöö tellimisel on diagnostika tasuta!</p>
              </div>
              <span className="text-[11px] text-emerald-600 font-medium mt-3">Valmib: samal või järgmisel päeval</span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-slate-900 text-sm">Windows / Linux paigaldus</h4>
                  <span className="font-extrabold text-[#0e4da4] text-base">25 € – 50 €</span>
                </div>
                <p className="text-xs text-slate-500">Uus puhas operatsioonisüsteem, draiverid, viirusetõrje ja vajalikud baasprogrammid.</p>
              </div>
              <span className="text-[11px] text-emerald-600 font-medium mt-3">Valmib: 24h jooksul</span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-slate-900 text-sm">Tolmust puhastus + termopasta</h4>
                  <span className="font-extrabold text-[#0e4da4] text-base">25 € – 40 €</span>
                </div>
                <p className="text-xs text-slate-500">Jahutussüsteemi hooldus laua- ja sülearvutitele. Kõrgekvaliteetne termopasta.</p>
              </div>
              <span className="text-[11px] text-emerald-600 font-medium mt-3">Valmib: 1 tööpäev</span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-slate-900 text-sm">Kiire SSD paigaldus</h4>
                  <span className="font-extrabold text-[#0e4da4] text-base">40 €</span>
                </div>
                <p className="text-xs text-slate-500">Uue kiire SSD paigaldus ja vanade andmete ning süsteemi 1:1 kloonimine.</p>
              </div>
              <span className="text-[11px] text-emerald-600 font-medium mt-3">Arvuti muutub 5–10x kiiremaks</span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-slate-900 text-sm">Tehniku väljasõit Tallinnas</h4>
                  <span className="font-extrabold text-[#0e4da4] text-base">35 € / tund</span>
                </div>
                <p className="text-xs text-slate-500">IT-spetsialisti visiit koju või kontorisse. Võrgu, ruuteri ja printerite häälestus.</p>
              </div>
              <span className="text-[11px] text-emerald-600 font-medium mt-3">Tallinn ja lähivallad</span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-slate-900 text-sm">Andmete taastamine</h4>
                  <span className="font-extrabold text-[#0e4da4] text-base">alates 30 €</span>
                </div>
                <p className="text-xs text-slate-500">Kustutatud failide või rikkis kõvaketaste andmete päästmine laboris.</p>
              </div>
              <span className="text-[11px] text-emerald-600 font-medium mt-3">Tasuta esmane hinnang</span>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => setIsServicesOpen(true)}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#0e4da4] hover:underline"
            >
              <span>Ava täielik hinnakiri ja garantiitingimused</span>
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
              <span className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">SHOP</span>
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
                onSelectCategory={handleSelectCategory}
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
                products={filteredProducts as any}
                onSelectProduct={(p: any) => setSelectedProduct(p)}
                onResetFilters={handleResetFilters}
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
                ETTEVÕTTEST
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Canman Systems OÜ — 20+ aastat IT-kogemust Tallinnas
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Asutatud eesmärgiga pakkuda klientidele ausat, kiiret ja tehniliselt kompromissitut IT-abi. Meie töökoda Tallinnas Kristiine linnaosas (Lille 14) on spetsialiseerunud arvutite, sülearvutite ja serverite komponenttasandi remondile ja hooldusele.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Lisaks IT-teenustele kontrollime ja taastame äriklassi arvuteid (Dell Latitude & OptiPlex, Lenovo ThinkPad & ThinkCentre, HP EliteBook), andes neile uue elu ja kindla garantii.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-teal-900/10 text-center">
                  <div className="text-2xl font-black text-[#0e4da4]">20+</div>
                  <div className="text-xs text-slate-500 mt-1">Aastat kogemust</div>
                </div>
                <div className="p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-teal-900/10 text-center">
                  <div className="text-2xl font-black text-[#0e4da4]">10 000+</div>
                  <div className="text-xs text-slate-500 mt-1">Hooldatud seadet</div>
                </div>
                <div className="p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-teal-900/10 text-center">
                  <div className="text-2xl font-black text-[#0e4da4]">100%</div>
                  <div className="text-xs text-slate-500 mt-1">Rahulolugarantii</div>
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
                    <h3 className="font-bold text-base text-white">Canman Kvaliteedilubadus</h3>
                    <p className="text-xs text-slate-400">Läbipaistev ja usaldusväärne IT-partner</p>
                  </div>
                </div>

                <ul className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span><strong>Aus diagnostika:</strong> me ei vaheta detaile, mis ei vaja vahetamist. Enne remonti räägime täpse hinna.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span><strong>Andmete puutumatus:</strong> Sinu failid, fotod ja äriandmed on kaitstud rangete privaatsusreeglitega.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span><strong>Ametlik arve ja garantii:</strong> era- ja äriklientidele käibemaksuga arve ning kuni 2-aastane garantii.</span>
                  </li>
                </ul>

                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Asukoht: Lille 14-4, Tallinn</span>
                  <a href="tel:+3725652062" className="text-cyan-400 font-bold hover:underline">
                    Tel: +372 5652 062
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
              VÕTA ÜHENDUST
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
              Tule kohale või saada meile päring
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Asume mugavas asukohas Lille tänaval Tallinnas. Tasuta parkimine otse maja ees.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Box 1: Workshop Address */}
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-teal-900/10 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0e4da4] flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Arvutitöökoda Tallinnas</h3>
              <div className="text-xs text-slate-600 space-y-1.5 leading-relaxed">
                <p className="font-semibold text-slate-800">Lille 14-4, Tallinn 10614, Harjumaa</p>
                <p>Kristiine linnaosa (Telliskivi ja Paldiski mnt lähedal)</p>
                <p className="text-emerald-600 font-medium pt-1">✓ Tasuta kliendiparkimine otse maja ees</p>
              </div>
              <a
                href="https://maps.google.com/?q=Lille+14,+Tallinn"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0e4da4] hover:underline pt-2"
              >
                <span>Ava Google Mapsis</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Box 2: Opening Hours & Phone */}
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-teal-900/10 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0e4da4] flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Lahtiolekuajad & Telefon</h3>
              <div className="text-xs text-slate-600 space-y-2">
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span>Esmaspäev – Reede:</span>
                  <span className="font-bold text-slate-800">10:00 – 18:00</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span>Laupäev – Pühapäev:</span>
                  <span className="text-slate-400">Kokkuleppel / Suletud</span>
                </div>
                <div className="pt-2">
                  <span className="block text-slate-500 mb-1">Kiire telefonitugi:</span>
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
              <h3 className="font-bold text-base text-slate-900">E-post & Ettevõtte info</h3>
              <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
                <div>
                  <span className="block text-slate-500 mb-0.5">Kirjuta meile:</span>
                  <a href="mailto:canman.systems@gmail.com" className="font-bold text-[#0e4da4] hover:underline text-sm">
                    canman.systems@gmail.com
                  </a>
                </div>
                <div className="pt-2 border-t border-slate-100 space-y-0.5">
                  <p><strong>Canman Systems OÜ</strong></p>
                  <p>Registrikood: 12147369</p>
                  <p>KMKR number: EE101478366</p>
                  <p>Pank: LHV EE517700771001586069</p>
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
