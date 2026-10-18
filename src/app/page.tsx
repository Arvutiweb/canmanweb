'use client';

import React, { useState, useMemo } from 'react';
import { Header } from '../components/Header';
import { CategorySidebar } from '../components/CategorySidebar';
import { FiltersBar } from '../components/FiltersBar';
import { ProductGrid } from '../components/ProductGrid';
import { ProductModal } from '../components/ProductModal';
import { CartDrawer } from '../components/CartDrawer';
import { CheckoutModal } from '../components/CheckoutModal';
import { InvoiceView } from '../components/InvoiceView';
import { ServicesModal } from '../components/ServicesModal';
import { Footer } from '../components/Footer';
import { allProducts as PRODUCTS } from '../data/productCatalog';
import { Product, Condition, OrderDetails } from '../types';
import { Wrench, Truck, MapPin, ChevronRight } from 'lucide-react';

const safeLower = (v: any) => String(v || '').toLowerCase();
const safeStr = (v: any) => String(v || '');

export default function Home() {
  const [selectedL1, setSelectedL1] = useState<string | null>(null);
  const [selectedL2, setSelectedL2] = useState<string | null>(null);
  const [selectedL3, setSelectedL3] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [conditionFilter, setConditionFilter] = useState<'all' | Condition>('all');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [sortBy, setSortBy] = useState('popular');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<OrderDetails | null>(null);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

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
    setMaxPrice(1000);
    setSortBy('popular');
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
        if (!matchesTitle &&!matchesBrand &&!matchesSpecs &&!matchesCat) return false;
      }
      if (selectedL1) {
        const sel = safeLower(selectedL1);
        const pL1 = safeLower(p.categoryL1 || p.topCategory || p.category);
        if (sel.includes('desktop kasutatud')) {
          if (!pL1.startsWith('desktop kasutatud')) return false;
        } else {
          if (pL1!== sel) return false;
        }
      }
      if (selectedL2) {
        const sel = safeLower(selectedL2);
        const pL1 = safeLower(p.categoryL1 || p.topCategory || p.category);
        const pL2 = safeLower(p.categoryL2 || p.subCategory);
        if (!pL1.includes(sel) &&!pL2.includes(sel)) return false;
      }
      if (selectedL3 && p.categoryL3 && safeLower(p.categoryL3)!== safeLower(selectedL3)) return false;
      if (conditionFilter!== 'all' && p.condition!== conditionFilter) return false;
      if (selectedBrand && String(p.brand)!== selectedBrand) return false;
      if (minPrice > 0 && Number(p.price) < minPrice) return false;
      if (maxPrice < 1000 && Number(p.price) > maxPrice) return false;
      return true;
    }).sort((a: any, b: any) => {
      if (sortBy === 'price-asc') return Number(a.price) - Number(b.price);
      if (sortBy === 'price-desc') return Number(b.price) - Number(a.price);
      if (sortBy === 'name-asc') return safeStr(a.title || a.name).localeCompare(safeStr(b.title || b.name));
      if (sortBy === 'popular') return (b.isPopular? 1 : 0) - (a.isPopular? 1 : 0);
      return 0;
    });
  }, [searchQuery, selectedL1, selectedL2, selectedL3, conditionFilter, selectedBrand, minPrice, maxPrice, sortBy]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} onOpenServicesModal={() => setIsServicesOpen(true)} />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex items-center text-xs text-slate-500 space-x-1.5 mb-3 overflow-x-auto py-1">
            <span onClick={handleResetFilters} className="hover:text-[#0e4da4] cursor-pointer font-medium">Avaleht (Home)</span>
            {selectedL1 && <><ChevronRight className="w-3 h-3 text-slate-400" /><span onClick={() => handleSelectCategory(selectedL1, null, null)} className="hover:text-[#0e4da4] cursor-pointer font-medium text-slate-700">{selectedL1}</span></>}
            {selectedL2 && <><ChevronRight className="w-3 h-3 text-slate-400" /><span onClick={() => handleSelectCategory(selectedL1, selectedL2, null)} className="hover:text-[#0e4da4] cursor-pointer font-medium text-slate-700">{selectedL2}</span></>}
            {selectedL3 && <><ChevronRight className="w-3 h-3 text-slate-400" /><span className="font-bold text-[#0e4da4]">{selectedL3}</span></>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-gradient-to-r from-[#0e4da4] to-[#0c3a7a] text-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center space-x-3"><div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0"><MapPin className="w-5 h-5 text-yellow-300" /></div><div><h4 className="font-bold text-xs">Lille 14-4 Tallinn 10614 Harjumaa</h4><p className="text- text-blue-100">Kaubale saab ise tasuta järele tulla</p></div></div>
            <div className="flex items-center space-x-3"><div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0"><Truck className="w-5 h-5 text-yellow-300" /></div><div><h4 className="font-bold text-xs">Kiire Tarne 1-2 Tööpäeva</h4><p className="text- text-blue-100">Omniva & DPD pakiautomaadid (€4.90)</p></div></div>
            <div className="flex items-center space-x-3"><div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0"><Wrench className="w-5 h-5 text-yellow-300" /></div><div><h4 className="font-bold text-xs">Arvutiremont & IT-Abi</h4><p className="text- text-blue-100">Tel. +372 5652062 • Canman töökoda</p></div></div>
          </div>
        </div>

        {/* PARANDUS SIIN - lg:w-80 ja items-start */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <div className="w-full lg:w-80 lg:shrink-0 lg:sticky lg:top-24">
            <CategorySidebar selectedL1={selectedL1} selectedL2={selectedL2} selectedL3={selectedL3} onSelectCategory={handleSelectCategory} products={PRODUCTS as any} />
          </div>
          <div className="flex-1 min-w-0 w-full overflow-hidden">
            <FiltersBar conditionFilter={conditionFilter} setConditionFilter={setConditionFilter} sortBy={sortBy} setSortBy={setSortBy} minPrice={minPrice} maxPrice={maxPrice} setMinPrice={setMinPrice} setMaxPrice={setMaxPrice} selectedBrand={selectedBrand} setSelectedBrand={setSelectedBrand} availableBrands={availableBrands} totalResults={filteredProducts.length} onReset={handleResetFilters} />
            <ProductGrid products={filteredProducts as any} onSelectProduct={(p) => setSelectedProduct(p)} onResetFilters={handleResetFilters} />
          </div>
        </div>

      </main>
      <Footer onOpenServicesModal={() => setIsServicesOpen(true)} />
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      <CartDrawer onOpenCheckout={() => setIsCheckoutOpen(true)} />
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} onOrderCompleted={(order) => { setIsCheckoutOpen(false); setCompletedOrder(order); }} />
      {completedOrder && <InvoiceView order={completedOrder} onClose={() => setCompletedOrder(null)} />}
      <ServicesModal isOpen={isServicesOpen} onClose={() => setIsServicesOpen(false)} />
    </div>
  );
}
