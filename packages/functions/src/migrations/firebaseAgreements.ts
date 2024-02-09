import * as admin from 'firebase-admin';
import { Config } from 'sst/node/config';
import { z } from 'zod';
import { notEmpty } from '@utils/typeGuards';
import { useDb } from 'db/dbClient';
import {
  NewLegalAgreement,
  legalAgreements,
  legalAgreementsRelations,
} from 'db/schema/legalAgreements';
import { eq } from 'drizzle-orm';
import logger from 'src/logger';
import TupLambdaHandler from 'handlers/TupLambdaHandler';
import { IdScalar } from '@utils/schema';

const FirebaseTimestamp = z.object({
  toDate: z.function().returns(z.date()),
});

const FirebaseAgreement = z.object({
  document: z.object({
    publishedAt: FirebaseTimestamp,
    title: z.string().nonempty(),
    type: z.string().nonempty(),
    revisionNo: IdScalar,
  }),
  providerId: z.string().nonempty(),
  location: z.object({ latitude: z.number(), longitude: z.number() }),
  legalDocumentId: z.string().nonempty(),
  device: z.object({
    ipAddress: z.string().nonempty(),
    systemVersion: z.string().nonempty(),
    systemName: z.string().nonempty(),
  }),
  acceptedAt: FirebaseTimestamp,
});

type FirebaseAgreement = z.infer<typeof FirebaseAgreement>;

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(Config.FIREBASE_ADMIN_KEY)),
  databaseURL: 'https://production-gettruckup.firebaseio.com',
});

const firestore = admin.firestore();

const db = useDb({ legalAgreements, legalAgreementsRelations });

export const handler = TupLambdaHandler(async () => {
  logger.info('Running migrations/firebaseAgreements...');

  const _agreements = await fetchAgreements();

  logger.info('Validating fetched agreements...');
  const agreements = _agreements
    .map((e) => (validateAgreement(e) ? e : null))
    .filter(notEmpty);

  logger.info(`Saving ${agreements.length} agreements to RDS...`);
  await saveAgreements(agreements);
  return agreements;
});

const fetchAgreements = async () => {
  const snapshot = await firestore.collection('agreements').get();
  const agreements = snapshot.docs.map((e) => e.data());
  return agreements;
};

// this throws on error
const validateAgreement = (
  data: Record<string, unknown>
): data is FirebaseAgreement => {
  FirebaseAgreement.parse(data);
  return true;
};

const saveAgreements = async (agreements: FirebaseAgreement[]) => {
  const formatted = agreements.map(formatAgreement);

  await Promise.all(
    formatted.map(async (e) => {
      const existing = await db
        .select()
        .from(legalAgreements)
        .where(eq(legalAgreements.legalDocumentId, e.legalDocumentId));
      if (!existing.length) {
        await db.insert(legalAgreements).values(e);
      }
    })
  );
};

const formatAgreement = (agreement: FirebaseAgreement): NewLegalAgreement => {
  const {
    acceptedAt,
    device: {
      ipAddress: deviceIpAddress,
      systemVersion: deviceSystemVersion,
      systemName: deviceSystemName,
    },
    document: {
      publishedAt: documentPublishedAt,
      title: documentTitle,
      revisionNo: documentRevisionNo,
      type: documentType,
    },
    legalDocumentId,
    location,
    providerId,
  } = agreement;
  return {
    acceptedAt: acceptedAt.toDate(),
    type: 'provider',
    providerId: parseInt(providerId, 10),
    documentPublishedAt: documentPublishedAt.toDate(),
    documentTitle,
    documentType,
    documentRevisionNo,
    legalDocumentId,
    location,
    deviceIpAddress,
    deviceSystemVersion,
    deviceSystemName,
  };
};
