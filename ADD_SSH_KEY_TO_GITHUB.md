# Add SSH Key to GitHub Secrets

## 🔑 Your SSH Public Key

You provided this public key:
```
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQCMDCAzHLzhQCvLRKsMmsc5nCmPZoCI/g3GC5hktwrRPDXThJNEFV289/TNGs8tVK4bpvF4TS4rghmXXqjndp5p7hsgtnY0kO0tV0wI42dV0qaoAyMPxs0ybCkwefsd/pqh65sVEfTgACEv3st/DAWf5irbezeRdEtxHiPkd7f5Zrz4f8FTalQdmfc++MjO8JBLrpOjVXTHWjn1In8SHt/moXfdB1sXSP8PgF9c6iV0UaAvo1MPUs5iRjn8edKr7HAD0oNTYaR/lLfv+DghipKvu6K/971sc5eQLLjVoA4ZZb9YuRpatT6x9Grd4GABO3fI/hWND5wdDCIWXrB1fJamaA1g9yOY0IQ5t+/NnqxcRt+8IDaQCbLR897BvpcZxsPgbw/J6rvIcIfn+tciuqQPU3GPA2gk7ctEt+k6aFIv4e5QkGvyHzoXnXj7tIqROGfybpxJTY23JWgn51os15KkSu6zx7MHS0GXBAwtV6vlbkMQ+qOHSTYKXkiX3ZYjDIM= u623025070@in-mum-web1990.main-hosting.eu
```

## ⚠️ Important: We Need the PRIVATE Key

For GitHub Actions to deploy to Hostinger, we need the **PRIVATE key** (not the public key you provided).

---

## 🔍 Option 1: Find Your Existing Private Key

### Step 1: Check if Private Key Exists

**On your local machine, check:**

```powershell
# Check common locations
Get-ChildItem "$env:USERPROFILE\.ssh\*" -Include "*id_rsa*","*id_ed25519*" -Exclude "*.pub" | Select-Object Name, FullName
```

**Look for files like:**
- `id_rsa` (without .pub extension)
- `id_ed25519` (without .pub extension)
- `id_rsa_hostinger`
- Any file that matches your public key

### Step 2: Verify Key Pair Matches

If you find a private key, verify it matches your public key:

```powershell
# Generate public key from private key to compare
ssh-keygen -y -f "$env:USERPROFILE\.ssh\id_rsa" | Set-Clipboard
# Compare with the public key you provided
```

---

## 🔧 Option 2: Generate New Key Pair (Recommended)

If you can't find the private key, generate a new pair:

### Step 1: Generate New SSH Key

```powershell
# Generate new key pair for Hostinger deployment
ssh-keygen -t rsa -b 4096 -C "github-actions-hostinger" -f "$env:USERPROFILE\.ssh\id_rsa_github_hostinger"

# When prompted:
# - Press Enter for default location
# - Enter passphrase (optional but recommended) or press Enter for no passphrase
```

### Step 2: Add Public Key to Hostinger

```powershell
# Display public key
Get-Content "$env:USERPROFILE\.ssh\id_rsa_github_hostinger.pub"

# Copy it, then SSH into Hostinger and add it:
ssh u623025070@in-mum-web1990.main-hosting.eu

# On Hostinger server:
mkdir -p ~/.ssh
echo "YOUR_NEW_PUBLIC_KEY_HERE" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
exit
```

### Step 3: Get Private Key for GitHub

```powershell
# Display private key (copy this entire output)
Get-Content "$env:USERPROFILE\.ssh\id_rsa_github_hostinger"

# Or copy to clipboard
Get-Content "$env:USERPROFILE\.ssh\id_rsa_github_hostinger" | Set-Clipboard
```

---

## 📋 Step 3: Add Secrets to GitHub

### Go to GitHub Secrets Page

1. **Open:** https://github.com/bala-dotcom/Vision-AI/settings/secrets/actions

2. **Add Secret 1: HOSTINGER_HOST**
   - Click **"New repository secret"**
   - **Name:** `HOSTINGER_HOST`
   - **Value:** `in-mum-web1990.main-hosting.eu`
   - Click **"Add secret"**

3. **Add Secret 2: HOSTINGER_USER**
   - Click **"New repository secret"**
   - **Name:** `HOSTINGER_USER`
   - **Value:** `u623025070`
   - Click **"Add secret"**

4. **Add Secret 3: HOSTINGER_SSH_KEY** ⚠️ IMPORTANT
   - Click **"New repository secret"**
   - **Name:** `HOSTINGER_SSH_KEY`
   - **Value:** Paste your **PRIVATE KEY** (entire content, including `-----BEGIN RSA PRIVATE KEY-----` and `-----END RSA PRIVATE KEY-----`)
   - Click **"Add secret"**

---

## ✅ Step 4: Test Connection

### Test SSH Connection Locally

```powershell
# Test connection
ssh -i "$env:USERPROFILE\.ssh\id_rsa_github_hostinger" u623025070@in-mum-web1990.main-hosting.eu

# If successful, you'll see Hostinger prompt
# Type 'exit' to disconnect
```

### Test GitHub Actions

1. **Commit and push the workflow:**
   ```powershell
   git add .github/workflows/deploy.yml
   git commit -m "Add deployment workflow"
   git push origin main
   ```

2. **Check GitHub Actions:**
   - Go to: https://github.com/bala-dotcom/Vision-AI/actions
   - You should see "Deploy to Hostinger" workflow running
   - Wait for completion

---

## 🔒 Security Notes

- ✅ **Never commit private keys to Git**
- ✅ **Only add private key to GitHub Secrets** (encrypted)
- ✅ **Use a separate key** for GitHub Actions (not your main server key)
- ✅ **Keep private keys secure** on your local machine

---

## 🆘 Troubleshooting

### Issue: "Permission denied (publickey)"

**Solution:**
- Verify public key is in Hostinger `~/.ssh/authorized_keys`
- Check private key is correct in GitHub Secrets
- Test SSH connection manually first

### Issue: "Host key verification failed"

**Solution:**
- Add Hostinger to known_hosts:
  ```powershell
  ssh-keyscan in-mum-web1990.main-hosting.eu >> "$env:USERPROFILE\.ssh\known_hosts"
  ```

### Issue: Workflow fails silently

**Solution:**
- Check GitHub Actions logs for detailed errors
- Verify all three secrets are added correctly
- Test SSH connection manually

---

## 📖 Quick Reference

**Public Key:** Use on Hostinger server (`~/.ssh/authorized_keys`)  
**Private Key:** Use in GitHub Secrets (`HOSTINGER_SSH_KEY`)

**Never share your private key!** Only the public key can be shared safely.

---

**Need help finding your private key or generating a new one?** Let me know!

