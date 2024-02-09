import * as admin from 'firebase-admin';
import TupLambdaHandler from 'handlers/TupLambdaHandler';
import { z } from 'zod';
import { Config } from 'sst/node/config';

const eventSchema = z.object({
  registrationToken: z.string().nonempty(),
  data: z.record(z.string().nonempty()).optional(),
  notification: z
    .object({
      title: z.string().nonempty(),
      body: z.string().nonempty(),
      imageUrl: z.string().nonempty().optional(),
    })
    .optional(),
});
type IEventSchema = z.infer<typeof eventSchema>;

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(Config.FIREBASE_ADMIN_KEY)),
});
const messaging = admin.messaging();

export const handler = TupLambdaHandler(async (e: IEventSchema) => {
  const { registrationToken, data, notification } = eventSchema.parse(e);

  const res = await messaging.send({
    token: registrationToken,
    data,
    notification,
  });

  return { messageId: res, registrationToken, data, notification };
});
