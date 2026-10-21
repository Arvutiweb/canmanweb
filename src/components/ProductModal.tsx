'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { X, ShoppingBag, ShieldCheck, MapPin, Truck, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const ProductModal = ({ product, onClose }: any) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  if (!product) return null;

  const allImgs: any[] = product.images || [];
  const norm = (s:any)=>{ 
    if(!s) return '';
    if(typeof s === 'object') s = s.url || s.src || '';
    return String(s).trim();
  };
  let imgs = allImgs.map(norm).filter(Boolean);
  if (!imgs.length) imgs = [product.image || '/images/placeholder.png'];
  const fullSrc = imgs[activeImg] || imgs[0];

  const title = product.title || product.name || '';
  const rawPrice = product.finalPrice || product.price || 0;
  const priceNum = parseFloat(String(rawPrice).replace(/[^0-9.,]/g,'').replace(',','.')) || 0;
  const oldPriceNum = product.oldPrice ? parseFloat(String(product.oldPrice).replace(/[^0-9.,]/g,'').replace(',','.')) : 0;
  const shortSpec = product.shortSpec || '';
  const description = product.description || '';
  const specs = product.specs || {};

  const handleAddToCart = () => {
    addToCart({ ...product, id: product.id || product.sku, title, price: priceNum, image: imgs[0] }, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl relative my-8" onClick={e=>e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 z-20 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full p-2 border-0 outline-none"><X className="w-5 h-5" /></button>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="bg-[#f8f9fb] p-4 flex flex-col">
            <div className="aspect-square bg-white rounded-2xl overflow-hidden relative border-0">
              <Image src={fullSrc} alt={title} fill className="object-contain p-6 border-0 outline-none" unoptimized style={{border:'none', outline:'none'}} />
            </div>
            {imgs.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
                {imgs.map((src:any,i:number)=>(
                  <button key={i} onClick={()=>setActiveImg(i)} className={`w-16 h-16 shrink-0 bg-white rounded-xl overflow-hidden border-2 ${activeImg===i ? 'border-slate-900' : 'border-transparent hover:border-slate-200'} outline-none`}>
                    <img src={src} className="w-full h-full object-contain p-2 border-0" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="p-6 flex flex-col">
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-snug mb-3">{title}</h2>
              {shortSpec && <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-4 text-sm text-slate-800">{shortSpec}</div>}
              <div className="flex items-baseline space-x-3 mb-4">
                <span className="text-2xl font-extrabold text-[#0e4da4]">{priceNum.toFixed(2)} €</span>
                {oldPriceNum > 0 && <span className="text-sm text-slate-400 line-through">{oldPriceNum.toFixed(2)} €</span>}
              </div>
              {description && <p className="text-sm text-slate-700 leading-relaxed mb-4 whitespace-pre-line">{description}</p>}
              <div className="space-y-2 text-sm mb-6">
                <div className="flex items-center text-slate-700 space-x-2"><MapPin className="w-4 h-4 text-[#0e4da4]" /><span>Kätte saamine: <strong>Lille 14-4 Tallinn</strong></span></div>
                <div className="flex items-center text-slate-700 space-x-2"><Truck className="w-4 h-4 text-emerald-600" /><span>Omniva & DPD (4.90 €)</span></div>
                <div className="flex items-center text-slate-700 space-x-2"><ShieldCheck className="w-4 h-4 text-amber-600" /><span>Garantii: <strong>12 kuud</strong></span></div>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-200 flex items-center space-x-3">
              <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden"><button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 outline-none"><Minus className="w-3.5 h-3.5" /></button><span className="px-4 py-2 text-sm font-bold">{quantity}</span><button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 outline-none"><Plus className="w-3.5 h-3.5" /></button></div>
              <button onClick={handleAddToCart} className="flex-1 bg-[#0e4da4] hover:bg-[#0a3a7d] text-white font-bold py-3 px-4 rounded-xl text-sm flex items-center justify-center space-x-2 outline-none"><ShoppingBag className="w-4 h-4" /><span>Lisa korvi ({(priceNum * quantity).toFixed(2)} €)</span></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};