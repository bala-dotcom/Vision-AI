# Deploy Vision AI to Hostinger via SSH
# Usage: .\deploy-to-hostinger.ps1

# Configuration
$HOSTINGER_HOST = "in-mum-web1990.main-hosting.eu"
$HOSTINGER_USER = "u623025070"
$REMOTE_PATH = "/home/u623025070/domains/vision.innovfix.in/public_html"
$SSH_KEY = "$env:USERPROFILE\.ssh\id_rsa_github_hostinger"

Write-Host "`n═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  🚀 Deploying Vision AI to Hostinger" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════`n" -ForegroundColor Cyan

# Step 1: Build Frontend
Write-Host "📦 Step 1: Building frontend..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed! Please fix errors and try again." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build completed successfully!`n" -ForegroundColor Green

# Step 2: Check if dist folder exists
if (-not (Test-Path "dist")) {
    Write-Host "❌ dist/ folder not found! Build may have failed." -ForegroundColor Red
    exit 1
}

# Step 3: Check SSH key
if (-not (Test-Path $SSH_KEY)) {
    Write-Host "⚠️  SSH key not found at: $SSH_KEY" -ForegroundColor Yellow
    Write-Host "   Using default SSH key or password authentication..." -ForegroundColor Yellow
    $USE_KEY = $false
} else {
    Write-Host "✅ SSH key found: $SSH_KEY" -ForegroundColor Green
    $USE_KEY = $true
}

# Step 4: Upload files via SCP
Write-Host "`n📤 Step 2: Uploading files to Hostinger..." -ForegroundColor Yellow
Write-Host "   Host: $HOSTINGER_HOST" -ForegroundColor Gray
Write-Host "   User: $HOSTINGER_USER" -ForegroundColor Gray
Write-Host "   Path: $REMOTE_PATH`n" -ForegroundColor Gray

# Create temporary directory structure
$TEMP_DIR = "temp-deploy"
if (Test-Path $TEMP_DIR) {
    Remove-Item -Recurse -Force $TEMP_DIR
}
New-Item -ItemType Directory -Path $TEMP_DIR | Out-Null

# Copy files to temp directory
Copy-Item "dist\*" -Destination $TEMP_DIR -Recurse -Force
Copy-Item ".htaccess" -Destination $TEMP_DIR -Force

Write-Host "📋 Files to upload:" -ForegroundColor Cyan
Get-ChildItem -Path $TEMP_DIR -Recurse | ForEach-Object {
    Write-Host "   $($_.FullName.Replace((Resolve-Path $TEMP_DIR).Path + '\', ''))" -ForegroundColor Gray
}

# Build SCP command
if ($USE_KEY) {
    $SCP_CMD = "scp -i `"$SSH_KEY`" -r `"$TEMP_DIR\*`" ${HOSTINGER_USER}@${HOSTINGER_HOST}:${REMOTE_PATH}/"
} else {
    $SCP_CMD = "scp -r `"$TEMP_DIR\*`" ${HOSTINGER_USER}@${HOSTINGER_HOST}:${REMOTE_PATH}/"
}

Write-Host "`n🔄 Uploading..." -ForegroundColor Yellow

# Execute SCP command
Invoke-Expression $SCP_CMD

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Deployment successful!`n" -ForegroundColor Green
    Write-Host "🌐 Your website should be live at: https://vision.innovfix.in" -ForegroundColor Cyan
} else {
    Write-Host "`n❌ Deployment failed! Check errors above." -ForegroundColor Red
    Write-Host "`nTroubleshooting:" -ForegroundColor Yellow
    Write-Host "   1. Verify SSH key is added to Hostinger" -ForegroundColor White
    Write-Host "   2. Test SSH connection: ssh $HOSTINGER_USER@$HOSTINGER_HOST" -ForegroundColor White
    Write-Host "   3. Check file permissions on Hostinger" -ForegroundColor White
    exit 1
}

# Cleanup
Write-Host "`n🧹 Cleaning up..." -ForegroundColor Yellow
Remove-Item -Recurse -Force $TEMP_DIR
Write-Host "✅ Done!`n" -ForegroundColor Green

