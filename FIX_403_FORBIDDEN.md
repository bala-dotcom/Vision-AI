# 🔴 Fix 403 Forbidden Error on vision.innovfix.in

## Problem
Your website shows:
```
GET https://vision.innovfix.in/ 403 (Forbidden)
```

**403 Forbidden** means the server is refusing to serve the files, even though they exist.

---

## 🔍 Common Causes

### 1. **File Permissions** (Most Common - 90% of cases)
After extracting a ZIP file, files may have wrong permissions.

**Fix:**
- Files (`index.html`, `.htaccess`, `assets/*.js`, `assets/*.css`): **644**
- Folders (`assets/`, `public_html/`): **755**

### 2. **Missing or Wrong index.html**
The server can't find `index.html` in `public_html/`.

**Fix:**
- Verify `index.html` exists in `public_html/`
- Check file size (~500-800 bytes)
- Verify it references `/assets/` not `/src/`

### 3. **.htaccess Configuration Issue**
The `.htaccess` file might be blocking access.

**Fix:**
- Temporarily rename `.htaccess` to `.htaccess.backup`
- Test if site loads
- If it loads, the `.htaccess` has an issue

### 4. **Directory Listing Disabled**
Apache can't find the default document (`index.html`).

**Fix:**
- Ensure `index.html` is named exactly `index.html` (lowercase)
- Check if `DirectoryIndex` is configured in `.htaccess`

---

## ✅ Step-by-Step Fix

### Step 1: Check File Permissions in Hostinger File Manager

1. **Go to:** https://hpanel.hostinger.com → File Manager
2. **Navigate to:** `domains/vision.innovfix.in/public_html/`
3. **Right-click `index.html`** → **Properties** or **Permissions**
4. **Set to:** `644` (or `rw-r--r--`)
5. **Right-click `assets/` folder** → **Properties** → **Set to:** `755` (or `rwxr-xr-x`)
6. **Right-click `.htaccess`** → **Properties** → **Set to:** `644`

### Step 2: Verify Files Exist

**Check these files exist in `public_html/`:**
```
public_html/
├── index.html          ← Must exist (~500-800 bytes)
├── assets/            ← Must exist
│   ├── index-*.js     ← Must exist (~200KB+)
│   └── index-*.css    ← Must exist (~10-50KB)
└── .htaccess          ← Must exist
```

### Step 3: Check index.html Content

**Open `index.html` in File Manager and verify:**

✅ **CORRECT:**
```html
<script type="module" crossorigin src="/assets/index-CHz6bupw.js"></script>
```

❌ **WRONG:**
```html
<script type="module" src="/src/main.jsx"></script>
```

### Step 4: Test Without .htaccess

**Temporarily disable `.htaccess`:**

1. **Rename `.htaccess`** to `.htaccess.backup`
2. **Test:** https://vision.innovfix.in
3. **If it works:** The `.htaccess` has an issue
4. **If still 403:** It's a permissions/file issue

### Step 5: Set Permissions via SSH (If Available)

**If you have SSH access:**

```bash
cd /home/u623025070/domains/vision.innovfix.in/public_html

# Set file permissions
chmod 644 index.html
chmod 644 .htaccess
chmod 644 assets/*.js
chmod 644 assets/*.css

# Set folder permissions
chmod 755 assets
chmod 755 .
```

---

## 🔧 Quick Fix: Simplified .htaccess

**If `.htaccess` is causing issues, try this simplified version:**

```apache
# Enable Rewrite Engine
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Don't rewrite existing files
  RewriteCond %{REQUEST_FILENAME} -f
  RewriteRule ^ - [L]
  
  # Don't rewrite existing directories
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  
  # Don't rewrite assets
  RewriteCond %{REQUEST_URI} \.(js|css|png|jpg|jpeg|gif|ico|svg)$ [NC]
  RewriteRule ^ - [L]
  
  # Rewrite everything else to index.html
  RewriteRule ^ index.html [L]
</IfModule>

# Set MIME types
<IfModule mod_mime.c>
  AddType application/javascript js
  AddType text/css css
</IfModule>
```

**Replace your `.htaccess` with this simplified version and test.**

---

## 📋 Diagnostic Checklist

- [ ] `index.html` exists in `public_html/`
- [ ] `index.html` permissions: `644`
- [ ] `assets/` folder exists
- [ ] `assets/` folder permissions: `755`
- [ ] Files in `assets/` have permissions: `644`
- [ ] `.htaccess` exists and permissions: `644`
- [ ] `public_html/` folder permissions: `755`
- [ ] `index.html` references `/assets/` not `/src/`
- [ ] File names are lowercase (`index.html` not `Index.html`)

---

## 🆘 Still Getting 403?

### Option 1: Contact Hostinger Support
- They can check server-level permissions
- They can verify Apache configuration

### Option 2: Check Error Logs
- In Hostinger File Manager, check `error_log` or `error.log`
- Look for specific permission denied messages

### Option 3: Verify via SSH
```bash
# Check if files exist
ls -la /home/u623025070/domains/vision.innovfix.in/public_html/

# Check permissions
ls -la /home/u623025070/domains/vision.innovfix.in/public_html/index.html
ls -la /home/u623025070/domains/vision.innovfix.in/public_html/assets/
```

---

## 🎯 Most Likely Solution

**90% of 403 errors on Hostinger are caused by file permissions after ZIP extraction.**

**Quick fix:**
1. Set all files to `644`
2. Set all folders to `755`
3. Clear browser cache
4. Test again

If this doesn't work, try the simplified `.htaccess` above.

