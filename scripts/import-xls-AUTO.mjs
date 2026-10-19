import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';

console.log('=== XLS IMPORT START ===');

const possibleFiles = [
  'tooted.xlsx',
  'Tooted.xlsx',
  'TOOTED.xlsx',
  'public/tooted.xlsx',
  'public/Tooted.xlsx',
  'data/tooted.xlsx',
  './tooted.xlsx',
  'src/data/tooted.xlsx'
];

// otsi ka suvaline xlsx projektist (v.a node_modules)
if (!fs.existsSync('tooted.xlsx')) {
  try {
    const allFiles = [];
    function scan(dir) {
      if (!fs.existsSync(dir)) return;
      if (dir.includes('node_modules') || dir.includes('.next')) return;
      for (const f of fs.readdirSync(dir)) {
        const fp = path.join(dir, f);
        try {
          if (fs.statSync(fp).isDirectory()) scan(fp);
          else if (fp.toLowerCase().endsWith('.xlsx') || fp.toLowerCase().endsWith('.xls')) {
            if (!fp.includes('node_modules')) allFiles.push(fp);
          }
        } catch {}
      }
    }
    scan('.');
    scan('public');
    if (allFiles.length > 0) possibleFiles.unshift(...allFiles);
  } catch {}
}

let file = possibleFiles.find(f => fs.existsSync(f));

if (!file) {
  console.log('No xlsx found - skipping import, using existing catalog');
  console.log('Vercel build continues normally!');
  process.exit(0);
}

console.log('Reading:', file);

try {
  const wb = xlsx.readFile(file);
  const sheetName = wb.SheetNames[0];
  const sheet = wb.Sheets[sheetName];
  const rows = xlsx.utils.sheet_to_json(sheet);

  console.log(`Found ${rows.length} rows`);

  const products = rows.map((row, idx) => {
    const images = [];
    for (const key of Object.keys(row)) {
      const lk = key.toLowerCase();
      if (lk.includes('pilt') || lk.includes('image') || lk.includes('jpg') || lk.includes('jpeg') || lk.includes('png') || lk.includes('foto') || lk.includes('picture') || lk.includes('photo')) {
        const val = String(row[key] || '').trim();
        if (val) {
          val.split(/[,;\n]+/).forEach(v => {
            const vv = v.trim();
            if (vv && (vv.startsWith('http') || vv.includes('.jpg') || vv.includes('.jpeg') || vv.includes('.png') || vv.includes('.webp'))) {
              images.push(vv);
            }
          });
        }
      }
    }

    return {
      id: row['ID'] || row['id'] || `prod-${idx}`,
      title: row['Nimetus'] || row['Title'] || row['Toode'] || row['Nimi'] || row['name'] || '',
      categoryL1: row['Kategooria'] || row['Category'] || row['KATEGOORIA'] || row['kategooria'] || 'Muu',
      categoryL2: row['Alamkategooria'] || row['Subcategory'] || row['ALAMKATEGOORIA'] || '',
      price: parseFloat(row['Hind'] || row['Price'] || row['HIND'] || 0) || 0,
      images: [...new Set(images)].slice(0, 8)
    };
  }).filter(p => p.title && p.title.length > 2);

  console.log(`Total ${products.length} products`);

  const outDir = 'src/data';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  
  const out = `// Auto-generated from ${file} on ${new Date().toISOString()}\n// Tooteid: ${products.length}\n\nexport const allProducts = ${JSON.stringify(products, null, 2)} as const;\n\nexport type Product = typeof allProducts[number];\n`;
  fs.writeFileSync(path.join(outDir, 'productCatalog.ts'), out);
  console.log(`Saved ${outDir}/productCatalog.ts`);
} catch (e) {
  console.error('Error reading xls:', e.message);
  console.log('Not failing build, using existing catalog');
  process.exit(0);
}
