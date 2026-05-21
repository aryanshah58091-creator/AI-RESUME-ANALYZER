# Reset Password Script
# Sets password to: 12345678

$email = "shaharyan251461@gmail.com"
$password = "12345678"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Reset Password" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Generate bcrypt hash using PHP
Write-Host "Generating password hash..." -ForegroundColor Yellow

$phpCode = @"
<?php
echo password_hash('$password', PASSWORD_BCRYPT);
?>
"@

$phpCode | Out-File -FilePath "temp_hash.php" -Encoding ASCII

$hashedPassword = & C:\xampp\php\php.exe temp_hash.php
Remove-Item "temp_hash.php" -Force

Write-Host "Updating password in database..." -ForegroundColor Yellow

# Update password in database
& C:\xampp\mysql\bin\mysql.exe -u root resume_analyzer -e "UPDATE users SET password = '$hashedPassword', role = 'admin' WHERE email = '$email';"

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Password Updated Successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "===========================================" -ForegroundColor Cyan
    Write-Host "  Your Admin Login Credentials" -ForegroundColor Cyan
    Write-Host "===========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Email:    $email" -ForegroundColor White
    Write-Host "Password: $password" -ForegroundColor White
    Write-Host "Role:     admin" -ForegroundColor Green
    Write-Host ""
    Write-Host "Login URL: http://localhost:5173/admin/login" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "✅ You can now login to the admin panel!" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "❌ Failed to update password" -ForegroundColor Red
}

Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
