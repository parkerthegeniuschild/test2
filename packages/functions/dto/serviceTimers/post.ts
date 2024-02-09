import { PathIdScalar } from '@utils/schema';
import { z } from 'zod';

export const serviceTimerPostPath = z.object({
  id: PathIdScalar,
});

export type IServiceTimerPostPath = z.infer<typeof serviceTimerPostPath>;
