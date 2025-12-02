# Hostinger hPanel Database Setup Guide

## Step-by-Step Instructions

### Step 1: Create Database in hPanel

1. **Log into Hostinger hPanel**
   - Go to: https://hpanel.hostinger.com/websites/vision.innovfix.in
   - Log in with your Hostinger credentials

2. **Navigate to Databases**
   - In the hPanel dashboard, find and click on **"Databases"** or **"MySQL Databases"**
   - This is usually in the "Advanced" or "Database" section

3. **Create New Database**
   - Click **"Create Database"** or **"Add New Database"**
   - Database name: `vision_ai_db`
   - **Note:** Hostinger may automatically prefix your username (e.g., `username_vision_ai_db`)
   - **IMPORTANT:** Copy the FULL database name including any prefix
   - Click **"Create"** or **"Add Database"**

### Step 2: Create Database User

1. **In the same Databases section**, scroll down to **"MySQL Users"** or **"Add New User"**

2. **Create New User**
   - Username: `vision_ai_user`
   - **Note:** Hostinger may prefix it (e.g., `username_vision_ai_user`)
   - Password: Create a strong password (use password generator if available)
   - **IMPORTANT:** Save this password securely - you'll need it for `.env` file
   - Click **"Create User"** or **"Add User"**

3. **Grant Privileges**
   - Find the user you just created
   - Click **"Manage"** or **"Add User to Database"**
   - Select the `vision_ai_db` database
   - Check **"ALL PRIVILEGES"** or select all available privileges
   - Click **"Make Changes"** or **"Add User to Database"**

### Step 3: Access phpMyAdmin

1. **In hPanel**, find **"phpMyAdmin"** or **"Database Management"**
   - Usually in the Databases section or Advanced section
   - Click to open phpMyAdmin in a new tab/window

2. **Log in to phpMyAdmin**
   - Username: The FULL username you created (e.g., `username_vision_ai_user`)
   - Password: The password you set
   - Server: Usually `localhost` (or leave default)
   - Click **"Go"** or **"Log in"**

### Step 4: Import Database Schema

1. **Select Database**
   - In phpMyAdmin left sidebar, click on your database name (`vision_ai_db` or `username_vision_ai_db`)
   - You should see an empty database

2. **Import SQL File**
   - Click the **"Import"** tab at the top
   - Click **"Choose File"** or **"Browse"**
   - Navigate to and select: `backend/database/schema.sql` from your project
   - Ensure **"Format"** is set to **"SQL"**
   - Click **"Go"** or **"Import"** at the bottom

3. **Verify Import**
   - After import, you should see:
     - ✅ Success message
     - Two tables created: `videos` and `usage_stats`
   - Click on the database name in left sidebar to see the tables

### Step 5: Get Database Connection Details

From your hPanel, note down these details:

- **Database Host:** Usually `localhost` (or check hPanel for exact hostname)
- **Database Name:** Full name including prefix (e.g., `username_vision_ai_db`)
- **Database User:** Full username including prefix (e.g., `username_vision_ai_user`)
- **Database Password:** The password you created
- **Database Port:** Usually `3306` (default MySQL port)

### Step 6: Update Backend Configuration

1. **Update `backend/.env` file** with your Hostinger database credentials:

```env
# Database Configuration (Hostinger)
DB_HOST=localhost
DB_USER=username_vision_ai_user
DB_PASSWORD=your_password_here
DB_NAME=username_vision_ai_db
DB_PORT=3306

# Google Cloud Configuration
GOOGLE_APPLICATION_CREDENTIALS=path/to/your/service-account-key.json
GOOGLE_PROJECT_ID=your-project-id
GOOGLE_LOCATION=us-central1

# Server Configuration
PORT=3001
NODE_ENV=production

# Frontend URL (update with your domain)
FRONTEND_URL=https://vision.innovfix.in

# Backend URL (update with your backend domain/port)
BACKEND_URL=https://api.vision.innovfix.in
```

**Important Notes:**
- Replace `username_vision_ai_user` with your ACTUAL full username from hPanel
- Replace `username_vision_ai_db` with your ACTUAL full database name from hPanel
- Replace `your_password_here` with your actual database password
- If Hostinger provides a different hostname (not `localhost`), use that instead

### Step 7: Test Database Connection

1. **Upload backend files** to your Hostinger server (via FTP/File Manager)

2. **SSH into your server** (if SSH access is available) or use Hostinger's terminal

3. **Navigate to backend directory** and test:
   ```bash
   cd backend
   node -e "require('./database/db.js').testConnection().then(console.log)"
   ```

4. **Or start the backend server:**
   ```bash
   npm start
   ```
   
   Look for these messages:
   - ✅ Database connection successful
   - ✅ Database tables initialized

### Troubleshooting

**Issue: Can't find Databases section in hPanel**
- Look for "Advanced" → "MySQL Databases"
- Or search for "Database" in hPanel search bar

**Issue: Database name/user has prefix**
- This is normal for Hostinger shared hosting
- Always use the FULL name including prefix in `.env`

**Issue: Connection refused or access denied**
- Double-check username and password in `.env`
- Verify user has ALL PRIVILEGES on the database
- Check if Hostinger requires a specific hostname (not `localhost`)

**Issue: Can't import schema.sql**
- Ensure file size is within phpMyAdmin limits (usually 50MB)
- Try importing in smaller chunks if file is large
- Check file encoding is UTF-8

**Issue: Tables not created**
- Check phpMyAdmin error messages
- Verify SQL syntax is correct
- Try running SQL commands manually in phpMyAdmin SQL tab

### Alternative: Manual Table Creation

If import fails, you can create tables manually in phpMyAdmin:

1. Select your database
2. Click "SQL" tab
3. Copy and paste the contents of `backend/database/schema.sql`
4. Click "Go"

### Next Steps

After database setup is complete:
1. Deploy backend files to Hostinger
2. Update `.env` with production credentials
3. Start backend server
4. Deploy frontend files
5. Test the application

## Quick Reference

**Database Credentials Location in hPanel:**
- Full database name: Databases → MySQL Databases → Your database
- Full username: Databases → MySQL Users → Your user
- Password: Set when creating user (save securely)
- Host: Usually `localhost` (check hPanel for exact value)

**Files Needed:**
- `backend/database/schema.sql` - Database schema file
- `backend/.env` - Backend configuration (update with Hostinger credentials)

