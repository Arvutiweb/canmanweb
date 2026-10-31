import ClientProducts from './ClientProducts';
import { getFourthCategoryParams } from '@/lib/staticProductParams';
import { getAllProducts } from '@/lib/products';

export function generateStaticParams() {
  return getFourthCategoryParams();
}

function categoryKey(value: unknown) {
  return String(value || '')
    .toLowerCase()
    .replace(/[õö]/g, 'o')
    .replace(/ü/g, 'u')
    .replace(/ä/g, '')
    .replace(/[^a-z0-9]/g, '');
}

export default function Page({params}: any){
  const all = getAllProducts();
  const p = params as any;
  const fourthSlug = p.fourth;

  const filtered = all.filter((prod:any)=>{
    const s3 = categoryKey(prod.categoryL3 || prod.sub2Category || prod.categoryPath?.[2]);
    const s4 = categoryKey(prod.categoryL4 || '');
    return s4
      ? s4 === categoryKey(fourthSlug)
      : s3 === categoryKey(fourthSlug) && categoryKey(p.third) === s3;
  });

  return <ClientProducts products={filtered} params={params} />;
}