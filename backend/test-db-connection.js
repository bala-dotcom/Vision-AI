// Quick database connection test
import dotenv from 'dotenv';
import { testConnection, initializeDatabase } from './database/db.js';

dotenv.config();

console.log('🔍 Testing database connection...');
console.log('📋 Configuration:');
console.log(`   Host: ${process.env.DB_HOST || 'localhost'}`);
console.log(`   User: ${process.env.DB_USER || 'root'}`);
console.log(`   Database: ${process.env.DB_NAME || 'vision_ai_db'}`);
console.log(`   Port: ${process.env.DB_PORT || 3306}`);
console.log('');

async function test() {
    try {
        const connected = await testConnection();
        if (connected) {
            console.log('✅ Database connection test: SUCCESS');
            console.log('');
            console.log('🔧 Initializing database tables...');
            const initialized = await initializeDatabase();
            if (initialized) {
                console.log('✅ Database initialization: SUCCESS');
                console.log('');
                console.log('🎉 All database tests passed!');
                process.exit(0);
            } else {
                console.log('⚠️  Database initialization: FAILED');
                process.exit(1);
            }
        } else {
            console.log('❌ Database connection test: FAILED');
            console.log('');
            console.log('💡 Note: If database is on Hostinger, connection may only work after deployment.');
            process.exit(1);
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.log('');
        console.log('💡 Note: If database is on Hostinger, connection may only work after deployment.');
        process.exit(1);
    }
}

test();

