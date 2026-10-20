// src/app/toode/[id]/page.tsx
import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { notFound } from 'next/navigation';

function getAllProducts(){
  const base = path.join(process.cwd(),'src/data/products');
  if(!fs.existsSync(base)) return [];
  let all:any[]=[];
  const walk=(dir:string)=>{
    const items=fs.readdirSync(dir);
    for(const it of items){
      const full=path.join(dir,it);
      const stat=fs.statSync(full);
      if(stat.isDirectory()) walk(full);
      else if(it.endsWith('.json')){
        try{ const d=JSON.parse(fs.readFileSync(full,'utf8')); if(Array.isArray(d)) all.push(...d); }catch{}
      }
    }
  }
  walk(base);
  return all;
}

export default function ToodePage({params}:{params:{id:string}}){
  const all=getAllProducts();
  const prod=all.find((p:any)=> String(p.id)===params.id || String(p.sku)===params.id);
  if(!prod) return notFound();
  const norm=(s:string)=> s ? (s.startsWith('/')||s.startsWith('http') ? s : `/images/${s}`) : '/images/placeholder.png';
  const imgs:string[]=(prod.images||prod.Images||prod.rawImages||[]).map(norm).filter(Boolean);
  if(!imgs.length && prod.image) imgs.push(norm(prod.image));
  const price=prod.finalPrice||prod.salePrice||prod.price;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <Link href="/" className="text-sm text-slate-500 hover:text-black mb-6 inline-block">← Tagasi poodi</Link>
      <div className="grid md:grid-cols-2 gap-8 bg-white rounded- border p-6">
        {/* GALERII - kõik pildid */}
        <div>
          <div className="aspect-square bg-[#f8f9fb] rounded- overflow-hidden">
            <img id="mainImg" src={imgs[0]} alt={prod.title} className="w-full h-full object-contain p-6 rounded-" />
          </div>
          <div className="flex gap-3 mt-4 overflow-x-auto">
            {imgs.map((src,i)=>(
              <button key={i} onClick={()=>{ (document.getElementById('mainImg') as HTMLImageElement).src=src }} className="w-20 h-20 shrink-0 bg-[#f8f9fb] rounded-2xl overflow-hidden border hover:border-black transition">
                <img src={src} className="w-full h-full object-contain p-2" />
              </button>
            ))}
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold">{prod.title||prod.name}</h1>
          <p className="text-2xl font-bold mt-4">{price} €</p>
          <p className="text-slate-500 mt-2 text-sm">{prod.description||prod.shortSpec||''}</p>
          <button className="mt-8 w-full bg-[#0e4da4] text-white rounded-full py-4 font-bold">Lisa korvi</button>
          <div className="mt-6 text-xs text-slate-400">SKU: {prod.sku||prod.id} • {imgs.length} fotot</div>
        </div>
      </div>
    </div>
  )
}