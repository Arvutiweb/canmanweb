'use client';
export default function ProductCard({ product, onSelectProduct }: any) {
  const main = product.images?.[0] || product.image || '/images/placeholder.png';
  const second = product.images?.[1] || '';
  const title = product.title || product.name || '';
  const price = product.finalPrice || product.price || '';
  return (
    <div onClick={()=>onSelectProduct(product)} className="group cursor-pointer bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="aspect-square bg-[#f8f9fb] rounded-3xl m-2.5 overflow-hidden relative">
        <img src={main} alt={title} className={`w-full h-full object-contain p-3 bg-white rounded-2xl border-0 outline-none ring-0 transition-all duration-500 ${second ? 'group-hover:opacity-0' : 'group-hover:scale-105'}`} />
        {second && <img src={second} alt={title} className="w-full h-full object-contain p-3 bg-white rounded-2xl border-0 outline-none ring-0 absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500" />}
      </div>
      <div className="px-4 pb-4 pt-1">
        <h3 className="text- leading-snug line-clamp-2 min-h-">{title}</h3>
        <div className="mt-1 font-bold text-">{price ? `${price} €` : ''}</div>
      </div>
    </div>
  );
}