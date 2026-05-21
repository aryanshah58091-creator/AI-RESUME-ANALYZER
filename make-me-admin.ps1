# Make User Admin
# This script updates your user to have admin role

$mysqlPath = "C:\xampp\mysql\bin\mysql.exe"
$database = "resume_analyzer"
$email = "shaharyan251461@gmail.com"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Make User Admin" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Update user to admin
Write-Host "Updating user to admin role..." -ForegroundColor Yellow
& $mysqlPath -u root $database -e "UPDATE users SET role = 'admin' WHERE email = '$email';"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ User updated to admin!" -ForegroundColor Green
    Write-Host ""
    
    # Show user details
    Write-Host "User Details:" -ForegroundColor Cyan
    & $mysqlPath -u root $database -e "SELECT id, name, email, role FROM users WHERE email = '$email';" -t
    
    Write-Host ""
    Write-Host "✅ You can now login as admin!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Login at: http://localhost:5173/admin/login" -ForegroundColor White
    Write-Host "Email: $email" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "❌ Failed to update user" -ForegroundColor Red
}

Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
