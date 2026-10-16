export function ProductCard({ product }: any) {
  // Võta pilt - töötab nii ühe kui mitme pildiga
  const imgSrc = product.image || product.images?.[0] || product.Images?.[0] || null
  const fullSrc = imgSrc ? (imgSrc.startsWith('/') ? imgSrc : `/images/${imgSrc}`) : '/images/placeholder.webp'

  return (
    <div className="border rounded-lg p-3 hover:shadow-lg transition">
      <div className="aspect-[4/3] bg-gray-100 rounded overflow-hidden">
        <img 
          src={fullSrc} 
          alt={product.name || product.sku} 
          className="w-full h-full object-contain"
          loading="lazy"
        />
      </div>
      <h3 className="mt-2 font-medium text-sm line-clamp-2">{product.name || product.sku}</h3>
      <p className="mt-1 font-bold">{product.price} €</p>
    </div>
  )
}

export default ProductCard
