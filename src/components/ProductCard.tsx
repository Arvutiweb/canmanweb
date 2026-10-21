'use client';
export default function ProductCard({ product, onSelectProduct }: any) {
  const main = product.images?.[0] || product.image || '/images/placeholder.png';
  const second = product.images?.[1] || '';
  const title = product.title || product.name || '';
  const price = product.finalPrice || product.price || '';
  return (
    <div onClick={()=>onSelectProduct(product)} style={{borderRadius:'24px', overflow:'hidden', border:'1px solid #e6efff'}} className="group cursor-pointer bg-white hover:shadow-xl">
      <div style={{overflow:'hidden'}} className="aspect-square bg-white relative">
        <img src={main} alt={title} style={{borderTopLeftRadius:'24px', borderTopRightRadius:'24px'}} className={`w-full h-full object-contain p-8 ${second ? 'group-hover:opacity-0' : 'group-hover:scale-105'} transition-all`} />
        {second && <img src={second} alt={title} style={{borderTopLeftRadius:'24px', borderTopRightRadius:'24px'}} className="w-full h-full object-contain p-8 bg-white absolute inset-0 opacity-0 group-hover:opacity-100 transition-all" />}
      </div>
      <div className="px-4 pb-4 pt-2">
        <h3 style={{fontSize:'13px', lineHeight:'1.3'}} className="line-clamp-2 min-h-">{title}</h3>
        <div style={{fontSize:'14px', fontWeight:'700', marginTop:'4px'}}>{price ? `${price} €` : ''}</div>
      </div>
    </div>
  );
}