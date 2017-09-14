import { Permissions, Notifications, Constants } from 'expo';
import jimmify from './jimmify';

async function getToken() {
  const { existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS)
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return;
  }

  return Notifications.getExpoPushTokenAsync();
}

export async function register(authToken) {
  const token = await getToken();
  console.log(`Got token: ${token}`);
  return jimmify.addPushToken({
    UUID: Constants.deviceId,
    token: authToken,
    expoID: token
  });
}

export async function unregister(authToken) {
  return jimmify.removePushToken({
    UUID: Constants.deviceId,
    token: authToken
  });
}