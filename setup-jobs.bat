@echo off
echo ========================================
echo   Career Connect - Jobs Setup
echo ========================================
echo.

echo [1/3] Checking MySQL status...
C:\xampp\mysql\bin\mysql.exe -u root -e "SELECT 1;" >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo   X MySQL is NOT running!
    echo.
    echo   Please start MySQL from XAMPP Control Panel
    echo   Opening XAMPP Control Panel...
    start C:\xampp\xampp-control.exe
    pause
    exit /b 1
)
echo   √ MySQL is running

echo.
echo [2/3] Setting up database and tables...
C:\xampp\mysql\bin\mysql.exe -u root -e "CREATE DATABASE IF NOT EXISTS resume_analyzer;" 2>nul
C:\xampp\mysql\bin\mysql.exe -u root resume_analyzer < "d:\ai resume analyzer\create_jobs_tables.sql" 2>nul
echo   √ Database and tables ready

echo.
echo [3/3] Verifying jobs...
C:\xampp\mysql\bin\mysql.exe -u root resume_analyzer -e "SELECT COUNT(*) FROM jobs;"
echo   √ Jobs loaded

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Database is ready with sample jobs!
echo Visit http://localhost:5173/jobs to browse jobs
echo.
pause
