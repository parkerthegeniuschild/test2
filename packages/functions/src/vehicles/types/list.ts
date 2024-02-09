import { VehicleType } from '@utils/constants';
import { TupApiHandler } from 'handlers/TupApiHandler';

export const handler = TupApiHandler(async () => {
  return Object.values(VehicleType);
});
