const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const ROOT = path.join(__dirname, '..');
const OUT_BASE = path.join(ROOT, 'src/data/products');

function clean(v){
  if(typeof v!=='string') return v;
  return v.replace(/â‚¬/g,'€').replace(/â€¢/g,'•').replace(/â€"/g,'–')
    .replace(/Ãµ/g,'õ').replace(/Ã¤/g,'ä').replace(/Ã¶/g,'ö').replace(/Ã¼/g,'ü')
    .replace(/Ã•/g,'Õ').replace(/Ã„/g,'Ä').replace(/Ã–/g,'Ö').replace(/Ãœ/g,'Ü')
    .replace(/Â/g,'').trim();
}

const odsFiles = fs.readdirSync(ROOT).filter(f=>f.toLowerCase().endsWith('.ods') && f.toUpperCase().startsWith('WPI_'));
console.log('Leidsin ODS:', odsFiles);

for(const f of odsFiles){
  const full = path.join(ROOT, f);
  const wb = XLSX.readFile(full, {codepage:65001, type:'buffer', raw:false});
  for(const sheet of wb.SheetNames){
    const rows = XLSX.utils.sheet_to_json(wb.Sheets[sheet], {defval:'', raw:false});
    const cleaned = rows.map(r=>{ const o={}; for(const k in r) o[clean(k)]=clean(r[k]); return o; });
    const outName = `${path.parse(f).name}-${sheet}.json`.toLowerCase().replace(/\s+/g,'-');
    const outPath = path.join(OUT_BASE, outName);
    fs.mkdirSync(path.dirname(outPath), {recursive:true});
    fs.writeFileSync(outPath, JSON.stringify(cleaned, null, 2), {encoding:'utf8'});
    console.log(` -> ${outName} ${cleaned.length} rida`);
  }
}
console.log('Valmis');