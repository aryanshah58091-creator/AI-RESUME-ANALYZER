@echo off
echo ================================================
echo   Career Connect - Fix Foreign Key Error
echo ================================================
echo.
echo This script will fix the foreign key constraint error
echo by ensuring all necessary users exist in the database.
echo.
echo Please enter your MySQL root password when prompted.
echo.
pause

cd /d "%~dp0"

echo.
echo Running SQL fix script...
echo.

mysql -u root -p resume_analyzer < fix_foreign_key_error.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ================================================
    echo   SUCCESS! Database has been fixed.
    echo ================================================
    echo.
    echo You can now try uploading your resume again.
    echo.
) else (
    echo.
    echo ================================================
    echo   ERROR! Failed to run SQL script.
    echo ================================================
    echo.
    echo Please make sure:
    echo 1. MySQL is running
    echo 2. You entered the correct password
    echo 3. The database 'resume_analyzer' exists
    echo.
)

pause
