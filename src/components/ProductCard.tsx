'use client';

export function ProductCard({ product, onSelectProduct }: any) {
  const allImgs: string[] = product.images?.length ? product.images : (product.Images || product.rawImages || []);
  const norm = (s: string) => s ? (s.startsWith('/') || s.startsWith('http') ? s : `/images/${s}`) : '';
  const imgs = allImgs.map(norm).filter(Boolean);
  const fullSrc = imgs[0] || (product.image ? norm(product.image) : '/images/placeholder.png');
  const cleanPrice = String(product.finalPrice || product.salePrice || product.price || '').replace(/[^0-9.,]/g, '').replace(',', '.');
  const priceNum = parseFloat(cleanPrice) || 0;
  const title = product.title || product.name || product.sku || '';
  const isNew = product.isNew || product.stock === 1;

  return (
    <div onClick={() => onSelectProduct?.(product)} className="group cursor-pointer bg-white rounded- border border-slate-100 overflow-hidden hover:shadow-[0_12px_32px_rgba(0,0,0,0.10)] hover:border-slate-200 transition-all duration-300 hover:-translate-y-1 flex flex-col">
      {/* FIX: aspect-square + object-cover + rounded- + m-2.5 */}
      <div className="aspect-square bg-[#f8f9fb] relative overflow-hidden rounded- m-2.5 mb-0">
        {isNew && <span className="absolute top-3 left-3 z-10 bg-black text-white text- font-bold px-2.5 py-1 rounded-full tracking-wider">UUS</span>}
        {imgs.length > 1 && <span className="absolute top-3 right-3 z-10 bg-white/95 backdrop-blur text- font-medium px-2.5 py-1 rounded-full border shadow-sm">{imgs.length} foto</span>}
        
        {/* FIX: object-cover mitte object-contain, ilma p-4, ilus ümar */}
        <img 
          src={fullSrc} 
          alt={title} 
          className="w-full h-full object-cover rounded- transition-all duration-500 group-hover:scale-[1.05]" 
          loading="lazy" 
          onError={(e)=>{(e.target as HTMLImageElement).src='/images/placeholder.png'}} 
        />
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