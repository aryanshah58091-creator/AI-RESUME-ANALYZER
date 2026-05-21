@echo off
echo ========================================
echo  Career Connect - MySQL Startup
echo ========================================
echo.

REM Check if MySQL is already running
netstat -ano | findstr ":3306" >nul
if %errorlevel% equ 0 (
    echo [INFO] MySQL is already running on port 3306
    echo.
    goto :end
)

echo Starting MySQL Server...
echo.

REM Start MySQL using XAMPP Control
start "" "C:\xampp\xampp-control.exe"

echo.
echo [INFO] XAMPP Control Panel has been opened
echo Please click "Start" next to MySQL in the XAMPP Control Panel
echo.
echo After MySQL starts, refresh your browser to use the job matching feature
echo.

:end
pause
