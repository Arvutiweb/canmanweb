'use client';
import React from 'react';

export default function ProductCard({ product, onSelect }: any) {
  const imgSrc = product?.image || product?.img || '/images/placeholder.png';

  return (
    <div 
      onClick={() => onSelect(product)}
      className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer flex flex-col h-full group"
    >
      <div className="h- w-full bg-white flex items-center justify-center p-3 overflow-hidden">
        <img 
          src={imgSrc}
          alt={product?.title || product?.name || ''}
          loading="lazy"
          decoding="async"
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-3 flex flex-col flex-1 border-t border-slate-100">
        <div className="text- text-slate-400 uppercase truncate">{product?.brand || ''}</div>
        <h3 className="text- font-semibold text-slate-800 line-clamp-2 leading-tight min-h-">{product?.title || product?.name}</h3>
        <div className="mt-auto pt-2 flex items-center justify-between">
          <span className="text- font-bold text-[#0e4da4]">{product?.price} €</span>
          <span className="text- bg-slate-900 text-white px-3 py-1 rounded-full">Vaata</span>
        </div>
      </div>
    </div>
  );
}
