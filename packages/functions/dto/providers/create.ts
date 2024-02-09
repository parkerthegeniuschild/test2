import { z } from 'zod';
import { IdScalar, PhoneScalar } from '@utils/schema';

export const providerCreationPayload = z.object({
  firstname: z.string().nonempty(),
  lastname: z.string().nonempty(),
  email: z.string().email(),
  phone: PhoneScalar,
  address1: z.string().nonempty(),
  address2: z.string().nonempty().optional(),
  city: z.string().nonempty(),
  state: z.string().nonempty(),
  zip: z.string().length(5),
  country: z.string().nonempty().optional(),
  company_id: IdScalar.optional(),
});

export type ProviderCreationPayload = z.infer<typeof providerCreationPayload>;
