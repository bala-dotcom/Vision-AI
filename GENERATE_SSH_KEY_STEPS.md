# Generate SSH Key Pair - Step by Step

## 🎯 Goal
Generate a new SSH key pair for GitHub Actions to deploy to Hostinger.

---

## 📋 Step-by-Step Instructions

### Step 1: Open PowerShell

1. Press `Windows Key + X`
2. Select **"Windows PowerShell"** or **"Terminal"**
3. Navigate to your project:
   ```powershell
   cd "C:\Users\divak\Vision AI"
   ```

### Step 2: Generate SSH Key

**Run this command:**

```powershell
ssh-keygen -t rsa -b 4096 -C "github-actions-hostinger" -f "$env:USERPROFILE\.ssh\id_rsa_github_hostinger"
```

**When prompted:**
- **Enter file in which to save the key:** Press `Enter` (use default)
- **Enter passphrase:** Press `Enter` (no passphrase - needed for GitHub Actions)
- **Enter same passphrase again:** Press `Enter`

**You should see:**
```
Your identification has been saved in ...
Your public key has been saved in ...
```

### Step 3: Get Your Public Key

**Run this command:**

```powershell
Get-Content "$env:USERPROFILE\.ssh\id_rsa_github_hostinger.pub"
```

**Copy the entire output** (starts with `ssh-rsa`)

### Step 4: Get Your Private Key

**Run this command:**

```powershell
Get-Content "$env:USERPROFILE\.ssh\id_rsa_github_hostinger"
```

**Copy the entire output** (includes `-----BEGIN RSA PRIVATE KEY-----` and `-----END RSA PRIVATE KEY-----`)

---

## 🔐 Step 5: Add Public Key to Hostinger

### Option A: Via SSH (Recommended)

1. **SSH into Hostinger:**
   ```powershell
   ssh u623025070@in-mum-web1990.main-hosting.eu
   ```

2. **Add public key:**
   ```bash
   mkdir -p ~/.ssh
   nano ~/.ssh/authorized_keys
   ```
   
3. **Paste your PUBLIC key** at the end of the file
   
4. **Save and exit:**
   - Press `Ctrl+X`
   - Press `Y` to confirm
   - Press `Enter` to save

5. **Set permissions:**
   ```bash
   chmod 600 ~/.ssh/authorized_keys
   chmod 700 ~/.ssh
   exit
   ```

### Option B: Via Hostinger File Manager

1. Go to Hostinger File Manager
2. Navigate to `.ssh` folder (create if doesn't exist)
3. Edit `authorized_keys` file
4. Paste your PUBLIC key at the end
5. Save

---

## 🔑 Step 6: Add Private Key to GitHub Secrets

1. **Go to GitHub:**
   - https://github.com/bala-dotcom/Vision-AI/settings/secrets/actions

2. **Click "New repository secret"**

3. **Add Secret 1: HOSTINGER_HOST**
   - **Name:** `HOSTINGER_HOST`
   - **Value:** `in-mum-web1990.main-hosting.eu`
   - Click **"Add secret"**

4. **Add Secret 2: HOSTINGER_USER**
   - **Name:** `HOSTINGER_USER`
   - **Value:** `u623025070`
   - Click **"Add secret"**

5. **Add Secret 3: HOSTINGER_SSH_KEY** ⚠️ IMPORTANT
   - **Name:** `HOSTINGER_SSH_KEY`
   - **Value:** Paste your **PRIVATE KEY** (entire content)
   - Click **"Add secret"**

---

## ✅ Step 7: Test Connection

**Test SSH connection:**

```powershell
ssh -i "$env:USERPROFILE\.ssh\id_rsa_github_hostinger" u623025070@in-mum-web1990.main-hosting.eu
```

**If successful:** You'll see Hostinger prompt (type `exit` to disconnect)

---

## 🚀 Step 8: Commit and Test Deployment

1. **Commit the workflow:**
   ```powershell
   git add .github/workflows/deploy.yml
   git commit -m "Add GitHub Actions deployment workflow"
   git push origin main
   ```

2. **Check GitHub Actions:**
   - Go to: https://github.com/bala-dotcom/Vision-AI/actions
   - You should see "Deploy to Hostinger" workflow running

---

## 📝 Quick Copy Commands

**Generate key:**
```powershell
ssh-keygen -t rsa -b 4096 -C "github-actions-hostinger" -f "$env:USERPROFILE\.ssh\id_rsa_github_hostinger" -N '""'
```

**Get public key:**
```powershell
Get-Content "$env:USERPROFILE\.ssh\id_rsa_github_hostinger.pub" | Set-Clipboard
```

**Get private key:**
```powershell
Get-Content "$env:USERPROFILE\.ssh\id_rsa_github_hostinger" | Set-Clipboard
```

---

## 🆘 Troubleshooting

### Issue: "ssh-keygen not recognized"

**Solution:** Install Git for Windows (includes SSH) or use Git Bash

### Issue: Permission denied when testing

**Solution:** 
- Verify public key is in Hostinger `~/.ssh/authorized_keys`
- Check file permissions: `chmod 600 ~/.ssh/authorized_keys`

### Issue: GitHub Actions fails

**Solution:**
- Verify all 3 secrets are added correctly
- Check private key includes BEGIN/END lines
- Test SSH connection manually first

---

**Follow these steps and let me know if you need help at any stage!**

