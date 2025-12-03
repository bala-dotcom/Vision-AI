# Generate SSH Key Pair for GitHub Actions → Hostinger Deployment

Write-Host ""
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "  Generating SSH Key Pair" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

$keyPath = "$env:USERPROFILE\.ssh\id_rsa_github_hostinger"

# Check if key already exists
if (Test-Path $keyPath) {
    Write-Host "⚠️  Key already exists at: $keyPath" -ForegroundColor Yellow
    $overwrite = Read-Host "Overwrite? (y/n)"
    if ($overwrite -ne "y") {
        Write-Host "Cancelled." -ForegroundColor Red
        exit
    }
}

Write-Host "Generating new SSH key pair..." -ForegroundColor Yellow
Write-Host "Key location: $keyPath" -ForegroundColor Gray
Write-Host ""

# Generate key (no passphrase for GitHub Actions)
ssh-keygen -t rsa -b 4096 -C "github-actions-hostinger" -f $keyPath -N '""'

if (Test-Path $keyPath) {
    Write-Host ""
    Write-Host "✅ SSH key pair generated successfully!" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "===============================================" -ForegroundColor Green
    Write-Host "  PUBLIC KEY (Add to Hostinger)" -ForegroundColor Green
    Write-Host "===============================================" -ForegroundColor Green
    Write-Host ""
    $publicKey = Get-Content "$keyPath.pub"
    Write-Host $publicKey -ForegroundColor White
    Write-Host ""
    Write-Host "📋 Copy the above public key" -ForegroundColor Yellow
    Write-Host "   Add it to Hostinger: ~/.ssh/authorized_keys" -ForegroundColor Gray
    Write-Host ""
    
    Write-Host "===============================================" -ForegroundColor Green
    Write-Host "  PRIVATE KEY (Add to GitHub Secrets)" -ForegroundColor Green
    Write-Host "===============================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  PRIVATE KEY - Keep this SECRET!" -ForegroundColor Red
    Write-Host ""
    $privateKey = Get-Content $keyPath
    Write-Host $privateKey -ForegroundColor White
    Write-Host ""
    Write-Host "📋 Copy the above private key" -ForegroundColor Yellow
    Write-Host "   Add it to GitHub Secrets as: HOSTINGER_SSH_KEY" -ForegroundColor Gray
    Write-Host ""
    
    # Copy public key to clipboard
    $publicKey | Set-Clipboard
    Write-Host "✅ Public key copied to clipboard!" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "===============================================" -ForegroundColor Cyan
    Write-Host "  Next Steps" -ForegroundColor Cyan
    Write-Host "===============================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Add PUBLIC key to Hostinger:" -ForegroundColor White
    Write-Host "   ssh u623025070@in-mum-web1990.main-hosting.eu" -ForegroundColor Gray
    Write-Host "   mkdir -p ~/.ssh" -ForegroundColor Gray
    Write-Host "   echo 'PUBLIC_KEY' >> ~/.ssh/authorized_keys" -ForegroundColor Gray
    Write-Host "   chmod 600 ~/.ssh/authorized_keys" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Add PRIVATE key to GitHub Secrets:" -ForegroundColor White
    Write-Host "   https://github.com/bala-dotcom/Vision-AI/settings/secrets/actions" -ForegroundColor Gray
    Write-Host "   Secret name: HOSTINGER_SSH_KEY" -ForegroundColor Gray
    Write-Host "   Value: (paste private key above)" -ForegroundColor Gray
    Write-Host ""
} else {
    Write-Host "❌ Failed to generate key" -ForegroundColor Red
}

