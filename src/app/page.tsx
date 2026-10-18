'use client';
import React, { useState, useMemo } from 'react';
import FiltersBar from '@/components/FiltersBar';
import ProductGrid from '@/components/ProductGrid';
import productCatalog from '@/data/products/laptops-used/laptop-14-used.json';

export default function Page() {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [conditionFilter, setConditionFilter] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');

  const products = (productCatalog as any).products || productCatalog;

  const availableBrands = useMemo(() => {
    const brands = new Set((products as any[]).map((p: any) => p.brand).filter(Boolean));
    return Array.from(brands);
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...(products as any[])].filter((p: any) => {
      if (conditionFilter !== 'all' && p.condition !== conditionFilter) return false;
      if (selectedBrand !== 'all' && p.brand !== selectedBrand) return false;
      if (minPrice && Number(p.price) < Number(minPrice)) return false;
      if (maxPrice && Number(p.price) > Number(maxPrice)) return false;
      return true;
    });

    if (sortBy === 'price-asc') result.sort((a: any, b: any) => Number(a.price) - Number(b.price));
    if (sortBy === 'price-desc') result.sort((a: any, b: any) => Number(b.price) - Number(a.price));

    return result;
  }, [products, conditionFilter, selectedBrand, minPrice, maxPrice, sortBy]);

  const handleResetFilters = () => {
    setConditionFilter('all');
    setSelectedBrand('all');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('default');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w- mx-auto p-4 flex gap-6">
        <div className="flex-1 min-w-0 w-full overflow-hidden">
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
            onReset={handleResetFilters} 
          />
          <ProductGrid 
            products={filteredProducts} 
            onSelectProduct={(p: any) => setSelectedProduct(p)} 
            onResetFilters={handleResetFilters} 
          />
        </div>
      </div>
    </div>
  );
}
