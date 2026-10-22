'use client';
export default function ProductCard({ product, onSelectProduct }: any) {
  const main = product.images?.[0] || product.image || '/images/placeholder.png';
  const second = product.images?.[1] || '';
  const title = product.title || product.name || '';
  const price = product.finalPrice || product.price || '';
  return (
    <div onClick={()=>onSelectProduct(product)} className="group cursor-pointer bg-white rounded- border border-slate-100 overflow-hidden hover:shadow-md transition-all">
      <div className="aspect-square bg-[#f8f9fb] rounded- m- overflow-hidden relative">
        <img src={main} alt={title} style={{borderTopLeftRadius:'8px', borderTopRightRadius:'8px'}} className={`w-full h-full object-contain p-2 bg-white transition-all duration-300 ${second ? 'group-hover:opacity-0' : 'group-hover:scale-105'}`} />
        {second && <img src={second} alt={title} style={{borderTopLeftRadius:'8px', borderTopRightRadius:'8px'}} className="w-full h-full object-contain p-2 bg-white absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300" />}
      </div>
      <div className="px-2.5 pb-2.5 pt-1">
        <h3 className="text- leading-[1.3] line-clamp-2 min-h-">{title}</h3>
        <div className="mt-1 font-bold text-">{price ? `${price} €` : ''}</div>
      </div>
    </div>
  );
}