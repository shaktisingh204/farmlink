
import * as admin from 'firebase-admin';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert(JSON.parse(serviceAccount!)),
            databaseURL: "https://shivamproject-288ca-default-rtdb.asia-southeast1.firebasedatabase.app/",
        });
    } catch (e) {
        console.error("Firebase admin initialization error", e);
    }
}


export const getFirebaseAdminApp = () => {
    if (!admin.apps.length) {
        throw new Error("Firebase admin app is not initialized");
    }
    return admin.app();
}

