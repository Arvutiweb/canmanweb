'use client';
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const ProductModal = ({ product, onClose }: any) => {
  const { addToCart } = useCart();
  const [idx, setIdx] = useState(0);
  if (!product) return null;

  const rawImgs = product.images || product.Images || product.rawImages || [];
  const all = rawImgs.length ? rawImgs : [product.image || product.imageUrl || product.Hind || ''].filter(Boolean);
  const norm = (s:any) => { const t=String(s||''); return t ? (t.startsWith('/') || t.startsWith('http') ? t : `/images/${t}`) : '/images/placeholder.png'; };
  const imgs = all.map(norm);

  const priceRaw = product.finalPrice || product.salePrice || product.price || 0;
  const price = String(priceRaw);

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded- max-w-4xl w-full max-h- overflow-auto relative" onClick={e=>e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 z-10 bg-slate-100 rounded-full p-2"><X className="w-5 h-5"/></button>
        <div className="grid md:grid-cols-2">
          <div className="bg-[#f8f9fb] p-4">
            <div className="aspect-square bg-white rounded- overflow-hidden">
              <img src={imgs[idx] || '/images/placeholder.png'} className="w-full h-full object-contain p-4" />
            </div>
            <div className="flex gap-2 mt-3 overflow-auto">
              {imgs.map((s:any,i:number)=><img key={i} onClick={()=>setIdx(i)} src={s} className={`w-16 h-16 bg-white rounded-xl object-contain p-1 cursor-pointer border-2 ${i===idx?'border-blue-600':'border-transparent'}`} />)}
            </div>
          </div>
          <div className="p-6">
            <h2 className="font-bold text-lg leading-tight">{product.name || product.title || product.sku || 'Toode'}</h2>
            <div className="text-2xl font-bold text-[#0e4da4] mt-3">{price} €</div>
            <div className="text-sm mt-4 text-slate-600">{product.description || product.shortSpec || ''}</div>
            <button onClick={()=>{addToCart({...product, id: product.id || product.sku, price: parseFloat(price)||0, title: product.name || product.title},1); onClose();}} className="mt-6 w-full bg-[#0e4da4] text-white py-3 rounded-xl font-bold">Lisa korvi</button>
          </div>
        </div>
      </div>
    </div>
  );
};