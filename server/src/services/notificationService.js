import admin from '../config/firebase.js';
import Account from '../models/AccountModel.js';

const sendPushNotification = async (userId, title, body, data = {}) => {
  try {
    const user = await Account.findById(userId);

    if (!user || !user.fcmToken) {
      console.log(`No FCM token found for user ${userId}. Skipping push notification.`);
      return;
    }

    const message = {
      notification: {
        title,
        body,
      },
      data: {
        ...data,
        userId: userId.toString(), // Ensure userId is always in data
        userType: user.role, // Include userType in data
      },
      token: user.fcmToken,
    };

    const response = await admin.messaging().send(message);
    console.log('Successfully sent message:', response);
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
};

export { sendPushNotification };
