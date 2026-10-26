import fs from 'fs';
import path from 'path';
import ClientProducts from './ClientProducts';

function slugify(s:string){ return String(s||'').toLowerCase().trim().replace(/[^a-z0-9äöõü]+/g,'-').replace(/^-|-$/g,''); }

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

export default function Page({params}: any){
  const all = getAllProducts();
  const p = params as any;
  const fourthSlug = p.fourth;

  const filtered = all.filter((prod:any)=>{
    const s1 = slugify(prod.categoryL1 || prod.categorySlugL1 || '');
    const s2 = slugify(prod.categoryL2 || '');
    const s3 = slugify(prod.categoryL3 || '');
    const s4 = slugify(prod.categoryL4 || '');
    // Match 4th level
    if(s4) return s4 === fourthSlug;
    // fallback kui L4 puudub, match L3
    if(!s4 && s3) return s3 === fourthSlug || p.third === s3;
    return false;
  });

  // kui filter tühi, proovi ka failinime järgi
  const finalList = filtered.length ? filtered : all.filter((pr:any)=> slugify(pr.categoryL2||'').includes(fourthSlug) || slugify(pr.title||'').includes(fourthSlug)).slice(0,100);

  return <ClientProducts products={finalList} params={params} />;
}