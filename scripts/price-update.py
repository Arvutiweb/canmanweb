import pandas as pd, json, glob, os, shutil
PRODUCTS_DIR="src/data/products"
ODS=["WPI_Notebooks.ods","WPI_Desktops.ods","WPI_Arvutiosad.ods"]

sku_map={}
for fp in glob.glob(f"{PRODUCTS_DIR}/*.json"):
    with open(fp,'r',encoding='utf-8') as f:
        items=json.load(f)
        items=items if isinstance(items,list) else items.get('products',[])
        for pr in items:
            sku=str(pr.get('sku','')).strip()
            if sku: sku_map[sku]=(fp,pr)

for ods in ODS:
    if not os.path.exists(ods): continue
    df=pd.read_excel(ods,engine='odf',dtype=str).fillna('')
    for _,r in df[df['ID'].str.lower()=='p'].iterrows():
        sku=str(r['SKU']).strip()
        if sku not in sku_map: continue
        _,prod=sku_map[sku]
        if r['Stock'].strip()!='': prod['stock']=int(float(r['Stock']))
        if r['Price'].strip()!='': prod['price']=float(r['Price'])
        if r['S_Price'].strip()!='':
            if r['S_Price'].strip()=='0' or r['S_Price'].strip()=='':
                prod.pop('sale_price',None)
            else:
                prod['sale_price']=float(r['S_Price'])

# salvesta
for fp in set([f for f,_ in sku_map.values()]):
    with open(fp,'r',encoding='utf-8') as f: data=json.load(f)
    with open(fp,'w',encoding='utf-8') as o: json.dump(data,o,ensure_ascii=False,indent=2)
print("ID=p valmis")