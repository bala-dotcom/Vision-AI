# Hostinger Quick Setup Checklist

## Pre-Setup Checklist
- [ ] Have Hostinger hPanel login credentials
- [ ] Have `backend/database/schema.sql` file ready
- [ ] Have backend `.env.example` file ready

## Database Setup (5-10 minutes)

### 1. Create Database
- [ ] Log into hPanel: https://hpanel.hostinger.com/websites/vision.innovfix.in
- [ ] Go to Databases → MySQL Databases
- [ ] Create database: `vision_ai_db`
- [ ] **Copy FULL database name** (with prefix if any)

### 2. Create User
- [ ] Create MySQL user: `vision_ai_user`
- [ ] Set strong password
- [ ] **Copy FULL username** (with prefix if any)
- [ ] Grant ALL PRIVILEGES to `vision_ai_db`

### 3. Import Schema
- [ ] Open phpMyAdmin from hPanel
- [ ] Select your database
- [ ] Import → Choose `backend/database/schema.sql`
- [ ] Verify `videos` and `usage_stats` tables created

### 4. Update Configuration
- [ ] Copy `backend/.env.example` to `backend/.env`
- [ ] Update database credentials:
  ```
  DB_HOST=localhost
  DB_USER=[your_full_username]
  DB_PASSWORD=[your_password]
  DB_NAME=[your_full_database_name]
  DB_PORT=3306
  ```
- [ ] Update Google Cloud credentials
- [ ] Update FRONTEND_URL and BACKEND_URL

### 5. Test Connection
- [ ] Upload backend files to server
- [ ] Run `npm start` in backend directory
- [ ] Verify: ✅ Database connection successful

## Common Hostinger Database Formats

**Database Name Format:**
- Pattern: `username_vision_ai_db`
- Example: `u123456789_vision_ai_db`

**Username Format:**
- Pattern: `username_vision_ai_user`
- Example: `u123456789_vision_ai_user`

**Host Format:**
- Usually: `localhost`
- Sometimes: `127.0.0.1`
- Check hPanel for exact value

## Important Notes

1. **Always use FULL names** including username prefix
2. **Save database password securely** - you'll need it for `.env`
3. **Database host** is usually `localhost` but verify in hPanel
4. **Port** is usually `3306` (default MySQL port)

## Need Help?

- Check `HOSTINGER_SETUP_GUIDE.md` for detailed instructions
- Check Hostinger documentation for database setup
- Contact Hostinger support if you can't find Databases section

