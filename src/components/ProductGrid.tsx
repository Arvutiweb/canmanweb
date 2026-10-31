'use client';
import React from 'react';
import ProductCard from './ProductCard';

export default function ProductGrid({ products, onSelectProduct, onResetFilters, maxRows }: any) {
  const list = (products || []).filter((p:any)=> p && (p.id || p.sku || p.name || p.title));
  const visibleList = maxRows ? list.slice(0, maxRows * 4) : list;

  if (!list.length) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
        <p className="text-slate-500 text-sm">Tooteid ei leitud</p>
        <button onClick={onResetFilters} className="mt-4 px-5 py-2 bg-[#0e4da4] text-white rounded-full text-sm">Tühista filtrid</button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
      {visibleList.map((product: any, i:number) => (
        <div
          key={String(product.id || product.sku || product.name || i)} 
          className={
            maxRows && i >= maxRows * 3
              ? 'hidden lg:block'
              : maxRows && i >= maxRows * 2
                ? 'hidden sm:block'
                : ''
          }
        >
          <ProductCard product={product} onSelectProduct={onSelectProduct} />
        </div>
      ))}
    </div>
  );
}