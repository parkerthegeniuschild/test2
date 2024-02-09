import { and, eq, isNull, sql } from 'drizzle-orm';
import {
  IPatchServiceTimerSchema,
  IPostServiceTimerSchema,
  serviceTimers as serviceTimersSchema,
} from 'db/schema/serviceTimers';
import { IServiceTimerPatchPath } from 'dto/serviceTimers/patch';
import { useDb } from 'db/dbClient';
import { getSqlCurrentTimestamp } from '@utils/helpers';
import { TDatabase, TTransaction } from '@utils/dbTransaction';

const db = useDb({
  serviceTimers: serviceTimersSchema,
});

interface ICreateTimerInput {
  body: IPostServiceTimerSchema;
  dbInstance?: TDatabase | TTransaction;
}

export const createTimer = async ({
  body,
  dbInstance = db,
}: ICreateTimerInput) => {
  const timer = await dbInstance
    .insert(serviceTimersSchema)
    .values({
      jobId: body.jobId,
      jobVehicleContactServiceId: body.jobVehicleContactServiceId,
      providerId: body.providerId,
      startTime: body.startTime
        ? sql.raw(`'${body.startTime.toISOString()}'::timestamp`)
        : getSqlCurrentTimestamp(),
      endTime: body.endTime
        ? sql.raw(`'${body.endTime.toISOString()}'::timestamp`)
        : null,
      createdBy: body.createdBy,
    })
    .returning();

  return timer[0];
};

export const updateTimer = async (
  where: IServiceTimerPatchPath,
  updates: IPatchServiceTimerSchema
) => {
  return await db
    .update(serviceTimersSchema)
    .set({
      startTime: updates.startTime
        ? sql`${updates.startTime?.toISOString()}::timestamp`
        : undefined,
      endTime: updates.endTime
        ? sql`${updates.endTime?.toISOString()}::timestamp`
        : undefined,
      updatedBy: updates.updatedBy,
      updatedAt: getSqlCurrentTimestamp(),
    })
    .where(
      and(
        eq(serviceTimersSchema.id, where.timerId),
        eq(serviceTimersSchema.jobId, where.id)
      )
    )
    .returning();
};

interface IDeleteTimerInput {
  timerId: number;
  dbInstance?: TDatabase | TTransaction;
}

export const deleteTimer = async ({
  timerId,
  dbInstance = db,
}: IDeleteTimerInput) => {
  const deleted = await dbInstance
    .delete(serviceTimersSchema)
    .where(eq(serviceTimersSchema.id, timerId))
    .returning();
  return deleted.length ? deleted[0] : undefined;
};

interface IStopActiveTimerInput {
  jobId: number;
  providerId: number;
  author: string;
  dbInstance?: TDatabase | TTransaction;
}

export const stopActiveTimer = async ({
  jobId,
  providerId,
  author,
  dbInstance = db,
}: IStopActiveTimerInput) => {
  const updated = await dbInstance
    .update(serviceTimersSchema)
    .set({
      endTime: getSqlCurrentTimestamp(),
      updatedAt: getSqlCurrentTimestamp(),
      updatedBy: author,
    })
    .where(
      and(
        eq(serviceTimersSchema.jobId, jobId),
        eq(serviceTimersSchema.providerId, providerId),
        isNull(serviceTimersSchema.endTime)
      )
    )
    .returning();
  return updated.length ? updated[0] : undefined;
};
