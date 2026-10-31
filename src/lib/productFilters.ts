const FILTER_KEYS: Record<string, string[]> = {
  cpu: ['cpu', 'processor', 'protsessor'],
  ram: ['ram', 'memory', 'mälu'],
  storage: ['storage', 'disk', 'drive', 'ketas'],
  os: ['os', 'operating system', 'operatsioonisüsteem'],
};

function normalize(value: unknown): string {
  return String(value ?? '').trim().toLocaleLowerCase().replace(/\s+/g, ' ');
}

function getSpecValue(product: any, key: string): string {
  const aliases = FILTER_KEYS[key] || [key];
  const specs = product?.specs;

  if (specs && typeof specs === 'object' && !Array.isArray(specs)) {
    const entry = Object.entries(specs).find(([name]) =>
      aliases.includes(normalize(name))
    );
    if (entry?.[1]) return String(entry[1]).trim();
  }

  const productField = Object.entries(product || {}).find(([name]) =>
    aliases.includes(normalize(name))
  );
  return productField?.[1] ? String(productField[1]).trim() : '';
}

function inferFilterValues(product: any, key: string): string[] {
  const text = [
    product?.title,
    product?.name,
    product?.shortSpec,
    product?.shortDescription,
    product?.description,
    product?.tags,
  ].filter(Boolean).join(' ');
  const patterns: Record<string, RegExp[]> = {
    cpu: [
      /\b(?:intel\s*)?(?:core\s*)?i[3579](?:[- ]\d{3,5}[a-z]?)?\b/gi,
      /\b(?:amd\s*)?ryzen\s*[3579](?:\s+\d{3,4}[a-z]?)?\b/gi,
      /\bxeon(?:\s+[a-z]\s*-\s*\d{3,5})?\b/gi,
      /\b(?:apple\s*)?m[1-4](?:\s*(?:pro|max|ultra))?\b/gi,
    ],
    ram: [/\b\d+\s*gb\b/gi],
    storage: [/\b\d+\s*(?:gb|tb)\b/gi],
    os: [/\b(?:windows\s*(?:10|11)(?:\s*(?:home|pro|professional))?|w(?:7|10|11)p?|macos|linux|ilma os)\b/gi],
  };

  const matches = (patterns[key] || [])
    .flatMap((pattern) => Array.from(text.matchAll(pattern), (match) => match[0].trim()))
    .filter(Boolean);

  if (key === 'ram') return matches.slice(0, 1);
  if (key === 'storage') return matches.slice(-1);
  return matches;
}

export function getProductFilterOptions(products: any[], key: string): string[] {
  return Array.from(new Set(
    (products || [])
      .flatMap((product) => {
        const spec = getSpecValue(product, key);
        return spec ? [spec] : inferFilterValues(product, key);
      })
      .filter(Boolean)
  )).sort((a, b) => a.localeCompare(b));
}

export function matchesProductFilter(product: any, key: string, selected: string): boolean {
  const expected = normalize(selected);
  if (!expected) return true;

  const spec = normalize(getSpecValue(product, key));
  if (spec && (spec === expected || spec.includes(expected))) return true;

  const text = normalize([
    product?.title,
    product?.name,
    product?.shortSpec,
    product?.shortDescription,
    product?.description,
    product?.tags,
  ].filter(Boolean).join(' '));
  return text.includes(expected);
}

export function normalizeProductCondition(condition: unknown): 'Kasutatud' | 'Uus' | '' {
  const value = normalize(condition);
  if (value === 'kasutatud' || value === 'used') return 'Kasutatud';
  if (value === 'uus' || value === 'new') return 'Uus';
  return '';
}
