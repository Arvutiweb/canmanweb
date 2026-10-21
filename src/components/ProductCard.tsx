'use client';
import { Clock, ShoppingCart, Eye } from 'lucide-react';

export default function ProductCard({ product, onSelectProduct }: any) {
  const raw = product.images || product.Images || product.rawImages || [];
  const norm = (s:any) => {
    if (!s) return '';
    if (typeof s === 'object') s = s.url || s.src || '';
    const t = String(s);
    return t ? (t.startsWith('/') || t.startsWith('http') ? t : `/images/${t}`) : '';
  };
  const imgs = raw.map(norm).filter(Boolean);
  const main = imgs[0] || norm(product.image || product.imageUrl) || '/images/placeholder.png';
  const title = product.title || product.name || product.sku || '';
  const price = product.finalPrice || product.salePrice || product.price || '';
  const brand = product.brand || product.title?.split(' ')[0] || '【entity-DELL¦canonical_name=DELL】';

  return (
    <div className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all flex flex-col">
      {/* PILT + BADGE + NUPP */}
      <div className="aspect-[4/3] bg-white relative overflow-hidden p-2" onClick={()=>onSelectProduct(product)}>
        <span className="absolute top-3 left-3 z-10 bg-[#ff8c00] text-white text- font-bold px-2.5 py-1 rounded-md">
          KASUTATUD
        </span>
        <img src={main} alt={title} className="w-full h-full object-contain" />
        
        <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/95 backdrop-blur shadow-md border border-slate-200 rounded-full px-4 py-2 flex items-center gap-1.5 text- font-medium hover:bg-white transition-all">
          <Eye className="w-4 h-4" /> Vaata detaile
        </button>
      </div>

      {/* SISU */}
      <div className="px-3.5 pb-3 pt-3 flex flex-col flex-1">
        <div className="text-[#0e4da4] text- font-bold tracking-wider mb-1">{brand.toUpperCase()}</div>
        <h3 className="text- font-bold leading-tight line-clamp-2 min-h- mb-3">
          {title}
        </h3>
        
        <div className="h- bg-slate-100 rounded mb-4"></div>

        <div className="mt-auto">
          <div className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-100 text- text-slate-600 px-2.5 py-1 rounded-md mb-3">
            <Clock className="w-3.5 h-3.5" /> Tellimisel (1-3 päeva)
          </div>

          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text- font-extrabold text-[#0e4da4]">€{price}0</span>
                <span className="text- text-slate-500">sis.</span>
              </div>
              <div className="text- text-slate-400 -mt-1">KM</div>
            </div>
            <button onClick={()=>onSelectProduct(product)} className="bg-[#0e4da4] hover:bg-[#0a3a7d] text-white rounded-lg px-4 py-2 flex items-center gap-1.5 text- font-bold">
              <ShoppingCart className="w-4 h-4" /> Lisa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}