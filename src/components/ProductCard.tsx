'use client';

export function ProductCard({ product, onSelectProduct }: any) {
  // võta pilt - toetab kõiki variante
  let imgSrc = product.image || product.Images || product.Image || null;
  
  // kui on array või koma-ga string
  if (Array.isArray(imgSrc)) imgSrc = imgSrc[0];
  if (typeof imgSrc === 'string' && imgSrc.includes(',')) imgSrc = imgSrc.split(',')[0].trim();
  if (Array.isArray(product.images)) imgSrc = product.images[0] || imgSrc;
  if (Array.isArray(product.Images)) imgSrc = product.Images[0] || imgSrc;

  const fullSrc = imgSrc 
    ? (imgSrc.startsWith('/') || imgSrc.startsWith('http') ? imgSrc : `/images/${imgSrc.trim()}`) 
    : '/images/placeholder.webp';

  const cleanPrice = String(product.price || '').replace(/[^0-9.,]/g, '').replace(',', '.');
  const priceNum = parseFloat(cleanPrice) || 0;
  const title = product.title || product.name || product.sku || '';

  return (
    <div onClick={() => onSelectProduct?.(product)} className="border border-slate-200 rounded-xl p-3 hover:shadow-lg transition bg-white cursor-pointer group flex flex-col h-full">
      <div className="aspect-[4/3] bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center">
        <img 
          src={fullSrc} 
          alt={title} 
          className="w-full h-full object-contain group-hover:scale-105 transition duration-300" 
          loading="lazy" 
          onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder.webp' }} 
        />
      </div>
      <h3 className="mt-2 font-medium text-sm line-clamp-2 leading-tight min-h-">{title}</h3>
      <div className="mt-auto pt-2">
        <p className="font-bold text-base">{priceNum ? `${priceNum} €` : ''}</p>
      </div>
    </div>
  )
}
export default ProductCard
