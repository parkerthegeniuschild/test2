import { PathIdScalar } from '@utils/schema';
import { z } from 'zod';

export const jobEarningsItemPatchPath = z.object({
  id: PathIdScalar,
  earningsId: PathIdScalar,
});

export type IJobEarningsItemPatchPath = z.infer<
  typeof jobEarningsItemPatchPath
>;
