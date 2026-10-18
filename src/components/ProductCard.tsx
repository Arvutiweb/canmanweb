'use client';
export default function ProductCard({ product }: any) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col">
      <div className="h- bg-white flex items-center justify-center p-4">
        <img src={product.image} alt={product.title} className="max-h-full max-w-full object-contain" loading="lazy" />
      </div>
      <div className="p-4 border-t">
        <div className="text- text-slate-400 uppercase">{product.brand}</div>
        <div className="text- font-semibold line-clamp-2 h-">{product.title}</div>
        <div className="mt-2 font-bold text-[#0e4da4]">{product.price} €</div>
      </div>
    </div>
  );
}
