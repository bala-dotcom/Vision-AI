// Usage statistics routes
import express from 'express';
import { getPool } from '../database/db.js';

const router = express.Router();

// Get usage statistics
router.get('/stats', async (req, res) => {
    try {
        const { date } = req.query; // Optional date filter
        const pool = getPool();
        
        let query = 'SELECT * FROM videos WHERE status = "completed"';
        let params = [];
        
        // Apply date filter if provided
        if (date && date !== 'all') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (date === 'today') {
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);
                query += ' AND created_at >= ? AND created_at < ?';
                params = [today, tomorrow];
            } else if (date === 'yesterday') {
                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);
                query += ' AND created_at >= ? AND created_at < ?';
                params = [yesterday, today];
            } else {
                const targetDate = new Date(date);
                if (!isNaN(targetDate.getTime())) {
                    const startOfDay = new Date(targetDate);
                    startOfDay.setHours(0, 0, 0, 0);
                    const endOfDay = new Date(targetDate);
                    endOfDay.setHours(23, 59, 59, 999);
                    query += ' AND created_at >= ? AND created_at <= ?';
                    params = [startOfDay, endOfDay];
                }
            }
        }
        
        const [rows] = await pool.execute(query, params);
        
        // Calculate statistics
        const totalVideos = rows.length;
        const totalCost = rows.reduce((sum, row) => sum + parseFloat(row.cost_usd || 0), 0);
        const avgCost = totalVideos > 0 ? totalCost / totalVideos : 0;
        
        // Resolution breakdown
        const resolutionCounts = { '720p': 0, '1080p': 0, '4k': 0 };
        rows.forEach(row => {
            const res = row.resolution || '720p';
            if (resolutionCounts[res] !== undefined) {
                resolutionCounts[res]++;
            }
        });
        
        // Sound breakdown
        const withSound = rows.filter(row => row.sound === 1 || row.sound === true).length;
        const withoutSound = totalVideos - withSound;
        
        res.json({
            totalVideos,
            totalCost,
            avgCost,
            resolutionCounts,
            withSound,
            withoutSound
        });
    } catch (error) {
        console.error('❌ [GET /api/usage/stats] Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get session cost (sum of all completed videos)
router.get('/session-cost', async (req, res) => {
    try {
        const pool = getPool();
        const [rows] = await pool.execute(
            'SELECT SUM(cost_usd) as total FROM videos WHERE status = "completed"'
        );
        
        const sessionCost = parseFloat(rows[0].total || 0);
        res.json({ sessionCost });
    } catch (error) {
        console.error('❌ [GET /api/usage/session-cost] Error:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;

