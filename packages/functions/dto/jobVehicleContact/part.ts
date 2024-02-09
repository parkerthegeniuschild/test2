import { z } from 'zod';
import { PathIdScalar } from '@utils/schema';

export const jobVehicleContactServicePartUpdatePath = z.object({
  id: PathIdScalar,
  vehicleId: PathIdScalar,
  serviceId: PathIdScalar,
  partId: PathIdScalar,
});
