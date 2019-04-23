import { Firebase } from "../fcm";

type NotificationType = {
  registrationTokens: Array<string>;
  payload: object;
};

async function PushNotification(notifications: NotificationType) {
  if (
    notifications.registrationTokens &&
    notifications.registrationTokens.length
  ) {
    await Firebase.messaging().sendToDevice(
      notifications.registrationTokens,
      notifications.payload
    );
  }
}

export default PushNotification;
