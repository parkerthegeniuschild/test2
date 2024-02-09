import * as admin from 'firebase-admin';
import { Config } from 'sst/node/config';

let _initialized = false;
const _initialize = () => {
  if (!_initialized) {
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(Config.FIREBASE_ADMIN_KEY)),
    });
    _initialized = true;
  }
};

let _messaging: admin.messaging.Messaging | null = null;
const useMessaging = () => {
  if (!_messaging) {
    _initialize();
    _messaging = admin.messaging();
  }
  return _messaging;
};

export interface TSendNotification {
  title: string;
  body: string;
  imageUrl?: string;
}
export interface TSendPayload {
  data?: Record<string, string>;
  notification?: TSendNotification;
}
export const send = async (
  registrationToken: string,
  payload: TSendPayload
) => {
  return await useMessaging().send({ token: registrationToken, ...payload });
};

export default { send };
