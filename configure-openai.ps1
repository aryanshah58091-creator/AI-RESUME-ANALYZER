# OpenAI API Key Configuration Script
# This script helps you safely configure your OpenAI API key

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  OpenAI API Key Configuration" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check if config file exists
$configFile = "C:\xampp\htdocs\resume-api\config\config.php"
$sourceConfigFile = "d:\ai resume analyzer\backend\config\config.php"

if (!(Test-Path $configFile)) {
    Write-Host "Error: Config file not found at: $configFile" -ForegroundColor Red
    Write-Host "Make sure XAMPP backend is set up correctly." -ForegroundColor Yellow
    exit
}

Write-Host "Step 1: Get Your OpenAI API Key" -ForegroundColor Yellow
Write-Host "---------------------------------------" -ForegroundColor Gray
Write-Host "1. Go to: https://platform.openai.com/" -ForegroundColor White
Write-Host "2. Sign in or create an account" -ForegroundColor White
Write-Host "3. Go to API Keys section" -ForegroundColor White
Write-Host "4. Create a new secret key" -ForegroundColor White
Write-Host "5. Copy the key (starts with 'sk-proj-' or 'sk-')" -ForegroundColor White
Write-Host ""

Write-Host "Step 2: Enter Your API Key" -ForegroundColor Yellow
Write-Host "---------------------------------------" -ForegroundColor Gray
Write-Host "Paste your OpenAI API key below:" -ForegroundColor White
Write-Host "(The key will be hidden for security)" -ForegroundColor Gray
Write-Host ""

# Read API key securely
$apiKey = Read-Host "API Key" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($apiKey)
$apiKeyPlain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

# Validate API key format
if ([string]::IsNullOrWhiteSpace($apiKeyPlain)) {
    Write-Host ""
    Write-Host "Error: No API key entered!" -ForegroundColor Red
    exit
}

if (!($apiKeyPlain -match '^sk-')) {
    Write-Host ""
    Write-Host "Warning: API key doesn't start with 'sk-'" -ForegroundColor Yellow
    Write-Host "Are you sure this is correct? (Y/N)" -ForegroundColor Yellow
    $confirm = Read-Host
    if ($confirm -ne 'Y' -and $confirm -ne 'y') {
        Write-Host "Configuration cancelled." -ForegroundColor Red
        exit
    }
}

Write-Host ""
Write-Host "Step 3: Updating Configuration Files" -ForegroundColor Yellow
Write-Host "---------------------------------------" -ForegroundColor Gray

try {
    # Read config file
    $configContent = Get-Content $configFile -Raw
    
    # Replace API key
    $newContent = $configContent -replace "define\('OPENAI_API_KEY',\s*'[^']*'\);", "define('OPENAI_API_KEY', '$apiKeyPlain');"
    
    # Save to production config
    $newContent | Set-Content $configFile -NoNewline
    Write-Host "Updated: $configFile" -ForegroundColor Green
    
    # Also update source config
    if (Test-Path $sourceConfigFile) {
        $newContent | Set-Content $sourceConfigFile -NoNewline
        Write-Host "Updated: $sourceConfigFile" -ForegroundColor Green
    }
    
    Write-Host ""
    Write-Host "Step 4: Restarting Apache" -ForegroundColor Yellow
    Write-Host "---------------------------------------" -ForegroundColor Gray
    
    # Try to restart Apache
    $apacheService = Get-Process -Name "httpd" -ErrorAction SilentlyContinue
    if ($apacheService) {
        Write-Host "Stopping Apache..." -ForegroundColor Yellow
        Stop-Process -Name "httpd" -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 2
        
        Write-Host "Please start Apache manually from XAMPP Control Panel" -ForegroundColor Yellow
        Write-Host ""
    } else {
        Write-Host "Apache not running. Please start it from XAMPP Control Panel" -ForegroundColor Yellow
        Write-Host ""
    }
    
    Write-Host "Step 5: Verification" -ForegroundColor Yellow
    Write-Host "---------------------------------------" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Testing configuration..." -ForegroundColor White
    
    Start-Sleep -Seconds 3
    
    try {
        $response = Invoke-WebRequest -Uri "http://localhost/resume-api/api/diagnostics" -UseBasicParsing
        $diagnostics = $response.Content | ConvertFrom-Json
        
        if ($diagnostics.checks.'OpenAI API Key'.status -eq $true) {
            Write-Host ""
            Write-Host "SUCCESS!" -ForegroundColor Green
            Write-Host "OpenAI API key is configured correctly!" -ForegroundColor Green
            Write-Host ""
        } else {
            Write-Host ""
            Write-Host "Configuration saved, but verification failed." -ForegroundColor Yellow
            Write-Host "Please restart Apache and try uploading a resume." -ForegroundColor Yellow
            Write-Host ""
        }
    } catch {
        Write-Host ""
        Write-Host "Could not verify configuration (Apache might not be running)" -ForegroundColor Yellow
        Write-Host "Please start Apache and test by uploading a resume." -ForegroundColor Yellow
        Write-Host ""
    }
    
    Write-Host "Next Steps:" -ForegroundColor Cyan
    Write-Host "1. Make sure Apache is running in XAMPP" -ForegroundColor White
    Write-Host "2. Go to: http://localhost:5173/dashboard" -ForegroundColor White
    Write-Host "3. Upload a resume" -ForegroundColor White
    Write-Host "4. Click 'Analyze Resume'" -ForegroundColor White
    Write-Host "5. Check the summary - it should NOT say 'Demo Mode'" -ForegroundColor White
    Write-Host ""
    Write-Host "You should now get AI-powered analysis!" -ForegroundColor Green
    Write-Host ""
    
} catch {
    Write-Host ""
    Write-Host "Error updating configuration:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "Manual configuration:" -ForegroundColor Yellow
    Write-Host "1. Open: $configFile" -ForegroundColor White
    Write-Host "2. Find: define('OPENAI_API_KEY', ..." -ForegroundColor White
    Write-Host "3. Replace with your API key" -ForegroundColor White
    Write-Host "4. Save and restart Apache" -ForegroundColor White
    Write-Host ""
}

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
