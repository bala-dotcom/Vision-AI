# 🔧 Fix: Hostinger Not Building Node.js Project

## Problem
Hostinger cloned your repository successfully, but:
- ❌ It's looking for `composer.json` (PHP files)
- ❌ It's NOT running `npm install` or `npm run build`
- ❌ Your `dist/` folder is not being created
- ❌ Website shows blank page or 404 errors

**Root Cause:** Hostinger's Git deployment is configured for PHP projects by default and doesn't automatically build Node.js/React projects.

---

## ✅ Solution Options

### Option 1: Configure Build Commands in Hostinger (Recommended)

**In Hostinger hPanel:**

1. **Go to Git/Deployments settings:**
   - Navigate to your domain: vision.innovfix.in
   - Find **"Git"** or **"Deployments"** section
   - Click **"Edit"** or **"Settings"**

2. **Add Build Commands:**
   - Look for **"Build Command"** or **"Pre-deploy Script"** field
   - Add:
     ```bash
     npm install && npm run build
     ```

3. **Set Deploy Path:**
   - **Source:** `dist/` (or leave empty if it copies everything)
   - **Target:** `public_html/`

4. **Save and Redeploy:**
   - Click **"Save"**
   - Click **"Deploy"** or **"Redeploy"**

---

### Option 2: Use Post-Deploy Hook Script

**Create a script that Hostinger can run after git pull:**

1. **In Hostinger File Manager:**
   - Navigate to: `domains/vision.innovfix.in/`
   - Create file: `build.sh`

2. **Add this content:**
   ```bash
   #!/bin/bash
   cd /home/u623025070/domains/vision.innovfix.in
   npm install
   npm run build
   cp -r dist/* public_html/
   cp .htaccess public_html/
   ```

3. **Make it executable:**
   - Right-click `build.sh` → Properties
   - Set permissions to `755` (executable)

4. **In Hostinger Git settings:**
   - Add **"Post-deploy Command":** `bash build.sh`
   - Or add to **"Build Command"** field

---

### Option 3: Manual Build and Upload (Quick Fix)

**Since Git deployment isn't building, manually upload built files:**

1. **Build locally:**
   ```powershell
   npm run build
   ```

2. **Upload via File Manager:**
   - Go to Hostinger File Manager
   - Navigate to `public_html/`
   - Upload:
     - `dist/index.html` → `public_html/index.html`
     - `dist/assets/` folder → `public_html/assets/`
     - `.htaccess` → `public_html/.htaccess`

3. **Or use the deployment script:**
   ```powershell
   .\deploy-to-hostinger.ps1
   ```

---

### Option 4: Use GitHub Actions (Best for Automation)

**Skip Hostinger Git integration and use GitHub Actions:**

1. **Add secrets to GitHub:**
   - Go to: https://github.com/bala-dotcom/Vision-AI/settings/secrets/actions
   - Add:
     - `HOSTINGER_HOST`: `in-mum-web1990.main-hosting.eu`
     - `HOSTINGER_USER`: `u623025070`
     - `HOSTINGER_SSH_KEY`: Your Hostinger private SSH key

2. **Push to GitHub:**
   ```powershell
   git push origin main
   ```

3. **GitHub Actions will:**
   - ✅ Build your frontend automatically
   - ✅ Deploy to Hostinger via SSH
   - ✅ Update your website

**This is already configured in `.github/workflows/deploy.yml`!**

---

## 🔍 Check Hostinger Settings

**Look for these fields in Hostinger Git/Deployments:**

- ✅ **Build Command:** `npm install && npm run build`
- ✅ **Deploy Command:** (usually auto)
- ✅ **Source Directory:** `dist` (or leave empty)
- ✅ **Target Directory:** `public_html`
- ✅ **Node.js Version:** (if available, select 18 or 20)

---

## 📋 Quick Fix Steps

### Step 1: Check Current Files on Hostinger

**Via File Manager:**
- Go to: `domains/vision.innovfix.in/`
- Check if you see:
  - `package.json` ✅
  - `node_modules/` ❌ (should exist after npm install)
  - `dist/` ❌ (should exist after npm run build)
  - `public_html/` ✅

### Step 2: Configure Build in Hostinger

1. **Find Build Command field**
2. **Add:** `npm install && npm run build`
3. **Save and redeploy**

### Step 3: Verify Build Output

**After deployment, check logs:**
- Should see: `npm install` output
- Should see: `npm run build` output
- Should see: `dist/` folder created

### Step 4: Check Deployed Files

**In File Manager:**
- `public_html/index.html` should exist
- `public_html/assets/` should exist with JS/CSS files

---

## 🆘 If Build Commands Don't Work

**Hostinger might not support Node.js builds. Use manual deployment:**

1. **Build locally:**
   ```powershell
   npm run build
   ```

2. **Upload via File Manager:**
   - Upload `dist/` contents to `public_html/`
   - Upload `.htaccess`

3. **Or use SSH:**
   ```powershell
   .\deploy-to-hostinger.ps1
   ```

---

## 🎯 Recommended Solution

**Use GitHub Actions for automatic deployment:**
- ✅ Builds automatically on push
- ✅ Deploys to Hostinger via SSH
- ✅ No need to configure Hostinger build commands
- ✅ More reliable than Hostinger Git integration

**Setup:**
1. Add GitHub secrets (see Option 4 above)
2. Push code to GitHub
3. GitHub Actions handles everything!

