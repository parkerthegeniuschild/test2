import { IdScalar } from '@utils/schema';
import { z } from 'zod';

export const driverCreationPayload = z.object({
  firstname: z.string().nonempty(),
  lastname: z.string().optional(),
  phone: z.string().nonempty(),
  secondary_phone: z.string().optional(),
  email: z.string().optional(),
});

export type DriverCreationPayload = z.infer<typeof driverCreationPayload>;

export const jobCreationStep1Payload = z.object({
  company_id: IdScalar.optional(),
  dispatcher_id: IdScalar,
  drivers: z.array(driverCreationPayload),
  customer_ref: z.string().optional().nullable(),
  invoice_message: z.string().optional().nullable(),
});
