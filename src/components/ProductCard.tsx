'use client';
export default function ProductCard({ product, onSelectProduct }: any) {
  const main = product.images?.[0] || product.image || '/images/placeholder.png';
  const second = product.images?.[1] || '';
  const title = product.title || product.name || '';
  const price = product.finalPrice || product.price || '';
  return (
    <div onClick={()=>onSelectProduct(product)} className="group cursor-pointer bg-white rounded- border border-[#e6efff] overflow-hidden hover:shadow-xl">
      <div className="aspect-square bg-white rounded- overflow-hidden relative">
        <img src={main} alt={title} className={`w-full h-full object-contain p-4 rounded- ${second ? 'group-hover:opacity-0' : 'group-hover:scale-105'} transition-all`} />
        {second && <img src={second} alt={title} className="w-full h-full object-contain p-4 bg-white rounded- absolute inset-0 opacity-0 group-hover:opacity-100 transition-all" />}
      </div>
      <div className="px-4 pb-4 pt-2">
        <h3 className="text- leading-snug line-clamp-2 min-h-">{title}</h3>
        <div className="mt-1 font-bold text-">{price ? `${price} €` : ''}</div>
      </div>
    </div>
  );
}