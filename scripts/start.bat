@echo off
cd /d C:\Users\raivo\Documents\canman.github.io
python scripts/import_ODS.py tooted.ods --catalog src/data/productCatalog.json --images public/images --import-images import_images
pause