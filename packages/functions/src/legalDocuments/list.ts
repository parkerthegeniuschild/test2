import assert from 'node:assert/strict';
import { ApiHandler } from 'sst/node/api';
import useContentful, {
  formatContentfulLegalDocument,
  isContentfulLegalDocument,
} from 'clients/contentful';
import { transformEvent } from '@utils/helpers';
import { legalDocuments } from 'db/schema/legalDocuments';
import { response } from '@utils/response';

const MAX_SIZE = 25;

export const handler = ApiHandler(async (_evt) => {
  const { paginate } = transformEvent(
    {
      ..._evt,
      queryStringParameters: {
        ..._evt.queryStringParameters,
        size: `${MAX_SIZE}`,
      },
    },
    legalDocuments
  );
  const { items } = await useContentful().getEntries();
  const agreements = items
    .filter(isContentfulLegalDocument)
    .map(formatContentfulLegalDocument);
  const { length: number } = agreements;

  assert.ok(number <= MAX_SIZE, `Too many contentful entries!`);

  return response.success(paginate(agreements, agreements.length));
});
