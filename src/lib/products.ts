import fs from 'fs';
import path from 'path';

export type Product = {
  id?: string | number;
  sku: string;
  title: string;
  name: string;
  price: number|null;
  salePrice: number|null;
  finalPrice: number|null;
  brand: string;
  images: string[];
  description: string;
};

export function getAllCategories() {
  const base = path.join(process.cwd(), 'src/data/products');
  if (!fs.existsSync(base)) return [];
  return fs.readdirSync(base).filter(f => fs.statSync(path.join(base,f)).isDirectory());
}

export function getSubcategories(top: string) {
  const dir = path.join(process.cwd(), `src/data/products/${top}`);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f=>f.endsWith('.json')).map(f=>f.replace('.json',''));
}

export function getProducts(top: string, sub: string) {
  const p = path.join(process.cwd(), `src/data/products/${top}/${sub}.json`);
  if (!fs.existsSync(p)) return [];
  return JSON.parse(fs.readFileSync(p,'utf8'));
}

function getProductFiles(directory: string): string[] {
  if (!fs.existsSync(directory)) return [];

  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return getProductFiles(entryPath);
    return entry.isFile() && entry.name.endsWith('.json') ? [entryPath] : [];
  });
}

export function getAllProducts() {
  const files = getProductFiles(path.join(process.cwd(), 'src/data/products'))
    .sort((a, b) => a.split(path.sep).length - b.split(path.sep).length || a.localeCompare(b));
  const productsById = new Map<string, Product>();

  files.forEach((file, index) => {
    const products: unknown = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (!Array.isArray(products)) return;

    products.forEach((product: Product, productIndex: number) => {
      const identity = product.sku || product.id || `${file}:${index}:${productIndex}`;
      productsById.set(String(identity), product);
    });
  });

  return Array.from(productsById.values());
}
