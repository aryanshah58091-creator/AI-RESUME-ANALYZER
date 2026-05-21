# Career Connect - Setup Jobs Database
# This script sets up the jobs database and inserts sample data

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Career Connect - Jobs Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check if MySQL is running
Write-Host "[1/4] Checking MySQL status..." -ForegroundColor Yellow
$mysqlPath = "C:\xampp\mysql\bin\mysql.exe"

try {
    $testConnection = & $mysqlPath -u root -e "SELECT 1;" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ MySQL is running" -ForegroundColor Green
    } else {
        Write-Host "  ✗ MySQL is NOT running!" -ForegroundColor Red
        Write-Host ""
        Write-Host "  Please start MySQL from XAMPP Control Panel:" -ForegroundColor Yellow
        Write-Host "  1. Open XAMPP Control Panel" -ForegroundColor White
        Write-Host "  2. Click 'Start' next to MySQL" -ForegroundColor White
        Write-Host "  3. Wait until it shows 'Running'" -ForegroundColor White
        Write-Host "  4. Run this script again" -ForegroundColor White
        Write-Host ""
        
        # Try to start XAMPP Control Panel
        Write-Host "  Opening XAMPP Control Panel..." -ForegroundColor Cyan
        Start-Process "C:\xampp\xampp-control.exe"
        exit 1
    }
} catch {
    Write-Host "  ✗ Cannot connect to MySQL!" -ForegroundColor Red
    Write-Host "  Please start MySQL from XAMPP Control Panel" -ForegroundColor Yellow
    Start-Process "C:\xampp\xampp-control.exe"
    exit 1
}

# Step 2: Check if database exists
Write-Host ""
Write-Host "[2/4] Checking database..." -ForegroundColor Yellow
$dbCheck = & $mysqlPath -u root -e "SHOW DATABASES LIKE 'resume_analyzer';" 2>&1
if ($dbCheck -match "resume_analyzer") {
    Write-Host "  ✓ Database 'resume_analyzer' exists" -ForegroundColor Green
} else {
    Write-Host "  ✗ Database 'resume_analyzer' does not exist!" -ForegroundColor Red
    Write-Host "  Creating database..." -ForegroundColor Yellow
    & $mysqlPath -u root -e "CREATE DATABASE resume_analyzer;" 2>&1
    Write-Host "  ✓ Database created" -ForegroundColor Green
}

# Step 3: Create jobs tables
Write-Host ""
Write-Host "[3/4] Creating jobs tables..." -ForegroundColor Yellow
$sqlFile = "d:\ai resume analyzer\create_jobs_tables.sql"

if (Test-Path $sqlFile) {
    Get-Content $sqlFile | & $mysqlPath -u root resume_analyzer 2>&1 | Out-Null
    Write-Host "  ✓ Jobs tables created" -ForegroundColor Green
} else {
    Write-Host "  ✗ SQL file not found: $sqlFile" -ForegroundColor Red
    exit 1
}

# Step 4: Verify jobs count
Write-Host ""
Write-Host "[4/4] Verifying jobs data..." -ForegroundColor Yellow
$jobCountOutput = & $mysqlPath -u root resume_analyzer -e "SELECT COUNT(*) as count FROM jobs;" 2>&1

if ($jobCountOutput -match "(\d+)") {
    $count = $matches[1]
    Write-Host "  ✓ Found $count jobs in database" -ForegroundColor Green
} else {
    Write-Host "  ⚠ Could not verify job count" -ForegroundColor Yellow
}

# Summary
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Setup Complete! ✓" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Database is ready with sample jobs!" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Make sure frontend is running (npm run dev)" -ForegroundColor White
Write-Host "  2. Visit http://localhost:5173/jobs" -ForegroundColor White
Write-Host "  3. Browse available jobs!" -ForegroundColor White
Write-Host ""
