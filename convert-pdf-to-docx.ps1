# PDF to DOCX Converter
# This script converts PDF files to DOCX using Microsoft Word

param(
    [string]$PdfPath = ""
)

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  PDF to DOCX Converter" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# If no path provided, ask user to select file
if ([string]::IsNullOrEmpty($PdfPath)) {
    Write-Host "Please select your PDF file..." -ForegroundColor Yellow
    
    Add-Type -AssemblyName System.Windows.Forms
    $openFileDialog = New-Object System.Windows.Forms.OpenFileDialog
    $openFileDialog.Filter = "PDF files (*.pdf)|*.pdf"
    $openFileDialog.Title = "Select PDF Resume to Convert"
    
    if ($openFileDialog.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK) {
        $PdfPath = $openFileDialog.FileName
    } else {
        Write-Host "No file selected. Exiting..." -ForegroundColor Red
        exit
    }
}

# Check if file exists
if (!(Test-Path $PdfPath)) {
    Write-Host "Error: PDF file not found at: $PdfPath" -ForegroundColor Red
    exit
}

Write-Host "Converting: $PdfPath" -ForegroundColor Green
Write-Host ""

try {
    # Create Word application
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    
    # Open PDF
    Write-Host "Opening PDF in Word..." -ForegroundColor Yellow
    $doc = $word.Documents.Open($PdfPath)
    
    # Generate output path
    $docxPath = [System.IO.Path]::ChangeExtension($PdfPath, ".docx")
    
    # Save as DOCX
    Write-Host "Converting to DOCX..." -ForegroundColor Yellow
    $doc.SaveAs([ref]$docxPath, [ref]16)
    
    # Close document
    $doc.Close()
    $word.Quit()
    
    # Release COM objects
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($doc) | Out-Null
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
    [System.GC]::Collect()
    [System.GC]::WaitForPendingFinalizers()
    
    Write-Host ""
    Write-Host "SUCCESS!" -ForegroundColor Green
    Write-Host ""
    Write-Host "DOCX file created at:" -ForegroundColor Cyan
    Write-Host "$docxPath" -ForegroundColor White
    Write-Host ""
    Write-Host "Opening folder..." -ForegroundColor Yellow
    
    # Open folder containing the file
    $folder = Split-Path $docxPath
    Start-Process explorer.exe -ArgumentList $folder
    
    Write-Host ""
    Write-Host "Next Steps:" -ForegroundColor Cyan
    Write-Host "1. Go to http://localhost:5173/dashboard" -ForegroundColor White
    Write-Host "2. Upload the DOCX file" -ForegroundColor White
    Write-Host "3. Click Analyze Resume" -ForegroundColor White
    Write-Host "4. View your results!" -ForegroundColor White
    Write-Host ""
    
} catch {
    Write-Host ""
    Write-Host "Error during conversion:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "Manual Method:" -ForegroundColor Yellow
    Write-Host "1. Right-click your PDF file" -ForegroundColor White
    Write-Host "2. Select Open with Microsoft Word" -ForegroundColor White
    Write-Host "3. Click OK when Word asks to convert" -ForegroundColor White
    Write-Host "4. File - Save As - Word Document (.docx)" -ForegroundColor White
    Write-Host ""
}
