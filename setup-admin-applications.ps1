# Setup Admin Applications - Load Sample Data
# This script creates sample job applications for testing the admin panel

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Admin Applications Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$mysqlPath = "C:\xampp\mysql\bin\mysql.exe"
$database = "resume_analyzer"
$sqlFile = "insert_sample_applications.sql"

# Check if MySQL is installed
if (-not (Test-Path $mysqlPath)) {
    Write-Host "❌ MySQL not found at: $mysqlPath" -ForegroundColor Red
    Write-Host "Please ensure XAMPP is installed and MySQL path is correct." -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host "✅ MySQL found" -ForegroundColor Green

# Check if SQL file exists
if (-not (Test-Path $sqlFile)) {
    Write-Host "❌ SQL file not found: $sqlFile" -ForegroundColor Red
    Write-Host "Please ensure the file exists in the current directory." -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host "✅ SQL file found" -ForegroundColor Green
Write-Host ""

# Execute SQL file
Write-Host "📊 Loading sample applications data..." -ForegroundColor Yellow
Write-Host ""

try {
    & $mysqlPath -u root $database -e "source $sqlFile" 2>&1 | Out-Null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Sample data loaded successfully!" -ForegroundColor Green
        Write-Host ""
        
        # Show statistics
        Write-Host "📈 Application Statistics:" -ForegroundColor Cyan
        Write-Host ""
        
        $stats = & $mysqlPath -u root $database -e "SELECT COUNT(*) as total, SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending, SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END) as accepted, SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected FROM job_applications;" -s -N
        
        if ($stats) {
            $values = $stats -split "`t"
            Write-Host "  Total Applications: $($values[0])" -ForegroundColor White
            Write-Host "  Pending: $($values[1])" -ForegroundColor Yellow
            Write-Host "  Accepted: $($values[2])" -ForegroundColor Green
            Write-Host "  Rejected: $($values[3])" -ForegroundColor Red
        }
        
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host "  Sample Data Created!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "📝 Test Users Created:" -ForegroundColor Cyan
        Write-Host "  • Shah Aryan (aryan@test.com)" -ForegroundColor White
        Write-Host "  • Priya Sharma (priya@test.com)" -ForegroundColor White
        Write-Host "  • Rahul Kumar (rahul@test.com)" -ForegroundColor White
        Write-Host "  • Sneha Patel (sneha@test.com)" -ForegroundColor White
        Write-Host "  • Amit Singh (amit@test.com)" -ForegroundColor White
        Write-Host ""
        Write-Host "🔐 Admin Login:" -ForegroundColor Cyan
        Write-Host "  URL: http://localhost:5173/admin/login" -ForegroundColor White
        Write-Host "  Email: admin@careerconnect.com" -ForegroundColor White
        Write-Host "  Password: password" -ForegroundColor White
        Write-Host ""
        Write-Host "📋 Admin Pages:" -ForegroundColor Cyan
        Write-Host "  • Dashboard: http://localhost:5173/admin/dashboard" -ForegroundColor White
        Write-Host "  • Pending: http://localhost:5173/admin/pending-applications" -ForegroundColor White
        Write-Host "  • Accepted: http://localhost:5173/admin/accepted-applications" -ForegroundColor White
        Write-Host ""
        Write-Host "✨ You're all set! Start the app and test the admin panel." -ForegroundColor Green
        Write-Host ""
        
    } else {
        Write-Host "❌ Failed to load sample data" -ForegroundColor Red
        Write-Host "Please check the SQL file for errors." -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "❌ Error executing SQL: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
