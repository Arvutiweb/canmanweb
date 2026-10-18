'use client';
import React from 'react';
import ProductCard from './ProductCard';

export default function ProductGrid({ products, onSelectProduct, onResetFilters }: any) {
  const safeProducts = (products || []).filter((p: any) => p && typeof p === 'object');

  if (!safeProducts.length) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Tooteid ei leitud</p>
        <button onClick={onResetFilters} className="mt-4 px-4 py-2 bg-[#0e4da4] text-white rounded">Tühista filtrid</button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
      {safeProducts.map((product: any, idx: number) => (
        <ProductCard 
          key={product.id || product.sku || idx} 
          product={{
            ...product,
            image: product.image || product.Image || product.img || product.Pilt || '/images/placeholder.png'
          }} 
          onSelect={() => onSelectProduct(product)} 
        />
      ))}
    </div>
  );
}
