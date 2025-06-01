import messaging from '@react-native-firebase/messaging';
import { EnvConfig } from '../config/envConfig';

export const SendMessageNotifications = async (
  registration_ids,
  notificationTitle,
  name,
  logo,
) => {
  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      const title = name || '';
      const body = notificationTitle || 'sends you a private message.';
      const image =
        logo ||
        'https://firebasestorage.googleapis.com/v0/b/proxero-app.appspot.com/o/default_profile_undraw_male_avatar_g98d%201.png?alt=media&token=5afbf7fe-4fc9-408e-8bdd-224c96362bec';

      const response = await fetch(`${EnvConfig.api.baseUrl}/notifications/send-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          registrationTokens: registration_ids,
          notificationTitle: body,
          name: title,
          logo: image,
        }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Response from backend:', result);
    }
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error; // Re-throw the error so it can be handled by the caller
  }
};
