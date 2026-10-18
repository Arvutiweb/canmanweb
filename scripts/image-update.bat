node scripts/convert-to-webp.mjs
python scripts/import-images.py
git add public/images/ src/data/products/*.json
git commit -m "ID=i/n images"
git push