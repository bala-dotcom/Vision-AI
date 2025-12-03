# Hostinger Upload Status Checklist

## Files That Should Be Uploaded

### Frontend Files (in `/public_html/`)
- [ ] `index.html` - Main HTML file
- [ ] `.htaccess` - Apache configuration file
- [ ] `assets/` folder - Contains:
  - [ ] `index-[hash].js` - Main JavaScript bundle
  - [ ] `index-[hash].css` - Main CSS file
  - [ ] Other asset files (images, fonts, etc.)

### Backend Files (in `/public_html/backend/` or separate location)
- [ ] `server.js` - Backend server file
- [ ] `package.json` - Node.js dependencies
- [ ] `node_modules/` - Installed packages (or run `npm install` on server)
- [ ] `.env` - Environment variables (create on server with database credentials)
- [ ] `database/` folder - Database schema files
- [ ] `routes/` folder - API route files
- [ ] `database/db.js` - Database connection file

## How to Check on Hostinger

### Option 1: Via File Manager (hPanel)
1. Login to https://hpanel.hostinger.com
2. Go to **File Manager**
3. Navigate to: `domains/vision.innovfix.in/public_html/`
4. Check if files listed above are present

### Option 2: Via SSH
```bash
# Connect to server
ssh u623025070@in-mum-web1990.main-hosting.eu

# Navigate to public_html
cd /home/u623025070/domains/vision.innovfix.in/public_html

# List all files
ls -la

# Check for assets folder
ls -la assets/

# Check for backend folder
ls -la backend/
```

## Quick Verification Commands

### Check Frontend Files
```bash
cd /home/u623025070/domains/vision.innovfix.in/public_html
test -f index.html && echo "✅ index.html exists" || echo "❌ index.html missing"
test -f .htaccess && echo "✅ .htaccess exists" || echo "❌ .htaccess missing"
test -d assets && echo "✅ assets/ folder exists" || echo "❌ assets/ folder missing"
```

### Check Backend Files
```bash
cd /home/u623025070/domains/vision.innovfix.in/public_html
test -d backend && echo "✅ backend/ folder exists" || echo "❌ backend/ folder missing"
```

## Expected File Structure

```
public_html/
├── index.html
├── .htaccess
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── ...
└── backend/          (if uploaded separately)
    ├── server.js
    ├── package.json
    ├── .env
    ├── database/
    └── routes/
```

## What to Do If Files Are Missing

1. **Frontend files missing**: Upload `frontend-upload.zip` via File Manager and extract
2. **Backend files missing**: Upload `backend-upload.zip` via File Manager and extract
3. **Assets folder missing**: Re-upload the `dist/` folder contents
4. **.htaccess missing**: Upload `.htaccess` file from project root

## Next Steps After Upload

1. ✅ Verify all files are uploaded
2. ✅ Set up backend `.env` file with database credentials
3. ✅ Install backend dependencies: `cd backend && npm install`
4. ✅ Start backend server (via PM2 or similar)
5. ✅ Test website: https://vision.innovfix.in

