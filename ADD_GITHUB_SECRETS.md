# 🔐 Add GitHub Secrets for Hostinger Deployment

## Step-by-Step Guide

### Step 1: Click "New repository secret"

On the page you're viewing:
- Click the green **"New repository secret"** button
- (It's below "This repository has no secrets")

---

### Step 2: Add Each Secret

You need to add **3 secrets**. Add them one by one:

---

## Secret 1: HOSTINGER_HOST

1. **Click "New repository secret"**
2. **Name:** `HOSTINGER_HOST`
3. **Secret:** `in-mum-web1990.main-hosting.eu`
4. **Click "Add secret"**

---

## Secret 2: HOSTINGER_USER

1. **Click "New repository secret"** (again)
2. **Name:** `HOSTINGER_USER`
3. **Secret:** `u623025070`
4. **Click "Add secret"**

---

## Secret 3: HOSTINGER_SSH_KEY

**This one requires your Hostinger SSH private key.**

### Option A: If you already have an SSH key

1. **Find your SSH private key:**
   - Location: `C:\Users\divak\.ssh\id_rsa_github_hostinger`
   - Or: `C:\Users\divak\.ssh\id_rsa_hostinger`

2. **Open it in a text editor** (VS Code, Notepad, etc.)

3. **Copy the ENTIRE key** (starts with `-----BEGIN` and ends with `-----END`)

4. **In GitHub:**
   - Click **"New repository secret"**
   - **Name:** `HOSTINGER_SSH_KEY`
   - **Secret:** Paste the entire private key
   - **Click "Add secret"**

### Option B: Generate new SSH key

**If you don't have an SSH key, generate one:**

1. **Open PowerShell** and run:
   ```powershell
   ssh-keygen -t rsa -b 4096 -C "vision-ai-deploy" -f "$env:USERPROFILE\.ssh\id_rsa_hostinger_github" -N '""'
   ```

2. **Display the PRIVATE key:**
   ```powershell
   Get-Content "$env:USERPROFILE\.ssh\id_rsa_hostinger_github"
   ```

3. **Copy the entire output** (starts with `-----BEGIN RSA PRIVATE KEY-----`)

4. **Add to GitHub:**
   - Name: `HOSTINGER_SSH_KEY`
   - Secret: Paste the private key

5. **Display the PUBLIC key:**
   ```powershell
   Get-Content "$env:USERPROFILE\.ssh\id_rsa_hostinger_github.pub"
   ```

6. **Add public key to Hostinger:**
   - SSH into Hostinger: `ssh u623025070@in-mum-web1990.main-hosting.eu`
   - Run:
     ```bash
     mkdir -p ~/.ssh
     nano ~/.ssh/authorized_keys
     # Paste public key, save (Ctrl+X, Y, Enter)
     chmod 600 ~/.ssh/authorized_keys
     chmod 700 ~/.ssh
     ```

---

## ✅ After Adding All 3 Secrets

You should see:
- ✅ `HOSTINGER_HOST`
- ✅ `HOSTINGER_USER`
- ✅ `HOSTINGER_SSH_KEY`

---

## 🚀 Test Deployment

1. **Make a small change** to your code (or just push existing code)
2. **Commit and push:**
   ```powershell
   git add .
   git commit -m "Test GitHub Actions deployment"
   git push origin main
   ```

3. **Check GitHub Actions:**
   - Go to: https://github.com/bala-dotcom/Vision-AI/actions
   - You should see a workflow running
   - Wait for it to complete (green checkmark = success)

4. **Check your website:**
   - Visit: https://vision.innovfix.in
   - Should be updated!

---

## 🔍 Verify Secrets Are Added

**On the secrets page, you should see:**
- 3 secrets listed under "Repository secrets"
- Each with a green "Update" button

---

## 🆘 Troubleshooting

### Can't find SSH key?
- Check: `C:\Users\divak\.ssh\`
- Look for files: `id_rsa*`, `id_ed25519*`

### SSH key format wrong?
- Must start with: `-----BEGIN RSA PRIVATE KEY-----` or `-----BEGIN OPENSSH PRIVATE KEY-----`
- Must end with: `-----END RSA PRIVATE KEY-----` or `-----END OPENSSH PRIVATE KEY-----`
- Include ALL lines, including BEGIN and END markers

### Deployment fails?
- Check GitHub Actions logs for errors
- Verify SSH key is correct
- Verify Hostinger host and user are correct

