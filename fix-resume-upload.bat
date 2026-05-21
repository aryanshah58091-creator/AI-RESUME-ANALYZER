@echo off
echo ========================================
echo   Fixing Resume Upload Issue
echo ========================================
echo.

echo [1/3] Checking current users...
C:\xampp\mysql\bin\mysql.exe -u root resume_analyzer -e "SELECT id, name, email FROM users;"

echo.
echo [2/3] Dropping and recreating resumes table...
C:\xampp\mysql\bin\mysql.exe -u root resume_analyzer -e "DROP TABLE IF EXISTS resumes;"
C:\xampp\mysql\bin\mysql.exe -u root resume_analyzer < "d:\ai resume analyzer\fix_resumes_table.sql"
echo   √ Resumes table recreated

echo.
echo [3/3] Verifying table structure...
C:\xampp\mysql\bin\mysql.exe -u root resume_analyzer -e "DESCRIBE resumes;"

echo.
echo ========================================
echo   Fix Complete!
echo ========================================
echo.
echo The resume upload should now work.
echo Try uploading a resume again!
echo.
pause
