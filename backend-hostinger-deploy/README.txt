BACKEND DEPLOYMENT INSTRUCTIONS
===============================

Database Credentials (Already Configured):
- Host: localhost
- Database: u623025070_vision_ai_db
- Username: u623025070_vision2025
- Password: Vision@20252025

STEP 1: Create Database Tables in phpMyAdmin
---------------------------------------------
1. Go to Hostinger hPanel > Databases > phpMyAdmin
2. Select database: u623025070_vision_ai_db
3. Click "SQL" tab
4. Copy and paste contents from: database/schema.sql
5. Click "Go" to execute

STEP 2: Upload Files to Hostinger
---------------------------------
1. Go to File Manager
2. Navigate to: public_html/api/
3. Upload ALL files from this ZIP
4. IMPORTANT: Rename "env-config.txt" to ".env"

STEP 3: Configure Node.js in hPanel
-----------------------------------
1. Go to: Website > Node.js
2. Create application:
   - Node.js version: 18
   - Application root: /public_html/api
   - Startup file: server.js
3. Click "NPM Install"
4. Click "Restart"

STEP 4: Update Google Cloud Credentials
---------------------------------------
Edit api/.env and update:
- GOOGLE_PROJECT_ID
- GOOGLE_SERVICE_ACCOUNT_EMAIL
- GOOGLE_PRIVATE_KEY

STEP 5: Test
------------
Visit: https://api.vision.innovfix.in/api/videos
Should return: []

FILES IN THIS PACKAGE
---------------------
- server.js           (Main backend server)
- package.json        (Dependencies)
- env-config.txt      (Rename to .env)
- database/           (Database files)
  - db.js             (Database connection)
  - schema.sql        (SQL to create tables)
- routes/             (API routes)
  - videos.js
  - usage.js





