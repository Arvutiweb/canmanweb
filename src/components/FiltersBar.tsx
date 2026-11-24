'use client';
export function FiltersBar({ sortBy, setSortBy, selectedBrand, setSelectedBrand, availableBrands, onReset }:any){
  return(
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100 mb-4">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          <select value={sortBy} onChange={e=>setSortBy(e.target.value)} className="border border-stone-200 rounded-lg px-3 py-1.5 text-sm text-stone-800 outline-none focus:border-[#5c4720] bg-white">
            <option value="popular">Populaarsed</option>
            <option value="price-asc">Hind kasvav</option>
            <option value="price-desc">Hind kahanev</option>
            <option value="name-asc">Nimi A-Z</option>
          </select>
          <select value={selectedBrand} onChange={e=>setSelectedBrand(e.target.value)} className="border border-stone-200 rounded-lg px-3 py-1.5 text-sm text-stone-800 outline-none focus:border-[#5c4720] bg-white">
            <option value="">Kõik brändid</option>
            {availableBrands.map((b:string)=><option key={b} value={b}>{b}</option>)}
          </select>
          <button onClick={onReset} className="text-stone-700 px-3 py-1.5 bg-stone-100 rounded-lg hover:bg-stone-200 transition">Tühjenda filtrid</button>
        </div>
      </div>
    </div>
  )
}
