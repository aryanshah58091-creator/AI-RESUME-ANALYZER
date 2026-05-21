# Install Poppler for PDF Support

# Check if Chocolatey is installed
if (!(Get-Command choco -ErrorAction SilentlyContinue)) {
    Write-Host "Chocolatey is not installed. Installing Chocolatey..." -ForegroundColor Yellow
    Set-ExecutionPolicy Bypass -Scope Process -Force
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
    iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
}

# Install Poppler
Write-Host "Installing Poppler (PDF tools)..." -ForegroundColor Green
choco install poppler -y

Write-Host ""
Write-Host "✅ Poppler installed successfully!" -ForegroundColor Green
Write-Host "⚠️  You may need to restart your terminal or computer for the changes to take effect." -ForegroundColor Yellow
Write-Host ""
Write-Host "After restart, PDF parsing will work much better!" -ForegroundColor Cyan
