import { Storage } from '@google-cloud/storage';
import dotenv from 'dotenv';
dotenv.config();

async function createBucket() {
    const storage = new Storage({
        credentials: {
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        },
        projectId: process.env.GOOGLE_PROJECT_ID
    });

    const bucketName = `vision-ai-output-${Date.now()}`;

    try {
        console.log(`Attempting to create bucket: ${bucketName}`);
        const [bucket] = await storage.createBucket(bucketName, {
            location: 'US-CENTRAL1',
            storageClass: 'STANDARD',
        });
        console.log(`SUCCESS! Created bucket: ${bucket.name}`);
        console.log('You can use this bucket for Veo output.');
    } catch (err) {
        console.error('Error creating bucket:', err.message);
    }
}

createBucket();
