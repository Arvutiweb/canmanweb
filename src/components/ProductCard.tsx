export function ProductCard({ product }: any) {
  const imgSrc = product.image || product.images?.[0] || product.Images?.[0] || null
  const fullSrc = imgSrc ? (imgSrc.startsWith('/') ? imgSrc : `/images/${imgSrc}`) : '/images/placeholder.webp'

  // Puhasta hind - võta kõik imelikud märgid maha
  const cleanPrice = String(product.price || '').replace(/[^0-9.,]/g, '').replace(',', '.')
  const priceNum = parseFloat(cleanPrice) || 0

  return (
    <div className="border rounded-lg p-3 hover:shadow-lg transition bg-white">
      <div className="aspect-[4/3] bg-gray-100 rounded overflow-hidden">
        <img 
          src={fullSrc} 
          alt={product.name || product.sku} 
          className="w-full h-full object-contain"
          loading="lazy"
          onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder.webp' }}
        />
      </div>
      <h3 className="mt-2 font-medium text-sm line-clamp-2 leading-tight">{product.name || product.sku}</h3>
      <p className="mt-1 font-bold text-">{priceNum ? `${priceNum} €` : ''}</p>
    </div>
  )
}

export default ProductCard
