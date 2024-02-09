import { response } from '@utils/response';
import useContentful from 'clients/contentful';
import { useDb } from 'db/dbClient';
import {
  NewLegalAgreement,
  legalAgreements as legalAgreementsSchema,
  legalAgreementsRelations,
} from 'db/schema/legalAgreements';
import assert from 'node:assert/strict';
import { ApiHandler } from 'sst/node/api';
import { z } from 'zod';

const Payload = z.object({
  revision: z.number().int(),
  longitude: z.number(),
  latitude: z.number(),
});

const db = useDb({
  legalAgreements: legalAgreementsSchema,
  legalAgreementsRelations,
});

// TODO restrict auth
export const handler = ApiHandler(async (e) => {
  const { id, documentId } = e.pathParameters || {};
  assert.ok(e.body, `Missing payload`);
  // TODO add more device data
  const {
    revision: _revision,
    latitude,
    longitude,
  } = Payload.parse(JSON.parse(e.body));
  const providerId = id && parseInt(id, 10);
  assert.ok(providerId && documentId, `Invalid path`);

  const {
    sys: {
      createdAt,
      revision,
      contentType: {
        sys: { type },
      },
    },
    fields: { title },
  } = await useContentful().getEntry(documentId);
  assert.ok(_revision === revision, `Bad revision #`);

  const agreement: NewLegalAgreement = {
    acceptedAt: new Date(e.requestContext.timeEpoch),
    type: 'provider',
    providerId,
    documentPublishedAt: new Date(createdAt),
    documentTitle: `${title}`,
    documentType: type,
    documentRevisionNo: revision,
    legalDocumentId: documentId,
    location: { latitude, longitude },
    deviceIpAddress: e.requestContext.http.sourceIp,
    deviceSystemVersion: e.requestContext.http.userAgent,
    deviceSystemName: e.requestContext.http.userAgent,
  };

  await db.insert(legalAgreementsSchema).values(agreement);

  return response.success({ providerId, documentId });
});
