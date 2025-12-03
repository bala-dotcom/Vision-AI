# Verify Hostinger Upload Status
# Usage: .\verify-upload.ps1

$SSH_KEY = "$env:USERPROFILE\.ssh\id_rsa_github_hostinger"
$SERVER = "u623025070@in-mum-web1990.main-hosting.eu"
$REMOTE_PATH = "/home/u623025070/domains/vision.innovfix.in/public_html"

Write-Host "`n═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  Verifying Hostinger Upload Status" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════`n" -ForegroundColor Cyan

Write-Host "Checking local files...`n" -ForegroundColor Yellow

# Check local frontend files
$localFiles = @{
    "index.html" = Test-Path "dist\index.html"
    ".htaccess" = Test-Path ".htaccess"
    "assets folder" = Test-Path "dist\assets"
}

Write-Host "Local Frontend Files:" -ForegroundColor Cyan
foreach ($file in $localFiles.Keys) {
    if ($localFiles[$file]) {
        Write-Host "  ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $file (missing)" -ForegroundColor Red
    }
}

Write-Host "`nChecking server files...`n" -ForegroundColor Yellow

# Build SSH command
$sshCmd = "cd $REMOTE_PATH && echo 'FRONTEND:' && test -f index.html && echo '✅ index.html' || echo '❌ index.html missing' && test -f .htaccess && echo '✅ .htaccess' || echo '❌ .htaccess missing' && test -d assets && echo '✅ assets/ folder' || echo '❌ assets/ folder missing' && echo '' && echo 'BACKEND:' && test -d backend && echo '✅ backend/ folder' || echo '❌ backend/ folder missing'"

try {
    if (Test-Path $SSH_KEY) {
        Write-Host "Using SSH key authentication...`n" -ForegroundColor Green
        ssh -i $SSH_KEY $SERVER $sshCmd
    } else {
        Write-Host "SSH key not found. Using password authentication...`n" -ForegroundColor Yellow
        ssh $SERVER $sshCmd
    }
} catch {
    Write-Host "`n⚠️  Could not connect via SSH. Please check manually:" -ForegroundColor Yellow
    Write-Host "   1. Login to Hostinger File Manager" -ForegroundColor White
    Write-Host "   2. Navigate to: domains/vision.innovfix.in/public_html/" -ForegroundColor White
    Write-Host "   3. Verify files listed above are present`n" -ForegroundColor White
}

Write-Host "`n═══════════════════════════════════════════════════════`n" -ForegroundColor Cyan

