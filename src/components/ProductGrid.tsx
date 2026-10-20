'use client';
import React from 'react';
import ProductCard from './ProductCard';

export default function ProductGrid({ products, onSelectProduct, onResetFilters }: any) {
 const list = (products || []).filter((p:any)=> p);

  if (!list.length) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
        <p className="text-slate-500 text-sm">Tooteid ei leitud</p>
        <button onClick={onResetFilters} className="mt-4 px-5 py-2 bg-[#0e4da4] text-white rounded-full text-sm">Tühista filtrid</button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {list.map((product: any) => (
        <ProductCard 
          key={String(product.id)} 
          product={product} 
          onSelectProduct={onSelectProduct} 
        />
      ))}
    </div>
  );
}