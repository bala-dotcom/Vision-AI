# Files to Upload to Hostinger

## 📦 Frontend Files (Upload to `public_html/`)

Upload these files/folders to your `public_html/` directory:

```
public_html/
├── index.html                    ← From dist/index.html
├── assets/                       ← From dist/assets/ (entire folder)
│   ├── index-*.js               ← JavaScript files
│   └── index-*.css              ← CSS files
└── .htaccess                     ← React Router configuration
```

**Source:** Copy from `dist/` folder in your project

---

## 🔧 Backend Files (Upload to `public_html/api/` or create `api/` folder)

Upload these files/folders to create your backend:

```
api/                              ← Create this folder
├── server.js                     ← Main server file
├── package.json                  ← Dependencies list
├── package-lock.json             ← Lock file (optional but recommended)
├── .env                          ← Create this file (see below)
├── database/
│   └── db.js                     ← Database connection
└── routes/
    ├── videos.js                 ← Video API routes
    └── usage.js                  ← Usage API routes
```

**Source:** Copy from `backend/` folder in your project

---

## ⚙️ Backend `.env` File (Create on Server)

**Location:** `api/.env`

**Content:** Copy from `backend/.env.production.example` and update:

```env
# Database Configuration (Hostinger)
DB_HOST=localhost
DB_USER=u623025070_vision2025
DB_PASSWORD=Vision@20252025
DB_NAME=u623025070_vision_ai_db
DB_PORT=3306

# Server Configuration
PORT=3001
NODE_ENV=production

# Frontend/Backend URLs (Update with your actual domains)
FRONTEND_URL=https://vision.innovfix.in
BACKEND_URL=https://api.vision.innovfix.in

# Google Cloud Configuration (add if you have credentials)
# GOOGLE_SERVICE_ACCOUNT_EMAIL=...
# GOOGLE_PRIVATE_KEY=...
# GOOGLE_PROJECT_ID=...
# GOOGLE_LOCATION=us-central1
```

---

## 📋 Upload Checklist

### Frontend Upload
- [ ] Upload `dist/index.html` → `public_html/index.html`
- [ ] Upload `dist/assets/` folder → `public_html/assets/`
- [ ] Upload `.htaccess` → `public_html/.htaccess`

### Backend Upload
- [ ] Create `api/` folder in `public_html/` or root
- [ ] Upload `backend/server.js` → `api/server.js`
- [ ] Upload `backend/package.json` → `api/package.json`
- [ ] Upload `backend/package-lock.json` → `api/package-lock.json`
- [ ] Upload `backend/database/` folder → `api/database/`
- [ ] Upload `backend/routes/` folder → `api/routes/`
- [ ] Create `api/.env` file with production values

### After Upload
- [ ] Install backend dependencies: `cd api && npm install`
- [ ] Start backend server (see `DEPLOYMENT_QUICK_START.md`)
- [ ] Configure subdomain for backend (if using `api.vision.innovfix.in`)
- [ ] Enable SSL certificates
- [ ] Test frontend: `https://vision.innovfix.in`
- [ ] Test backend: `https://api.vision.innovfix.in/api/videos`

---

## 🚀 Quick Upload Guide

1. **Access Hostinger File Manager:**
   - Login: https://hpanel.hostinger.com/websites/vision.innovfix.in
   - Go to: **Files** → **File Manager**

2. **Upload Frontend:**
   - Navigate to `public_html/`
   - Upload all files from `dist/` folder
   - Upload `.htaccess` file

3. **Upload Backend:**
   - Create `api/` folder
   - Upload backend files
   - Create `.env` file

4. **Install & Start:**
   - Use Terminal in hPanel or SSH
   - Run: `cd api && npm install`
   - Start server (see `DEPLOYMENT_QUICK_START.md`)

---

## 📖 Need More Help?

- **Quick Start:** See `DEPLOYMENT_QUICK_START.md`
- **Detailed Steps:** See `DEPLOYMENT_CHECKLIST_HOSTINGER.md`
- **Troubleshooting:** Check backend logs and browser console

---

**Total Files to Upload:**
- Frontend: ~5 files (index.html + assets folder)
- Backend: ~6 files (server.js + package.json + folders)
- Config: 2 files (.htaccess + .env)

**Estimated Upload Time:** 5-10 minutes

