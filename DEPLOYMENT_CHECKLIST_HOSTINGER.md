# Hostinger Deployment Checklist

## ✅ Pre-Deployment (Already Completed)
- [x] Database created in Hostinger hPanel
- [x] Database schema imported (videos and usage_stats tables)
- [x] Database user created with privileges
- [x] Backend .env configured with database credentials

## 📦 Step 1: Prepare Files Locally

### Frontend Build
- [ ] **Build frontend for production:**
  ```bash
  npm run build
  ```
  This creates a `dist/` folder with production-ready files

- [ ] **Verify build:**
  - Check that `dist/` folder exists
  - Check that `dist/index.html` exists
  - Check that `dist/assets/` folder has JavaScript and CSS files

### Backend Files
- [ ] **Verify backend files are ready:**
  - `backend/server.js` ✓
  - `backend/package.json` ✓
  - `backend/database/db.js` ✓
  - `backend/routes/videos.js` ✓
  - `backend/routes/usage.js` ✓
  - `backend/.env.production.example` ✓ (use as template)

## 🚀 Step 2: Deploy Backend to Hostinger

### Upload Backend Files
- [ ] **Access Hostinger File Manager or use FTP:**
  - Log into hPanel: https://hpanel.hostinger.com/websites/vision.innovfix.in
  - Go to **Files** → **File Manager**
  - Navigate to your domain's root directory (usually `public_html` or `domains/vision.innovfix.in/public_html`)

- [ ] **Create backend directory:**
  - Create folder: `api` or `backend` (e.g., `public_html/api`)
  - Upload all backend files to this directory:
    - `server.js`
    - `package.json`
    - `package-lock.json`
    - `database/` folder (with `db.js`)
    - `routes/` folder (with `videos.js` and `usage.js`)

### Configure Backend Environment
- [ ] **Create `.env` file on server:**
  - Copy `backend/.env.production.example` content
  - Update with production values:
    - `FRONTEND_URL=https://vision.innovfix.in` (your frontend domain)
    - `BACKEND_URL=https://api.vision.innovfix.in` (your backend URL)
    - Verify database credentials match Hostinger
    - Add Google Cloud credentials if needed

### Install Dependencies & Start Backend
- [ ] **SSH into Hostinger server** (if available) or use **Terminal** in hPanel:
  ```bash
  cd public_html/api  # or your backend directory
  npm install --production
  ```

- [ ] **Start backend server:**
  - **Option A: Using PM2 (Recommended for production):**
    ```bash
    npm install -g pm2
    pm2 start server.js --name vision-ai-backend
    pm2 save
    pm2 startup
    ```
  
  - **Option B: Using Node.js directly (for testing):**
    ```bash
    node server.js
    ```

- [ ] **Verify backend is running:**
  - Check console for: ✅ Database connection successful
  - Check console for: ✅ Database tables initialized
  - Test backend URL: `https://api.vision.innovfix.in/api/videos` (should return JSON)

## 🌐 Step 3: Deploy Frontend to Hostinger

### Upload Frontend Build
- [ ] **Upload `dist/` folder contents:**
  - Go to File Manager
  - Navigate to `public_html/` (or your domain root)
  - Upload ALL contents from `dist/` folder:
    - `index.html`
    - `assets/` folder (with all JS and CSS files)

### Configure Frontend Environment
- [ ] **Update backend URL in frontend:**
  - **Option A:** If you built with `.env.production`, the URL is already set
  - **Option B:** If not, you need to rebuild with correct URL:
    ```bash
    # Create .env file locally
    echo "VITE_BACKEND_URL=https://api.vision.innovfix.in" > .env.production
    npm run build
    # Then upload new dist/ folder
    ```

### Configure Web Server
- [ ] **Set up URL rewriting** (for React Router):
  - Create `.htaccess` file in `public_html/`:
    ```apache
    <IfModule mod_rewrite.c>
      RewriteEngine On
      RewriteBase /
      RewriteRule ^index\.html$ - [L]
      RewriteCond %{REQUEST_FILENAME} !-f
      RewriteCond %{REQUEST_FILENAME} !-d
      RewriteRule . /index.html [L]
    </IfModule>
    ```

## ✅ Step 4: Test Deployment

### Backend Tests
- [ ] **Test database connection:**
  - Check backend logs for: ✅ Database connection successful
  - Check backend logs for: ✅ Database tables initialized

- [ ] **Test API endpoints:**
  - `GET https://api.vision.innovfix.in/api/videos` - Should return empty array or videos
  - `GET https://api.vision.innovfix.in/api/usage/stats` - Should return statistics

### Frontend Tests
- [ ] **Test frontend access:**
  - Open: `https://vision.innovfix.in`
  - Verify page loads correctly
  - Check browser console for errors

- [ ] **Test video generation:**
  - Enter Google credentials
  - Create a test video
  - Verify it appears in history
  - Check database for new record

### Integration Tests
- [ ] **Test full flow:**
  - Generate a video
  - Check Usage Details modal
  - Verify statistics update
  - Check database records

## 🔧 Step 5: Configure Domains & SSL

### Domain Configuration
- [ ] **Set up subdomain for backend** (if using subdomain):
  - In hPanel: **Domains** → **Subdomains**
  - Create: `api.vision.innovfix.in`
  - Point to: `public_html/api` directory

- [ ] **Or configure backend on main domain:**
  - Use reverse proxy or different port
  - Update CORS settings in backend

### SSL Certificates
- [ ] **Enable SSL for both domains:**
  - In hPanel: **SSL** → **Let's Encrypt**
  - Enable SSL for `vision.innovfix.in`
  - Enable SSL for `api.vision.innovfix.in` (if using subdomain)

## 📝 Step 6: Final Configuration

### Environment Variables Check
- [ ] **Backend `.env` verified:**
  - Database credentials correct
  - FRONTEND_URL matches frontend domain
  - BACKEND_URL matches backend URL
  - Google Cloud credentials added (if needed)

- [ ] **Frontend build verified:**
  - VITE_BACKEND_URL points to correct backend
  - No hardcoded localhost URLs

### Security Checklist
- [ ] `.env` file is NOT in git
- [ ] `.env` file permissions are secure (600 or 644)
- [ ] Database password is strong
- [ ] SSL certificates are active
- [ ] CORS is configured correctly

## 🎉 Step 7: Go Live!

- [ ] All tests passing
- [ ] Frontend accessible at: `https://vision.innovfix.in`
- [ ] Backend accessible at: `https://api.vision.innovfix.in`
- [ ] Database connection working
- [ ] Video generation working
- [ ] Usage statistics tracking working

## 🆘 Troubleshooting

### Backend Issues
- **Database connection fails:** Check DB_HOST, DB_USER, DB_PASSWORD in `.env`
- **Port already in use:** Change PORT in `.env` or stop conflicting service
- **Module not found:** Run `npm install` in backend directory

### Frontend Issues
- **Backend API calls fail:** Check VITE_BACKEND_URL and CORS settings
- **404 errors on refresh:** Ensure `.htaccess` is configured for React Router
- **Build errors:** Check Node.js version (need v18+)

### Database Issues
- **Tables not found:** Re-import `schema_hostinger.sql` in phpMyAdmin
- **Access denied:** Verify user has ALL PRIVILEGES on database

## 📞 Need Help?

- Check Hostinger documentation
- Review `DEPLOYMENT.md` for detailed instructions
- Check backend logs for error messages
- Verify all environment variables are set correctly

