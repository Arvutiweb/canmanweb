'use client';

export function ProductCard({ product, onSelectProduct }: any) {
  const allImgs: string[] = product.images?.length ? product.images : (product.Images || []);
  // normaliseeri /images/ path
  const norm = (s: string) => s ? (s.startsWith('/') ? s : `/images/${s}`) : '';
  const imgs = allImgs.map(norm).filter(Boolean);
  const fullSrc = imgs[0] || (product.image ? norm(product.image) : '/images/placeholder.png');
  const secondSrc = imgs[1] || null;
  const cleanPrice = String(product.price || '').replace(/[^0-9.,]/g, '').replace(',', '.');
  const priceNum = parseFloat(cleanPrice) || 0;
  const title = product.title || product.name || product.sku || '';

  return (
    <div onClick={() => onSelectProduct?.(product)} className="border border-slate-200 rounded-xl p-3 hover:shadow-lg transition bg-white cursor-pointer group flex flex-col">
      <div className="aspect-[4/3] bg-gray-50 rounded-lg overflow-hidden relative">
        <img src={fullSrc} alt={title} className={`w-full h-full object-contain transition duration-300 absolute inset-0 ${secondSrc ? 'group-hover:opacity-0' : 'group-hover:scale-105'}`} loading="lazy" onError={(e) =>{ (e.target as HTMLImageElement).src = '/images/placeholder.png' }} />
        {secondSrc && (
          <img src={secondSrc} alt={title} className="w-full h-full object-contain transition duration-300 opacity-0 group-hover:opacity-100 absolute inset-0" loading="lazy" onError={(e) =>{ (e.target as HTMLImageElement).style.display='none' }} />
        )}
      </div>
      <h3 className="mt-2 font-medium text-sm line-clamp-2 leading-tight">{title}</h3>
      <div className="mt-auto pt-2">
        <p className="font-bold text-base">{priceNum ? `${priceNum} €` : ''}</p>
      </div>
    </div>
  )
}
export default ProductCard