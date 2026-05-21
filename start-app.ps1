# Career Connect - Automated Startup Script
# This script starts the entire application stack

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Career Connect - Application Startup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check MySQL
Write-Host "[1/3] Checking MySQL status..." -ForegroundColor Yellow
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
        exit 1
    }
} catch {
    Write-Host "  ✗ Cannot connect to MySQL!" -ForegroundColor Red
    Write-Host "  Please start MySQL from XAMPP Control Panel" -ForegroundColor Yellow
    exit 1
}

# Step 2: Check if frontend is already running
Write-Host ""
Write-Host "[2/3] Checking if frontend is already running..." -ForegroundColor Yellow
$frontendRunning = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue
if ($frontendRunning) {
    Write-Host "  ✓ Frontend is already running on port 5173" -ForegroundColor Green
    $skipFrontend = $true
} else {
    Write-Host "  → Frontend is not running, will start it now..." -ForegroundColor Cyan
    $skipFrontend = $false
}

# Step 3: Start Frontend
if (-not $skipFrontend) {
    Write-Host ""
    Write-Host "[3/3] Starting Frontend..." -ForegroundColor Yellow
    
    $frontendPath = "d:\ai resume analyzer\frontend"
    
    if (Test-Path $frontendPath) {
        Write-Host "  → Opening new terminal for frontend..." -ForegroundColor Cyan
        
        # Start frontend in a new terminal window
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; Write-Host 'Starting Career Connect Frontend...' -ForegroundColor Cyan; npm run dev"
        
        Write-Host "  ✓ Frontend terminal opened" -ForegroundColor Green
        Write-Host "  → Waiting for frontend to start (this may take 10-15 seconds)..." -ForegroundColor Cyan
        Start-Sleep -Seconds 3
    } else {
        Write-Host "  ✗ Frontend directory not found!" -ForegroundColor Red
        exit 1
    }
}

# Summary
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Application Started Successfully! ✓" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Access your application at:" -ForegroundColor Cyan
Write-Host "  → Frontend:  http://localhost:5173" -ForegroundColor White
Write-Host "  → Backend:   http://localhost/resume-api/api/" -ForegroundColor White
Write-Host "  → Database:  http://localhost/phpmyadmin" -ForegroundColor White
Write-Host ""
Write-Host "To stop the application:" -ForegroundColor Yellow
Write-Host "  1. Press Ctrl+C in the frontend terminal" -ForegroundColor White
Write-Host "  2. Stop MySQL from XAMPP Control Panel" -ForegroundColor White
Write-Host ""
Write-Host "Happy coding!" -ForegroundColor Cyan
Write-Host ""
