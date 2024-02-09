import { Decimal } from 'decimal.js';
import {
  ICreateJobEarningsItemsSchema,
  IUpdateJobEarningsItemsSchema,
} from 'db/schema/jobEarningsItems';
import {
  TruckupInternalServerErrorError,
  TruckupNotFoundError,
} from 'src/errors';
import {
  createEarningsItem,
  deleteEarningsItem,
  getJobEarningsItemById,
  listJobEarningsItemByJobId,
  updateEarningsItem,
} from '@db/earnings';
import { IJobEarningsItemPatchPath } from 'dto/earnings/patch';
import { getOnlyJobById } from './jobs';
import { IGetTimersByJobId, getTimersByJobId } from './serviceTimers';

export const createJobEarningsItemAction = async (
  body: ICreateJobEarningsItemsSchema
) => {
  const job = await getOnlyJobById(body.jobId);

  if (!job) throw new TruckupNotFoundError();

  const item = await createEarningsItem({ body });

  if (!item) {
    throw new TruckupInternalServerErrorError();
  }

  return item;
};

export const updateJobEarningsItemAction = async (
  body: IUpdateJobEarningsItemsSchema
) => {
  if (!body.id) throw new TruckupNotFoundError();

  const job = await getOnlyJobById(body.jobId);

  if (!job) throw new TruckupNotFoundError();

  const item = await updateEarningsItem({
    body,
    where: { id: body.id, jobId: body.jobId },
  });

  if (!item) {
    throw new TruckupInternalServerErrorError();
  }

  return item;
};

export const deleteJobEarningsItemAction = async (
  pathParams: IJobEarningsItemPatchPath
) => {
  const item = await getJobEarningsItemById({ itemId: pathParams.earningsId });

  if (!item || item.jobId !== pathParams.id) throw new TruckupNotFoundError();

  const deleted = await deleteEarningsItem({
    itemId: pathParams.earningsId,
  });

  if (!deleted) {
    throw new TruckupNotFoundError();
  }
};

export const getJobEarningsItemAction = async (jobId: number) => {
  const job = await getOnlyJobById(jobId);

  if (!job || !job.provider_id) throw new TruckupNotFoundError();

  const timers = await getTimersByJobId(jobId, job.provider_id);

  const perHourAmount = calculateTimerTotal(timers);

  let itemsTotalPriceCents = 0;

  const items = (await listJobEarningsItemByJobId({ jobId })).map((item) => {
    const totalPriceCents = calculateTotalPrice({
      quantity: parseInt(item.quantity, 10),
      unitPriceCents: item.unitPriceCents,
    });
    itemsTotalPriceCents += totalPriceCents;
    return {
      ...item,
      ...{ totalPriceCents },
    };
  });

  const perHourRateTotalCents = new Decimal(job.provider_rate_cents)
    .times(perHourAmount)
    .floor()
    .toNumber();

  return {
    jobId,
    providerId: job.provider_id,
    earningsTotalCents:
      perHourRateTotalCents + job.provider_callout_cents + itemsTotalPriceCents,
    perHourRateCents: job.provider_rate_cents,
    perHourAmount,
    perHourRateTotalCents,
    calloutRateCents: job.provider_callout_cents,
    itemsTotalPriceCents,
    items,
  };
};

export const calculateTimerTotal = (timers: IGetTimersByJobId[]) => {
  return new Decimal(
    timers.reduce((acc, timer) => {
      return acc + timer.timer;
    }, 0)
  )
    .div(3600) // Converting seconds to hours
    .toNearest(0.25, Decimal.ROUND_UP) // Rounding to the nearest up 0.25
    .toNumber(); // Converting to number
};

interface ICalculateTotalPriceInput {
  quantity: number;
  unitPriceCents: number;
}

export const calculateTotalPrice = ({
  quantity,
  unitPriceCents,
}: ICalculateTotalPriceInput): number => {
  return new Decimal(quantity).times(unitPriceCents).floor().toNumber();
};
