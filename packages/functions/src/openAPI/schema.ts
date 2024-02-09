import { z } from '@openAPI/config';

export const paginated = <T extends z.ZodTypeAny>(data: T) =>
  z.object({
    data: z.array(data),
    page: z
      .object({
        size: z.number(),
        number: z.number(),
        page: z.number(),
        totalElements: z.number(),
      })
      .openapi({
        example: {
          size: 25,
          number: 4,
          page: 0,
          totalElements: 4,
        },
      }),
  });
