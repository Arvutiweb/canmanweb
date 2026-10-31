import { getThirdCategoryParams } from '@/lib/staticProductParams';
import { getAllProducts } from '@/lib/products';
import ClientProducts from './[fourth]/ClientProducts';

export function generateStaticParams() {
  return getThirdCategoryParams();
}

const categoryKey = (value: unknown) =>
  String(value || '')
    .toLowerCase()
    .replace(/[õö]/g, 'o')
    .replace(/ü/g, 'u')
    .replace(/ä/g, '')
    .replace(/[^a-z0-9]/g, '');

export default function Page({ params }: { params: { top: string; sub: string; third: string } }) {
  const products = getAllProducts().filter((product: any) => {
    const categorySegments = product.categorySlug
      ? product.categorySlug.split('/')
      : [
          product.categoryL1 || product.topCategory || product.categoryPath?.[0],
          product.categoryL2 || product.subCategory || product.categoryPath?.[1],
          product.categoryL3 || product.sub2Category || product.categoryPath?.[2],
        ];
    return categorySegments.slice(0, 3).every((segment: string, index: number) => (
      categoryKey(segment) === categoryKey([params.top, params.sub, params.third][index])
    ));
  });

  return <ClientProducts products={products} params={params} />;
}
