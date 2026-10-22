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

  const allImgs: any[] = product.images || product.Images || product.rawImages || [];
  const norm = (s:any)=>{ const t=String(s||''); return t ? (t.startsWith('/')||t.startsWith('http') ? t : `/images/${t}`) : ''; };
  let imgs = allImgs.map(norm).filter(Boolean);
  if (!imgs.length) { const single = product.imageUrl || product.image; if (single) imgs = [norm(single)]; }
  if (!imgs.length) imgs = ['/images/placeholder.webp'];
  const fullSrc = imgs[activeImg] || imgs[0];

  const title = product.title || product.name || product.sku || '';
  const rawPrice = product.finalPrice || product.salePrice || product.price || 0;
  const priceNum = parseFloat(String(rawPrice).replace(/[^0-9.,]/g,'').replace(',','.')) || 0;
  const oldPriceNum = product.oldPrice ? parseFloat(String(product.oldPrice).replace(/[^0-9.,]/g,'').replace(',','.')) : 0;
  const shortSpec = product.shortSpec || product.shortDescription || '';
  const description = product.description || '';
  const specs = product.specs || product.attributes || {};
  const hasSpecs = specs && Object.keys(specs).length > 0;

  const handleAddToCart = () => {
    addToCart({ ...product, id: product.id || product.sku, title, price: priceNum, image: imgs[0] }, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded- max-w-3xl w-full overflow-hidden shadow-2xl relative my-8" onClick={e=>e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 z-20 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full p-2"><X className="w-5 h-5" /></button>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="bg-[#f8f9fb] p-4 flex flex-col">
            <div className="aspect-square bg-white rounded- overflow-hidden relative">
              <Image src={fullSrc} alt={title} fill className="object-contain p-6" unoptimized />
            </div>
            {imgs.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
                {imgs.map((src:any,i:number)=><button key={i} onClick={()=>setActiveImg(i)} className={`w-16 h-16 shrink-0 bg-white rounded-xl overflow-hidden border-2 ${activeImg===i ? 'border-[#0e4da4]' : 'border-transparent hover:border-slate-200'}`}><img src={src} className="w-full h-full object-contain p-2" /></button>)}
              </div>
            )}
          </div>
          <div className="p-6 flex flex-col max-h- overflow-y-auto">
            <div>
              <div className="text-xs text-slate-500 font-medium mb-1">{product.brand || ''} / {product.categoryL1 || product.topCategory || ''} / {product.categoryL2 || product.subCategory || ''}</div>
              <h2 className="text-xl font-bold text-slate-900 leading-snug mb-3">{title}</h2>
              {shortSpec && <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-4 text- text-slate-800 leading-relaxed">{shortSpec}</div>}
              <div className="flex items-baseline space-x-3 mb-4">
                <span className="text-2xl font-extrabold text-[#0e4da4]">{priceNum.toFixed(2)} €</span>
                {oldPriceNum > 0 && <span className="text-sm text-slate-400 line-through">{oldPriceNum.toFixed(2)} €</span>}
              </div>
              {description && <p className="text- text-slate-700 leading-relaxed mb-4 whitespace-pre-line">{description}</p>}
              {hasSpecs && (
                <div className="border border-slate-200 rounded-lg overflow-hidden mb-6 text-">
                  <div className="divide-y divide-slate-100">
                    {Object.entries(specs).map(([key, val]: any) => val ? <div key={key} className="grid grid-cols-3 px-3 py-2"><span className="text-slate-500 capitalize">{key}:</span><span className="col-span-2 text-slate-800 font-medium">{String(val)}</span></div> : null)}
                  </div>
                </div>
              )}
              <div className="space-y-2 text- mb-6">
                <div className="flex items-center text-slate-700 space-x-2"><MapPin className="w-4 h-4 text-[#0e4da4] flex-shrink-0" /><span>Kätte saamine: <strong>Lille 14-4 Tallinn</strong></span></div>
                <div className="flex items-center text-slate-700 space-x-2"><Truck className="w-4 h-4 text-emerald-600 flex-shrink-0" /><span>Omniva & DPD (4.90 €)</span></div>
                <div className="flex items-center text-slate-700 space-x-2"><ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0" /><span>Garantii: <strong>{(specs as any).warranty || 'erinevalt'}</strong></span></div>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-200 flex items-center space-x-3">
              <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden"><button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 bg-slate-100"><Minus className="w-3.5 h-3.5" /></button><span className="px-4 py-2 text-xs font-bold">{quantity}</span><button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 bg-slate-100"><Plus className="w-3.5 h-3.5" /></button></div>
              <button onClick={handleAddToCart} className="flex-1 bg-[#0e4da4] hover:bg-[#0a3a7d] text-white font-bold py-2.5 px-4 rounded-lg text-sm flex items-center justify-center space-x-2"><ShoppingBag className="w-4 h-4" /><span>Lisa korvi ({(priceNum * quantity).toFixed(2)} €)</span></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};