'use client';
import React from 'react';
import ProductCard from './ProductCard';

export default function ProductGrid({ products, onSelectProduct, onResetFilters }: any) {
  const safeProducts = (products || []).filter((p: any) => p && p.id);

  if (!safeProducts.length) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border">
        <p className="text-slate-500 text-sm">Tooteid ei leitud</p>
        <button onClick={onResetFilters} className="mt-4 px-5 py-2 bg-[#0e4da4] text-white rounded-full text-sm">Tühista filtrid</button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {safeProducts.map((product: any) => (
        <ProductCard 
          key={String(product.id)} 
          product={product} 
          onSelect={() => onSelectProduct(product)} 
        />
      ))}
    </div>
  );
}
