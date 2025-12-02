import { GoogleAuth } from 'google-auth-library';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

async function checkStatus() {
    const auth = new GoogleAuth({
        credentials: {
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        },
        scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });
    const client = await auth.getClient();
    const accessToken = (await client.getAccessToken()).token;

    // The operation name from the user's screenshot/logs
    const operationName = 'projects/gen-lang-client-0308702958/locations/us-central1/publishers/google/models/veo-3.1-fast-generate-001/operations/6f904ac8-2ede-4a78-ac45-458551c4e418';

    // Extract parts
    const match = operationName.match(/projects\/([^\/]+)\/locations\/([^\/]+)\/.*\/operations\/([^\/]+)$/);
    const projectId = match[1];
    const location = match[2];
    const operationId = match[3];

    console.log('Project:', projectId);
    console.log('Location:', location);
    console.log('Operation ID:', operationId);

    const endpoints = [
        // Standard v1
        `https://us-central1-aiplatform.googleapis.com/v1/${operationName}`,
        // v1beta1
        `https://us-central1-aiplatform.googleapis.com/v1beta1/${operationName}`,
        // Without publisher/model path (standard operations)
        `https://us-central1-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/operations/${operationId}`,
        // v1beta1 without publisher/model
        `https://us-central1-aiplatform.googleapis.com/v1beta1/projects/${projectId}/locations/${location}/operations/${operationId}`
    ];

    for (const url of endpoints) {
        console.log('\nTrying:', url);
        try {
            const res = await fetch(url, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });
            console.log('Status:', res.status);
            if (res.status === 200) {
                const data = await res.json();
                console.log('SUCCESS! Response:', JSON.stringify(data, null, 2));
                break;
            } else {
                const text = await res.text();
                console.log('Error:', text.substring(0, 200));
            }
        } catch (e) {
            console.log('Request failed:', e.message);
        }
    }
}

checkStatus();
