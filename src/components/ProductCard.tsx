'use client';
import { ShoppingCart, CheckCircle2 } from 'lucide-react';

export default function ProductCard({ product, onSelectProduct }: any) {
  const main = product.images?.[0] || product.image || '/images/placeholder.png';
  const title = product.title || product.name || '';
  const price = product.finalPrice || product.price || '';
  const brand = product.brand || product.title?.split(' ')[0] || '';
  const stock = product.stock ?? product.qty ?? product.quantity ?? 1;

  return (
    <div onClick={()=>onSelectProduct(product)} className="cursor-pointer bg-white rounded-xl border border-[#e6efff] overflow-hidden hover:shadow-md transition-all">
      {/* PILT - EI HÜPPA */}
      <div className="aspect-square bg-[#f8f9fb] rounded-xl m-2 p-2 flex items-center justify-center">
        <div className="w-full h-full bg-white rounded-lg flex items-center justify-center p-3">
          <img src={main} alt={title} className="max-w-full max-h-full object-contain rounded-md" />
        </div>
      </div>

      <div className="px-3 pb-3 pt-1">
        <div className="text-[#0e7aff] text-xs font-bold mb-1">{brand.toUpperCase()}</div>
        <h3 className="text-sm font-semibold leading-tight line-clamp-2 min-h- text-slate-800 mb-3">
          {title}
        </h3>

        <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-medium px-3 py-1 rounded-full mb-3">
          <CheckCircle2 className="w-3 h-3" /> Laos {stock} tk.
        </div>

        <div className="flex items-center justify-between">
          <span className="text-base font-extrabold text-[#0e4da4]">€{price}</span>
          <button className="bg-[#0e4da4] text-white rounded-full px-4 py-1.5 flex items-center gap-1 text-xs font-bold">
            <ShoppingCart className="w-3.5 h-3.5" /> Lisa
          </button>
        </div>
      </div>
    </div>
  );
}