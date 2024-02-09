import assert from 'node:assert/strict';
import {
  asc,
  desc,
  SQL,
  and,
  eq,
  ne,
  gt,
  gte,
  lt,
  lte,
  isNull,
  isNotNull,
  inArray,
  notInArray,
  between,
  notBetween,
  exists,
  notExists,
  like,
  ilike,
  notIlike,
  sql,
  type AnyColumn,
  type ColumnsSelection,
} from 'drizzle-orm';
import type {
  PgTableWithColumns,
  SubqueryWithSelection,
} from 'drizzle-orm/pg-core';
import { z } from 'zod';
import type {
  CamelCasedPropertiesDeep,
  SnakeCasedPropertiesDeep,
} from 'type-fest';
import { DateTime } from 'luxon';
import { notEmpty } from './typeGuards';
import { isPlainObject } from 'lodash';
import {
  DEFAULT_JOB_RATE_CENTS,
  DEFAULT_PROVIDER_RATES,
  VehicleType,
} from './constants';
import {
  calculateLaborPlusServicesSubtotal,
  calculatePartTotalPriceWithMarkup,
  calculatePartUnitPriceWithMarkup,
  calculatePartsTotalPrice,
} from '../functions/src/core/jobVehicleContactServiceParts';
import { Enum } from './types';
import type {
  TContentTemplateReplacer,
  TGetDraweeData,
  TGetInvoiceFilePath,
  TInvoiceDataGenerator,
  TJobService,
  TJobVehicle,
  TVehicleTemplateReplacer,
  TmapEntryReplacer,
} from './helpers.types';
import { TruckupBadRequestError } from '../functions/src/errors';

const orderSelect = { asc, desc };

const orderArraySchema = z.union([z.literal('asc'), z.literal('desc')]).array();

const operatorSelect = {
  eq,
  ne,
  gt,
  gte,
  lt,
  lte,
  isNull,
  isNotNull,
  inArray,
  notInArray,
  exists,
  notExists,
  between,
  notBetween,
  like,
  ilike,
  notIlike,
};

export const timestampMsString = z
  .string()
  .regex(/^\d.+$/)
  .length(13)
  .optional()
  .transform((t) =>
    t ? sql.raw(`TO_TIMESTAMP(${t.slice(0, -3)}.${t.slice(-3)})`) : undefined
  );

export function transformEvent(
  event: AWSLambda.APIGatewayProxyEventV2,
  schema?: PgTableWithColumns<any> | SubqueryWithSelection<any, any>,
  overrides?: { size?: number; order?: 'asc' | 'desc' }
) {
  const {
    page: _page = '0',
    size: _size = '25',
    sort: _sort = 'id',
    order: _order = overrides?.order || 'asc',
    joins,
    timeFrom: _timeFrom,
    timeTo: _timeTo,
    ...filterParams
  } = event.queryStringParameters ?? {};
  const page = parseInt(_page, 10);
  const size = overrides?.size || parseInt(_size, 10);

  const sortArray = _sort.split(',');
  const orderArray = orderArraySchema.parse(_order.split(','));
  const orderBy: TransformedEvent['orderBy'] = (aliases) =>
    sortArray.map((col, idx) => {
      const column = aliases[col] as AnyColumn;
      const order = orderArray[idx];
      assert.ok(!!column, `Bad column: ${col}`);
      assert.ok(!!order, `Must specify order for ${col} to sort by`);
      return orderSelect[order](column);
    });
  const joinsArray = joins?.split(',') || [];

  const timeFrom = timestampMsString.parse(_timeFrom);
  const timeTo = timestampMsString.parse(_timeTo);
  const filtersArray = schema
    ? Object.keys(filterParams).map((column) => {
        //@ts-ignore
        const [operator, stringValues] = filterParams[column].split(':');

        const values =
          stringValues?.split('+').map((stringValue) => {
            if (!!schema[stringValue]) {
              return schema[stringValue];
            }

            if (stringValue === 'true' || stringValue === 'false') {
              return stringValue === 'true' || false;
            }

            //@ts-ignore
            if (!isNaN(stringValue) && !isNaN(parseFloat(stringValue))) {
              return Number(stringValue);
            }

            return stringValue;
          }) ?? [];

        if (operator === 'inArray' || operator === 'notInArray') {
          //@ts-ignore
          return operatorSelect[operator](
            schema[column],
            values
          ) as SQL<unknown>;
        }
        //@ts-ignore
        return operatorSelect[operator](
          schema[column],
          ...values
        ) as SQL<unknown>;
      })
    : [];

  const filters = and(
    filtersArray.reduce((acc: undefined | SQL<unknown>, filter) => {
      if (!acc) return filter;
      if (!filter) return acc;
      return and(acc, filter);
    }, undefined),
    timeFrom && schema ? gte(schema.created_at, timeFrom) : undefined,
    timeTo && schema ? lte(schema.created_at, timeTo) : undefined
  );

  const transformedEvent: TransformedEvent = {
    page,
    size,
    offset: page * size,
    orderBy,
    joins: joinsArray,
    filters,
    filter: (filter) =>
      filters ? (and(filter, filters) as SQL<unknown>) : filter,
    paginate: (data, totalElements, extra) => {
      assert.ok(Array.isArray(data), `Data to paginate must be an array`);
      assert.ok(
        typeof totalElements === 'number',
        `invalid totalElements to paginate with`
      );
      return {
        data,
        page: {
          size,
          number: data.length,
          page,
          totalElements,
          total_elements: totalElements,
        },
        extra,
      };
    },
  };
  return transformedEvent;
}

export interface TransformedEvent {
  page: number;
  size: number;
  offset: number;
  orderBy: <TSelection extends ColumnsSelection>(aliases: TSelection) => SQL[];
  filters?: SQL<unknown>;
  joins?: Array<string>;
  count?: boolean;
  paginate: <T, E>(
    data: T[],
    totalElements: number,
    extra?: E
  ) => PaginatedResponse<T, E>;
  filter: (filter: SQL<unknown>) => SQL<unknown>;
}

// This type isn't perfect, but it is pretty close. The type doesn't know if extra is present or not.
export interface PaginatedResponse<T = unknown, E = Record<string, unknown>> {
  data: T[];
  page: PaginationData;
  extra?: E;
}

interface PaginationData {
  size: number;
  number: number;
  page: number;
  totalElements: number;
}

export const updatedPropsSchema = z.object({
  updated_by: z.string(),
  updated_at: z.custom<SQL>((d) => !!d),
});
export type IUpdatedProps = z.infer<typeof updatedPropsSchema>;
export function buildUpdatedProperties(
  _evt: AWSLambda.APIGatewayProxyEventV2
): IUpdatedProps {
  return { updated_by: buildBy(_evt), updated_at: getSqlCurrentTimestamp() };
}
export function buildUpdatedPropertiesV2(
  _evt: AWSLambda.APIGatewayProxyEventV2
) {
  const res = buildUpdatedProperties(_evt);
  return { updatedBy: res.updated_by, updatedAt: res.updated_at };
}

export function buildBy(_evt: AWSLambda.APIGatewayProxyEventV2) {
  // @ts-ignore APIGatewayProxyEventV2 is missing the authorizer property
  const username = _evt.requestContext?.authorizer?.lambda?.username;
  assert.ok(
    typeof username === 'string' && username.length,
    `Authorizer Error`
  );
  return username;
}

const authSchema = z.object({
  username: z.string().min(1),
  roles: z.array(z.string().min(1)),
});
export const extractAuth = (event: AWSLambda.APIGatewayProxyEventV2) => {
  /* eslint-disable @typescript-eslint/ban-ts-comment */
  // @ts-ignore
  const username = event.requestContext.authorizer?.lambda?.username;
  // @ts-ignore
  const roles = event.requestContext.authorizer?.lambda?.roles;
  /* eslint-enable @typescript-eslint/ban-ts-comment */
  return authSchema.parse({ username, roles });
};

export const getProviderRateIds = async () => ({
  rate: 1041,
  callout: 1042,
  bonusAfterHour: 1043,
  bonus5Star: 1044,
  bonusProPlus: 1045,
});

export const getDefaultProviderRates = async () => DEFAULT_PROVIDER_RATES;

export const getDefaultJobRateCents = async () => DEFAULT_JOB_RATE_CENTS;

export const getServiceAreaId = async () => 2;

export const snakeCaseKeys = <T extends object>(
  obj: T
): SnakeCasedPropertiesDeep<
  CamelCasedPropertiesDeep<T, { preserveConsecutiveUppercase: false }>
> => {
  const snakedEntries = Object.entries(obj).map(([key, value]) => {
    const snakeCaseKey = key.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
    return [
      snakeCaseKey,
      isPlainObject(value)
        ? snakeCaseKeys(value)
        : Array.isArray(value)
        ? value.map((v) => snakeCaseKeys(v as object))
        : value,
    ];
  });

  return Object.fromEntries(snakedEntries.filter(notEmpty));
};

export const camelCaseKeys = <T extends object>(
  obj: T
): CamelCasedPropertiesDeep<SnakeCasedPropertiesDeep<T>> => {
  const camelEntries = Object.entries(obj).map(([key, value]) => {
    const camelCaseKey = key.replace(
      /([a-z])_([a-z])/g,
      (_, b, c) => b + c.toUpperCase()
    );
    return [
      camelCaseKey,
      isPlainObject(value)
        ? camelCaseKeys(value)
        : Array.isArray(value)
        ? value.map((v) => camelCaseKeys(v as object))
        : value,
    ];
  });

  return Object.fromEntries(camelEntries.filter(notEmpty));
};

export const getSqlCurrentTimestamp = () => sql`CURRENT_TIMESTAMP`;

export const getInvoiceFilePath = ({ jobId, prefix }: TGetInvoiceFilePath) => ({
  filename: `${prefix}-${Date.now()}.pdf`,
  publicFilename: `${prefix}-${jobId}.pdf`,
});

const centsToDollars = (cents: number | null) =>
  Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Number(cents) / 100);

const mapEntryReplacer = ({ dataMap, originalContent }: TmapEntryReplacer) => {
  let result = originalContent;

  for (const [key, value] of Object.entries(dataMap)) {
    result = result.replaceAll(`{{${key}}}`, String(value));
  }

  return result;
};

const numberFormatter = (number: number | null) =>
  !number ? '0' : new Intl.NumberFormat('en-US').format(number);

export const getAllServiceParts = (services: TJobService[]) =>
  services.flatMap((service) => service.jobServiceParts);

const vehicleTemplateReplacer = ({
  data,
  partTemplate,
  serviceTemplate,
  serviceSubTotalTemplate,
  vehicleTemplate,
}: TVehicleTemplateReplacer) => {
  const vehicles = data.map((vehicle, index) => {
    const vehicleUnit = vehicle.unit || ++index;

    const services = vehicle.jobServices.map((service) => {
      const serviceDataReplacerMap = {
        serviceId: service.id,
        serviceTypeDescription: service.service?.description ?? '',
        serviceDescription: service.description,
        hasParts: !!service.jobServiceParts.length,
      };

      const parts = service.jobServiceParts.map((part) => {
        const partsDataReplacerMap = {
          partId: part.id,
          partName: part.name,
          partQuantity: part.quantity?.toFixed(2) ?? 1,
          partUnitPrice: centsToDollars(calculatePartUnitPriceWithMarkup(part)),
          partTotalPrice: centsToDollars(
            calculatePartTotalPriceWithMarkup(part)
          ),
        };

        return mapEntryReplacer({
          dataMap: partsDataReplacerMap,
          originalContent: partTemplate,
        });
      });

      return mapEntryReplacer({
        dataMap: serviceDataReplacerMap,
        originalContent: serviceTemplate,
      }).replace('{{parts}}', parts.join(''));
    });

    const serviceParts = getAllServiceParts(vehicle.jobServices);

    const serviceSubTotalDataReplacerMap = {
      vehicleUnit,
      vehicleType: formatVehicle(vehicle.type),
      servicesSubTotalPrice: centsToDollars(
        calculatePartsTotalPrice(serviceParts)
      ),
    };

    const serviceSubTotal = mapEntryReplacer({
      dataMap: serviceSubTotalDataReplacerMap,
      originalContent: serviceSubTotalTemplate,
    });

    const vehicleDataReplacerMap = {
      vehicleUnit,
      vehicleType: formatVehicle(vehicle.type),
      vehicleYear: vehicle.year,
      vehicleManufacturer: vehicle.manufacturer,
      vehicleModel: vehicle.model,
      vehicleVIN: vehicle.vin_serial,
      vehicleMileage: vehicle.mileage
        ? numberFormatter(Number(vehicle.mileage))
        : null,
    };

    return mapEntryReplacer({
      dataMap: vehicleDataReplacerMap,
      originalContent: vehicleTemplate,
    })
      .replace('{{services}}', services.join(''))
      .replace('{{servicesSubTotal}}', serviceSubTotal);
  });

  return vehicles.join('');
};

const formatVehicle = (vehicle: TJobVehicle['type']) => {
  if (!vehicle) throw new TruckupBadRequestError('Vehicle type is required');
  if (vehicle === VehicleType.DUMP_TRUCK) return vehicle;
  return vehicle.split(' ').shift()!;
};

const formatLocationAddress = (address: string | null) =>
  address?.split(',').slice(0, -1).join(',') ?? '';

const getDraweeData = ({ company, dispatcher }: TGetDraweeData) => ({
  draweeName:
    company?.name ?? `${dispatcher?.firstname} ${dispatcher?.lastname}`,
  draweeAddress1: company?.address1 ?? null,
  draweeAddress2: company?.address2 ?? null,
  draweeCity: company?.city ?? null,
  draweeState: company?.state ?? null,
  draweeZipCode: company?.zipcode ?? null,
});

const contentTemplateReplacer = ({
  contentTemplate,
  data,
}: TContentTemplateReplacer) => {
  const {
    draweeAddress1,
    draweeAddress2,
    draweeCity,
    draweeName,
    draweeState,
    draweeZipCode,
  } = getDraweeData({
    company: data.job.company,
    dispatcher: data.job.dispatcher,
  });

  const jobSubTotalPriceCents = calculateLaborPlusServicesSubtotal({
    vehicles: data.job.jobVehicles,
    laborSubtotalCents: data.charge.laborHoursUnitPriceCentsTotal,
  });

  const dataMap = {
    jobId: data.job.id,
    draweeAddress1,
    draweeAddress2,
    draweeCity,
    draweeName,
    draweeState,
    draweeZipCode,

    serviceDate: DateTime.fromJSDate(data.job.created_at).toFormat(
      'MMM d, yyyy'
    ),
    invoiceMessage: data.job.invoice_message,
    balanceDue: centsToDollars(data.balanceCents),
    paymentStatusText: data.balanceCents ? 'Balance due' : 'PAID',
    laborSurpassedMinimum: data.charge.surpassedMinimum,
    laborHours: data.charge.laborHoursAmount,
    laborHoursQuantity: data.charge.laborHoursAmount.toFixed(2),
    laborUnitPrice: centsToDollars(data.charge.laborHoursUnitPriceCents),
    laborTotalPrice: centsToDollars(data.charge.laborHoursUnitPriceCentsTotal),
    labourSubtotalPrice: centsToDollars(
      data.charge.laborHoursUnitPriceCentsTotal
    ),

    jobSubtotalPrice: centsToDollars(jobSubTotalPriceCents),
    calloutPrice: centsToDollars(data.charge.calloutPriceCents),
    fuelSurchargePrice: centsToDollars(data.charge.fuelSurchargeCents),
    totalJobPrice: centsToDollars(data.charge.totalPriceCents),
    totalAmountPaid: centsToDollars(data.payments.totalAmountPaidCents),
    locationAddress: formatLocationAddress(data.job.location_address),
    customerRefOrPO: data.job.customer_ref,
  };

  return mapEntryReplacer({
    dataMap,
    originalContent: contentTemplate,
  });
};

export const invoiceDataGenerator = ({
  data,
  templates,
}: TInvoiceDataGenerator) => {
  const {
    contentTemplate,
    serviceTemplate,
    partTemplate,
    serviceSubTotalTemplate,
    vehicleTemplate,
    headerTemplate,
    footerTemplate,
  } = templates;

  const vehicles = vehicleTemplateReplacer({
    data: data.job.jobVehicles,
    partTemplate,
    serviceSubTotalTemplate,
    serviceTemplate,
    vehicleTemplate,
  });

  const content = contentTemplateReplacer({
    contentTemplate,
    data,
  }).replace('{{vehicles}}', vehicles);

  const header = headerTemplate.replace('{{jobId}}', String(data.job.id));
  const footer = footerTemplate.replace(
    '{{controlNumber}}',
    String(data.invoiceId || 'PREVIEW')
  );

  return {
    content,
    layout: {
      header,
      footer,
    },
  };
};
