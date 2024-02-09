import { PathIdScalar } from '@utils/schema';
import { z } from 'zod';

export const jobPaymentsItemPatchPath = z.object({
  id: PathIdScalar,
  chargesId: PathIdScalar,
});

export type IJobPaymentsItemPatchPath = z.infer<
  typeof jobPaymentsItemPatchPath
>;
