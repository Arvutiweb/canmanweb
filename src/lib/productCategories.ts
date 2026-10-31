export function getMainCategoryName(product: any): string {
  const rawCategory = String(
    product.categoryL1
      || product.topCategory
      || product.categoryPath?.[0]
      || product.category
      || 'Muu',
  ).trim();

  return rawCategory.toLowerCase().includes('desktop kasutatud')
    ? 'Desktop kasutatud / used'
    : rawCategory;
}
