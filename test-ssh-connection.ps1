# Test SSH Connection to Hostinger
# Run this in a separate PowerShell window

$SSH_KEY = "$env:USERPROFILE\.ssh\id_rsa_github_hostinger"
$SERVER = "u623025070@in-mum-web1990.main-hosting.eu"
$REMOTE_PATH = "/home/u623025070/domains/vision.innovfix.in/public_html"

Write-Host "`n═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  Testing SSH Connection to Hostinger" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════`n" -ForegroundColor Cyan

if (-not (Test-Path $SSH_KEY)) {
    Write-Host "❌ SSH key not found at: $SSH_KEY" -ForegroundColor Red
    exit 1
}

Write-Host "✅ SSH key found: $SSH_KEY`n" -ForegroundColor Green
Write-Host "Connecting to server..." -ForegroundColor Yellow
Write-Host "This may take 10-20 seconds...`n" -ForegroundColor Gray

# Try to connect and list files
try {
    $result = ssh -i $SSH_KEY -o ConnectTimeout=20 -o StrictHostKeyChecking=no $SERVER "cd $REMOTE_PATH && echo '=== FILES IN public_html ===' && ls -la && echo '' && echo '=== ASSETS FOLDER ===' && (test -d assets && echo '✅ assets/ exists' && ls assets/ || echo '❌ assets/ not found') && echo '' && echo '=== BACKEND FOLDER ===' && (test -d backend && echo '✅ backend/ exists' && ls backend/ || echo '❌ backend/ not found')" 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host $result -ForegroundColor Green
        Write-Host "`n✅ Connection successful!`n" -ForegroundColor Green
    } else {
        Write-Host $result -ForegroundColor Red
        Write-Host "`n❌ Connection failed or command error`n" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
    Write-Host "`nPossible issues:" -ForegroundColor Yellow
    Write-Host "  1. Network/firewall blocking SSH (port 22)" -ForegroundColor White
    Write-Host "  2. SSH key requires passphrase" -ForegroundColor White
    Write-Host "  3. Server not accessible from your network`n" -ForegroundColor White
}

Write-Host "═══════════════════════════════════════════════════════`n" -ForegroundColor Cyan


