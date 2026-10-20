import { getAllProducts } from "@/lib/products"
import ProductCard from "@/components/ProductCard"

export default function PoodPage(){
  const all = getAllProducts();
  return (
    <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
      {all.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}