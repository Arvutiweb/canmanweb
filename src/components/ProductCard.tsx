'use client';
import React from 'react';

export default function ProductCard({ product, onSelect }: any) {
  const imgSrc = product?.image || '/images/placeholder.png';
  
  return (
    <div 
      onClick={onSelect}
      className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer group flex flex-col h-full"
    >
      <div className="aspect-[4/3] bg-white flex items-center justify-center p-3 overflow-hidden">
        <img 
          src={imgSrc}
          alt={product?.title || ''}
          width={400}
          height={300}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-3 flex flex-col flex-1 border-t border-slate-100">
        <div className="text- text-slate-400 uppercase truncate">{product?.brand || ''}</div>
        <h3 className="text- font-semibold text-slate-800 line-clamp-2 leading-tight flex-1 mt-0.5">{product?.title}</h3>
        <div className="mt-3 flex items-center justify-between">
          <span className="text- font-bold text-[#0e4da4]">{product?.price} €</span>
          <span className="text- bg-slate-900 text-white px-3 py-1 rounded-full">Vaata</span>
        </div>
      </div>
    </div>
  );
}
