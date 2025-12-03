# Deployment Preparation Script for Windows
# This script helps prepare files for Hostinger deployment

Write-Host ""
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "  Vision AI - Deployment Preparation" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

# Check if dist folder exists
Write-Host "Checking Frontend Build..." -ForegroundColor Yellow
if (Test-Path "dist") {
    $distFiles = Get-ChildItem dist -Recurse | Measure-Object
    Write-Host "  [OK] Frontend build found ($($distFiles.Count) files)" -ForegroundColor Green
} else {
    Write-Host "  [X] Frontend build not found. Building now..." -ForegroundColor Red
    npm run build
    if (Test-Path "dist") {
        Write-Host "  [OK] Frontend build completed" -ForegroundColor Green
    } else {
        Write-Host "  [X] Build failed. Please check errors above." -ForegroundColor Red
        exit 1
    }
}

# Check backend files
Write-Host ""
Write-Host "Checking Backend Files..." -ForegroundColor Yellow
$backendFiles = @(
    "backend/server.js",
    "backend/package.json",
    "backend/database/db.js",
    "backend/routes/videos.js",
    "backend/routes/usage.js"
)

$allBackendFiles = $true
foreach ($file in $backendFiles) {
    if (Test-Path $file) {
        Write-Host "  [OK] $file" -ForegroundColor Green
    } else {
        Write-Host "  [X] $file - MISSING" -ForegroundColor Red
        $allBackendFiles = $false
    }
}

if (-not $allBackendFiles) {
    Write-Host ""
    Write-Host "[X] Some backend files are missing!" -ForegroundColor Red
    exit 1
}

# Check configuration files
Write-Host ""
Write-Host "Checking Configuration Files..." -ForegroundColor Yellow
if (Test-Path ".htaccess") {
    Write-Host "  [OK] .htaccess (React Router config)" -ForegroundColor Green
} else {
    Write-Host "  [!] .htaccess not found" -ForegroundColor Yellow
}

if (Test-Path "backend/.env.production.example") {
    Write-Host "  [OK] backend/.env.production.example" -ForegroundColor Green
} else {
    Write-Host "  [X] backend/.env.production.example - MISSING" -ForegroundColor Red
}

# Summary
Write-Host ""
Write-Host "===============================================" -ForegroundColor Green
Write-Host "  Preparation Complete!" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green
Write-Host ""

Write-Host "Ready to Upload:" -ForegroundColor Cyan
Write-Host "  - Frontend: dist/ folder -> public_html/" -ForegroundColor White
Write-Host "  - Backend: backend/ files -> api/ folder" -ForegroundColor White
Write-Host "  - Config: .htaccess -> public_html/" -ForegroundColor White

Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Open Hostinger File Manager" -ForegroundColor White
Write-Host "  2. Upload files as shown above" -ForegroundColor White
Write-Host "  3. Follow DEPLOYMENT_QUICK_START.md for detailed steps" -ForegroundColor White
Write-Host ""
