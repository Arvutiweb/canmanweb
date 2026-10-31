'use client';
import Image from 'next/image';
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
      <div className="aspect-square bg-[#f8f9fb] rounded-lg m-1.5 p-1.5 flex items-center justify-center">
        <div className="relative w-full h-full bg-white rounded-md p-1">
          <Image
            src={main}
            alt={title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain rounded-md p-2"
          />
        </div>
      </div>

      <div className="px-2.5 pb-2.5 pt-1">
        <div className="text-[#0e7aff] text-[10px] font-bold mb-1">{brand.toUpperCase()}</div>
        <h3 className="text-xs font-semibold leading-tight line-clamp-2 min-h-[2rem] text-slate-800 mb-2">
          {title}
        </h3>

        <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-medium px-2 py-0.5 rounded-full mb-2">
          <CheckCircle2 className="w-3 h-3" /> Laos {stock} tk.
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-extrabold text-[#0e4da4]">€{price}</span>
          <button className="bg-[#0e4da4] text-white rounded-full px-3 py-1 flex items-center gap-1 text-[10px] font-bold">
            <ShoppingCart className="w-3 h-3" /> Lisa
          </button>
        </div>
      </div>
    </div>
  );
}