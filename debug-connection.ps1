#!/usr/bin/env pwsh
# Debug Connection Script for Career Connect
# This script checks and fixes the connection between frontend and backend

Write-Host "🔍 Career Connect - Connection Debugger" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check if XAMPP Apache is running
Write-Host "Step 1: Checking XAMPP Apache status..." -ForegroundColor Yellow
$apacheProcess = Get-Process -Name "httpd" -ErrorAction SilentlyContinue
if ($apacheProcess) {
    Write-Host "✅ Apache is running" -ForegroundColor Green
} else {
    Write-Host "❌ Apache is NOT running" -ForegroundColor Red
    Write-Host "   Please start Apache from XAMPP Control Panel" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   Steps:" -ForegroundColor White
    Write-Host "   1. Open XAMPP Control Panel" -ForegroundColor White
    Write-Host "   2. Click 'Start' next to Apache" -ForegroundColor White
    Write-Host "   3. Wait for it to show 'Running' in green" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host ""

# Step 2: Check if backend files exist
Write-Host "Step 2: Checking backend files..." -ForegroundColor Yellow
$backendPath = "C:\xampp\htdocs\resume-api"
if (Test-Path $backendPath) {
    Write-Host "✅ Backend files exist at: $backendPath" -ForegroundColor Green
} else {
    Write-Host "❌ Backend files NOT found at: $backendPath" -ForegroundColor Red
    Write-Host "   Copying backend files..." -ForegroundColor Yellow
    
    $sourcePath = "d:\ai resume analyzer\backend"
    if (Test-Path $sourcePath) {
        Copy-Item -Path "$sourcePath\*" -Destination $backendPath -Recurse -Force
        Write-Host "✅ Backend files copied successfully" -ForegroundColor Green
    } else {
        Write-Host "❌ Source backend files not found at: $sourcePath" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""

# Step 3: Test backend API endpoint
Write-Host "Step 3: Testing backend API..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost/resume-api/" -UseBasicParsing -ErrorAction Stop
    Write-Host "✅ Backend API is accessible" -ForegroundColor Green
    Write-Host "   Response: $($response.StatusCode) $($response.StatusDescription)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Backend API is NOT accessible" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "   Possible issues:" -ForegroundColor Yellow
    Write-Host "   1. Apache is not running" -ForegroundColor White
    Write-Host "   2. Backend files are not in the correct location" -ForegroundColor White
    Write-Host "   3. .htaccess file is missing or incorrect" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host ""

# Step 4: Test diagnostics endpoint
Write-Host "Step 4: Testing diagnostics endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost/resume-api/api/diagnostics" -UseBasicParsing -ErrorAction Stop
    $content = $response.Content | ConvertFrom-Json
    Write-Host "✅ Diagnostics endpoint is working" -ForegroundColor Green
    Write-Host "   Status: $($content.status)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Diagnostics endpoint failed" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Step 5: Check CORS configuration
Write-Host "Step 5: Checking CORS configuration..." -ForegroundColor Yellow
$configPath = "$backendPath\config\config.php"
if (Test-Path $configPath) {
    $configContent = Get-Content $configPath -Raw
    if ($configContent -match "Access-Control-Allow-Origin") {
        Write-Host "✅ CORS headers are configured" -ForegroundColor Green
    } else {
        Write-Host "⚠️  CORS headers might not be configured" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ Config file not found: $configPath" -ForegroundColor Red
}

Write-Host ""

# Step 6: Test auth endpoint (should return 401 or error, but should respond)
Write-Host "Step 6: Testing auth endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost/resume-api/api/auth/me" -UseBasicParsing -ErrorAction Stop
    Write-Host "✅ Auth endpoint responded (unexpected success)" -ForegroundColor Green
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✅ Auth endpoint is working (401 Unauthorized - expected)" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Auth endpoint responded with: $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
    }
}

Write-Host ""

# Step 7: Check frontend configuration
Write-Host "Step 7: Checking frontend API configuration..." -ForegroundColor Yellow
$frontendApiPath = "d:\ai resume analyzer\frontend\src\api\axios.js"
if (Test-Path $frontendApiPath) {
    $frontendApiContent = Get-Content $frontendApiPath -Raw
    if ($frontendApiContent -match "http://localhost/resume-api/api") {
        Write-Host "✅ Frontend is configured to connect to: http://localhost/resume-api/api" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Frontend API URL might be incorrect" -ForegroundColor Yellow
        Write-Host "   Expected: http://localhost/resume-api/api" -ForegroundColor White
    }
} else {
    Write-Host "❌ Frontend API config not found: $frontendApiPath" -ForegroundColor Red
}

Write-Host ""

# Step 8: Summary and recommendations
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "📊 Summary" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Backend URL: http://localhost/resume-api/" -ForegroundColor White
Write-Host "API Base URL: http://localhost/resume-api/api" -ForegroundColor White
Write-Host "Frontend URL: http://localhost:5173" -ForegroundColor White
Write-Host ""

Write-Host "🔧 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Make sure Apache is running in XAMPP" -ForegroundColor White
Write-Host "2. Test backend in browser: http://localhost/resume-api/" -ForegroundColor White
Write-Host "3. Check diagnostics: http://localhost/resume-api/api/diagnostics" -ForegroundColor White
Write-Host "4. If still failing, check Apache error logs" -ForegroundColor White
Write-Host ""

Write-Host "✅ Debug complete!" -ForegroundColor Green
