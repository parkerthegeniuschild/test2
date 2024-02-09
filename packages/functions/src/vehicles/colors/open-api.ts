import { z } from '@openAPI/config';
import type { TOpenAPIAction } from '@openAPI/types';
import { Method } from '@utils/constants';

export const VehicleColorSchema = z.object({
  background_color: z.string().openapi({ examples: ['white', '#ffffff'] }),
  border: z.string().optional(),
});

export const ListVehicleColorsResponseSchema = z
  .object({
    white: VehicleColorSchema,
    black: VehicleColorSchema,
    gray: VehicleColorSchema,
    yellow: VehicleColorSchema,
    orange: VehicleColorSchema,
    pink: VehicleColorSchema,
    red: VehicleColorSchema,
    green: VehicleColorSchema,
    blue: VehicleColorSchema,
    purple: VehicleColorSchema,
    tan: VehicleColorSchema,
    brown: VehicleColorSchema,
  })
  .openapi({
    example: {
      white: { background_color: 'white', border: '1px solid #dde1e5' },
      black: { background_color: '#262c33' },
      gray: { background_color: '#e4e8ed' },
      yellow: { background_color: '#eab308' },
      orange: { background_color: '#ff800a' },
      pink: { background_color: '#d53f8c' },
      red: { background_color: '#e53e3e' },
      green: { background_color: '#38a169' },
      blue: { background_color: '#1c92FF' },
      purple: { background_color: '#af00cc' },
      tan: { background_color: 'tan' },
      brown: { background_color: 'brown' },
    },
  });

export const ListVehicleColorsAction: TOpenAPIAction = {
  title: 'VehicleColorsSchema',
  method: Method.GET,
  path: '/vehicles/colors',
  description: 'Lists the color options for vehicles',
  isProtected: true,
  response: {
    content: ListVehicleColorsResponseSchema,
  },
};
