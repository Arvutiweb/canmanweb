import pandas as pd, os, shutil, glob

OUTPUT="image/output"
PUBLIC="public/images"
ODS=["WPI_Notebooks.ods","WPI_Desktops.ods","WPI_Arvutiosad.ods"]

os.makedirs(PUBLIC,exist_ok=True)

def move_ok(img_name):
    src=os.path.join(OUTPUT,img_name.strip())
    dst=os.path.join(PUBLIC,img_name.strip())
    if not img_name.strip(): return False
    if os.path.exists(src):
        shutil.copy2(src,dst)
        os.remove(src) # KUSTUTA outputist kui õnnestus weebi panna
        print(f" {img_name} -> public/images/ [output kustutatud]")
        return True
    elif os.path.exists(dst):
        print(f" {img_name} juba public/images/ - outputis polnud")
        # kui juba publicis, kustuta ikka outputist kui seal juhuslikult on
        if os.path.exists(src): os.remove(src)
        return True
    else:
        print(f" VIGA {img_name} puudub {OUTPUT}/")
        return False

for ods in ODS:
    if not os.path.exists(ods): continue
    df=pd.read_excel(ods,engine='odf',dtype=str).fillna('')
    # ID = i või n
    rows=df[df['ID'].str.lower().isin(['i','n'])]
    for _,r in rows.iterrows():
        sku=str(r['SKU']).strip()
        imgs=str(r['Images']).strip()
        if not imgs: continue
        print(f"\n{sku} ({r['ID']}): {imgs}")
        for im in imgs.split(','):
            move_ok(im)

# kontroll kas output tühi
left=os.listdir(OUTPUT) if os.path.exists(OUTPUT) else []
if not left:
    print("\nimage/output/ on TÜHI - kõik weebis")
else:
    print(f"\nimage/output/ jäi {len(left)} faili: {left}")