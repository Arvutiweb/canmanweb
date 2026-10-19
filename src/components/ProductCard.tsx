'use client';

export function ProductCard({ product, onSelectProduct }: any) {
  const allImgs: string[] = product.images?.length ? product.images : (product.Images || []);
  const norm = (s: string) => s ? (s.startsWith('/') ? s : `/images/${s}`) : '';
  const imgs = allImgs.map(norm).filter(Boolean);
  const fullSrc = imgs[0] || (product.image ? norm(product.image) : '/images/placeholder.png');
  const secondSrc = imgs[1] || null;
  const cleanPrice = String(product.price || '').replace(/[^0-9.,]/g, '').replace(',', '.');
  const priceNum = parseFloat(cleanPrice) || 0;
  const title = product.title || product.name || product.sku || '';
  const isNew = product.isNew || imgs.length > 2;

  return (
    <div onClick={() => onSelectProduct?.(product)} className="group cursor-pointer bg-white rounded- border border-slate-100 overflow-hidden hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] hover:border-slate-200 transition-all duration-300 hover:-translate-y-1 flex flex-col">
      <div className="aspect-[4/3] bg-[#f8f9fb] relative overflow-hidden">
        {isNew && <span className="absolute top-3 left-3 z-10 bg-black text-white text- font-bold px-2.5 py-1 rounded-full tracking-wider">UUS</span>}
        <span className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur text- font-medium px-2 py-1 rounded-full border">{imgs.length} foto</span>
        <img src={fullSrc} alt={title} className={`w-full h-full object-contain p-4 transition-all duration-500 absolute inset-0 ${secondSrc ? 'group-hover:opacity-0 group-hover:scale-105' : 'group-hover:scale-105'}`} loading="lazy" onError={(e)=>{(e.target as HTMLImageElement).src='/images/placeholder.png'}} />
        {secondSrc && <img src={secondSrc} alt={title} className="w-full h-full object-contain p-4 transition-all duration-500 opacity-0 group-hover:opacity-100 group-hover:scale-105 absolute inset-0" loading="lazy" />}
        <div className="absolute bottom-0 left-0 right-0 h-[50%] bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition" />
      </div>
      <div className="p-3.5 flex flex-col flex-1">
        <h3 className="font-medium text-[13.5px] leading-[1.35] line-clamp-2 text-slate-900 min-h-">{title}</h3>
        <div className="mt-3 flex items-end justify-between">
          <div>
            <p className="font-bold text- tracking-tight">{priceNum ? `${priceNum} €` : ''}</p>
            <p className="text- text-slate-400 -mt-0.5">KM-ga 24%</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <span className="text-">↗</span>
          </div>
        </div>
      </div>
    </div>
  )
}
export default ProductCard