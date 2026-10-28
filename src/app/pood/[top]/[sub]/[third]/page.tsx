export function generateStaticParams() {
  return []
}
import fs from 'fs'; 
import path from 'path'; 
import Link from 'next/link';

function getAllProducts() {
  const base = path.join(process.cwd(),'src/data/products');
  if(!fs.existsSync(base)) return [];
  let all: any[] = [];
  const tops = fs.readdirSync(base).filter(f=>{
    try { return fs.statSync(path.join(base,f)).isDirectory(); } catch { return false; }
  });
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

export default function Page(){
  const base = path.join(process.cwd(),'src/data/products');
  if(!fs.existsSync(base)) return <div>Tooteid pole</div>;
  const tops = fs.readdirSync(base).filter(f=>{
    try { return fs.statSync(path.join(base,f)).isDirectory(); } catch { return false; }
  });

  // loe kokku iga L1 kohta mitu L2 ja mitu toodet (uus süsteem)
  const stats = tops.map(top=>{
    const topDir = path.join(base, top);
    let count = 0;
    let subSet = new Set<string>();
    let realName = top;
    try {
      const jsons = fs.readdirSync(topDir).filter(f=>f.endsWith('.json'));
      for (const jf of jsons) {
        const data = JSON.parse(fs.readFileSync(path.join(topDir, jf), 'utf8'));
        count += data.length;
        data.forEach((p:any)=>{
          if (p.categoryL1) realName = p.categoryL1;
          if (p.categoryL2) subSet.add(p.categoryL2);
          // fallback vana süsteem: failinimi = sub
          if (!p.categoryL2) subSet.add(jf.replace('.json',''));
        });
      }
    } catch {}
    return { slug: top, name: realName, productCount: count, subCount: subSet.size || fs.readdirSync(topDir).filter(f=>f.endsWith('.json')).length };
  });

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6" style={{color:'#0e4da4'}}>Pood</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map(top=>{
          return (
            <Link key={top.slug} href={`/pood/${top.slug}`} className="border rounded-xl p-6 hover:shadow bg-white">
              <div className="font-semibold text-lg">{top.name}</div>
              <div className="text-gray-500 text-sm">{top.subCount} alamkategooriat • {top.productCount} toodet</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
