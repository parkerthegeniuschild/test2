import { TDatabaseOrTransaction } from '@utils/dbTransaction';
import { listPartsByJobId as listPartsByJobIdDB } from '@db/jobVehicleContactServiceParts';
import Decimal from 'decimal.js';
import { ISelectJobVehicleContactServicePartSchemaWithDefaultValues } from 'db/schema/jobVehicleContactServiceParts';
import {
  TruckuppartMissingMarkupValueError,
  TruckuppartMissingPriceValueError,
  TruckuppartMissingQuantityValueError,
} from 'src/errors';
import { getAllServiceParts } from '@utils/helpers';
import type { TJobServiceParts, TJobVehicle } from '@utils/helpers.types';

interface IListPartsByJobId {
  jobId: number;
  dbInstance?: TDatabaseOrTransaction;
}

type Parts = Awaited<ReturnType<typeof listPartsByJobId>> | TJobServiceParts[];

export const calculatePartsTotalPrice = (parts: Parts) =>
  parts.reduce((acc, part) => {
    return acc + calculatePartTotalPriceWithMarkup(part);
  }, 0);

export const listPartsByJobId = async ({
  jobId,
  dbInstance,
}: IListPartsByJobId) => {
  const parts = await listPartsByJobIdDB({ jobId, dbInstance });

  return parts.map((part) => ({
    ...part.job_vehicle_contact_service_part,
    price_total_cents: calculatePartTotalPrice(
      part.job_vehicle_contact_service_part
    ),
    price_total_markup_cents: calculatePartTotalPriceWithMarkup(
      part.job_vehicle_contact_service_part
    ),
  }));
};

export const calculatePartUnitPriceWithMarkup = ({
  markup,
  price_cents: priceCents,
}: Pick<
  ISelectJobVehicleContactServicePartSchemaWithDefaultValues,
  'price_cents' | 'markup'
>) => {
  if (!markup) throw new TruckuppartMissingMarkupValueError();
  if (!priceCents) throw new TruckuppartMissingPriceValueError();

  return new Decimal(markup)
    .div(100)
    .times(priceCents)
    .plus(priceCents)
    .ceil()
    .toNumber();
};

export const calculatePartTotalPrice = (
  part: Pick<
    ISelectJobVehicleContactServicePartSchemaWithDefaultValues,
    'price_cents' | 'quantity'
  >
) => {
  if (!part.price_cents) throw new TruckuppartMissingPriceValueError();
  if (!part.quantity) throw new TruckuppartMissingQuantityValueError();

  return new Decimal(part.price_cents).times(part.quantity).ceil().toNumber();
};

export const calculatePartTotalPriceWithMarkup = (
  part: Pick<
    ISelectJobVehicleContactServicePartSchemaWithDefaultValues,
    'price_cents' | 'quantity' | 'markup'
  >
) => {
  if (!part.markup) throw new TruckuppartMissingMarkupValueError();
  const unitPriceWithMarkup = calculatePartUnitPriceWithMarkup(part);

  return calculatePartTotalPrice({
    price_cents: unitPriceWithMarkup,
    quantity: part.quantity,
  });
};

export const getPartsTotalPriceByJobId = async ({
  jobId,
  dbInstance,
}: IListPartsByJobId) => {
  const parts = await listPartsByJobId({ jobId, dbInstance });
  return calculatePartsTotalPrice(parts);
};

type TcalculateLaborServicesSubtotal = {
  vehicles: TJobVehicle[];
  laborSubtotalCents: number;
};

export const calculateLaborPlusServicesSubtotal = ({
  vehicles,
  laborSubtotalCents,
}: TcalculateLaborServicesSubtotal) => {
  const serviceParts = vehicles.flatMap((vehicle) =>
    getAllServiceParts(vehicle.jobServices)
  );

  const servicesSubTotal = calculatePartsTotalPrice(serviceParts);
  return Decimal.add(servicesSubTotal, laborSubtotalCents).toNumber();
};
