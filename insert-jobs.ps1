# Script to insert sample jobs into the database
# Make sure XAMPP MySQL is running before executing this

Write-Host "Inserting sample jobs into the database..." -ForegroundColor Cyan

# Path to MySQL executable
$mysqlPath = "C:\xampp\mysql\bin\mysql.exe"
$sqlFile = "d:\ai resume analyzer\insert_sample_jobs.sql"

# Check if MySQL is accessible
try {
    $testConnection = & $mysqlPath -u root -e "SELECT 1;" 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: MySQL server is not running!" -ForegroundColor Red
        Write-Host "Please start MySQL from XAMPP Control Panel and try again." -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "ERROR: Cannot connect to MySQL!" -ForegroundColor Red
    Write-Host "Please make sure XAMPP MySQL is running." -ForegroundColor Yellow
    exit 1
}

# Execute the SQL file
Write-Host "Executing SQL file..." -ForegroundColor Yellow
$result = Get-Content $sqlFile | & $mysqlPath -u root resume_analyzer 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "Success! Sample jobs inserted successfully!" -ForegroundColor Green
    Write-Host "You should now see 15 jobs in the Jobs section." -ForegroundColor Cyan
} else {
    Write-Host "Failed to insert jobs. Error:" -ForegroundColor Red
    Write-Host $result -ForegroundColor Yellow
}
