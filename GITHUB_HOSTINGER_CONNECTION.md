# Connect GitHub (bala-dotcom) with Hostinger Vision AI Panel

## 🎯 Goal
Connect your GitHub repository to Hostinger for automated deployments or easy file syncing.

---

## 🔗 Connection Options

### Option 1: GitHub Actions → Hostinger (Automated Deployment)
**Best for:** Automatic deployments when you push to GitHub

### Option 2: Hostinger Git Integration
**Best for:** Pull code directly from GitHub to Hostinger

### Option 3: Manual Sync via SSH
**Best for:** Full control over deployments

---

## ✅ Option 1: GitHub Actions Deployment (Recommended)

### Step 1: Add SSH Key to GitHub Secrets

1. **Go to GitHub Repository:**
   - https://github.com/bala-dotcom/Vision-AI
   - Click **Settings** → **Secrets and variables** → **Actions**

2. **Add New Secret:**
   - Click **"New repository secret"**
   - **Name:** `HOSTINGER_SSH_KEY`
   - **Value:** Paste your Hostinger private SSH key
   - Click **"Add secret"**

3. **Add More Secrets:**
   - **Name:** `HOSTINGER_HOST`
   - **Value:** `in-mum-web1990.main-hosting.eu`
   
   - **Name:** `HOSTINGER_USER`
   - **Value:** `u623025070`

### Step 2: Create GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Hostinger

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Build Frontend
      run: |
        npm install
        npm run build
        
    - name: Deploy to Hostinger
      uses: appleboy/scp-action@master
      with:
        host: ${{ secrets.HOSTINGER_HOST }}
        username: ${{ secrets.HOSTINGER_USER }}
        key: ${{ secrets.HOSTINGER_SSH_KEY }}
        source: "dist/*,.htaccess"
        target: "/home/u623025070/domains/vision.innovfix.in/public_html"
```

---

## ✅ Option 2: Hostinger Git Integration

### Step 1: Enable Git in Hostinger

1. **Log into Hostinger hPanel:**
   - https://hpanel.hostinger.com/websites/vision.innovfix.in

2. **Find Git Integration:**
   - Go to **Advanced** → **Git** (if available)
   - Or use **Terminal/SSH** access

### Step 2: Clone Repository on Hostinger

**Via SSH/Terminal:**

```bash
# SSH into Hostinger
ssh u623025070@in-mum-web1990.main-hosting.eu

# Navigate to your domain directory
cd domains/vision.innovfix.in

# Clone repository
git clone https://github.com/bala-dotcom/Vision-AI.git temp-repo

# Copy files
cp -r temp-repo/dist/* public_html/
cp temp-repo/.htaccess public_html/

# Clean up
rm -rf temp-repo
```

---

## ✅ Option 3: Manual Sync Script

### Create Deployment Script

**File: `deploy-to-hostinger.sh`**

```bash
#!/bin/bash

# Configuration
HOSTINGER_HOST="in-mum-web1990.main-hosting.eu"
HOSTINGER_USER="u623025070"
REMOTE_PATH="/home/u623025070/domains/vision.innovfix.in/public_html"

# Build frontend
echo "Building frontend..."
npm run build

# Deploy files
echo "Deploying to Hostinger..."
scp -r dist/* $HOSTINGER_USER@$HOSTINGER_HOST:$REMOTE_PATH/
scp .htaccess $HOSTINGER_USER@$HOSTINGER_HOST:$REMOTE_PATH/

echo "Deployment complete!"
```

**Usage:**
```bash
bash deploy-to-hostinger.sh
```

---

## 🔑 SSH Key Setup for Hostinger

### Step 1: Generate SSH Key Pair (if needed)

```powershell
# Generate new SSH key
ssh-keygen -t rsa -b 4096 -C "your-email@example.com" -f "$env:USERPROFILE\.ssh\id_rsa_hostinger"

# Display public key
Get-Content "$env:USERPROFILE\.ssh\id_rsa_hostinger.pub"
```

### Step 2: Add Public Key to Hostinger

1. **Copy your public key**
2. **SSH into Hostinger:**
   ```bash
   ssh u623025070@in-mum-web1990.main-hosting.eu
   ```
3. **Add key to authorized_keys:**
   ```bash
   mkdir -p ~/.ssh
   echo "YOUR_PUBLIC_KEY_HERE" >> ~/.ssh/authorized_keys
   chmod 600 ~/.ssh/authorized_keys
   chmod 700 ~/.ssh
   ```

### Step 3: Test Connection

```powershell
ssh u623025070@in-mum-web1990.main-hosting.eu
```

---

## 🚀 Quick Setup: GitHub Actions (Easiest)

I can create a GitHub Actions workflow file that will:
- ✅ Automatically deploy when you push to GitHub
- ✅ Build frontend automatically
- ✅ Upload files to Hostinger
- ✅ No manual steps needed

**Would you like me to create this?**

---

## 📋 Current Repository Info

- **GitHub:** https://github.com/bala-dotcom/Vision-AI
- **Hostinger Host:** in-mum-web1990.main-hosting.eu
- **Hostinger User:** u623025070
- **Domain:** vision.innovfix.in

---

## 🆘 Need Help?

Tell me which option you prefer:
1. **GitHub Actions** (automatic, recommended)
2. **Manual SSH sync** (more control)
3. **Hostinger Git integration** (if available)

I'll guide you through the setup!

