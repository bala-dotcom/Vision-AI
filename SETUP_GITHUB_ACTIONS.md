# Setup GitHub Actions for Hostinger Deployment

## 🎯 What This Does

When you **push code to GitHub**, it will automatically:
1. ✅ Build your frontend
2. ✅ Deploy files to Hostinger
3. ✅ Update your live website

**No manual uploads needed!**

---

## 📋 Setup Steps

### Step 1: Add Secrets to GitHub

1. **Go to your GitHub repository:**
   - https://github.com/bala-dotcom/Vision-AI
   - Click **Settings** (top right)
   - Click **Secrets and variables** → **Actions**

2. **Add these secrets:**

   **Secret 1: HOSTINGER_HOST**
   - Click **"New repository secret"**
   - **Name:** `HOSTINGER_HOST`
   - **Value:** `in-mum-web1990.main-hosting.eu`
   - Click **"Add secret"**

   **Secret 2: HOSTINGER_USER**
   - Click **"New repository secret"**
   - **Name:** `HOSTINGER_USER`
   - **Value:** `u623025070`
   - Click **"Add secret"**

   **Secret 3: HOSTINGER_SSH_KEY**
   - Click **"New repository secret"**
   - **Name:** `HOSTINGER_SSH_KEY`
   - **Value:** Your Hostinger **private** SSH key
     - If you don't have it, generate one (see below)
   - Click **"Add secret"**

### Step 2: Generate SSH Key (if needed)

**On your local machine:**

```powershell
# Generate SSH key pair
ssh-keygen -t rsa -b 4096 -C "vision-ai-deploy" -f "$env:USERPROFILE\.ssh\id_rsa_hostinger"

# Display PUBLIC key (add this to Hostinger)
Get-Content "$env:USERPROFILE\.ssh\id_rsa_hostinger.pub"

# Display PRIVATE key (add this to GitHub Secrets)
Get-Content "$env:USERPROFILE\.ssh\id_rsa_hostinger"
```

**Add PUBLIC key to Hostinger:**
1. SSH into Hostinger: `ssh u623025070@in-mum-web1990.main-hosting.eu`
2. Run:
   ```bash
   mkdir -p ~/.ssh
   echo "YOUR_PUBLIC_KEY_HERE" >> ~/.ssh/authorized_keys
   chmod 600 ~/.ssh/authorized_keys
   chmod 700 ~/.ssh
   ```

**Add PRIVATE key to GitHub Secrets:**
- Copy the entire private key (starts with `-----BEGIN RSA PRIVATE KEY-----`)
- Paste into `HOSTINGER_SSH_KEY` secret

### Step 3: Commit and Push Workflow

The workflow file is already created at `.github/workflows/deploy.yml`

**Commit and push:**

```powershell
cd "<YourProjectRoot>"  # Replace with your actual project path
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Actions deployment workflow"
git push origin main
```

**Example:** `cd "C:\Users\<YourUsername>\Vision AI"` (Windows) or `cd ~/Vision-AI` (Linux/Mac)

### Step 4: Test Deployment

1. **Make a small change** to your code
2. **Commit and push:**
   ```powershell
   git add .
   git commit -m "Test deployment"
   git push origin main
   ```
3. **Check GitHub Actions:**
   - Go to: https://github.com/bala-dotcom/Vision-AI/actions
   - You should see a workflow running
   - Wait for it to complete (green checkmark = success)

---

## ✅ Verification

After deployment:

1. **Visit your website:** https://vision.innovfix.in
2. **Check if changes are live**
3. **Check GitHub Actions logs** if something fails

---

## 🔧 Troubleshooting

### Issue: Workflow fails with "Permission denied"

**Solution:**
- Verify SSH key is correct in GitHub Secrets
- Make sure public key is added to Hostinger `~/.ssh/authorized_keys`
- Test SSH connection manually: `ssh u623025070@in-mum-web1990.main-hosting.eu`

### Issue: Files not deploying

**Solution:**
- Check GitHub Actions logs for errors
- Verify target path is correct: `/home/u623025070/domains/vision.innovfix.in/public_html`
- Check file permissions on Hostinger

### Issue: Build fails

**Solution:**
- Check Node.js version (should be 18+)
- Verify `package.json` has correct build script
- Check Actions logs for specific error

---

## 📖 Manual Trigger

You can also trigger deployment manually:

1. Go to: https://github.com/bala-dotcom/Vision-AI/actions
2. Click **"Deploy to Hostinger"** workflow
3. Click **"Run workflow"** button
4. Select branch (usually `main`)
5. Click **"Run workflow"**

---

## 🎉 Benefits

- ✅ **Automatic:** Deploy on every push
- ✅ **Fast:** No manual file uploads
- ✅ **Reliable:** Build happens in GitHub's servers
- ✅ **History:** See all deployments in GitHub Actions

---

**Ready to set up?** Follow the steps above and let me know if you need help!

