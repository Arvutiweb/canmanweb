'use client';
export default function ProductCard({ product, onSelectProduct }: any) {
  const raw = product.images || product.Images || [];
  const main = raw[0] || product.image || '/images/placeholder.png';
  const second = raw[1] || '';
  const title = product.title || product.name || '';
  const price = product.finalPrice || product.price || '';
  return (
    <div onClick={()=>onSelectProduct(product)} className="group cursor-pointer bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-xl transition-all">
      <div className="aspect-square bg-[#f8f9fb] rounded-3xl m-2 overflow-hidden relative">
        <img src={main} alt={title} className={`w-full h-full object-contain p-3 bg-white rounded-2xl transition-all duration-500 border-0 outline-none ${second ? 'group-hover:opacity-0' : 'group-hover:scale-105'}`} style={{border:'0', outline:'none'}} />
        {second && <img src={second} alt={title} className="w-full h-full object-contain p-3 bg-white rounded-2xl absolute inset-0 opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 border-0 outline-none" style={{border:'0', outline:'none'}} />}
      </div>
      <div className="px-3.5 pb-3.5 pt-1">
        <h3 className="text- leading-snug line-clamp-2 min-h-">{title}</h3>
        <div className="mt-1 font-bold text-">{price ? `${price} €` : ''}</div>
      </div>
    </div>
  );
}