# Hostinger Database Setup - Complete Guide

## Quick Start

1. **Create Database** in hPanel → Databases → MySQL Databases
2. **Create User** in hPanel → Databases → MySQL Users  
3. **Import Schema** in phpMyAdmin using `backend/database/schema_hostinger.sql`
4. **Update `.env`** with your database credentials

---

## Detailed Steps

### Step 1: Create Database in Hostinger hPanel

1. **Access hPanel**
   - URL: https://hpanel.hostinger.com/websites/vision.innovfix.in
   - Log in with your Hostinger credentials

2. **Navigate to Databases**
   - In hPanel dashboard, find **"Databases"** section
   - Click on **"MySQL Databases"** or **"Databases"**

3. **Create New Database**
   - Click **"Create Database"** or **"Add New Database"** button
   - Database name: `vision_ai_db`
   - **Important:** Hostinger will add a prefix (e.g., `u123456789_vision_ai_db`)
   - Click **"Create"** or **"Add Database"**
   - **Copy the FULL database name** - you'll need it for `.env`

### Step 2: Create Database User

1. **In the Databases section**, scroll to **"MySQL Users"** or **"Add New User"**

2. **Create New User**
   - Username: `vision_ai_user`
   - **Note:** Hostinger will add prefix (e.g., `u123456789_vision_ai_user`)
   - Password: Click **"Generate"** or create a strong password
   - **IMPORTANT:** Save this password - you'll need it for `.env`
   - Click **"Create User"** or **"Add User"**

3. **Grant Privileges**
   - Find your newly created user
   - Click **"Manage"**, **"Add User to Database"**, or **"Privileges"**
   - Select your `vision_ai_db` database from dropdown
   - Check **"ALL PRIVILEGES"** checkbox
   - Click **"Make Changes"** or **"Add User to Database"**

### Step 3: Access phpMyAdmin

1. **In hPanel**, find **"phpMyAdmin"** link
   - Usually in Databases section or Advanced section
   - May be labeled as **"Database Management"** or **"phpMyAdmin"**

2. **Log in to phpMyAdmin**
   - Username: Your FULL username (e.g., `u123456789_vision_ai_user`)
   - Password: The password you set
   - Server: Usually `localhost` (leave default)
   - Click **"Go"**

### Step 4: Import Database Schema

1. **Select Your Database**
   - In phpMyAdmin left sidebar, click on your database name
   - It should be empty (no tables yet)

2. **Import SQL File**
   - Click **"Import"** tab at the top
   - Click **"Choose File"** button
   - Navigate to: `backend/database/schema_hostinger.sql`
   - **OR** use the original `schema.sql` (both work, but `schema_hostinger.sql` is recommended)
   - Format should be: **SQL** (default)
   - Click **"Go"** at the bottom

3. **Verify Import Success**
   - You should see: ✅ "Import has been successfully finished"
   - In left sidebar, you should see:
     - `videos` table
     - `usage_stats` table
   - Click on each table to verify structure

### Step 5: Get Database Connection Details

From your hPanel, collect these details:

| Setting | Value | Where to Find |
|---------|-------|---------------|
| **DB_HOST** | Usually `localhost` | Databases section or phpMyAdmin |
| **DB_NAME** | `u123456789_vision_ai_db` | MySQL Databases list |
| **DB_USER** | `u123456789_vision_ai_user` | MySQL Users list |
| **DB_PASSWORD** | Your password | Set when creating user |
| **DB_PORT** | Usually `3306` | Default MySQL port |

**Important:** 
- Always use FULL names including username prefix
- If Hostinger shows a different hostname (not `localhost`), use that

### Step 6: Update Backend Configuration

1. **Create `.env` file** in `backend/` directory:
   ```bash
   cd backend
   cp .env.example .env
   ```

2. **Edit `backend/.env`** with your Hostinger credentials:

```env
# Database Configuration (Hostinger)
DB_HOST=localhost
DB_USER=u123456789_vision_ai_user
DB_PASSWORD=your_actual_password_here
DB_NAME=u123456789_vision_ai_db
DB_PORT=3306

# Google Cloud Configuration
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json
GOOGLE_PROJECT_ID=your-google-project-id
GOOGLE_LOCATION=us-central1

# Server Configuration
PORT=3001
NODE_ENV=production

# Frontend/Backend URLs
FRONTEND_URL=https://vision.innovfix.in
BACKEND_URL=https://api.vision.innovfix.in
```

**Replace:**
- `u123456789_vision_ai_user` → Your actual full username
- `u123456789_vision_ai_db` → Your actual full database name
- `your_actual_password_here` → Your actual database password
- Update Google Cloud credentials
- Update URLs with your actual domains

### Step 7: Test Database Connection

1. **Upload backend files** to Hostinger (via FTP or File Manager)

2. **SSH into server** (if available) or use Hostinger's terminal

3. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

4. **Install dependencies** (if not done):
   ```bash
   npm install
   ```

5. **Test connection:**
   ```bash
   npm start
   ```

6. **Look for these success messages:**
   - ✅ Database connection successful
   - ✅ Database tables initialized
   - Backend proxy server running on port 3001

---

## Troubleshooting

### Can't Find Databases Section
- Look for **"Advanced"** → **"MySQL Databases"**
- Use hPanel search bar: type "database"
- Check Hostinger documentation for your plan type

### Database Name Has Prefix
- **This is normal!** Hostinger adds username prefix
- Always use the FULL name in `.env`
- Example: `u123456789_vision_ai_db` (not just `vision_ai_db`)

### Connection Refused / Access Denied
- Double-check username and password in `.env`
- Verify user has ALL PRIVILEGES on database
- Check if DB_HOST is correct (might not be `localhost`)
- Ensure database user is added to the database

### Can't Import Schema
- Check file size (phpMyAdmin limit usually 50MB)
- Verify file encoding is UTF-8
- Try copying SQL content and pasting in phpMyAdmin SQL tab
- Check phpMyAdmin error messages

### Tables Already Exist Error
- This means tables were already created
- You can either:
  - Drop existing tables and re-import
  - Or proceed (tables are already set up)

---

## Files Reference

| File | Purpose |
|------|---------|
| `backend/database/schema_hostinger.sql` | Recommended schema for Hostinger (tables only) |
| `backend/database/schema.sql` | Original schema (includes CREATE DATABASE) |
| `backend/.env.example` | Template for environment variables |
| `DATABASE_CREDENTIALS_TEMPLATE.txt` | Template to fill in your credentials |

---

## Next Steps After Database Setup

1. ✅ Database created and schema imported
2. ✅ `.env` configured with database credentials
3. ⏭️ Deploy backend files to Hostinger
4. ⏭️ Deploy frontend files to Hostinger
5. ⏭️ Test the full application

---

## Security Reminders

- ✅ Never commit `.env` file to git
- ✅ Use strong database passwords
- ✅ Keep database credentials secure
- ✅ Restrict database access to backend server only
- ✅ Use HTTPS in production

---

## Support

If you encounter issues:
1. Check Hostinger documentation
2. Review phpMyAdmin error messages
3. Verify all credentials are correct
4. Contact Hostinger support if needed

