# 🔴 Fix: Hostinger Git Deployment Error

## Problem
Hostinger shows this error when trying to deploy:
```
clone: fatal: could not read Username for 'https://github.com': No such device or address
Deployment failed
```

**Root Cause:** Hostinger is trying to clone using HTTPS, which requires authentication.

---

## ✅ Solution Options

### Option 1: Use SSH URL (Recommended)

**In Hostinger Git Integration settings:**

1. **Change repository URL from:**
   ```
   https://github.com/bala-dotcom/Vision-Al
   ```
   
   **To SSH URL:**
   ```
   git@github.com:bala-dotcom/Vision-AI.git
   ```

2. **Add SSH Key to Hostinger:**
   - Go to Hostinger hPanel → **SSH Access**
   - Generate or add your GitHub SSH public key
   - Or use Hostinger's SSH key and add it to GitHub

**Steps:**
1. **In Hostinger hPanel:**
   - Go to **"Git"** or **"Deployments"** section
   - Find your deployment configuration
   - **Change URL** to: `git@github.com:bala-dotcom/Vision-AI.git`
   - **Select "SSH"** as authentication method

2. **Add SSH Key:**
   - If Hostinger generated a key, copy the **public key**
   - Go to GitHub: https://github.com/bala-dotcom/Vision-AI/settings/keys
   - Click **"New SSH key"**
   - Paste the public key
   - Save

---

### Option 2: Make Repository Public (Easiest)

**If you don't mind making the repo public:**

1. **Go to GitHub:**
   - https://github.com/bala-dotcom/Vision-AI/settings
   - Scroll to **"Danger Zone"**
   - Click **"Change visibility"**
   - Select **"Make public"**
   - Confirm

2. **In Hostinger:**
   - Keep using HTTPS URL: `https://github.com/bala-dotcom/Vision-AI.git`
   - No authentication needed for public repos

---

### Option 3: Use Personal Access Token (HTTPS)

**If you want to keep repo private:**

1. **Create GitHub Personal Access Token:**
   - Go to: https://github.com/settings/tokens
   - Click **"Generate new token"** → **"Generate new token (classic)"**
   - **Name:** `Hostinger Deployment`
   - **Expiration:** Choose duration
   - **Scopes:** Check `repo` (full control of private repositories)
   - Click **"Generate token"**
   - **COPY THE TOKEN** (you won't see it again!)

2. **In Hostinger Git Integration:**
   - **Repository URL:** `https://github.com/bala-dotcom/Vision-AI.git`
   - **Username:** `bala-dotcom` (your GitHub username)
   - **Password:** Paste the Personal Access Token (NOT your GitHub password)

---

### Option 4: Use GitHub Actions Instead (Best for Automation)

**Skip Hostinger Git Integration entirely:**

1. **Use GitHub Actions** (already configured in `.github/workflows/deploy.yml`)
2. **Add secrets to GitHub:**
   - Go to: https://github.com/bala-dotcom/Vision-AI/settings/secrets/actions
   - Add:
     - `HOSTINGER_HOST`: `in-mum-web1990.main-hosting.eu`
     - `HOSTINGER_USER`: `u623025070`
     - `HOSTINGER_SSH_KEY`: Your Hostinger private SSH key

3. **Push to GitHub:**
   ```powershell
   git push origin main
   ```
   - GitHub Actions will automatically deploy!

---

## 🎯 Recommended: Fix Repository URL

**The error shows:** `https://github.com/bala-dotcom/Vision-Al`

**But it should be:** `https://github.com/bala-dotcom/Vision-AI` (capital I, not lowercase L)

**Fix in Hostinger:**
1. Go to **Git/Deployments** settings
2. **Update repository URL** to: `https://github.com/bala-dotcom/Vision-AI.git`
3. Choose authentication method (SSH recommended)

---

## 📋 Quick Fix Steps

### Step 1: Check Repository Name
- Verify: https://github.com/bala-dotcom/Vision-AI
- Make sure URL is correct (capital I, not lowercase L)

### Step 2: Choose Authentication Method

**A) SSH (Recommended):**
- URL: `git@github.com:bala-dotcom/Vision-AI.git`
- Add Hostinger SSH key to GitHub

**B) HTTPS with Token:**
- URL: `https://github.com/bala-dotcom/Vision-AI.git`
- Username: `bala-dotcom`
- Password: Personal Access Token

**C) Public Repo:**
- Make repo public
- Use HTTPS URL (no auth needed)

### Step 3: Retry Deployment
- In Hostinger, click **"Deploy"** or **"Retry"**
- Check deployment logs

---

## 🔍 Verify Repository Access

**Test if Hostinger can access your repo:**

1. **If using SSH:**
   ```bash
   ssh u623025070@in-mum-web1990.main-hosting.eu
   git clone git@github.com:bala-dotcom/Vision-AI.git test-clone
   ```

2. **If using HTTPS (public):**
   ```bash
   git clone https://github.com/bala-dotcom/Vision-AI.git test-clone
   ```

---

## 🆘 Still Not Working?

**Check:**
1. ✅ Repository URL is correct
2. ✅ Repository exists and is accessible
3. ✅ SSH key is added to GitHub (if using SSH)
4. ✅ Personal Access Token has `repo` scope (if using HTTPS)
5. ✅ Repository is public (if using HTTPS without auth)

**Alternative:** Use manual file upload via File Manager instead of Git integration.

