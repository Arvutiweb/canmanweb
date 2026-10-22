'use client';
import { Clock, ShoppingCart, CheckCircle } from 'lucide-react';

export default function ProductCard({ product, onSelectProduct }: any) {
  const main = product.images?.[0] || product.image || '/images/placeholder.png';
  const title = product.title || product.name || '';
  const price = product.finalPrice || product.price || '';
  const brand = product.brand || product.title?.split(' ')[0] || '';
  const stock = product.stock ?? product.qty ?? product.quantity ?? product.inStock ?? 0;

  return (
    <div className="group bg-white rounded- border border-slate-200 overflow-hidden hover:shadow-md transition-all flex flex-col">
      {/* PILT - väiksem */}
      <div className="aspect-[4/3] bg-white relative overflow-hidden cursor-pointer" onClick={()=>onSelectProduct(product)}>
        <span className="absolute top-2.5 left-2.5 z-10 bg-[#ff8c00] text-white text- font-bold px-2 py-0.5 rounded-">
          KASUTATUD
        </span>
        {/* PILT VÄIKSEM - 75% suurus */}
        <div className="w-full h-full flex items-center justify-center p-6">
          <img src={main} alt={title} className="w-[85%] h-[85%] object-contain group-hover:scale-105 transition-all duration-300" />
        </div>
      </div>

      {/* SISU - nagu pildil */}
      <div className="px-3 pb-3 pt-2 flex flex-col flex-1">
        <div className="text-[#0e7aff] text- font-bold tracking-wider mb-1">{brand.toUpperCase()}</div>
        <h3 className="text- font-bold leading-tight line-clamp-2 min-h- mb-3">
          {title}
        </h3>
        
        <div className="h- bg-slate-100 rounded-full mb-3"></div>

        <div className="mt-auto">
          {/* SIIN MUUDATUS - Laos x tk. Tellimise asemel */}
          {stock > 0 ? (
            <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text- font-medium px-2.5 py-1 rounded- mb-3">
              <CheckCircle className="w-3.5 h-3.5" /> Laos {stock} tk.
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-100 text-slate-600 text- px-2.5 py-1 rounded- mb-3">
              <Clock className="w-3.5 h-3.5" /> Tellimisel (1-3 päeva)
            </div>
          )}

          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text- font-extrabold text-[#0e4da4]">€{price}</span>
                <span className="text- text-slate-500">sis.</span>
              </div>
              <div className="text- text-slate-400 -mt-1">KM</div>
            </div>
            <button onClick={()=>onSelectProduct(product)} className="bg-[#0e4da4] hover:bg-[#0a3a7d] text-white rounded- px-3.5 py-2 flex items-center gap-1.5 text- font-bold">
              <ShoppingCart className="w-4 h-4" /> Lisa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}