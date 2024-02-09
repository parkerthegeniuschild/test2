import { Decimal } from 'decimal.js';
import {
  TruckupBadRequestError,
  TruckupInternalServerErrorError,
  TruckupNotFoundError,
} from 'src/errors';
import {
  createPaymentsItem,
  deletePaymentsItem,
  getJobPaymentByStripePaymentId,
  getJobPaymentsItemById,
  listJobPaymentsItemByJobId,
  updatePaymentsItem,
} from '@db/charges';
import { DEFAULT_TAX_RATE } from '@utils/constants';
import {
  ICreateJobPaymentsItemsSchema,
  ISelectJobPaymentsItemsSchema,
  IUpdateJobPaymentsItemsSchema,
  JobPaymentsItemPaymentMethod,
} from 'db/schema/jobPaymentsItems';
import { getHighestServiceMinimumHoursByJobId } from '@db/jobVehicleContactServices';
import { useDb } from 'db/dbClient';
import { IJobPaymentsItemPatchPath } from 'dto/charges/patch';
import { getOnlyJobById } from './jobs';
import { getTimersByJobId } from './serviceTimers';
import { calculateTimerTotal } from './earnings';
import { getPartsTotalPriceByJobId } from './jobVehicleContactServiceParts';

export const getJobPaymentsItemAction = async (jobId: number) => {
  const job = await getOnlyJobById(jobId);

  if (!job) throw new TruckupNotFoundError();

  const [timers, minHours, partsPriceCentsTotal, entries] =
    await useDb().transaction(async (tx) => {
      return await Promise.all([
        getTimersByJobId(jobId, job.provider_id ?? undefined, tx),
        getHighestServiceMinimumHoursByJobId({ jobId, dbInstance: tx }),
        getPartsTotalPriceByJobId({ jobId, dbInstance: tx }),
        listJobPaymentsItemByJobId({ jobId, dbInstance: tx }),
      ]);
    });

  const workedHours = calculateTimerTotal(timers);

  const laborHoursAmount = Math.max(minHours, workedHours);

  const laborHoursUnitPriceCentsTotal = new Decimal(job.charge_rate_cents)
    .times(laborHoursAmount)
    .ceil()
    .toNumber();

  const subtotalPriceCents = calculateSubTotalPrice([
    laborHoursUnitPriceCentsTotal,
    partsPriceCentsTotal,
    job.charge_callout_cents,
    job.charge_fuel_surcharge_cents,
  ]);

  const totalPriceCents = calculateTotalPriceWithTax({
    price: subtotalPriceCents,
    taxRate: DEFAULT_TAX_RATE,
  });

  const totalAmountPaidCents = calculateTotalAmountPaid(entries);

  return {
    charge: {
      laborHoursAmount,
      surpassedMinimum: workedHours > minHours,
      laborHoursUnitPriceCents: job.charge_rate_cents,
      laborHoursUnitPriceCentsTotal,
      partsPriceCentsTotal,
      chargeCalloutCents: job.charge_callout_cents,
      calloutPriceCents: job.charge_callout_cents,
      fuelSurchargeCents: job.charge_fuel_surcharge_cents,
      subtotalPriceCents,
      taxRate: DEFAULT_TAX_RATE,
      taxPriceCents: calculateTaxPrice({
        price: subtotalPriceCents,
        taxRate: DEFAULT_TAX_RATE,
      }),
      totalPriceCents,
    },
    payments: {
      totalAmountPaidCents,
      entries,
    },
    balanceCents: calculateBalance({ totalPriceCents, totalAmountPaidCents }),
  };
};

interface TGetPaymentByStripeIdParams {
  jobId: number;
  stripePaymentId: string;
}
export const getPaymentByStripeId = async (
  params: TGetPaymentByStripeIdParams
) => {
  return await getJobPaymentByStripePaymentId(params);
};

interface ICalculateTaxPriceInput {
  price: number;
  taxRate: number;
}

export const calculateTaxPrice = ({
  price,
  taxRate,
}: ICalculateTaxPriceInput) => {
  return new Decimal(price).times(taxRate).floor().toNumber();
};

export const calculateTotalPriceWithTax = ({
  price,
  taxRate,
}: ICalculateTaxPriceInput) => {
  return new Decimal(price)
    .plus(calculateTaxPrice({ price, taxRate }))
    .floor()
    .toNumber();
};

export const calculateTotalAmountPaid = (
  payments: ISelectJobPaymentsItemsSchema[]
) => {
  return payments.reduce((acc, payment) => {
    return acc + payment.amountCents;
  }, 0);
};

interface ICalculateBalanceInput {
  totalPriceCents: number;
  totalAmountPaidCents: number;
}

export const calculateBalance = ({
  totalPriceCents,
  totalAmountPaidCents,
}: ICalculateBalanceInput) => totalPriceCents - totalAmountPaidCents;

export const calculateSubTotalPrice = (values: number[]) => {
  return values.reduce((acc, value) => {
    return new Decimal(acc).plus(value).toNumber();
  }, 0);
};

export const createJobPaymentsItemAction = async (
  body: ICreateJobPaymentsItemsSchema
) => {
  const job = await getOnlyJobById(body.jobId);

  if (!job) throw new TruckupNotFoundError();

  const item = await createPaymentsItem({ body });

  if (!item) {
    throw new TruckupInternalServerErrorError();
  }

  return item;
};

export const updateJobPaymentsItemAction = async (
  body: IUpdateJobPaymentsItemsSchema
) => {
  if (!body.id) throw new TruckupNotFoundError();

  if (body.paymentMethod === JobPaymentsItemPaymentMethod.CREDIT_CARD)
    throw new TruckupBadRequestError();

  const job = await getOnlyJobById(body.jobId);

  if (!job) throw new TruckupNotFoundError();

  const item = await updatePaymentsItem({
    body,
    where: { id: body.id, jobId: body.jobId },
  });

  if (!item) {
    throw new TruckupInternalServerErrorError();
  }

  return item;
};

export const deleteJobPaymentsItemAction = async (
  pathParams: IJobPaymentsItemPatchPath
) => {
  const item = await getJobPaymentsItemById({ itemId: pathParams.chargesId });

  if (!item || item.jobId !== pathParams.id) throw new TruckupNotFoundError();

  if (item.paymentMethod === JobPaymentsItemPaymentMethod.CREDIT_CARD)
    throw new TruckupBadRequestError();

  const deleted = await deletePaymentsItem({
    itemId: pathParams.chargesId,
  });

  if (!deleted) {
    throw new TruckupNotFoundError();
  }
};
