import admin from '../config/firebase.js';
import Farmer from '../models/FarmerModel.js';
import Buyer from '../models/BuyerModel.js';

const sendPushNotification = async (userId, userType, title, body, data = {}) => {
  try {
    let user = null;
    if (userType === 'Farmer') {
      user = await Farmer.findById(userId);
    } else if (userType === 'Buyer') {
      user = await Buyer.findById(userId);
    } else {
      console.error(`Invalid user type: ${userType}. Cannot send push notification.`);
      return;
    }

    if (!user || !user.fcmToken) {
      console.log(`No FCM token found for user ${userId} (${userType}). Skipping push notification.`);
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
        userType: userType, // Include userType in data
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