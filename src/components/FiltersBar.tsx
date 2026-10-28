'use client';
export function FiltersBar({ conditionFilter, setConditionFilter, sortBy, setSortBy, minPrice, maxPrice, setMinPrice, setMaxPrice, selectedBrand, setSelectedBrand, availableBrands, totalResults, onReset }:any){
  return(
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-4">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="text- font-semibold">{totalResults} toodet</div>
        <div className="flex gap-2 flex-wrap">
          <select value={sortBy} onChange={e=>setSortBy(e.target.value)} className="border rounded-lg px-3 py-1.5 text-">
            <option value="popular">Populaarsed</option>
            <option value="price-asc">Hind kasvav</option>
            <option value="price-desc">Hind kahanev</option>
            <option value="name-asc">Nimi A-Z</option>
          </select>
          <select value={selectedBrand} onChange={e=>setSelectedBrand(e.target.value)} className="border rounded-lg px-3 py-1.5 text-">
            <option value="">Kõik brändid</option>
            {availableBrands.map((b:string)=><option key={b} value={b}>{b}</option>)}
          </select>
          <button onClick={onReset} className="text- px-3 py-1.5 bg-slate-100 rounded-lg">Tühjenda filtrid</button>
        </div>
      </div>
    </div>
  )
}
