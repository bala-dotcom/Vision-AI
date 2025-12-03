# GitHub SSH Setup Guide

## 🔑 Understanding SSH Keys

**Important:** The SSH key you provided (`u623025070@in-mum-web1990.main-hosting.eu`) is from your **Hostinger server**, not GitHub. 

For GitHub, you need a **separate SSH key** (or you can use the same key, but it's better to keep them separate for security).

---

## ✅ Option 1: Generate New SSH Key for GitHub (Recommended)

### Step 1: Generate SSH Key

**Open PowerShell or Git Bash** and run:

```powershell
# Navigate to your project
cd "C:\Users\divak\Vision AI"

# Generate new SSH key for GitHub
ssh-keygen -t ed25519 -C "your-email@example.com" -f "$env:USERPROFILE\.ssh\id_ed25519_github"

# Or if ed25519 is not supported, use RSA:
ssh-keygen -t rsa -b 4096 -C "your-email@example.com" -f "$env:USERPROFILE\.ssh\id_rsa_github"
```

**When prompted:**
- Press Enter to accept default location
- Enter a passphrase (optional but recommended) or press Enter for no passphrase

### Step 2: Copy Public Key

```powershell
# Display your public key
Get-Content "$env:USERPROFILE\.ssh\id_ed25519_github.pub"

# Or copy to clipboard
Get-Content "$env:USERPROFILE\.ssh\id_ed25519_github.pub" | Set-Clipboard
```

### Step 3: Add Key to GitHub

1. **Go to GitHub:** https://github.com/settings/keys
2. **Click "New SSH key"**
3. **Fill in:**
   - **Title:** "Vision AI - Windows PC" (or any name)
   - **Key:** Paste your public key (starts with `ssh-ed25519` or `ssh-rsa`)
4. **Click "Add SSH key"**

### Step 4: Test Connection

```powershell
# Test GitHub SSH connection
ssh -T git@github.com
```

You should see: `Hi username! You've successfully authenticated...`

---

## ✅ Option 2: Use Existing SSH Key

If you already have a GitHub SSH key:

### Step 1: Find Your Public Key

```powershell
# List all SSH keys
Get-ChildItem "$env:USERPROFILE\.ssh\*.pub"
```

### Step 2: Display and Copy

```powershell
# Display key (replace with your key name)
Get-Content "$env:USERPROFILE\.ssh\id_rsa.pub"

# Copy to clipboard
Get-Content "$env:USERPROFILE\.ssh\id_rsa.pub" | Set-Clipboard
```

### Step 3: Add to GitHub

Follow **Step 3** from Option 1 above.

---

## ⚠️ Option 3: Use Hostinger Key (Not Recommended)

**Note:** Using your server SSH key for GitHub is **not recommended** for security reasons, but it's possible.

### Step 1: Add Hostinger Key to GitHub

1. **Go to GitHub:** https://github.com/settings/keys
2. **Click "New SSH key"**
3. **Fill in:**
   - **Title:** "Hostinger Server Key"
   - **Key:** Paste the key you provided:
     ```
     ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQCMDCAzHLzhQCvLRKsMmsc5nCmPZoCI/g3GC5hktwrRPDXThJNEFV289/TNGs8tVK4bpvF4TS4rghmXXqjndp5p7hsgtnY0kO0tV0wI42dV0qaoAyMPxs0ybCkwefsd/pqh65sVEfTgACEv3st/DAWf5irbezeRdEtxHiPkd7f5Zrz4f8FTalQdmfc++MjO8JBLrpOjVXTHWjn1In8SHt/moXfdB1sXSP8PgF9c6iV0UaAvo1MPUs5iRjn8edKr7HAD0oNTYaR/lLfv+DghipKvu6K/971sc5eQLLjVoA4ZZb9YuRpatT6x9Grd4GABO3fI/hWND5wdDCIWXrB1fJamaA1g9yOY0IQ5t+/NnqxcRt+8IDaQCbLR897BvpcZxsPgbw/J6rvIcIfn+tciuqQPU3GPA2gk7ctEt+k6aFIv4e5QkGvyHzoXnXj7tIqROGfybpxJTY23JWgn51os15KkSu6zx7MHS0GXBAwtV6vlbkMQ+qOHSTYKXkiX3ZYjDIM= u623025070@in-mum-web1990.main-hosting.eu
     ```
4. **Click "Add SSH key"**

### Step 2: Test Connection

```powershell
ssh -T git@github.com
```

---

## 🔧 Configure Git to Use SSH

After adding your SSH key to GitHub:

### Step 1: Update Remote URL

```powershell
cd "C:\Users\divak\Vision AI"

# Check current remote URL
git remote -v

# Change to SSH (if currently HTTPS)
git remote set-url origin git@github.com:bala-dotcom/Vision-AI.git

# Verify
git remote -v
```

### Step 2: Test Push

```powershell
# Make a small change
echo "# Test" >> README.md

# Commit and push
git add README.md
git commit -m "Test SSH connection"
git push origin main
```

---

## 🆘 Troubleshooting

### Issue: Permission denied (publickey)

**Solution:**
1. Verify key is added to GitHub: https://github.com/settings/keys
2. Test connection: `ssh -T git@github.com`
3. Check SSH agent: `ssh-add -l`

### Issue: Key already in use

**Solution:**
- Generate a new unique key for GitHub
- Use Option 1 above

### Issue: Git still asks for password

**Solution:**
- Make sure remote URL uses SSH: `git@github.com:...`
- Not HTTPS: `https://github.com/...`

---

## ✅ Verification Checklist

- [ ] SSH key generated/identified
- [ ] Public key added to GitHub
- [ ] SSH connection tested (`ssh -T git@github.com`)
- [ ] Git remote URL updated to SSH
- [ ] Test push successful

---

## 📖 Next Steps

Once SSH is set up:
1. You can push/pull without entering password
2. More secure than HTTPS with tokens
3. Easier for automated deployments

**Need help?** Let me know which option you want to use!

