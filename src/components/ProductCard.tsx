'use client';
import React from 'react';

function clean(v: any) {
  return String(v || '')
    .replace(/â‚¬/g, '€')
    .replace(/â€¢/g, ' ')
    .replace(/Ãµ/g, 'õ')
    .replace(/Ã¤/g, 'ä')
    .replace(/Ã¶/g, 'ö')
    .replace(/Ã¼/g, 'ü')
}

export function ProductCard({ product, onSelectProduct }: any) {
  const imgSrc = product.image || product.images?.[0] || product.Images?.[0] || null
  const fullSrc = imgSrc ? (imgSrc.startsWith('/') ? imgSrc : `/images/${imgSrc}`) : '/images/placeholder.webp'
  
  const title = clean(product.title || product.name || product.sku)
  const price = Number(product.price) || 0
  const brand = clean(product.brand)

  return (
    <div 
      onClick={() => onSelectProduct(product)}
      className="border border-slate-200 rounded-xl p-3 hover:shadow-lg transition bg-white cursor-pointer group flex flex-col"
    >
      <div className="aspect-[4/3] bg-gray-50 rounded-lg overflow-hidden">
        <img 
          src={fullSrc} 
          alt={title} 
          className="w-full h-full object-contain group-hover:scale-105 transition duration-300"
          loading="lazy"
          onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder.webp' }}
        />
      </div>
      
      {/* BRAND + SKU ilma Kasutatud sildita */}
      <div className="mt-2 text- text-slate-500 truncate">
        {brand} {product.sku ? `• ${product.sku}` : ''}
      </div>

      <h3 className="mt-1 font-medium text- line-clamp-2 leading-tight min-h-">{title}</h3>
      
      <div className="mt-auto pt-2">
        <p className="font-bold text-">{price ? `${price} €` : ''}</p>
        <p className="text- text-slate-500">sis. 22% KM</p>
      </div>
    </div>
  )
}

export default ProductCard
