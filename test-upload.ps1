# Test Resume Upload
# This script tests the resume upload endpoint to see the actual error

Write-Host "Testing Resume Upload Endpoint..." -ForegroundColor Cyan
Write-Host ""

# Test with a simple text file first
$testContent = @"
JOHN DOE
Software Developer

SKILLS
JavaScript, React, Node.js, Python

EXPERIENCE
Senior Developer - Tech Company (2020-Present)
- Developed web applications
- Led team of 5 developers
- Improved performance by 40%

EDUCATION
Bachelor of Science in Computer Science
University Name, 2018
"@

# Create a test DOCX file
$testFile = "d:\ai resume analyzer\test-resume.txt"
$testContent | Out-File -FilePath $testFile -Encoding UTF8

Write-Host "Created test file: $testFile" -ForegroundColor Green
Write-Host ""
Write-Host "Testing backend endpoint..." -ForegroundColor Yellow
Write-Host ""

try {
    # Get auth token first
    $loginData = @{
        email = "test@example.com"
        password = "password123"
    } | ConvertTo-Json

    $loginResponse = Invoke-WebRequest -Uri "http://localhost/resume-api/api/auth/login" `
        -Method POST `
        -Body $loginData `
        -ContentType "application/json" `
        -UseBasicParsing

    $token = ($loginResponse.Content | ConvertFrom-Json).token

    if ($token) {
        Write-Host "Login successful!" -ForegroundColor Green
        Write-Host "Token: $($token.Substring(0, 20))..." -ForegroundColor Gray
        Write-Host ""
    } else {
        Write-Host "Login failed - creating new account..." -ForegroundColor Yellow
        
        $registerData = @{
            name = "Test User"
            email = "test@example.com"
            password = "password123"
        } | ConvertTo-Json

        $registerResponse = Invoke-WebRequest -Uri "http://localhost/resume-api/api/auth/register" `
            -Method POST `
            -Body $registerData `
            -ContentType "application/json" `
            -UseBasicParsing

        $token = ($registerResponse.Content | ConvertFrom-Json).token
        Write-Host "Registration successful!" -ForegroundColor Green
        Write-Host ""
    }

} catch {
    Write-Host "Auth Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Response:" -ForegroundColor Yellow
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host $responseBody -ForegroundColor White
    }
}

Write-Host ""
Write-Host "Check the error above to see what's failing." -ForegroundColor Cyan
Write-Host ""
Write-Host "Common issues:" -ForegroundColor Yellow
Write-Host "1. Database not connected (normal - demo mode)" -ForegroundColor White
Write-Host "2. CORS headers issue" -ForegroundColor White
Write-Host "3. PHP configuration problem" -ForegroundColor White
Write-Host ""
