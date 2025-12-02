# Hosting Files Checklist

## Files Ready for Hosting

### Backend Files
- ✅ `backend/server.js` - Main backend server
- ✅ `backend/package.json` - Dependencies (includes mysql2)
- ✅ `backend/database/schema.sql` - Database schema for phpMyAdmin import
- ✅ `backend/database/db.js` - Database connection module
- ✅ `backend/routes/videos.js` - Video CRUD API routes
- ✅ `backend/routes/usage.js` - Usage statistics API routes
- ✅ `backend/.env.example` - Environment variables template

### Frontend Files
- ✅ `src/` - All React source files
- ✅ `package.json` - Frontend dependencies
- ✅ `vite.config.js` - Build configuration
- ✅ `dist/` - Production build (after running `npm run build`)

### Documentation
- ✅ `DEPLOYMENT.md` - Complete deployment guide
- ✅ `README_DATABASE.md` - Database integration guide
- ✅ `HOSTING_FILES.md` - This file

## Quick Setup Steps

### 1. Database Setup (phpMyAdmin)

1. Open phpMyAdmin: `http://localhost/phpmyadmin`
2. Create database: `vision_ai_db`
3. Import schema: Go to Import tab → Select `backend/database/schema.sql` → Click Go

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm start
```

### 3. Frontend Setup

```bash
npm install
# Create .env file with: VITE_BACKEND_URL=http://localhost:3001
npm run build
# Serve dist folder with your web server
```

## Environment Variables Required

### Backend (.env)
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=vision_ai_db
DB_PORT=3306
GOOGLE_APPLICATION_CREDENTIALS=path/to/key.json
GOOGLE_PROJECT_ID=your-project-id
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3001
PORT=3001
```

### Frontend (.env)
```
VITE_BACKEND_URL=http://localhost:3001
```

## Database Schema Import

The `backend/database/schema.sql` file contains:
- Database creation: `vision_ai_db`
- Table creation: `videos` and `usage_stats`
- Indexes for performance
- Initial data setup

**Import this file in phpMyAdmin to set up your database.**

## Testing

After setup:
1. Start backend: `cd backend && npm start`
2. Start frontend: `npm run dev`
3. Open browser: `http://localhost:5173`
4. Check backend logs for: ✅ Database connection successful

## Production Deployment

See `DEPLOYMENT.md` for complete production deployment instructions including:
- PM2 setup for backend
- Web server configuration
- Security considerations
- Troubleshooting guide

