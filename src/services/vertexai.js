// Google Vertex AI Service for Veo 3.1 Video Generation

// Use environment variable for backend URL, fallback to localhost for development
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

/**
 * Base pricing per second (USD) for Veo 3.1 models
 * Note: These are estimates based on typical AI video generation patterns.
 * Official Google Cloud pricing should be verified and updated when available.
 */
export const PRICING = {
    'veo-3.1-generate-preview': 0.15,  // Preview model (lower cost)
    'veo-3.1-fast-generate-001': 0.15, // Fast model (legacy, same as preview)
    'veo-3.1-generate-001': 0.40       // Standard model (higher quality)
};

/**
 * Resolution multipliers - higher resolution = more processing cost
 */
export const RESOLUTION_MULTIPLIERS = {
    '720p': 1.0,
    '1080p': 1.5,
    '4k': 2.5
};

/**
 * Sound generation multiplier - audio adds processing overhead
 */
export const SOUND_MULTIPLIER = 1.25; // 25% additional cost for audio

/**
 * Estimate the cost of a video generation with all parameters
 * @param {string} modelId - The model ID (e.g., 'veo-3.1-generate-preview')
 * @param {string|number} duration - Duration in seconds (e.g., '4s', 4, or 8)
 * @param {string} resolution - Resolution (e.g., '720p', '1080p', '4k')
 * @param {string} aspectRatio - Aspect ratio (e.g., '16:9', '9:16')
 * @param {boolean} sound - Whether sound is enabled
 * @returns {string} - Estimated cost in USD formatted as "X.XX"
 */
export const estimateCost = (modelId, duration, resolution = '720p', aspectRatio = '16:9', sound = false) => {
    // Parse duration - handle '4s' format or direct number
    const durationSeconds = typeof duration === 'string' 
        ? parseInt(duration.toString().replace('s', '')) || 4
        : parseInt(duration) || 4;
    
    // Get base price per second for the model
    const basePricePerSecond = PRICING[modelId] || PRICING['veo-3.1-generate-preview'];
    
    // Calculate base cost
    let cost = basePricePerSecond * durationSeconds;
    
    // Apply resolution multiplier
    const resolutionMultiplier = RESOLUTION_MULTIPLIERS[resolution] || RESOLUTION_MULTIPLIERS['720p'];
    cost = cost * resolutionMultiplier;
    
    // Apply sound multiplier if enabled
    if (sound) {
        cost = cost * SOUND_MULTIPLIER;
    }
    
    // Return formatted cost with 2 decimal places
    return cost.toFixed(2);
};

/**
 * Generate a video using Google Vertex AI Veo 3.1
 * @param {string} accessToken - Google OAuth2 access token
 * @param {string} projectId - Google Cloud project ID
 * @param {string} prompt - Text prompt for video generation
 * @param {string|null} startImage - Base64 encoded start image (optional)
 * @param {string|null} endImage - Base64 encoded end image (optional)
 * @param {object} settings - Video generation settings
 * @param {string} modelId - Vertex AI model ID (e.g., 'veo-3.1-fast-generate-001')
 * @returns {Promise<object>} - API response with video URL or operation ID
 */
export const generateVideo = async (accessToken, projectId, prompt, startImage = null, endImage = null, settings = {}, modelId = 'veo-3.1-fast-generate-001') => {
    try {
        console.log(`Starting Vertex AI video generation with model: ${modelId}...`);
        
        // Parse duration - remove 's' suffix if present
        const durationValue = settings.duration ? parseInt(settings.duration.toString().replace('s', '')) : 4;
        
        const requestSettings = {
            aspectRatio: settings.aspectRatio || '16:9',
            duration: durationValue,
            sound: settings.sound || false
        };
        
        console.log('📐 [FRONTEND] Sending settings:', requestSettings);
        console.log('   - Aspect Ratio:', requestSettings.aspectRatio);
        console.log('   - Duration:', requestSettings.duration, 'seconds');
        console.log('   - Sound:', requestSettings.sound);

        const response = await fetch(`${BACKEND_URL}/api/vertex-generate-video`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                accessToken,
                projectId,
                prompt,
                startImage,
                endImage,
                modelId,
                settings: requestSettings
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            console.error('Vertex AI API Error:', errorData);
            
            // Extract error message properly
            let errorMessage = 'Unknown error';
            if (typeof errorData === 'string') {
                errorMessage = errorData;
            } else if (errorData.error) {
                if (typeof errorData.error === 'string') {
                    errorMessage = errorData.error;
                } else if (errorData.error.message) {
                    errorMessage = errorData.error.message;
                } else {
                    errorMessage = JSON.stringify(errorData.error);
                }
            } else if (errorData.message) {
                errorMessage = errorData.message;
            } else {
                errorMessage = JSON.stringify(errorData);
            }
            
            // Add status code context for 403 errors
            if (response.status === 403) {
                errorMessage = `403 Forbidden: ${errorMessage}. Check that:\n- Vertex AI API is enabled for your project\n- Service account has 'Vertex AI User' role\n- Veo model is available in your region`;
            }
            
            throw new Error(errorMessage);
        }

        const result = await response.json();
        console.log('Vertex AI API Response:', result);

        // Handle response
        if (result.name) {
            return {
                name: result.name,
                status: 'processing'
            };
        } else if (result.videoUrl) {
            return {
                url: result.videoUrl,
                status: 'completed'
            };
        }

        throw new Error('Unexpected API response format');

    } catch (error) {
        console.error('Error generating video with Vertex AI:', error);
        throw error;
    }
};

/**
 * Check the status of a long-running video generation operation
 * @param {string} accessToken - Google OAuth2 access token
 * @param {string} operationName - Operation name from initial request
 * @returns {Promise<object>} - Operation status
 */
export const checkGenerationStatus = async (accessToken, operationName) => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/vertex-video-status`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                accessToken,
                operationName
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            throw new Error(errorData.error || errorData.message || 'Failed to check operation status');
        }

        const result = await response.json();

        if (result.done) {
            if (result.error) {
                throw new Error(result.error.message || 'Generation failed');
            }

            return {
                status: 'completed',
                url: result.response?.videoUrl || result.response?.generatedSamples?.[0]?.video?.uri
            };
        }

        return {
            status: 'processing'
        };

    } catch (error) {
        console.error('Error checking operation status:', error);
        throw error;
    }
};
