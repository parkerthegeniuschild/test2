import { VEHICLE_COLORS } from '@utils/constants';
import { snakeCaseKeys } from '@utils/helpers';
import { TupApiHandler } from 'handlers/TupApiHandler';

export const handler = TupApiHandler(async () => {
  return snakeCaseKeys(VEHICLE_COLORS);
});
