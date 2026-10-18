from PIL import Image
import os, glob, shutil

INCOMING="data/incoming"
OUTPUT="image/output"
ORIGINALS="data/originals"

os.makedirs(OUTPUT,exist_ok=True)
os.makedirs(ORIGINALS,exist_ok=True)

files = list(glob.glob(f"{INCOMING}/*.*"))
if not files:
    print("data/incoming/ TUHI")
    exit()

print(f"Leitud {len(files)} pilti")
for src in files:
    name=os.path.basename(src)
    base=os.path.splitext(name)[0]
    dst=os.path.join(OUTPUT, base + ".webp")
    try:
        with Image.open(src) as im:
            if im.mode in ("RGBA","LA"):
                bg=Image.new("RGB", im.size, (255,255,255))
                bg.paste(im, mask=im.split()[-1])
                im=bg
            else:
                im=im.convert("RGB")
            im.save(dst, "WEBP", quality=80)
            print(f"OK {name} -> {base}.webp")
            shutil.move(src, os.path.join(ORIGINALS, name))
    except Exception as e:
        print(f"VIGA {name}: {e}")

print(f"\nimage/output/ : {len(os.listdir(OUTPUT))} faili")
print("data/incoming/ TUHI - koik veebi pandud" if not os.listdir(INCOMING) else f"incoming jai: {os.listdir(INCOMING)}")