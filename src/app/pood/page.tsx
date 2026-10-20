import fs from 'fs';
import path from 'path';

function getAllProducts() {
  const base = path.join(process.cwd(),'src/data/products');
  if(!fs.existsSync(base)) return [];
  let all: any[] = [];
  const tops = fs.readdirSync(base).filter(f=>{ try { return fs.statSync(path.join(base,f)).isDirectory(); } catch { return false; } });
  for (const top of tops) {
    const topDir = path.join(base, top);
    const jsons = fs.readdirSync(topDir).filter(f=>f.endsWith('.json'));
    for (const jf of jsons) {
      try {
        const data = JSON.parse(fs.readFileSync(path.join(topDir, jf), 'utf8'));
        if (Array.isArray(data)) all.push(...data);
      } catch {}
    }
  }
  return all;
}

export default function PoodPage(){
  const all = getAllProducts();
  return <ClientPood initialProducts={all} />;
}