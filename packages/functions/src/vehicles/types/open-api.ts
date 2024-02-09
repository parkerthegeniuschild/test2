import { z } from '@openAPI/config';
import type { TOpenAPIAction } from '@openAPI/types';
import { Method, VehicleType } from '@utils/constants';
import { enumFromConst } from '@utils/schema';

export const VehicleTypeEnum = enumFromConst(VehicleType);

export const ListVehicleTypesResponseSchema = z.array(VehicleTypeEnum).openapi({
  example: VehicleTypeEnum.options,
});

export const ListVehicleTypesAction: TOpenAPIAction = {
  title: 'VehicleTypesSchema',
  method: Method.GET,
  path: '/vehicles/types',
  description: 'Lists the type options for vehicles',
  isProtected: true,
  response: {
    content: ListVehicleTypesResponseSchema,
  },
};
