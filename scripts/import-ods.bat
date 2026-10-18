@echo off
chcp 65001 >nul
cd /d %~dp0
python scripts\import_ODS.py tooted.ods --catalog src/data/productCatalog.json --images public/images --import-images import_images
pause