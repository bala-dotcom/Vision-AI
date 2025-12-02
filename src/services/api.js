// API service for database operations
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

/**
 * Get all videos from database
 * @param {string} date - Optional date filter ('all', 'today', 'yesterday', or specific date)
 * @returns {Promise<Array>} - Array of video objects
 */
export const getVideos = async (date = 'all') => {
    try {
        const url = date === 'all' 
            ? `${BACKEND_URL}/api/videos`
            : `${BACKEND_URL}/api/videos?date=${encodeURIComponent(date)}`;
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch videos: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching videos:', error);
        throw error;
    }
};

/**
 * Create a new video record in database
 * @param {Object} videoData - Video data object
 * @returns {Promise<Object>} - Created video object
 */
export const createVideo = async (videoData) => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/videos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: videoData.prompt,
                duration: videoData.duration,
                resolution: videoData.resolution,
                aspectRatio: videoData.aspectRatio || videoData.ratio,
                sound: videoData.sound,
                language: videoData.language,
                model: videoData.model,
                status: videoData.status || 'processing'
            })
        });
        
        if (!response.ok) {
            throw new Error(`Failed to create video: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error creating video:', error);
        throw error;
    }
};

/**
 * Update a video record in database
 * @param {number} id - Video ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} - Updated video object
 */
export const updateVideo = async (id, updates) => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/videos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updates)
        });
        
        if (!response.ok) {
            throw new Error(`Failed to update video: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error updating video:', error);
        throw error;
    }
};

/**
 * Get usage statistics
 * @param {string} date - Optional date filter
 * @returns {Promise<Object>} - Usage statistics object
 */
export const getUsageStats = async (date = 'all') => {
    try {
        const url = date === 'all'
            ? `${BACKEND_URL}/api/usage/stats`
            : `${BACKEND_URL}/api/usage/stats?date=${encodeURIComponent(date)}`;
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch usage stats: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching usage stats:', error);
        throw error;
    }
};

/**
 * Get session cost
 * @returns {Promise<number>} - Total session cost
 */
export const getSessionCost = async () => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/usage/session-cost`);
        if (!response.ok) {
            throw new Error(`Failed to fetch session cost: ${response.statusText}`);
        }
        const data = await response.json();
        return data.sessionCost || 0;
    } catch (error) {
        console.error('Error fetching session cost:', error);
        return 0; // Return 0 on error as fallback
    }
};

