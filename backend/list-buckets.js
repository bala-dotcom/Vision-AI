import { Storage } from '@google-cloud/storage';
import dotenv from 'dotenv';
dotenv.config();

async function listBuckets() {
    const storage = new Storage({
        credentials: {
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        },
        projectId: process.env.GOOGLE_PROJECT_ID
    });

    try {
        const [buckets] = await storage.getBuckets();
        console.log('Buckets:');
        buckets.forEach(bucket => {
            console.log(`- ${bucket.name}`);
        });

        if (buckets.length > 0) {
            console.log(`\nRecommended: Use '${buckets[0].name}' for video output.`);
        } else {
            console.log('\nNo buckets found. Please create one.');
        }
    } catch (err) {
        console.error('Error listing buckets:', err.message);
    }
}

listBuckets();
