# Vision AI - Deployment Guide

## Prerequisites

1. **Node.js** (v18 or higher)
2. **MySQL** (v8.0 or higher) or **phpMyAdmin** with MySQL
3. **Google Cloud Platform** account with Vertex AI API enabled
4. **Service Account Key** JSON file from Google Cloud Console

## Database Setup

### Step 1: Create Database in phpMyAdmin

1. Open phpMyAdmin (usually at `http://localhost/phpmyadmin`)
2. Click on "New" to create a new database
3. Name it `vision_ai_db` (or your preferred name)
4. Select collation: `utf8mb4_unicode_ci`
5. Click "Create"

### Step 2: Import Database Schema

1. In phpMyAdmin, select the `vision_ai_db` database
2. Click on the "Import" tab
3. Click "Choose File" and select `backend/database/schema.sql`
4. Click "Go" to import the schema
5. Verify that two tables are created:
   - `videos`
   - `usage_stats`

### Step 3: Create Database User (Optional but Recommended)

1. In phpMyAdmin, go to "User accounts" tab
2. Click "Add user account"
3. Set:
   - Username: `vision_ai_user` (or your preferred name)
   - Host name: `localhost`
   - Password: (set a strong password)
4. Under "Database for user account", select "Grant all privileges on database `vision_ai_db`"
5. Click "Go"

## Backend Setup

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

### Step 2: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and fill in your values:
   ```env
   # Google Cloud Configuration
   GOOGLE_APPLICATION_CREDENTIALS=path/to/your/service-account-key.json
   GOOGLE_PROJECT_ID=your-project-id
   GOOGLE_LOCATION=us-central1

   # Database Configuration
   DB_HOST=localhost
   DB_USER=root                    # or vision_ai_user if you created one
   DB_PASSWORD=your_password
   DB_NAME=vision_ai_db
   DB_PORT=3306

   # Server Configuration
   PORT=3001
   NODE_ENV=production

   # Frontend URL (for CORS)
   FRONTEND_URL=http://localhost:5173

   # Backend URL (for API calls)
   BACKEND_URL=http://localhost:3001
   ```

### Step 3: Start Backend Server

```bash
npm start
```

The server will:
- Test database connection
- Initialize database tables if they don't exist
- Start listening on port 3001 (or your configured PORT)

## Frontend Setup

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Configure Environment Variables

1. Create `.env` file in the root directory:
   ```env
   VITE_BACKEND_URL=http://localhost:3001
   ```

### Step 3: Build for Production

```bash
npm run build
```

This creates a `dist` folder with production-ready files.

### Step 4: Serve Frontend

**Option A: Using a Web Server (Recommended)**

Copy the `dist` folder contents to your web server (Apache, Nginx, etc.)

**Option B: Using Node.js**

```bash
npm install -g serve
serve -s dist -l 5173
```

## Production Deployment

### Backend Deployment

1. **Upload backend files** to your server
2. **Install dependencies**: `npm install --production`
3. **Set environment variables** in `.env` file
4. **Start with PM2** (recommended):
   ```bash
   npm install -g pm2
   pm2 start server.js --name vision-ai-backend
   pm2 save
   pm2 startup
   ```

### Frontend Deployment

1. **Build the frontend**: `npm run build`
2. **Upload `dist` folder** to your web server
3. **Configure web server** to serve static files from `dist`
4. **Update `VITE_BACKEND_URL`** in `.env` to your backend URL

### Database Configuration

- Update `DB_HOST` in backend `.env` to your database server IP/hostname
- Ensure MySQL is accessible from your backend server
- Update firewall rules if necessary

## Environment Variables Reference

### Backend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `GOOGLE_APPLICATION_CREDENTIALS` | Path to GCP service account JSON | `/path/to/key.json` |
| `GOOGLE_PROJECT_ID` | Your GCP project ID | `my-project-123` |
| `GOOGLE_LOCATION` | GCP region | `us-central1` |
| `DB_HOST` | MySQL host | `localhost` |
| `DB_USER` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | `your_password` |
| `DB_NAME` | Database name | `vision_ai_db` |
| `DB_PORT` | MySQL port | `3306` |
| `PORT` | Backend server port | `3001` |
| `FRONTEND_URL` | Frontend URL for CORS | `https://yourdomain.com` |
| `BACKEND_URL` | Backend URL | `https://api.yourdomain.com` |

### Frontend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_BACKEND_URL` | Backend API URL | `https://api.yourdomain.com` |

## Troubleshooting

### Database Connection Issues

- Verify MySQL is running: `mysql -u root -p`
- Check database credentials in `.env`
- Ensure database exists: `SHOW DATABASES;`
- Test connection: `mysql -u DB_USER -p DB_NAME`

### CORS Errors

- Update `FRONTEND_URL` in backend `.env` to match your frontend domain
- Ensure no trailing slashes in URLs

### Video Generation Issues

- Verify Google Cloud credentials are correct
- Check Vertex AI API is enabled in GCP Console
- Ensure service account has necessary permissions

## Security Notes

1. **Never commit `.env` files** to version control
2. **Use strong database passwords** in production
3. **Restrict database access** to backend server only
4. **Use HTTPS** in production
5. **Set proper CORS origins** (not `*` in production)

## Support

For issues or questions, check:
- Backend logs: `pm2 logs vision-ai-backend`
- Database logs: Check MySQL error logs
- Browser console: Check for frontend errors

