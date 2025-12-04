import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { GoogleAuth } from 'google-auth-library';
import { testConnection, initializeDatabase } from './database/db.js';
import videoRoutes from './routes/videos.js';
import usageRoutes from './routes/usage.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for frontend
const corsOptions = {
    origin: process.env.FRONTEND_URL || '*', // In production, set FRONTEND_URL to your domain
    credentials: true
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));

// Initialize Google Auth with service account credentials
let googleAuth = null;
let cachedAccessToken = null;
let tokenExpiry = null;

// Initialize Google Auth if credentials are provided
if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
    googleAuth = new GoogleAuth({
        credentials: {
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        },
        scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    });
    console.log('✅ Google Auth initialized with service account');
} else {
    console.log('⚠️  No service account credentials found in .env - will use access token from requests');
}

/**
 * Get a valid access token (cached or fresh)
 */
async function getAccessToken() {
    // If we have a cached token that's still valid, use it
    if (cachedAccessToken && tokenExpiry && Date.now() < tokenExpiry) {
        return cachedAccessToken;
    }

    // Generate a new token
    if (googleAuth) {
        const client = await googleAuth.getClient();
        const tokenResponse = await client.getAccessToken();
        cachedAccessToken = tokenResponse.token;
        // Tokens typically expire in 1 hour, we'll refresh 5 minutes early
        tokenExpiry = Date.now() + (55 * 60 * 1000);
        console.log('🔑 Generated new access token (expires in ~55 minutes)');
        return cachedAccessToken;
    }

    return null;
}



// Proxy endpoint for Vertex AI video generation (Google Veo 3.1)
app.post('/api/vertex-generate-video', async (req, res) => {
    try {
        const { accessToken: clientAccessToken, projectId, prompt, startImage, endImage, settings, modelId } = req.body;

        console.log('========================================');
        console.log('🚀 [GENERATE] New video generation request');
        console.log('========================================');

        // Use service account token if available, otherwise use token from request
        const accessToken = await getAccessToken() || clientAccessToken;

        if (!accessToken) {
            console.log('❌ [GENERATE] No authentication available');
            return res.status(401).json({
                error: 'No authentication available. Please configure service account in .env or provide access token.'
            });
        }

        if (!projectId) {
            console.log('❌ [GENERATE] Missing project ID');
            return res.status(400).json({ error: 'Project ID is required' });
        }

        console.log('📋 [GENERATE] Request Details:');
        console.log('   - Project ID:', projectId);
        console.log('   - Model ID:', modelId);
        console.log('   - Prompt:', prompt?.substring(0, 100) + (prompt?.length > 100 ? '...' : ''));
        console.log('   - Start Image:', startImage ? 'Yes' : 'No');
        console.log('   - End Image:', endImage ? 'Yes' : 'No');
        console.log('   - Settings:', JSON.stringify(settings));
        console.log('   - Auth method:', googleAuth ? 'Service Account' : 'Client Token');

        const location = 'us-central1';
        // Use preview model which supports fetchPredictOperation
        const selectedModel = modelId || 'veo-3.1-generate-preview';
        const endpoint = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${selectedModel}:predictLongRunning`;

        console.log('🌐 [GENERATE] Calling Vertex AI endpoint:', endpoint);

        // Build payload with correct Veo API structure
        // Parameters must be at root level, not inside instances
        const durationSeconds = parseInt(settings.duration) || 4;
        const aspectRatio = settings.aspectRatio || '16:9';
        const generateAudio = settings.sound || false;
        const language = settings.language || 'en';
        
        // Language mapping to full names
        const languageMap = {
            'ta': 'Tamil',
            'tu': 'Telugu',
            'kn': 'Kannada',
            'ml': 'Malayalam',
            'bn': 'Bengali',
            'mr': 'Marathi',
            'hi': 'Hindi',
            'en': 'English'
        };
        
        const languageName = languageMap[language] || 'English';
        
        // Modify prompt to include strong language instruction
        // This ensures the video output is in the selected language regardless of prompt language
        let languagePrompt = prompt;
        if (language !== 'en') {
            // Strong, explicit language instruction at the beginning
            languagePrompt = `IMPORTANT: Generate this video entirely in ${languageName} language. All dialogue, narration, text, and audio must be in ${languageName}. ${prompt}`;
            
            // Also add language instruction at the end for reinforcement
            languagePrompt = `${languagePrompt} Remember: Everything in this video must be in ${languageName} language.`;
        }
        
        console.log('📐 [GENERATE] Video Settings:');
        console.log('   - Aspect Ratio:', aspectRatio);
        console.log('   - Duration:', durationSeconds, 'seconds');
        console.log('   - Generate Audio:', generateAudio);
        console.log('   - Language:', languageName, `(${language})`);
        console.log('📝 [GENERATE] Original Prompt:', prompt?.substring(0, 150));
        console.log('📝 [GENERATE] Language-Modified Prompt:', languagePrompt?.substring(0, 200));

        const payload = {
            instances: [{
                prompt: languagePrompt
            }],
            parameters: {
                aspectRatio: aspectRatio,
                durationSeconds: durationSeconds,
                generateAudio: generateAudio,
                sampleCount: 1,
                // Try adding language parameter if supported by Veo API
                language: language !== 'en' ? language : undefined
            }
        };
        
        // Remove undefined parameters to keep payload clean
        Object.keys(payload.parameters).forEach(key => {
            if (payload.parameters[key] === undefined) {
                delete payload.parameters[key];
            }
        });

        // Add image for image-to-video generation
        if (startImage) {
            // Extract base64 data and mime type from data URL
            // Format: data:image/jpeg;base64,/9j/4AAQ...
            let base64Data = startImage;
            let mimeType = 'image/jpeg'; // default
            
            if (startImage.includes(',')) {
                const parts = startImage.split(',');
                base64Data = parts[1];
                
                // Extract mime type from data URL header
                // e.g., "data:image/png;base64" -> "image/png"
                const header = parts[0];
                const mimeMatch = header.match(/data:([^;]+);/);
                if (mimeMatch) {
                    mimeType = mimeMatch[1];
                }
            }
            
            payload.instances[0].image = {
                bytesBase64Encoded: base64Data,
                mimeType: mimeType
            };
            console.log('🖼️ [GENERATE] Start image attached:');
            console.log('   - MIME Type:', mimeType);
            console.log('   - Data length:', base64Data.length, 'chars');
        }

        console.log('📦 [GENERATE] Payload structure:', JSON.stringify({
            instances: [{ prompt: prompt.substring(0, 50) + '...', image: startImage ? '[IMAGE DATA]' : undefined }],
            parameters: payload.parameters
        }, null, 2));
        
        console.log('📤 [GENERATE] Sending request to Vertex AI...');

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        console.log('📡 [GENERATE] Response Status:', response.status);

        // Get the raw text first
        const responseText = await response.text();
        console.log('📦 [GENERATE] Raw Response (first 500 chars):', responseText.substring(0, 500));

        if (!response.ok) {
            // Try to parse as JSON, otherwise return text
            let errorData;
            try {
                errorData = JSON.parse(responseText);
            } catch (e) {
                errorData = { error: responseText };
            }
            console.error('❌ [GENERATE] Vertex AI Error:', JSON.stringify(errorData, null, 2));
            
            // Extract detailed error message
            let errorMessage = 'Unknown error';
            if (errorData.error) {
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
                errorMessage = responseText.substring(0, 500);
            }
            
            // Provide helpful context for common errors
            if (response.status === 403) {
                errorMessage = `403 Forbidden: ${errorMessage}. This usually means:\n` +
                    `1. Vertex AI API is not enabled for project: ${projectId}\n` +
                    `2. Service account lacks 'Vertex AI User' role\n` +
                    `3. Veo model may not be available in your region\n` +
                    `4. Check IAM permissions in Google Cloud Console`;
            } else if (response.status === 404) {
                errorMessage = `404 Not Found: ${errorMessage}. Check that:\n` +
                    `- Project ID is correct: ${projectId}\n` +
                    `- Model ID is correct: ${selectedModel}\n` +
                    `- Veo API is enabled for your project`;
            }
            
            return res.status(response.status).json({
                error: errorMessage,
                status: response.status,
                details: errorData
            });
        }

        // Parse successful response
        const data = JSON.parse(responseText);
        console.log('✅ [GENERATE] Video generation started!');
        console.log('📋 [GENERATE] Operation Name:', data.name);
        console.log('========================================');

        res.json(data);

    } catch (error) {
        console.error('========================================');
        console.error('❌ [GENERATE] CRITICAL ERROR:', error.message);
        console.error('📋 [GENERATE] Stack:', error.stack);
        console.error('========================================');
        res.status(500).json({ error: error.message });
    }
});

// Proxy endpoint for checking Vertex AI operation status
app.post('/api/vertex-video-status', async (req, res) => {
    try {
        const { accessToken: clientAccessToken, operationName } = req.body;

        console.log('========================================');
        console.log('🔍 [STATUS] Checking operation status');
        console.log('📋 [STATUS] Operation:', operationName);

        // Use service account token if available, otherwise use token from request
        const accessToken = await getAccessToken() || clientAccessToken;

        if (!accessToken) {
            console.log('❌ [STATUS] No authentication available');
            return res.status(401).json({
                error: 'No authentication available. Please configure service account in .env or provide access token.'
            });
        }

        // Extract location from operation name
        const locationMatch = operationName.match(/locations\/([^\/]+)\//);
        const location = locationMatch ? locationMatch[1] : 'us-central1';

        // Use the full operation name as-is - Vertex AI returns the complete path
        // Format: projects/.../locations/.../publishers/google/models/.../operations/UUID
        // API endpoint needs /v1/ prefix before the operation path
        const statusEndpoint = `https://${location}-aiplatform.googleapis.com/v1/${operationName}`;

        console.log('🌐 [STATUS] Endpoint:', statusEndpoint);

        const response = await fetch(statusEndpoint, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            }
        });

        console.log('📡 [STATUS] Response status:', response.status);

        // Get the raw text first
        const responseText = await response.text();
        console.log('📦 [STATUS] Response (first 300 chars):', responseText.substring(0, 300));

        if (!response.ok) {
            // Try to parse as JSON, otherwise return text
            let errorData;
            try {
                errorData = JSON.parse(responseText);
            } catch (e) {
                errorData = { error: responseText };
            }
            console.error('❌ [STATUS] Vertex AI Status Error:', errorData);
            return res.status(response.status).json(errorData);
        }

        // Parse successful response
        const data = JSON.parse(responseText);

        // Check if operation is complete
        if (data.done === true) {
            console.log('✅ [STATUS] Operation complete! Fetching video...');

            // Fetch the video and upload to GCS
            try {
                const backendUrl = process.env.BACKEND_URL || `http://localhost:${PORT}`;
                const fetchResponse = await fetch(`${backendUrl}/api/fetch-video`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ operationName })
                });

                if (fetchResponse.ok) {
                    const videoData = await fetchResponse.json();
                    console.log('🎉 [STATUS] Video fetched successfully!');
                    return res.json({
                        ...data,
                        videoReady: true,
                        videoUrl: videoData.url,
                        filename: videoData.filename
                    });
                } else {
                    const errorText = await fetchResponse.text();
                    console.error('❌ [STATUS] Failed to fetch video:', errorText);
                    return res.json({ ...data, videoReady: false, fetchError: errorText });
                }
            } catch (fetchError) {
                console.error('❌ [STATUS] Error fetching video:', fetchError.message);
                return res.json({ ...data, videoReady: false, fetchError: fetchError.message });
            }
        }

        // Operation still running
        console.log('⏳ [STATUS] Operation still running...');
        console.log('========================================');
        res.json(data);

    } catch (error) {
        console.error('========================================');
        console.error('❌ [STATUS] CRITICAL ERROR:', error.message);
        console.error('📋 [STATUS] Stack:', error.stack);
        console.error('========================================');
        res.status(500).json({ error: error.message });
    }
});

// New endpoint to fetch completed video and upload to GCS
app.post('/api/fetch-video', async (req, res) => {
    try {
        const { operationName } = req.body;

        if (!operationName) {
            console.log('❌ [FETCH] Missing operation name in request');
            return res.status(400).json({ error: 'Operation name is required' });
        }

        console.log('========================================');
        console.log('🎬 [FETCH] Starting video fetch process');
        console.log('📋 [FETCH] Operation Name:', operationName);

        // Extract model and project ID from operation name
        // Format: projects/{project}/locations/{location}/publishers/google/models/{model}/operations/{id}
        const modelMatch = operationName.match(/models\/([^\/]+)\/operations/);
        const projectMatch = operationName.match(/projects\/([^\/]+)\//);
        const locationMatch = operationName.match(/locations\/([^\/]+)\//);

        const model = modelMatch ? modelMatch[1] : 'veo-3.1-generate-preview';
        const projectId = projectMatch ? projectMatch[1] : process.env.GOOGLE_PROJECT_ID;
        const location = locationMatch ? locationMatch[1] : 'us-central1';

        console.log('🔍 [FETCH] Extracted from operation name:');
        console.log('   - Project ID:', projectId);
        console.log('   - Location:', location);
        console.log('   - Model:', model);

        // Get access token
        const accessToken = await getAccessToken();
        if (!accessToken) {
            console.log('❌ [FETCH] No access token available');
            return res.status(401).json({ error: 'No authentication available' });
        }
        console.log('✅ [FETCH] Access token obtained');

        // NOTE: Veo models don't support GET operation status endpoint (returns 404)
        // We must call fetchPredictOperation directly - it returns video if ready, or indicates still processing
        const fetchEndpoint = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${model}:fetchPredictOperation`;

        console.log('🌐 [FETCH] Calling fetchPredictOperation:', fetchEndpoint);

        const response = await fetch(fetchEndpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ operationName })
        });

        console.log('📡 [FETCH] Fetch response status:', response.status);

        const responseText = await response.text();
        console.log('📦 [FETCH] Raw response (first 1000 chars):', responseText.substring(0, 1000));

        if (!response.ok) {
            console.log('❌ [FETCH] Fetch API Error:', responseText.substring(0, 500));
            
            // Parse error to give better feedback
            let errorMessage = responseText;
            let errorCode = response.status;
            try {
                const errorJson = JSON.parse(responseText);
                errorMessage = errorJson.error?.message || errorJson.message || responseText;
                errorCode = errorJson.error?.code || response.status;
            } catch (e) {}
            
            // Check if this is a "still processing" type error
            const lowerError = errorMessage.toLowerCase();
            if (lowerError.includes('not done') || 
                lowerError.includes('not ready') || 
                lowerError.includes('still running') ||
                lowerError.includes('in progress') ||
                errorCode === 400) {
                console.log('⏳ [FETCH] Video still generating (API indicated not ready)');
                return res.json({ 
                    status: 'processing',
                    message: 'Video still being generated, please wait...'
                });
            }
            
            return res.json({ 
                status: 'error',
                error: errorMessage,
                details: `fetchPredictOperation returned ${response.status}`
            });
        }

        const data = JSON.parse(responseText);
        console.log('📦 [FETCH] Response received, keys:', Object.keys(data));
        console.log('📦 [FETCH] Full response:', JSON.stringify(data, null, 2).substring(0, 1500));
        
        // Check if operation indicates it's still running
        if (data.done === false) {
            console.log('⏳ [FETCH] Operation not done yet (done: false)');
            return res.json({ 
                status: 'processing',
                message: 'Video generation in progress...'
            });
        }
        
        // Check for error in response
        if (data.error) {
            console.log('❌ [FETCH] Operation returned error:', data.error);
            return res.json({ 
                status: 'error',
                error: data.error.message || JSON.stringify(data.error)
            });
        }

        // Try multiple possible response structures
        let base64Video = null;
        
        // Structure 1: data.response.videos[0].bytesBase64Encoded (ACTUAL VEO FORMAT!)
        if (data.response?.videos?.[0]?.bytesBase64Encoded) {
            base64Video = data.response.videos[0].bytesBase64Encoded;
            console.log('✅ [FETCH] Found video in response.videos[0].bytesBase64Encoded');
        }
        // Structure 2: data.videos[0].bytesBase64Encoded
        else if (data.videos?.[0]?.bytesBase64Encoded) {
            base64Video = data.videos[0].bytesBase64Encoded;
            console.log('✅ [FETCH] Found video in videos[0].bytesBase64Encoded');
        }
        // Structure 3: data.predictions[0].bytesBase64Encoded
        else if (data.predictions?.[0]?.bytesBase64Encoded) {
            base64Video = data.predictions[0].bytesBase64Encoded;
            console.log('✅ [FETCH] Found video in predictions[0].bytesBase64Encoded');
        }
        // Structure 4: data.response.predictions[0].bytesBase64Encoded
        else if (data.response?.predictions?.[0]?.bytesBase64Encoded) {
            base64Video = data.response.predictions[0].bytesBase64Encoded;
            console.log('✅ [FETCH] Found video in response.predictions[0].bytesBase64Encoded');
        }
        // Structure 5: data.generatedSamples[0].video.bytesBase64Encoded
        else if (data.generatedSamples?.[0]?.video?.bytesBase64Encoded) {
            base64Video = data.generatedSamples[0].video.bytesBase64Encoded;
            console.log('✅ [FETCH] Found video in generatedSamples[0].video.bytesBase64Encoded');
        }
        // Structure 6: data.response.generatedSamples
        else if (data.response?.generatedSamples?.[0]?.video?.bytesBase64Encoded) {
            base64Video = data.response.generatedSamples[0].video.bytesBase64Encoded;
            console.log('✅ [FETCH] Found video in response.generatedSamples[0].video.bytesBase64Encoded');
        }
        // Structure 7: Direct video in response field
        else if (data.response?.video?.bytesBase64Encoded) {
            base64Video = data.response.video.bytesBase64Encoded;
            console.log('✅ [FETCH] Found video in response.video.bytesBase64Encoded');
        }
        // Structure 8: video directly in data
        else if (data.video?.bytesBase64Encoded) {
            base64Video = data.video.bytesBase64Encoded;
            console.log('✅ [FETCH] Found video in video.bytesBase64Encoded');
        }

        if (!base64Video) {
            console.log('⏳ [FETCH] No video data in response yet - still processing');
            console.log('📋 [FETCH] Response keys:', Object.keys(data));
            
            // If we have metadata, the operation might still be running
            if (data.metadata || data.name) {
                return res.json({ 
                    status: 'processing', 
                    message: 'Video generation in progress, waiting for completion...',
                    responseKeys: Object.keys(data)
                });
            }
            
            // If response is empty or unexpected, treat as still processing
            return res.json({ 
                status: 'processing', 
                message: 'Waiting for video data...',
                responseKeys: Object.keys(data)
            });
        }

        // Decode base64 video
        console.log('🎥 [FETCH] Decoding base64 video data...');
        const videoBuffer = Buffer.from(base64Video, 'base64');
        const videoSizeMB = (videoBuffer.length / 1024 / 1024).toFixed(2);
        console.log(`📊 [FETCH] Video size: ${videoSizeMB} MB`);

        // Try to upload to GCS, but fall back to data URL if it fails
        let videoUrl = null;
        let filename = null;

        try {
            console.log('☁️ [FETCH] Attempting GCS upload...');
            const { Storage } = await import('@google-cloud/storage');
            const storage = new Storage({
                credentials: {
                    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
                },
                projectId: process.env.GOOGLE_PROJECT_ID
            });

            const bucketName = 'vision-ai-videos-outputs';
            filename = `video-${Date.now()}.mp4`;
            const bucket = storage.bucket(bucketName);
            const file = bucket.file(filename);

            console.log(`📤 [FETCH] Uploading to GCS bucket: ${bucketName}`);
            console.log(`📄 [FETCH] Filename: ${filename}`);

            // Upload the video
            await file.save(videoBuffer, {
                metadata: {
                    contentType: 'video/mp4',
                },
            });

            console.log('✅ [FETCH] GCS Upload complete!');

            // Generate signed URL (valid for 7 days)
            const [signedUrl] = await file.getSignedUrl({
                version: 'v4',
                action: 'read',
                expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
            });

            videoUrl = signedUrl;
            console.log('🔗 [FETCH] Signed URL generated (valid 7 days)');

        } catch (gcsError) {
            console.log('⚠️ [FETCH] GCS upload failed:', gcsError.message);
            console.log('📦 [FETCH] Falling back to base64 data URL...');
            
            // Fall back to returning video as data URL
            videoUrl = `data:video/mp4;base64,${base64Video}`;
            filename = `video-${Date.now()}.mp4`;
            console.log('✅ [FETCH] Data URL created (video embedded in response)');
        }

        console.log('========================================');
        console.log('🎉 [FETCH] SUCCESS! Video ready for playback');
        console.log('========================================');

        res.json({
            status: 'completed',
            url: videoUrl,
            filename: filename
        });

    } catch (error) {
        console.error('========================================');
        console.error('❌ [FETCH] CRITICAL ERROR:', error.message);
        console.error('📋 [FETCH] Stack:', error.stack);
        console.error('========================================');
        res.status(500).json({ 
            status: 'error',
            error: error.message,
            details: 'Server-side error during video fetch'
        });
    }
});


// New endpoint to check if video is ready in GCS
app.post('/api/check-video-status', async (req, res) => {
    try {
        const { filename } = req.body;

        console.log('🔍 [GCS-CHECK] Checking video status for:', filename);

        if (!filename) {
            console.log('❌ [GCS-CHECK] Missing filename');
            return res.status(400).json({ error: 'Filename is required' });
        }

        const { Storage } = await import('@google-cloud/storage');
        const storage = new Storage({
            credentials: {
                client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            },
            projectId: process.env.GOOGLE_PROJECT_ID
        });

        const bucketName = 'vision-ai-videos-outputs';
        const bucket = storage.bucket(bucketName);
        const file = bucket.file(filename);

        try {
            // Check if file exists
            const [exists] = await file.exists();
            console.log(`📦 [GCS-CHECK] File exists: ${exists}`);

            if (exists) {
                // Generate a signed URL valid for 1 hour
                const [signedUrl] = await file.getSignedUrl({
                    version: 'v4',
                    action: 'read',
                    expires: Date.now() + 60 * 60 * 1000, // 1 hour
                });

                console.log('✅ [GCS-CHECK] Video ready, signed URL generated');
                res.json({
                    status: 'completed',
                    url: signedUrl
                });
            } else {
                console.log('⏳ [GCS-CHECK] Video not found, still processing');
                res.json({
                    status: 'processing'
                });
            }
        } catch (gcsError) {
            // If we get a 403 or any GCS error, treat it as "not ready yet"
            console.log('⚠️ [GCS-CHECK] GCS error (file not ready):', gcsError.message);
            res.json({
                status: 'processing'
            });
        }

    } catch (error) {
        console.error('❌ [GCS-CHECK] Critical error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Database routes
app.use('/api/videos', videoRoutes);
app.use('/api/usage', usageRoutes);

// Initialize database and start server
async function startServer() {
    // Test database connection
    const dbConnected = await testConnection();
    if (dbConnected) {
        // Initialize database tables
        await initializeDatabase();
    } else {
        console.log('⚠️  Database connection failed - some features may not work');
    }
    
    app.listen(PORT, () => {
        console.log(`Backend proxy server running on port ${PORT}`);
        if (process.env.NODE_ENV !== 'production') {
            console.log(`Local URL: http://localhost:${PORT}`);
        }
    });
}

startServer();
