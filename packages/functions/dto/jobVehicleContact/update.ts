import { z } from 'zod';

export const jobVehicleContactUpdatePath = z.object({
  id: z.string().regex(/^\d+$/).transform(Number),
  vehicleId: z.string().regex(/^\d+$/).transform(Number),
});

export type IJobVehicleContactUpdatePath = z.infer<
  typeof jobVehicleContactUpdatePath
>;
