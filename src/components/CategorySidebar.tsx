'use client';
import React, { useMemo, useState } from 'react';
const safeLower = (v:any)=>String(v||'').toLowerCase();

export function CategorySidebar({ selectedL1, selectedL2, selectedL3, onSelectCategory, products }:any){
  const [open,setOpen]=useState<Record<string,boolean>>({});
  const grouped=useMemo(()=>{
    const map=new Map();
    (products||[]).forEach((p:any)=>{
      const rawL1=String(p.categoryL1||p.topCategory||p.category||'Muu').trim();
      const rawL2=String(p.categoryL2||p.subCategory||'').trim();
      let baseL1=rawL1; let gen=null;
      if(rawL1.toLowerCase().includes('desktop kasutatud')){
        baseL1='Desktop kasutatud / used';
        if(rawL1.includes(',')) gen=rawL1.split(',')[1]?.trim();
        if(!gen && rawL2 && /\d+-gen/i.test(rawL2)) gen=rawL2;
      }
      if(!map.has(baseL1)) map.set(baseL1,{count:0,subs:new Map()});
      const e=map.get(baseL1); e.count++;
      const aL2=gen||rawL2; if(!aL2) return;
      if(!e.subs.has(aL2)) e.subs.set(aL2,{count:0,l3:new Map()});
      const s=e.subs.get(aL2); s.count++;
    });
    return map;
  },[products]);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
      <h3 className="font-bold text- tracking-widest text-slate-800 uppercase mb-4">KATEGOORIAD</h3>
      <div className="space-y-1">
        <button onClick={()=>onSelectCategory(null,null,null)} className={`w-full text-left text- px-3 py-2.5 rounded-xl flex justify-between ${!selectedL1?'bg-[#0e4da4] text-white':'hover:bg-slate-50'}`}>
          <span>Kõik kategooriad</span><span>{products?.length||0}</span>
        </button>
        {Array.from(grouped.entries()).map(([base,data]:any)=>{
          const isActive=safeLower(selectedL1)===safeLower(base);
          const isOpen=open[base]??isActive;
          return(
            <div key={base}>
              <button onClick={()=>{setOpen(o=>({...o,[base]:!o[base]})); onSelectCategory(base,null,null)}} className={`w-full text-left text- font-semibold px-3 py-2.5 rounded-xl flex justify-between ${isActive?'bg-blue-50 text-[#0e4da4]':'hover:bg-slate-50'}`}>
                <span>› {base}</span><span className="bg-slate-100 px-2 rounded-full text-">{data.count}</span>
              </button>
              {isOpen && <div className="ml-4 pl-3 border-l-2 border-slate-100 space-y-1 mt-1">
                {Array.from(data.subs.entries()).map(([sub,sd]:any)=>(
                  <button key={sub} onClick={()=>onSelectCategory(base,sub,null)} className={`w-full text-left text- px-2 py-1.5 rounded-lg flex justify-between ${safeLower(selectedL2)===safeLower(sub)?'bg-slate-900 text-white':'text-slate-600 hover:bg-slate-50'}`}>
                    <span>{sub}</span><span>{sd.count}</span>
                  </button>
                ))}
              </div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
