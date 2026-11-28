@echo off
chcp 65001 >nul
cd /d "%~dp0"
python "check_products.py"
set "CHECK_EXIT_CODE=%ERRORLEVEL%"
echo.
if "%CHECK_EXIT_CODE%"=="0" (
    echo Product catalog check finished.
) else (
    echo Product catalog check failed with exit code %CHECK_EXIT_CODE%.
)
pause
exit /b %CHECK_EXIT_CODE%