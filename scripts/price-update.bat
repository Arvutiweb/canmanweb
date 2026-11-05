@echo off
chcp 65001 >nul
cd /d "%~dp0.."
python scripts\price-update.py
if errorlevel 1 goto failed
echo Hinna- ja laoseisu uuendamine valmis.
pause
exit /b 0

:failed
echo Hinna- ja laoseisu uuendamine ebaonnestus.
pause
exit /b 1
