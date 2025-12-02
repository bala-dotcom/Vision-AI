// Database connection module for MySQL
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'vision_ai_db',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
};

// Create connection pool
let pool = null;

export function getPool() {
    if (!pool) {
        try {
            pool = mysql.createPool(dbConfig);
            console.log('✅ Database connection pool created');
        } catch (error) {
            console.error('❌ Database connection error:', error.message);
            throw error;
        }
    }
    return pool;
}

// Test database connection
export async function testConnection() {
    try {
        const connection = await getPool().getConnection();
        await connection.ping();
        connection.release();
        console.log('✅ Database connection successful');
        return true;
    } catch (error) {
        console.error('❌ Database connection test failed:', error.message);
        return false;
    }
}

// Initialize database (create tables if they don't exist)
export async function initializeDatabase() {
    try {
        const pool = getPool();
        
        // Create videos table
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS videos (
                id INT PRIMARY KEY AUTO_INCREMENT,
                video_url TEXT,
                thumbnail_url TEXT NULL,
                prompt TEXT NOT NULL,
                duration VARCHAR(10) DEFAULT '4s',
                resolution VARCHAR(10) DEFAULT '720p',
                aspect_ratio VARCHAR(10) DEFAULT '16:9',
                sound BOOLEAN DEFAULT FALSE,
                language VARCHAR(10) DEFAULT 'en',
                model VARCHAR(100) DEFAULT 'veo-3.1-generate-preview',
                cost_usd DECIMAL(10, 4) DEFAULT 0.0000,
                status VARCHAR(20) DEFAULT 'processing',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_status (status),
                INDEX idx_created_at (created_at),
                INDEX idx_language (language),
                INDEX idx_model (model)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        
        // Create usage_stats table
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS usage_stats (
                id INT PRIMARY KEY AUTO_INCREMENT,
                total_videos INT DEFAULT 0,
                total_cost_usd DECIMAL(10, 4) DEFAULT 0.0000,
                last_updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        
        // Initialize usage_stats if empty
        const [statsRows] = await pool.execute('SELECT COUNT(*) as count FROM usage_stats');
        if (statsRows[0].count === 0) {
            await pool.execute('INSERT INTO usage_stats (total_videos, total_cost_usd) VALUES (0, 0.0000)');
        }
        
        console.log('✅ Database tables initialized');
        return true;
    } catch (error) {
        console.error('❌ Database initialization error:', error.message);
        return false;
    }
}

export default { getPool, testConnection, initializeDatabase };

