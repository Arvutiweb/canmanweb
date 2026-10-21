'use client';

export function ProductCard({ product, onSelectProduct }: any) {
  const imgSrc = product.image || product.images?.[0] || product.Images?.[0] || null
  const fullSrc = imgSrc ? (imgSrc.startsWith('/') ? imgSrc : `/images/${imgSrc}`) : '/images/placeholder.png'
  const cleanPrice = String(product.price || '').replace(/[^0-9.,]/g, '').replace(',', '.')
  const priceNum = parseFloat(cleanPrice) || 0
  const title = product.title || product.name || product.sku || ''
  return (
    <div onClick={() => onSelectProduct?.(product)} className="border border-slate-200 rounded-xl p-3 hover:shadow-lg transition bg-white cursor-pointer group flex flex-col">
      <div className="aspect-[4/3] bg-gray-50 rounded-lg overflow-hidden">
        <img src={fullSrc} alt={title} className="w-full h-full object-contain group-hover:scale-105 transition" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder.png' }} />
      </div>
      <h3 className="mt-2 font-medium text-sm line-clamp-2 leading-tight min-h-">{title}</h3>
      <div className="mt-auto pt-2">
        <p className="font-bold text-base">{priceNum ? `${priceNum} €` : ''}</p>
       {/* <p className="text-xs text-slate-500">sis. 24% KM</p> */}
      </div>
    </div>
  )
}
export default ProductCard
