# Test Admin Login
# This script verifies your admin setup

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Admin Login Test" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$email = "shaharyan251461@gmail.com"

# Check user in database
Write-Host "Checking user in database..." -ForegroundColor Yellow
Write-Host ""

$result = & C:\xampp\mysql\bin\mysql.exe -u root resume_analyzer -e "SELECT id, name, email, role FROM users WHERE email = '$email';" -s -N

if ($result) {
    $fields = $result -split "`t"
    $userId = $fields[0]
    $userName = $fields[1]
    $userEmail = $fields[2]
    $userRole = $fields[3]
    
    Write-Host "✅ User Found!" -ForegroundColor Green
    Write-Host ""
    Write-Host "User Details:" -ForegroundColor Cyan
    Write-Host "  ID:    $userId" -ForegroundColor White
    Write-Host "  Name:  $userName" -ForegroundColor White
    Write-Host "  Email: $userEmail" -ForegroundColor White
    Write-Host "  Role:  $userRole" -ForegroundColor $(if ($userRole -eq 'admin') { 'Green' } else { 'Red' })
    Write-Host ""
    
    if ($userRole -eq 'admin') {
        Write-Host "✅ User has admin role!" -ForegroundColor Green
        Write-Host ""
        Write-Host "===========================================" -ForegroundColor Cyan
        Write-Host "  Ready to Login!" -ForegroundColor Green
        Write-Host "===========================================" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Login URL: http://localhost:5173/admin/login" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Credentials:" -ForegroundColor Cyan
        Write-Host "  Email:    $email" -ForegroundColor White
        Write-Host "  Password: 12345678" -ForegroundColor White
        Write-Host ""
        Write-Host "✅ You should be able to login now!" -ForegroundColor Green
    } else {
        Write-Host "❌ User does NOT have admin role!" -ForegroundColor Red
        Write-Host "Attempting to fix..." -ForegroundColor Yellow
        
        & C:\xampp\mysql\bin\mysql.exe -u root resume_analyzer -e "UPDATE users SET role = 'admin' WHERE email = '$email';"
        
        Write-Host "✅ Role updated! Please run this script again to verify." -ForegroundColor Green
    }
} else {
    Write-Host "❌ User not found in database!" -ForegroundColor Red
    Write-Host "Please register first at: http://localhost:5173/register" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
