'use client';
export function ProductCard({ product, onSelectProduct }: any) {
  let imgSrc = product.image || product.Images || product.images?.[0] || null
  if (Array.isArray(imgSrc)) imgSrc = imgSrc[0]
  if (typeof imgSrc === 'string' && imgSrc.includes(',')) imgSrc = imgSrc.split(',')[0].trim()
  const fullSrc = imgSrc ? (imgSrc.startsWith('/') ? imgSrc : `/images/${imgSrc}`) : '/images/placeholder.png'
  const cleanPrice = String(product.price || '').replace(/[^0-9.,]/g, '').replace(',', '.')
  const priceNum = parseFloat(cleanPrice) || 0
  const title = product.title || product.name || product.sku || ''
  return (
    <div onClick={() => onSelectProduct?.(product)} className="border border-slate-200 rounded-xl p-3 hover:shadow-lg transition bg-white cursor-pointer group flex flex-col h-full">
      <div className="aspect-[4/3] bg-white rounded-lg overflow-hidden flex items-center justify-center">
        <img src={fullSrc} alt={title} className="w-full h-full object-contain" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder.png' }} />
      </div>
      <h3 className="mt-2 font-medium text-sm line-clamp-2 leading-tight min-h-">{title}</h3>
      <div className="mt-auto pt-2">
        <p className="font-bold text-">{priceNum ? `${priceNum} €` : ''}</p>
      </div>
    </div>
  )
}
export default ProductCard
