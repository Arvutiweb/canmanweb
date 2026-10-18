'use client';
import React, { useState, useMemo } from 'react';
import { FiltersBar } from '@/components/FiltersBar';
import ProductGrid from '@/components/ProductGrid';
import productCatalog from '@/data/products/laptops-used/laptop-14-used.json';

export default function Page() {
  const [conditionFilter, setConditionFilter] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');

  const products = (productCatalog as any).products || productCatalog || [];

  const availableBrands = useMemo(() => {
    return Array.from(new Set((products as any[]).map((p: any) => p.brand).filter(Boolean))) as string[];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...(products as any[])].filter((p: any) => {
      if (conditionFilter !== 'all' && p.condition !== conditionFilter) return false;
      if (selectedBrand !== 'all' && p.brand !== selectedBrand) return false;
      if (minPrice && Number(p.price) < Number(minPrice)) return false;
      if (maxPrice && Number(p.price) > Number(maxPrice)) return false;
      return true;
    });
    if (sortBy === 'price-asc') result.sort((a,b) => Number(a.price) - Number(b.price));
    if (sortBy === 'price-desc') result.sort((a,b) => Number(b.price) - Number(a.price));
    return result;
  }, [products, conditionFilter, selectedBrand, minPrice, maxPrice, sortBy]);

  return (
    <div className="min-h-screen bg-[#f6f7f9]">
      <div className="max-w- mx-auto px-4 py-6">
        <FiltersBar 
          conditionFilter={conditionFilter} 
          setConditionFilter={setConditionFilter} 
          sortBy={sortBy} 
          setSortBy={setSortBy} 
          minPrice={minPrice} 
          maxPrice={maxPrice} 
          setMinPrice={setMinPrice} 
          setMaxPrice={setMaxPrice} 
          selectedBrand={selectedBrand} 
          setSelectedBrand={setSelectedBrand} 
          availableBrands={availableBrands} 
          totalResults={filteredProducts.length} 
          onReset={() => { setConditionFilter('all'); setSelectedBrand('all'); setMinPrice(''); setMaxPrice(''); setSortBy('default'); }} 
        />
        <div className="mt-6">
          <ProductGrid 
            products={filteredProducts} 
            onSelectProduct={() => {}} 
            onResetFilters={() => { setConditionFilter('all'); setSelectedBrand('all'); setMinPrice(''); setMaxPrice(''); }} 
          />
        </div>
      </div>
    </div>
  );
}
