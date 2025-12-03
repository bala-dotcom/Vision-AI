# 🚀 Deploy to Hostinger via SSH (Direct Upload)

## Quick Deploy

**Run this command:**
```powershell
.\deploy-to-hostinger.ps1
```

This will:
1. ✅ Build your frontend (`npm run build`)
2. ✅ Upload files to Hostinger via SSH/SCP
3. ✅ Deploy to `public_html/`

---

## Prerequisites

### 1. SSH Access Setup

**If you haven't set up SSH yet:**

1. **Generate SSH key:**
   ```powershell
   ssh-keygen -t rsa -b 4096 -C "vision-ai-deploy" -f "$env:USERPROFILE\.ssh\id_rsa_github_hostinger" -N '""'
   ```

2. **Get your public key:**
   ```powershell
   Get-Content "$env:USERPROFILE\.ssh\id_rsa_github_hostinger.pub"
   ```

3. **Add public key to Hostinger:**
   - SSH into Hostinger: `ssh u623025070@in-mum-web1990.main-hosting.eu`
   - Run:
     ```bash
     mkdir -p ~/.ssh
     nano ~/.ssh/authorized_keys
     # Paste your public key, save (Ctrl+X, Y, Enter)
     chmod 600 ~/.ssh/authorized_keys
     chmod 700 ~/.ssh
     ```

4. **Test connection:**
   ```powershell
   ssh -i "$env:USERPROFILE\.ssh\id_rsa_github_hostinger" u623025070@in-mum-web1990.main-hosting.eu
   ```

### 2. Install Required Tools

**SCP is included with:**
- Git for Windows (recommended)
- OpenSSH (Windows 10+)

**Check if SCP is available:**
```powershell
scp
```

If not found, install Git: https://git-scm.com/download/win

---

## Manual Deployment Steps

If the script doesn't work, deploy manually:

### Step 1: Build Frontend
```powershell
npm run build
```

### Step 2: Upload Files via SCP

**Upload all files:**
```powershell
scp -i "$env:USERPROFILE\.ssh\id_rsa_github_hostinger" -r dist\* u623025070@in-mum-web1990.main-hosting.eu:/home/u623025070/domains/vision.innovfix.in/public_html/
```

**Upload .htaccess:**
```powershell
scp -i "$env:USERPROFILE\.ssh\id_rsa_github_hostinger" .htaccess u623025070@in-mum-web1990.main-hosting.eu:/home/u623025070/domains/vision.innovfix.in/public_html/
```

### Step 3: Verify Upload

**SSH into Hostinger:**
```powershell
ssh -i "$env:USERPROFILE\.ssh\id_rsa_github_hostinger" u623025070@in-mum-web1990.main-hosting.eu
```

**Check files:**
```bash
cd /home/u623025070/domains/vision.innovfix.in/public_html
ls -la
ls -la assets/
```

**Expected structure:**
```
public_html/
├── index.html
├── assets/
│   ├── index-*.css
│   └── index-*.js
└── .htaccess
```

---

## Troubleshooting

### Issue: "scp: command not found"
**Solution:** Install Git for Windows or enable OpenSSH

### Issue: "Permission denied"
**Solution:** 
- Verify SSH key is added to Hostinger `~/.ssh/authorized_keys`
- Check file permissions: `chmod 600 ~/.ssh/authorized_keys`

### Issue: "Connection refused"
**Solution:**
- Verify Hostinger SSH is enabled
- Check host: `in-mum-web1990.main-hosting.eu`
- Check username: `u623025070`

### Issue: Files uploaded but website shows 404
**Solution:**
- Verify `assets/` folder exists on server
- Check `.htaccess` file is uploaded
- Clear browser cache

---

## Alternative: Using SFTP Client

If SCP doesn't work, use an SFTP client:

1. **FileZilla** (free): https://filezilla-project.org/
   - Protocol: SFTP
   - Host: `in-mum-web1990.main-hosting.eu`
   - Username: `u623025070`
   - Port: `22`
   - Key file: `%USERPROFILE%\.ssh\id_rsa_github_hostinger` (Windows) or `~/.ssh/id_rsa_github_hostinger` (Linux/Mac)

2. **WinSCP** (free): https://winscp.net/
   - Same settings as above

---

## ✅ Success Checklist

After deployment:
- [ ] Website loads: https://vision.innovfix.in
- [ ] No 404 errors in browser console
- [ ] CSS/styles loading correctly
- [ ] JavaScript working
- [ ] `.htaccess` file uploaded
- [ ] `assets/` folder exists with CSS/JS files

---

**Ready to deploy? Run:** `.\deploy-to-hostinger.ps1`


