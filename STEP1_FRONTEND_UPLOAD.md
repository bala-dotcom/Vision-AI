# Step 1: Upload Frontend Files - Detailed Guide

## 🎯 Goal
Upload your frontend build files to Hostinger's `public_html/` directory.

---

## 📋 What You Need

### Files to Upload:
1. **From `dist/` folder:**
   - `index.html`
   - `assets/` folder (contains all JavaScript and CSS files)

2. **Configuration file:**
   - `.htaccess` (for React Router to work properly)

### Total Files:
- Approximately 5 files (1 HTML + assets folder with JS/CSS)

---

## 🚀 Step-by-Step Instructions

### 1. Access Hostinger File Manager

1. **Open your browser** and go to:
   ```
   https://hpanel.hostinger.com/websites/vision.innovfix.in
   ```

2. **Log in** with your Hostinger credentials

3. **Navigate to File Manager:**
   - Look for **"Files"** in the left sidebar
   - Click on **"File Manager"** or **"Files"**
   - You should see your domain's file structure

### 2. Navigate to public_html/

1. **Find the `public_html/` folder**
   - This is usually the root directory for your website
   - It might be named:
     - `public_html/`
     - `domains/vision.innovfix.in/public_html/`
     - Or just the root of your domain

2. **Click on `public_html/`** to open it
   - This is where your website files should go

### 3. Upload Frontend Files

#### Option A: Using Hostinger File Manager (Easiest)

1. **Click "Upload" button** (usually at the top)
2. **Select files from your computer:**
   - Navigate to: `<YourProjectRoot>\dist\` (replace `<YourProjectRoot>` with your actual project path)
   - Select **ALL files** in the `dist` folder:
     - `index.html`
     - `assets/` folder (select the entire folder)
3. **Click "Upload"** and wait for upload to complete

#### Option B: Using Drag & Drop

1. **Open File Explorer** on your computer
2. **Navigate to:** `<YourProjectRoot>\dist\` (replace `<YourProjectRoot>` with your actual project path)
3. **Select all files** (Ctrl+A)
4. **Drag and drop** them into the Hostinger File Manager window
5. **Wait for upload** to complete

### 4. Upload .htaccess File

1. **In Hostinger File Manager**, make sure you're still in `public_html/`
2. **Click "Upload"** again
3. **Select:** `<YourProjectRoot>\.htaccess` (replace `<YourProjectRoot>` with your actual project path)
4. **Upload** the file

**Note:** Replace `<YourProjectRoot>` with your actual project directory path (e.g., `C:\Users\<YourUsername>\Vision AI` on Windows or `/home/<username>/Vision-AI` on Linux/Mac)

---

## ✅ Verification Checklist

After uploading, verify:

- [ ] `index.html` is in `public_html/`
- [ ] `assets/` folder is in `public_html/`
- [ ] `.htaccess` file is in `public_html/`
- [ ] No error messages during upload

---

## 🧪 Test Your Upload

1. **Open a new browser tab**
2. **Visit:** `https://vision.innovfix.in`
3. **Expected result:**
   - Page should load (may show API errors - that's OK for now)
   - You should see your Vision AI interface
   - Browser console (F12) may show backend connection errors (normal until backend is deployed)

---

## ⚠️ Common Issues

### Issue: Can't find public_html folder
**Solution:**
- Look for "File Manager" or "Website Files"
- Check if there's a "domains" folder
- Contact Hostinger support if you can't find it

### Issue: Upload fails or times out
**Solution:**
- Try uploading files one by one
- Check your internet connection
- Try using FTP client (FileZilla) instead

### Issue: Page shows 404 or blank page
**Solution:**
- Verify `index.html` is in `public_html/` (not in a subfolder)
- Check that `.htaccess` file is uploaded
- Clear browser cache and try again

### Issue: Assets not loading (no CSS/styling)
**Solution:**
- Verify `assets/` folder is uploaded correctly
- Check that all files in `assets/` folder are present
- Check browser console (F12) for 404 errors

---

## 📸 What It Should Look Like

After successful upload, your `public_html/` should contain:

```
public_html/
├── index.html          ← Your main HTML file
├── assets/             ← Folder with JS/CSS
│   ├── index-*.js      ← JavaScript files
│   └── index-*.css    ← CSS files
└── .htaccess          ← React Router config
```

---

## ✅ Step 1 Complete!

Once you've verified:
- ✅ Files uploaded successfully
- ✅ Page loads at `https://vision.innovfix.in`
- ✅ No major errors in browser console

**You're ready for Step 2: Upload Backend!**

---

## 🆘 Need Help?

If you encounter any issues:
1. Take a screenshot of the error
2. Check browser console (F12) for error messages
3. Verify all files are in the correct location
4. Ask me for help with specific error messages

---

**Next Step:** Step 2 - Upload Backend Files

