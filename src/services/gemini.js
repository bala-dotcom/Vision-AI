// Google Gemini API Service for Veo Video Generation
// Using REST API directly since the SDK doesn't support video generation yet

/**
 * Generate a video using Google Gemini API with Veo 3.1 model
 * @param {string} apiKey - Google AI Studio API key
 * @param {string} prompt - Text prompt for video generation
 * @param {string|null} startImage - Base64 encoded start image (optional)
 * @param {string|null} endImage - Base64 encoded end image (optional)
 * @param {object} settings - Video generation settings
 * @returns {Promise<object>} - API response with video URL or operation ID
 */
export const generateVideo = async (apiKey, prompt, startImage = null, endImage = null, settings = {}) => {
    try {
        console.log('Starting Gemini API video generation...');

        // Gemini API endpoint for Veo
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/veo-3.1-generate-001:generateContent?key=${apiKey}`;

        // Build the request payload
        const parts = [{ text: prompt }];

        // Add images if provided
        if (startImage) {
            const base64Data = startImage.split(',')[1];
            const mimeType = startImage.split(';')[0].split(':')[1];
            parts.push({
                inlineData: {
                    mimeType: mimeType,
                    data: base64Data
                }
            });
        }

        if (endImage) {
            const base64Data = endImage.split(',')[1];
            const mimeType = endImage.split(';')[0].split(':')[1];
            parts.push({
                inlineData: {
                    mimeType: mimeType,
                    data: base64Data
                }
            });
        }

        const payload = {
            contents: [{
                parts: parts
            }]
            // Note: generationConfig parameters for video generation may not be supported yet
            // Keeping it simple for now
        };

        console.log('Sending request to Gemini API:', {
            endpoint: endpoint.replace(apiKey, 'API_KEY_HIDDEN'),
            payload: JSON.stringify(payload, null, 2)
        });

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const responseText = await response.text();
        console.log('Raw response:', responseText);

        if (!response.ok) {
            let errorData;
            try {
                errorData = JSON.parse(responseText);
            } catch (e) {
                errorData = { error: { message: responseText } };
            }
            console.error('Gemini API Error:', errorData);

            // User-friendly error messages
            const errorMessage = errorData.error?.message ||
                errorData.message ||
                `API Error: ${response.status} ${response.statusText}`;

            if (errorMessage.includes('API_KEY')) {
                throw new Error('Invalid API key. Please check your Google AI Studio API key.');
            }
            if (errorMessage.includes('quota')) {
                throw new Error('API quota exceeded. Please check your usage limits.');
            }
            if (errorMessage.includes('not found') || errorMessage.includes('404')) {
                throw new Error('Veo model not available. It may not be enabled for your API key yet.');
            }

            throw new Error(errorMessage);
        }

        const result = JSON.parse(responseText);
        console.log('Gemini API Response:', result);

        // Extract video from response
        // The response format may vary, check for different possible structures
        const candidate = result.candidates?.[0];
        const content = candidate?.content;
        const responseParts = content?.parts;

        if (responseParts && responseParts.length > 0) {
            // Look for video data in parts
            for (const part of responseParts) {
                if (part.videoUri || part.fileData?.fileUri) {
                    return {
                        url: part.videoUri || part.fileData.fileUri,
                        status: 'completed'
                    };
                }
            }
        }

        // Check if it's a long-running operation
        if (result.name || result.metadata?.operationName) {
            return {
                id: result.name || result.metadata.operationName,
                status: 'processing'
            };
        }

        console.warn('Unexpected response format:', result);
        throw new Error('Unexpected API response format. The Veo model may not be available yet. Check console for details.');

    } catch (error) {
        console.error('Error generating video with Gemini API:', error);
        throw error;
    }
};

/**
 * Check the status of a long-running video generation operation
 * @param {string} apiKey - Google AI Studio API key
 * @param {string} operationName - Operation name from initial request
 * @returns {Promise<object>} - Operation status
 */
export const checkGenerationStatus = async (apiKey, operationName) => {
    try {
        console.log('Checking operation status:', operationName);

        // Operation status endpoint
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/${operationName}?key=${apiKey}`;

        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            throw new Error(errorData.error?.message || 'Failed to check operation status');
        }

        const operation = await response.json();
        console.log('Operation status:', operation);

        // Check if operation is complete
        if (operation.done) {
            if (operation.error) {
                throw new Error(operation.error.message || 'Operation failed');
            }

            // Extract video URL from response
            const videoUri = operation.response?.videoUri || operation.response?.fileData?.fileUri;

            return {
                status: 'completed',
                url: videoUri
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
