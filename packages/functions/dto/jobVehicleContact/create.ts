import { z } from 'zod';

export const jobVehicleContactPostPath = z.object({
  id: z.string().regex(/^\d+$/).transform(Number),
});

export type IJobVehicleContactPostPath = z.infer<
  typeof jobVehicleContactPostPath
>;
