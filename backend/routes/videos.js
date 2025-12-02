// Video CRUD routes
import express from 'express';
import { getPool } from '../database/db.js';

const router = express.Router();

// Get all videos (with optional date filter)
router.get('/', async (req, res) => {
    try {
        const { date } = req.query; // date filter: 'all', 'today', 'yesterday', or specific date
        const pool = getPool();
        
        let query = 'SELECT * FROM videos ORDER BY created_at DESC';
        let params = [];
        
        if (date && date !== 'all') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (date === 'today') {
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);
                query = 'SELECT * FROM videos WHERE created_at >= ? AND created_at < ? ORDER BY created_at DESC';
                params = [today, tomorrow];
            } else if (date === 'yesterday') {
                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);
                query = 'SELECT * FROM videos WHERE created_at >= ? AND created_at < ? ORDER BY created_at DESC';
                params = [yesterday, today];
            } else {
                // Specific date - parse and filter
                const targetDate = new Date(date);
                if (!isNaN(targetDate.getTime())) {
                    const startOfDay = new Date(targetDate);
                    startOfDay.setHours(0, 0, 0, 0);
                    const endOfDay = new Date(targetDate);
                    endOfDay.setHours(23, 59, 59, 999);
                    query = 'SELECT * FROM videos WHERE created_at >= ? AND created_at <= ? ORDER BY created_at DESC';
                    params = [startOfDay, endOfDay];
                }
            }
        }
        
        const [rows] = await pool.execute(query, params);
        
        // Format response to match frontend expectations
        const videos = rows.map(row => ({
            id: row.id,
            url: row.video_url,
            thumbnail: row.thumbnail_url || row.video_url,
            prompt: row.prompt,
            duration: row.duration,
            resolution: row.resolution,
            ratio: row.aspect_ratio,
            sound: row.sound === 1 || row.sound === true,
            language: row.language,
            model: row.model,
            cost: parseFloat(row.cost_usd) || 0,
            status: row.status,
            date: formatDate(row.created_at)
        }));
        
        res.json(videos);
    } catch (error) {
        console.error('❌ [GET /api/videos] Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Create new video record
router.post('/', async (req, res) => {
    try {
        const {
            prompt,
            duration = '4s',
            resolution = '720p',
            aspectRatio = '16:9',
            sound = false,
            language = 'en',
            model = 'veo-3.1-generate-preview',
            status = 'processing'
        } = req.body;
        
        const pool = getPool();
        
        const [result] = await pool.execute(
            `INSERT INTO videos (prompt, duration, resolution, aspect_ratio, sound, language, model, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [prompt, duration, resolution, aspectRatio, sound ? 1 : 0, language, model, status]
        );
        
        const [rows] = await pool.execute('SELECT * FROM videos WHERE id = ?', [result.insertId]);
        
        const video = {
            id: rows[0].id,
            url: rows[0].video_url,
            thumbnail: rows[0].thumbnail_url || rows[0].video_url,
            prompt: rows[0].prompt,
            duration: rows[0].duration,
            resolution: rows[0].resolution,
            ratio: rows[0].aspect_ratio,
            sound: rows[0].sound === 1 || rows[0].sound === true,
            language: rows[0].language,
            model: rows[0].model,
            cost: parseFloat(rows[0].cost_usd) || 0,
            status: rows[0].status,
            date: formatDate(rows[0].created_at)
        };
        
        res.status(201).json(video);
    } catch (error) {
        console.error('❌ [POST /api/videos] Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update video record
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        const pool = getPool();
        
        // Build update query dynamically
        const updateFields = [];
        const updateValues = [];
        
        if (updates.video_url !== undefined) {
            updateFields.push('video_url = ?');
            updateValues.push(updates.video_url);
        }
        if (updates.thumbnail_url !== undefined) {
            updateFields.push('thumbnail_url = ?');
            updateValues.push(updates.thumbnail_url);
        }
        if (updates.status !== undefined) {
            updateFields.push('status = ?');
            updateValues.push(updates.status);
        }
        if (updates.cost !== undefined || updates.cost_usd !== undefined) {
            updateFields.push('cost_usd = ?');
            updateValues.push(updates.cost || updates.cost_usd);
        }
        
        if (updateFields.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }
        
        updateValues.push(id);
        
        await pool.execute(
            `UPDATE videos SET ${updateFields.join(', ')} WHERE id = ?`,
            updateValues
        );
        
        const [rows] = await pool.execute('SELECT * FROM videos WHERE id = ?', [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Video not found' });
        }
        
        const video = {
            id: rows[0].id,
            url: rows[0].video_url,
            thumbnail: rows[0].thumbnail_url || rows[0].video_url,
            prompt: rows[0].prompt,
            duration: rows[0].duration,
            resolution: rows[0].resolution,
            ratio: rows[0].aspect_ratio,
            sound: rows[0].sound === 1 || rows[0].sound === true,
            language: rows[0].language,
            model: rows[0].model,
            cost: parseFloat(rows[0].cost_usd) || 0,
            status: rows[0].status,
            date: formatDate(rows[0].created_at)
        };
        
        res.json(video);
    } catch (error) {
        console.error('❌ [PUT /api/videos/:id] Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Helper function to format date
function formatDate(date) {
    if (!date) return 'Unknown';
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Unknown';
    
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`;
    
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default router;

