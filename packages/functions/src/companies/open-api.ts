import { Audience, CompanyType, Method } from '@utils/constants';
import { CompanyBaseShape, schemaFromShape } from '@utils/schema';
import { paginated } from '@openAPI/schema';
import type { TOpenAPIAction } from '@openAPI/types';

const GetCompaniesResponseSchema = paginated(
  schemaFromShape(CompanyBaseShape).openapi({
    example: {
      id: 2943,
      created_by: 'david@truckup.com',
      created_at: '2022-08-29T17:05:04.682Z',
      updated_by: 'david@truckup.com',
      updated_at: '2022-08-29T17:05:04.682Z',
      name: 'C1 Driving School',
      phone: null,
      email: null,
      usdot: null,
      type: CompanyType.FLEET,
      address1: null,
      address2: null,
      city: null,
      state: null,
      zipcode: null,
      country: null,
    },
  })
);

export const GetCompaniesAction: TOpenAPIAction = {
  title: 'ListCompaniesSchema',
  method: Method.GET,
  path: '/companies',
  description: 'Get list of companies',
  tags: [Audience.ADMINS],
  isProtected: true,
  response: {
    content: GetCompaniesResponseSchema,
  },
};
