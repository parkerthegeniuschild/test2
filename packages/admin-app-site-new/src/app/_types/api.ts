import { z } from 'zod';

export type PaginationModel = {
  size: number;
  number: number;
  page: number;
  totalElements: number;
};

export const operatorSchema = z.union([
  z.literal('eq'),
  z.literal('gt'),
  z.literal('lt'),
  z.literal('between'),
]);

export type Operator = z.infer<typeof operatorSchema>;
