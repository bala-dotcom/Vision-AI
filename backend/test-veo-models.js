import fetch from 'node-fetch';

// Test different Veo model IDs on Freepik API
const API_KEY = 'FPSX77233aaa4245b65734b907e98d83b28c';

const possibleModelIds = [
    // Veo variations
    'veo-3.1-fast',
    'veo-3-1-fast',
    'veo-3.1',
    'veo-3',
    'veo-2',
    'google-veo-3.1-fast',
    'google-veo-3-1-fast',
    'google-veo-3.1',
    'google-veo-3',
    'google-veo-2',
    'veo3-1-fast',
    'veo3-fast',
    'veo3',
    'veo2',
];

const testPayload = {
    prompt: "test video",
    duration: "5",
    image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
};

async function testModel(modelId, useImageToVideo = true) {
    try {
        let endpoint;
        let payload = { ...testPayload };

        if (useImageToVideo) {
            endpoint = `https://api.freepik.com/v1/ai/image-to-video/${modelId}`;
        } else {
            endpoint = 'https://api.freepik.com/v1/ai/text-to-video';
            payload.model = modelId;
        }

        console.log(`\nTesting: ${modelId} (${useImageToVideo ? 'image-to-video' : 'text-to-video'})`);
        console.log(`Endpoint: ${endpoint}`);

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-freepik-api-key': API_KEY
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
            console.log(`✅ SUCCESS! Model ID: ${modelId}`);
            console.log('Response:', JSON.stringify(data, null, 2));
            return { modelId, success: true, endpoint, data };
        } else {
            console.log(`❌ Failed: ${response.status} - ${data.message || 'Unknown error'}`);
            return { modelId, success: false, status: response.status, error: data.message };
        }
    } catch (error) {
        console.log(`❌ Error: ${error.message}`);
        return { modelId, success: false, error: error.message };
    }
}

async function runTests() {
    console.log('='.repeat(60));
    console.log('TESTING VEO MODEL IDS ON FREEPIK API');
    console.log('='.repeat(60));

    const results = [];

    // Test image-to-video endpoint
    console.log('\n📹 Testing IMAGE-TO-VIDEO endpoint...\n');
    for (const modelId of possibleModelIds) {
        const result = await testModel(modelId, true);
        results.push(result);
        await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms between requests
    }

    // Test text-to-video endpoint
    console.log('\n\n📝 Testing TEXT-TO-VIDEO endpoint...\n');
    for (const modelId of possibleModelIds) {
        const result = await testModel(modelId, false);
        results.push(result);
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('SUMMARY');
    console.log('='.repeat(60));

    const successful = results.filter(r => r.success);

    if (successful.length > 0) {
        console.log('\n✅ WORKING MODEL IDS:');
        successful.forEach(r => {
            console.log(`   - ${r.modelId} (${r.endpoint})`);
        });
    } else {
        console.log('\n❌ No working Veo model IDs found.');
        console.log('   Freepik API may not support Veo, or it requires different authentication.');
    }
}

runTests().catch(console.error);
