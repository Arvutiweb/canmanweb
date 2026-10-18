import pathlib, json
import pandas as pd

ROOT = pathlib.Path(__file__).resolve().parents[1]
CATALOG_ROOT = ROOT / "src/data/products"
PUBLIC_IMAGES = ROOT / "public/images"

def clean_text(v):
    """hoiab TEXT-ina, eemaldab .0 lõpu"""
    s = str(v).strip()
    if not s or s.lower() == 'nan':
        return ""
    # 340016.0 -> 340016
    if s.endswith('.0'):
        s = s[:-2]
    try:
        # 340016.0 (float) -> 340016
        if '.' in s:
            f = float(s)
            if f.is_integer():
                return str(int(f))
    except:
        pass
    return s

# public/images kaart webp jaoks
stem_map = {}
for f in PUBLIC_IMAGES.glob("*.*"):
    stem_map[f.stem.lower()] = f.name

def resolve_image(name):
    key = pathlib.Path(name).stem.lower()
    real = stem_map.get(key, pathlib.Path(name).name)
    return f"/images/{real}"

def main():
    import sys
    ods = pathlib.Path(sys.argv[1]) if len(sys.argv)>1 else ROOT/"scripts/WPI_Notebooks.ods"
    
    sku_map = {}
    file_cache = {}
    for jf in CATALOG_ROOT.rglob("*.json"):
        try:
            data = json.loads(jf.read_text(encoding='utf-8'))
            if isinstance(data, list):
                file_cache[jf] = data
                for idx, prod in enumerate(data):
                    sku = clean_text(prod.get("sku",""))
                    if sku:
                        prod["sku"] = sku  # veendu et catalogis on TEXT
                        sku_map[sku] = (jf, idx)
        except Exception as e:
            pass

    print(f"Catalogis {len(sku_map)} SKU")

    df = pd.read_excel(ods, engine='odf', dtype=str).fillna("")
    cols = {c.lower(): c for c in df.columns}
    c_sku = cols.get("sku")
    c_images = cols.get("images")

    for _, row in df.iterrows():
        sku = clean_text(row[c_sku]) if c_sku else ""
        if not sku or sku not in sku_map:
            continue
        raw = str(row[c_images]).strip() if c_images else ""
        if not raw:
            continue
        parts = [x.strip() for x in raw.replace(";",",").split(",") if x.strip()]
        if not parts:
            continue
        
        jf, idx = sku_map[sku]
        imgs = [resolve_image(x) for x in parts]
        file_cache[jf][idx]["images"] = imgs
        # ID, SKU jäävad TEXT - ei puutu
        print(f"{sku} i -> {imgs}")

    for jf, data in file_cache.items():
        jf.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')

if __name__ == "__main__":
    main()