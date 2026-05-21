# Open PHP Admin Panel
# This script opens the admin panel in your default browser

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Opening PHP Admin Panel" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$url = "http://localhost/resume-api/admin-login.php"

Write-Host "Admin Panel URL: $url" -ForegroundColor Yellow
Write-Host ""
Write-Host "Login Credentials:" -ForegroundColor Green
Write-Host "  Username: admin" -ForegroundColor White
Write-Host "  Password: admin123" -ForegroundColor White
Write-Host ""
Write-Host "Opening in browser..." -ForegroundColor Yellow

Start-Process $url

Write-Host ""
Write-Host "✅ Admin panel opened!" -ForegroundColor Green
Write-Host ""
Write-Host "Features:" -ForegroundColor Cyan
Write-Host "  ✓ Pending Applications (Accept/Reject)" -ForegroundColor White
Write-Host "  ✓ Accepted Applications" -ForegroundColor White
Write-Host "  ✓ User Management" -ForegroundColor White
Write-Host "  ✓ Job Management" -ForegroundColor White
Write-Host ""
