import { beforeAll } from 'vitest';
import { ROLE } from '@utils/constants';
import { fetchLegacyToken, fetchV1Token } from './helpers';

beforeAll(async () => {
  await fetchV1Token();
  await Promise.all(Object.values(ROLE).map(fetchLegacyToken));
});
