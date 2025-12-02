#!/bin/bash
# Server startup script for Hostinger
# Run this script to start the backend server

echo "🚀 Starting Vision AI Backend Server..."
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "📝 Please create .env file using .env.production.example as template"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install --production
fi

# Test database connection
echo "🔍 Testing database connection..."
node -e "
require('dotenv').config();
const mysql = require('mysql2/promise');
(async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT || 3306
        });
        await connection.ping();
        console.log('✅ Database connection successful');
        await connection.end();
    } catch (error) {
        console.log('❌ Database connection failed:', error.message);
        console.log('⚠️  Server will start but database features may not work');
    }
})();
"

# Start server
echo ""
echo "🌐 Starting server on port ${PORT:-3001}..."
echo ""

# Use PM2 if available, otherwise use node directly
if command -v pm2 &> /dev/null; then
    echo "📦 Using PM2 to start server..."
    pm2 start server.js --name vision-ai-backend
    pm2 save
    echo ""
    echo "✅ Server started with PM2"
    echo "📋 Useful commands:"
    echo "   pm2 logs vision-ai-backend    # View logs"
    echo "   pm2 restart vision-ai-backend # Restart server"
    echo "   pm2 stop vision-ai-backend   # Stop server"
else
    echo "📦 Starting server with Node.js..."
    node server.js
fi

