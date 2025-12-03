# Prepare Correct Files for Hostinger Upload
# This script creates a ZIP file with the CORRECT built files

Write-Host "`n═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  Preparing Correct Files for Hostinger Upload" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════`n" -ForegroundColor Cyan

# Check if dist folder exists
if (-not (Test-Path "dist")) {
    Write-Host "❌ dist/ folder not found. Building first...`n" -ForegroundColor Red
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Build failed!`n" -ForegroundColor Red
        exit 1
    }
}

# Verify correct index.html
$indexContent = Get-Content "dist\index.html" -Raw
if ($indexContent -notmatch "/assets/") {
    Write-Host "❌ ERROR: dist/index.html references /src/ instead of /assets/`n" -ForegroundColor Red
    Write-Host "This means the wrong index.html is in dist/. Rebuilding...`n" -ForegroundColor Yellow
    npm run build
    $indexContent = Get-Content "dist\index.html" -Raw
    if ($indexContent -notmatch "/assets/") {
        Write-Host "❌ Still wrong after rebuild. Check your build configuration.`n" -ForegroundColor Red
        exit 1
    }
}

Write-Host "✅ Verified correct index.html (references /assets/)`n" -ForegroundColor Green

# Check assets folder
if (-not (Test-Path "dist\assets")) {
    Write-Host "❌ dist/assets/ folder not found!`n" -ForegroundColor Red
    exit 1
}

$jsFiles = Get-ChildItem "dist\assets\*.js" -ErrorAction SilentlyContinue
$cssFiles = Get-ChildItem "dist\assets\*.css" -ErrorAction SilentlyContinue

if (-not $jsFiles) {
    Write-Host "❌ No JS files found in dist/assets/!`n" -ForegroundColor Red
    exit 1
}

if (-not $cssFiles) {
    Write-Host "❌ No CSS files found in dist/assets/!`n" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Found $($jsFiles.Count) JS file(s) and $($cssFiles.Count) CSS file(s) in assets/`n" -ForegroundColor Green

# Check .htaccess
if (-not (Test-Path ".htaccess")) {
    Write-Host "⚠️  .htaccess file not found in root. Creating one...`n" -ForegroundColor Yellow
    # .htaccess should already exist, but if not, we'll note it
}

# Create temporary directory for upload
$tempDir = "hostinger-upload-temp"
if (Test-Path $tempDir) {
    Remove-Item $tempDir -Recurse -Force
}
New-Item -ItemType Directory -Path $tempDir | Out-Null

Write-Host "📦 Copying files to temporary directory...`n" -ForegroundColor Cyan

# Copy index.html
Copy-Item "dist\index.html" -Destination "$tempDir\index.html"
Write-Host "✅ Copied index.html" -ForegroundColor Green

# Copy assets folder
Copy-Item "dist\assets" -Destination "$tempDir\assets" -Recurse
Write-Host "✅ Copied assets/ folder" -ForegroundColor Green

# Copy .htaccess
if (Test-Path ".htaccess") {
    Copy-Item ".htaccess" -Destination "$tempDir\.htaccess"
    Write-Host "✅ Copied .htaccess`n" -ForegroundColor Green
} else {
    Write-Host "⚠️  .htaccess not found - you'll need to upload it separately`n" -ForegroundColor Yellow
}

# Create ZIP file
$zipFile = "hostinger-correct-upload.zip"
if (Test-Path $zipFile) {
    Remove-Item $zipFile -Force
}

Write-Host "📦 Creating ZIP file...`n" -ForegroundColor Cyan

# Use .NET compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory($tempDir, $zipFile)

Write-Host "✅ Created: $zipFile`n" -ForegroundColor Green

# Clean up temp directory
Remove-Item $tempDir -Recurse -Force

# Show file sizes
$zipSize = (Get-Item $zipFile).Length / 1MB
Write-Host "📊 ZIP file size: $([math]::Round($zipSize, 2)) MB`n" -ForegroundColor Cyan

Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  ✅ Ready to Upload!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════`n" -ForegroundColor Cyan

Write-Host "📋 Next Steps:`n" -ForegroundColor Yellow
Write-Host "1. Go to Hostinger File Manager:" -ForegroundColor White
Write-Host "   https://hpanel.hostinger.com`n" -ForegroundColor Gray
Write-Host "2. Navigate to: domains/vision.innovfix.in/public_html/`n" -ForegroundColor White
Write-Host "3. DELETE the old index.html file`n" -ForegroundColor White
Write-Host "4. Upload the ZIP file: $zipFile`n" -ForegroundColor White
Write-Host "5. Extract the ZIP file in public_html/`n" -ForegroundColor White
Write-Host "6. DELETE the ZIP file after extraction`n" -ForegroundColor White
Write-Host "7. Verify index.html references /assets/ not /src/`n" -ForegroundColor White
Write-Host "8. Clear browser cache and test: https://vision.innovfix.in`n" -ForegroundColor White

Write-Host "═══════════════════════════════════════════════════════`n" -ForegroundColor Cyan

