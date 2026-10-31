// src/app/toode/[id]/page.tsx
import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductIdParams } from '@/lib/staticProductParams';
import ProductImageGallery from './ProductImageGallery';

export function generateStaticParams() {
  return getProductIdParams();
}

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
  if(!imgs.length) imgs.push('/images/placeholder.png');
  const price=prod.finalPrice||prod.salePrice||prod.price;

  return (
    <div className="mx-auto max-w-5xl p-3 md:p-5">
      <Link href="/" className="mb-3 inline-block text-sm text-slate-500 hover:text-black">← Tagasi poodi</Link>
      <div className="grid gap-4 rounded-xl border bg-white p-3 md:grid-cols-2 md:gap-5 md:p-4">
        <ProductImageGallery images={imgs} title={prod.title || prod.name} />
        <div>
          <h1 className="text-2xl font-bold">{prod.title||prod.name}</h1>
          <p className="mt-3 text-xl font-bold">{price} €</p>
          <p className="mt-2 text-sm text-slate-500">{prod.description||prod.shortSpec||''}</p>
          <button className="mt-5 w-full rounded-full bg-[#0e4da4] py-3 font-bold text-white">Lisa korvi</button>
          <div className="mt-4 text-xs text-slate-400">SKU: {prod.sku||prod.id} • {imgs.length} fotot</div>
        </div>
      </div>
    </div>
  )
}