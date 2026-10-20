'use client';
import { useState } from 'react';
import Link from 'next/link';
import ProductGrid from '@/components/ProductGrid';
import { ProductModal } from '@/components/ProductModal';

export default function ClientProducts({products, params}: any){
  const [selected, setSelected] = useState<any>(null);
  return (
    <div className="max-w- mx-auto p-4 md:p-6">
      <div className="text- text-slate-500 mb-4 flex gap-2">
        <Link href="/pood" className="hover:underline">Pood</Link> / <span>{params.fourth}</span>
      </div>
      <h1 className="text-2xl font-bold mb-6 capitalize">{decodeURIComponent(params.fourth).replace(/-/g,' ')} <span className="text-slate-400 font-normal text-lg">({products.length})</span></h1>
      <ProductGrid products={products} onSelectProduct={setSelected} onResetFilters={()=>{}} />
      {selected && <ProductModal product={selected} onClose={()=>setSelected(null)} />}
    </div>
  );
}