import admin from 'firebase-admin';
import { config } from './index';

// Initialize Firebase Admin SDK
let firebaseApp: admin.app.App;

export const initializeFirebase = () => {
  try {
    if (!firebaseApp) {
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: config.firebase.projectId,
          privateKey: config.firebase.privateKey,
          clientEmail: config.firebase.clientEmail,
        }),
        databaseURL: config.firebase.databaseURL,
      });
    }
    console.log('Firebase initialized successfully');
    return firebaseApp;
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    throw error;
  }
};

/**
 * Send push notification to a user
 */
export const sendPushNotification = async (
  fcmToken: string,
  title: string,
  body: string,
  data?: Record<string, string>
): Promise<void> => {
  try {
    const message = {
      notification: {
        title,
        body,
      },
      data: data || {},
      token: fcmToken,
    };
    
    await admin.messaging().send(message);
    console.log('Notification sent successfully');
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};

export default firebaseApp;
