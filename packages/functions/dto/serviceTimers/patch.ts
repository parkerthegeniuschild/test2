import { PathIdScalar } from '@utils/schema';
import { z } from 'zod';

export const serviceTimerPatchPath = z.object({
  id: PathIdScalar,
  timerId: PathIdScalar,
});

export type IServiceTimerPatchPath = z.infer<typeof serviceTimerPatchPath>;
