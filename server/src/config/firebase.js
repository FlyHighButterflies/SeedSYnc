import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

if (!serviceAccountPath) {
  console.error('FIREBASE_SERVICE_ACCOUNT_PATH environment variable is not set.');
  console.error('Firebase Admin SDK will not be initialized.');
} else {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('Firebase Admin SDK initialized successfully.');
  } catch (error) {
    console.error('Error initializing Firebase Admin SDK:', error);
    console.error('Please ensure FIREBASE_SERVICE_ACCOUNT_JSON is a valid JSON string.');
  }
}

export default admin;
