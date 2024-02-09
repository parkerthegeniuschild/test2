import { z } from 'zod';

import { operatorSchema } from '@/app/_types/api';

// ? this is probably going to be extracted into a common type structure between server and client
export type Provider = {
  id: number;
  is_blocked: boolean;
  firstname: string;
  lastname: string;
  phone: string;
  balance: string;
  rating: string | null;
  completedJobsCount: number;
  is_online: boolean;
  acceptedRate?: number;
};

export const cashBalanceModelSchema = z.object({
  operator: operatorSchema,
  values: z.array(z.string()),
});

export type CashBalanceFilterModel = z.infer<typeof cashBalanceModelSchema>;

export const statusSchema = z.enum(['approved', 'unapproved']);

export type Status = z.infer<typeof statusSchema>;
