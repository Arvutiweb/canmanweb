'use client';
import ProductCard from './ProductCard';

export default function ProductGrid({ products }: any) {
  if (!products?.length) return <div className="text-center py-20 text-slate-500">Tooteid ei leitud</div>;
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {products.map((product: any) => (
        <ProductCard key={String(product.id)} product={product} onSelect={() => {}} />
      ))}
    </div>
  );
}
