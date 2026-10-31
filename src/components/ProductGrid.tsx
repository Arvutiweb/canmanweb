'use client';
import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import ProductCard from './ProductCard';

export default function ProductGrid({ products, onSelectProduct, onResetFilters, maxRows }: any) {
  const { t } = useLanguage();
  const [columnCount, setColumnCount] = useState(2);
  const [showAll, setShowAll] = useState(false);
  const list = (products || []).filter((p:any)=> p && (p.id || p.sku || p.name || p.title));

  useEffect(() => {
    const updateColumnCount = () => {
      setColumnCount(window.innerWidth >= 1024 ? 5 : window.innerWidth >= 640 ? 3 : 2);
    };

    updateColumnCount();
    window.addEventListener('resize', updateColumnCount);
    return () => window.removeEventListener('resize', updateColumnCount);
  }, []);

  useEffect(() => {
    setShowAll(false);
  }, [products]);

  const visibleCount = maxRows ? maxRows * columnCount : list.length;
  const visibleList = showAll ? list : list.slice(0, visibleCount);
  const canToggleProducts = maxRows && (list.length > visibleCount || showAll);

  if (!list.length) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
        <p className="text-slate-500 text-sm">Tooteid ei leitud</p>
        <button onClick={onResetFilters} className="mt-4 px-5 py-2 bg-[#0e4da4] text-white rounded-full text-sm">Tühista filtrid</button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-5">
        {visibleList.map((product: any, i:number) => (
          <div key={String(product.id || product.sku || product.name || i)}>
            <ProductCard product={product} onSelectProduct={onSelectProduct} />
          </div>
        ))}
      </div>
      {canToggleProducts && (
        <button
          type="button"
          onClick={() => setShowAll((current) => !current)}
          className="mx-auto mt-5 flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-[#0e4da4] shadow-sm transition hover:border-[#0e4da4] hover:bg-blue-50"
        >
          {showAll ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          {showAll ? t('show_fewer_products') : t('show_all_products')}
        </button>
      )}
    </>
  );
}