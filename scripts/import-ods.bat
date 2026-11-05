@echo off
chcp 65001 >nul
cd /d "%~dp0.."
python scripts\import_ODS.py scripts\WPI_Arvutiosad.ods scripts\WPI_Connectors.ods scripts\WPI_Desktops.ods scripts\WPI_Notebooks.ods scripts\WPI_NotebookU.ods
if errorlevel 1 goto failed
echo ODS-piltide import valmis.
pause
exit /b 0

:failed
echo ODS-piltide import ebaonnestus.
pause
exit /b 1