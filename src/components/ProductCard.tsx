'use client';
export default function ProductCard({ product, onSelectProduct }: any) {
  const raw = product.images || product.Images || product.rawImages || [];
  const norm = (s:any) => {
    if (!s) return '';
    if (typeof s === 'object') s = s.url || s.src || '';
    let t = String(s).trim();
    if (t.includes('[STRIPPED 3 bytes]') || t.length > 300) return '';
    return t ? (t.startsWith('/') || t.startsWith('http') ? t : `/images/${t}`) : '';
  };
  const imgs = raw.map(norm).filter(Boolean);
  const mainRaw = product.image || product.imageUrl || product.mainImage || '';
  const mainNorm = norm(mainRaw);
  const main = imgs[0] || mainNorm || '/images/placeholder.png';
  const second = imgs[1] || '';

  const title = product.title || product.name || product.sku || '';
  const price = product.finalPrice || product.salePrice || product.price || '';

  return (
    <div onClick={()=>onSelectProduct(product)} className="group cursor-pointer bg-white rounded- border border-slate-100 overflow-hidden hover:shadow-xl transition-all">
      <div className="aspect-square bg-[#f8f9fb] rounded- m- overflow-hidden relative">
        <img src={main} alt={title} className={`w-full h-full object-contain p-3 bg-white rounded- transition-all duration-500 ${second ? 'group-hover:opacity-0' : 'group-hover:scale-105'}`} />
        {second && <img src={second} alt={title} className="w-full h-full object-contain p-3 bg-white rounded- absolute inset-0 opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />}
      </div>
      <div className="px-3.5 pb-3.5 pt-1">
        <h3 className="text- leading-snug line-clamp-2 min-h-">{title}</h3>
        <div className="mt-1 font-bold text-">{price ? `${price} €` : ''}</div>
      </div>
    </div>
  );
}