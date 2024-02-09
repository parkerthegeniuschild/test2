import { z } from 'zod';

export const jobVehicleContactServiceUpdatePath = z.object({
  id: z.string().regex(/^\d+$/).transform(Number),
  vehicleId: z.string().regex(/^\d+$/).transform(Number),
  serviceId: z.string().regex(/^\d+$/).transform(Number),
});

export type IJobVehicleContactServiceUpdatePath = z.infer<
  typeof jobVehicleContactServiceUpdatePath
>;
