import { z } from 'zod';
import {
  CompanyType,
  DBSortOrder,
  JobRequestStatus,
  JobStatuses,
  ROLE,
} from './constants';

export const PathPositiveIntScalar = z
  .string()
  .regex(/^\d+$/)
  .transform((s) => parseInt(s, 10));
export const PathIdScalar = PathPositiveIntScalar;

// They are the same thing, but we use different names to make it easier to grasp the concept of usage.
export const IdScalar = z.number().int().positive();
export const PositiveIntScalar = IdScalar;

export const PhoneScalar = z
  .string()
  .regex(/^1\d{10}$/, 'Phone number must be 11 digits long and start with 1');

/**
 * `extractValuesAsTuple` extracts the values from a given enum-like object and returns them
 * in a tuple-ish format.
 *
 * This seems more like a hack then a proper solution, but nonetheless it seems to work and is
 * useful when working with libraries or utilities that expect a non-empty tuple of string
 * values, particularly when those utilities cannot accept a simple string array.
 *
 * https://stackoverflow.com/questions/73825273/creating-a-zod-enum-from-an-object
 */
function extractValuesAsTuple<T extends Record<string, unknown>>(
  obj: T
): [T[keyof T], ...T[keyof T][]] {
  const values = Object.values(obj) as T[keyof T][];
  if (values.length === 0)
    throw new Error('Object must have at least one value.');

  // Explicitly extract the first value
  const result: [T[keyof T], ...T[keyof T][]] = [values[0], ...values.slice(1)];

  return result;
}

export function enumFromConst<T extends Record<string, string>>(obj: T) {
  const values = extractValuesAsTuple(obj);
  return z.enum(values);
}

export const schemaFromShape = <T extends z.ZodRawShape>(shape: T) =>
  z.strictObject(shape);

export const RoleEnum = enumFromConst(ROLE);

export const MomentShape = {
  id: IdScalar,
  created_by: z.string(),
  created_at: z.string().datetime(),
  updated_by: z.string().nullable(),
  updated_at: z.string().datetime().nullable(),
};

const MomentSchema = schemaFromShape(MomentShape);

export const MomentExample = {
  id: 123,
  created_by: 'admin@truckup.com',
  created_at: '2023-12-21T12:34:50.678Z',
  updated_by: 'admin@truckup.com',
  updated_at: '2023-12-25:21:43:05:876Z',
} satisfies z.infer<typeof MomentSchema>;

const AddressShape = {
  address1: z.string().nullable(),
  address2: z.string().nullable(),
  city: z.string().nullable(),
  zipcode: z.string().length(5).nullable(),
  state: z.string().length(2).toUpperCase().nullable(),
  country: z.string().nullable(),
};

export const GeoLocationCoordinatesShape = {
  location_latitude: z.number().min(-90).max(90).nullable(),
  location_longitude: z.number().min(-180).max(180).nullable(),
};

export const LocationShape = {
  location_address: z.string().nullable(),
  location_street: z.string().nullable(),
  location_street_number: z.string().nullable(),
  location_zip: z.string().nullable(),
  location_city: z.string().nullable(),
  location_state: z.string().length(2).toUpperCase().nullable(),
  location_details: z.string().nullable(),
  location_notes: z.string().nullable(),
  location_type: z.string().nullable(),
  ...GeoLocationCoordinatesShape,
};

export const JobBaseShape = {
  ...MomentShape,
  dispatcher_id: IdScalar,
  service_area_id: IdScalar.nullable(),
  company_id: IdScalar,
  ...LocationShape,
  is_pending_review: z.boolean(),
  rating: z.string().nullable(),
  status_id: enumFromConst(JobStatuses),
  total_cost: z.string(),
  payment_method: z.string().nullable(),
  payment_refnumber: z.string().nullable(),
  promised_time: z.string().nullable(),
  provider_id: IdScalar.nullable(),
  payment_sum: z.string(),
  is_abandoned: z.boolean(),
  customer_ref: z.string().nullable(),
  provider_callout_cents: z.number().int().positive(),
  provider_rate_cents: z.number().int().positive(),
  invoice_message: z.string().optional().nullable(),
};

export const JobRequestResponseBaseShape = {
  id: IdScalar,
  created_by: z.string(),
  created_at: z.string().datetime(),
  updated_by: z.string().nullable(),
  updated_at: z.string().datetime().nullable(),
  dispatcher_id: IdScalar.nullable(),
  provider_id: IdScalar,
  service_area_id: IdScalar,
  location_address: z.string(),
  location_state: z.string(),
  location_city: z.string(),
  location_details: z.string(),
  location_notes: z.string().nullable(),
  ...GeoLocationCoordinatesShape,
  response_time: z.string().nullable(),
  job_id: IdScalar,
  status: enumFromConst(JobRequestStatus),
  distance: IdScalar,
  duration: IdScalar,
};

export const CompanyBaseShape = {
  ...MomentShape,
  name: z.string(),
  phone: PhoneScalar.nullable(),
  email: z.string().email().nullable(),
  usdot: z.string().nullable(),
  type: enumFromConst(CompanyType),
  ...AddressShape,
};

export const BaseQuerySchema = z.object({
  order: enumFromConst(DBSortOrder).optional(),
  page: PositiveIntScalar.optional(),
  size: PositiveIntScalar.optional(),
  // add more stuff here like filters, etc.
});
