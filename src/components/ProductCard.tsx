'use client';
export default function ProductCard({ product, onSelectProduct }: any) {
  const raw = product.images || product.Images || product.rawImages || [];
  const norm = (s:any) => {
    if (!s) return '';
    if (typeof s === 'object') s = s.url || s.src || '';
    const t = String(s);
    return t ? (t.startsWith('/') || t.startsWith('http') ? t : `/images/${t}`) : '';
  };
  const imgs = raw.map(norm).filter(Boolean);
  const main = imgs[0] || norm(product.image || product.imageUrl) || '/images/placeholder.png';
  const second = imgs[1] || '';
  const title = product.title || product.name || product.sku || '';
  const price = product.finalPrice || product.salePrice || product.price || '';

  return (
    <div onClick={()=>onSelectProduct(product)} style={{borderRadius:'24px', overflow:'hidden', border:'1px solid #e6efff'}} className="group cursor-pointer bg-white hover:shadow-xl">
      <div style={{overflow:'hidden'}} className="aspect-square bg-white relative">
        <img src={main} alt={title} style={{borderTopLeftRadius:'24px', borderTopRightRadius:'24px'}} className={`w-full h-full object-contain p-8 ${second ? 'group-hover:opacity-0' : 'group-hover:scale-105'} transition-all`} />
        {second && <img src={second} alt={title} style={{borderTopLeftRadius:'24px', borderTopRightRadius:'24px'}} className="w-full h-full object-contain p-8 bg-white absolute inset-0 opacity-0 group-hover:opacity-100 transition-all" />}
      </div>
      <div className="px-3.5 pb-3.5 pt-1">
        <h3 style={{fontSize:'13px'}} className="leading-snug line-clamp-2 min-h-">{title}</h3>
        <div style={{fontSize:'14px', fontWeight:'700'}} className="mt-1">{price ? `${price} €` : ''}</div>
      </div>
    </div>
  );
}