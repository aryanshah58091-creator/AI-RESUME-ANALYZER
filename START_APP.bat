@echo off
:: Career Connect - Quick Startup Batch File
:: Double-click this file to start the application

echo ========================================
echo   Career Connect - Quick Start
echo ========================================
echo.

:: Run the PowerShell startup script
powershell -ExecutionPolicy Bypass -File "%~dp0start-app.ps1"

pause
