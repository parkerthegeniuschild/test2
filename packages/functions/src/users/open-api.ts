import { z } from '@openAPI/config';
import type { TOpenAPIAction } from '@openAPI/types';
import { Method, ROLE } from '@utils/constants';
import {
  IdScalar,
  MomentExample,
  MomentShape,
  PhoneScalar,
  RoleEnum,
} from '@utils/schema';

export const UserSchema = z.strictObject({
  ...MomentShape,
  username: z.string().nonempty(),
  phone: PhoneScalar.nullable(),
  email: z.string().email().nullable(),
  last_login_at: z.string().datetime().nullable(),
  app_role: RoleEnum,
  fcm_token: z.string().nullable(),
});

const UserExample = {
  ...MomentExample,
  username: 'super_trucker',
  phone: '12345678910',
  email: 'trucker@truckup.com',
  last_login_at: MomentExample.updated_at,
  app_role: ROLE.PROVIDER,
  fcm_token: '123-abc-456-def',
} satisfies z.infer<typeof UserSchema>;

export const PatchUserResponseSchema = UserSchema.openapi({
  example: UserExample,
});

export const PatchUserAction: TOpenAPIAction = {
  title: 'UsersSchema',
  method: Method.PATCH,
  path: '/users/{userId}',
  description: 'Updates a user',
  isProtected: true,
  request: {
    params: z.strictObject({ userId: IdScalar }),
    body: {
      content: z.strictObject({ fcm_token: z.string().nonempty().nullable() }),
    },
  },
  response: {
    content: PatchUserResponseSchema,
  },
};
