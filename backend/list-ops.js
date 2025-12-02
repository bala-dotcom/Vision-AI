import { GoogleAuth } from 'google-auth-library';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

async function listOperations() {
    const auth = new GoogleAuth({
        credentials: {
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        },
        scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });
    const client = await auth.getClient();
    const accessToken = (await client.getAccessToken()).token;

    const projectId = 'gen-lang-client-0308702958'; // User's project ID
    const location = 'us-central1';

    // Try the publisher endpoint
    const url = `https://us-central1-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/veo-3.1-fast-generate-001/operations`;

    console.log('Listing operations from:', url);

    try {
        const res = await fetch(url, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });

        if (res.status === 200) {
            const data = await res.json();
            console.log(`Found ${data.operations ? data.operations.length : 0} operations.`);

            if (data.operations) {
                // Check if any match our UUID format
                const veoOps = data.operations.filter(op => op.name.includes('veo') || op.name.length > 50);
                console.log('Potential Veo Operations:', JSON.stringify(veoOps, null, 2));

                // Print the first few to see format
                if (veoOps.length === 0 && data.operations.length > 0) {
                    console.log('First 3 operations:', JSON.stringify(data.operations.slice(0, 3), null, 2));
                }
            }
        } else {
            console.log('Error:', await res.text());
        }
    } catch (e) {
        console.log('Request failed:', e.message);
    }
}

listOperations();
