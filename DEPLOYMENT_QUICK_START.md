# Quick Start Deployment Guide

## 🚀 Fast Track to Deploy

### Prerequisites ✅
- [x] Database created and schema imported
- [x] Frontend built (`dist/` folder ready)
- [x] Backend files ready

---

## Step 1: Upload Frontend (5 minutes)

1. **Access Hostinger File Manager:**
   - Go to: https://hpanel.hostinger.com/websites/vision.innovfix.in
   - Click **Files** → **File Manager**
   - Navigate to `public_html/`

2. **Upload Frontend Files:**
   - Upload ALL contents from `dist/` folder:
     - `index.html`
     - `assets/` folder (with all JS/CSS files)
   - Upload `.htaccess` file (for React Router)

3. **Verify:**
   - Visit: `https://vision.innovfix.in`
   - Page should load (may show API errors - that's OK for now)

---

## Step 2: Upload Backend (10 minutes)

1. **Create Backend Directory:**
   - In File Manager, create folder: `api` (inside `public_html/`)
   - Or create at root level: `domains/vision.innovfix.in/api`

2. **Upload Backend Files:**
   - Upload these files/folders to `api/`:
     ```
     server.js
     package.json
     package-lock.json
     database/
       └── db.js
     routes/
       ├── videos.js
       └── usage.js
     ```

3. **Create `.env` File:**
   - In `api/` folder, create new file: `.env`
   - Copy content from `backend/.env.production.example`
   - Update these values:
     ```env
     FRONTEND_URL=https://vision.innovfix.in
     BACKEND_URL=https://api.vision.innovfix.in
     ```
   - Keep database credentials as-is (already correct)

---

## Step 3: Install & Start Backend (5 minutes)

### Option A: Using Hostinger Terminal (Recommended)

1. **Open Terminal in hPanel:**
   - Go to **Advanced** → **Terminal** (or **SSH Access**)

2. **Navigate and Install:**
   ```bash
   cd public_html/api
   npm install --production
   ```

3. **Start Server:**
   ```bash
   # Using PM2 (best for production)
   npm install -g pm2
   pm2 start server.js --name vision-ai-backend
   pm2 save
   pm2 startup
   
   # OR using Node directly (for testing)
   node server.js
   ```

### Option B: Using SSH (if available)

1. **SSH into server:**
   ```bash
   ssh your-username@your-server-ip
   ```

2. **Follow same commands as Option A**

---

## Step 4: Configure Domain & SSL (5 minutes)

### Set Up Backend Subdomain

1. **In hPanel:**
   - Go to **Domains** → **Subdomains**
   - Create: `api.vision.innovfix.in`
   - Point to: `public_html/api` (or your backend directory)

2. **Enable SSL:**
   - Go to **SSL** → **Let's Encrypt**
   - Enable SSL for `vision.innovfix.in`
   - Enable SSL for `api.vision.innovfix.in`

---

## Step 5: Test Everything (5 minutes)

### Backend Test
```bash
# Check if backend is running
curl https://api.vision.innovfix.in/api/videos

# Should return: [] (empty array) or list of videos
```

### Frontend Test
1. Visit: `https://vision.innovfix.in`
2. Open browser console (F12)
3. Check for errors
4. Try generating a video

### Database Test
- Check backend logs for:
  - ✅ Database connection successful
  - ✅ Database tables initialized

---

## 🎉 You're Live!

If all tests pass, your application is deployed!

---

## ⚠️ Common Issues & Fixes

### Backend Not Starting
- **Check:** Node.js version (need v18+)
- **Fix:** `node --version` - if old, contact Hostinger support

### Database Connection Fails
- **Check:** `.env` file has correct credentials
- **Fix:** Verify DB_HOST, DB_USER, DB_PASSWORD in `.env`

### Frontend Shows API Errors
- **Check:** Backend URL in `.env.production`
- **Fix:** Rebuild frontend: `npm run build` (with correct URL)

### 404 Errors on Page Refresh
- **Check:** `.htaccess` file exists in `public_html/`
- **Fix:** Upload `.htaccess` file

### CORS Errors
- **Check:** FRONTEND_URL in backend `.env`
- **Fix:** Update to match your frontend domain

---

## 📞 Need Help?

1. Check `DEPLOYMENT_CHECKLIST_HOSTINGER.md` for detailed steps
2. Check backend logs for error messages
3. Verify all environment variables are set
4. Contact Hostinger support if server issues

---

## ✅ Post-Deployment Checklist

- [ ] Frontend accessible at: `https://vision.innovfix.in`
- [ ] Backend accessible at: `https://api.vision.innovfix.in`
- [ ] SSL certificates active (green padlock)
- [ ] Database connection working
- [ ] Video generation working
- [ ] Usage statistics tracking working
- [ ] No console errors in browser

---

**Total Time: ~30 minutes**

Good luck! 🚀

