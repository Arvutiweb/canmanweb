import fs from 'fs';
import path from 'path';

const productsDirectory = path.join(process.cwd(), 'src', 'data', 'products');

function getProductFiles(directory = productsDirectory): string[] {
  if (!fs.existsSync(directory)) return [];

  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return getProductFiles(entryPath);
    return entry.isFile() && entry.name.endsWith('.json') ? [entryPath] : [];
  });
}

function getCategoryPaths(depth: number): string[][] {
  return getProductFiles()
    .map((file) => path.relative(productsDirectory, file).replace(/\.json$/, '').split(path.sep))
    .filter((segments) => segments.length >= depth)
    .map((segments) => segments.slice(0, depth));
}

function uniquePaths(depth: number): string[][] {
  return Array.from(
    new Map(getCategoryPaths(depth).map((segments) => [segments.join('/'), segments])).values()
  );
}

export function getTopParams(): { top: string }[] {
  return uniquePaths(1).map(([top]) => ({ top }));
}

export function getSubcategoryParams(): { top: string; sub: string }[] {
  return uniquePaths(2).map(([top, sub]) => ({ top, sub }));
}

export function getThirdCategoryParams(): { top: string; sub: string; third: string }[] {
  return uniquePaths(3).map(([top, sub, third]) => ({ top, sub, third }));
}

export function getFourthCategoryParams(): {
  top: string;
  sub: string;
  third: string;
  fourth: string;
}[] {
  const params = new Map<string, { top: string; sub: string; third: string; fourth: string }>();
  const slugify = (value: unknown) =>
    String(value || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9äöõü]+/g, '-')
      .replace(/^-|-$/g, '');

  for (const file of getProductFiles()) {
    const segments = path
      .relative(productsDirectory, file)
      .replace(/\.json$/, '')
      .split(path.sep);
    if (segments.length < 3) continue;

    const products: unknown = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (!Array.isArray(products)) continue;

    for (const product of products) {
      if (!product || typeof product !== 'object') continue;
      const item = product as { categoryL3?: unknown; categoryL4?: unknown };
      const third = slugify(item.categoryL3);
      const fourth = slugify(item.categoryL4 || item.categoryL3);
      if (!third || !fourth) continue;

      const route = { top: segments[0], sub: segments[1], third, fourth };
      params.set(`${route.top}/${route.sub}/${route.third}/${route.fourth}`, route);
    }
  }

  return Array.from(params.values());
}

export function getProductIdParams(): { id: string }[] {
  const ids = new Set<string>();

  for (const file of getProductFiles()) {
    const products: unknown = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (!Array.isArray(products)) continue;

    for (const product of products) {
      if (!product || typeof product !== 'object') continue;
      const item = product as { id?: unknown; sku?: unknown };
      for (const value of [item.id, item.sku]) {
        if (typeof value === 'string' || typeof value === 'number') {
          ids.add(String(value));
        }
      }
    }
  }

  return Array.from(ids, (id) => ({ id }));
}
