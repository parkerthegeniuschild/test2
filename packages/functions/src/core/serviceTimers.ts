import { getSqlCurrentTimestamp } from '@utils/helpers';
import { useDb } from 'db/dbClient';
import {
  jobVehicleContactServices as jobVehicleContactServicesSchema,
  JobVehicleContactServicesStatus,
} from 'db/schema/jobVehicleContactServices';
import {
  IPatchServiceTimerSchema,
  createServiceTimerSchema,
  serviceTimers as serviceTimersSchema,
  IServiceTimer as IServiceTimerSchema,
  IPostServiceTimerSchema,
} from 'db/schema/serviceTimers';
import { and, desc, eq, gte, isNull, lte, ne, or, sql } from 'drizzle-orm';
import { IServiceTimerPatchPath } from 'dto/serviceTimers/patch';
import { createTimer, deleteTimer, updateTimer } from '@db/serviceTimers';
import {
  TruckupBadRequestError,
  TruckupLaborAlreadyInProgressError,
  TruckupLaborEndTimeBeforeStartTimeError,
  TruckupLaborHasOverlapError,
  TruckupLaborOnFutureError,
  TruckupNotFoundError,
} from 'src/errors';
import { updateServiceStatus } from '@db/jobVehicleContactServices';
import { TDatabaseOrTransaction } from '@utils/dbTransaction';
import { getOnlyJobById } from './jobs';

export type IServiceTimer = {
  jobId: number;
  jobVehicleContactServiceId?: number;
  providerId: number;
  author: string;
  status: string;
  keepWorking: boolean;
};

export interface IGetTimersByJobId {
  id: number;
  jobId: number;
  jobVehicleContactServiceId?: number | null;
  jobVehicleContactId?: number | null;
  providerId?: number | null;
  startTime: Date;
  endTime?: Date | null;
  timer: number;
}

export const validateServiceStatusChange = async (
  serviceTimer: IServiceTimer,
  dbInstance: TDatabaseOrTransaction = useDb()
): Promise<void> => {
  switch (serviceTimer.status) {
    case 'STARTED':
      await startTimer(serviceTimer, dbInstance);
      break;
    case 'PAUSED':
    case 'COMPLETED':
      await stopTimer({ serviceTimer, dbInstance });
      break;
    default:
  }
};

export const getTimersByJobId = (
  jobId: number,
  providerId?: number,
  db: TDatabaseOrTransaction = useDb()
): Promise<IGetTimersByJobId[]> => {
  return db
    .select({
      id: serviceTimersSchema.id,
      jobId: serviceTimersSchema.jobId,
      jobVehicleContactServiceId:
        serviceTimersSchema.jobVehicleContactServiceId,
      providerId: serviceTimersSchema.providerId,
      startTime: serviceTimersSchema.startTime,
      endTime: serviceTimersSchema.endTime,
      jobVehicleContactId:
        jobVehicleContactServicesSchema.job_vehicle_contact_id,
      timer: sql
        .raw(
          `FLOOR(EXTRACT(EPOCH from (COALESCE(${serviceTimersSchema.endTime.name}, CURRENT_TIMESTAMP) - ${serviceTimersSchema.startTime.name})))`
        )
        .as<number>('time'),
    })
    .from(serviceTimersSchema)
    .leftJoin(
      jobVehicleContactServicesSchema,
      eq(
        jobVehicleContactServicesSchema.id,
        serviceTimersSchema.jobVehicleContactServiceId
      )
    )
    .where(
      and(
        eq(serviceTimersSchema.jobId, jobId),
        providerId ? eq(serviceTimersSchema.providerId, providerId) : undefined
      )
    )
    .orderBy(desc(serviceTimersSchema.startTime))
    .execute() satisfies Promise<IGetTimersByJobId[]>;
};

export const getActiveTimer = async (
  jobId: number,
  dbInstance: TDatabaseOrTransaction = useDb()
) => {
  const timer = await dbInstance
    .select()
    .from(serviceTimersSchema)
    .where(
      and(
        eq(serviceTimersSchema.jobId, jobId),
        isNull(serviceTimersSchema.endTime)
      )
    );
  if (timer.length > 1) throw new TruckupBadRequestError();
  return timer.length ? timer[0] : undefined;
};

interface IStopTimerInput {
  serviceTimer: IServiceTimer;
  anyTimer?: boolean;
  forcedEndTime?: Date;
  dbInstance?: TDatabaseOrTransaction;
}

export const stopTimer = async ({
  serviceTimer,
  anyTimer,
  forcedEndTime,
  dbInstance = useDb(),
}: IStopTimerInput) => {
  await dbInstance
    .update(serviceTimersSchema)
    .set({
      endTime: forcedEndTime || getSqlCurrentTimestamp(),
      updatedBy: serviceTimer.author,
      updatedAt: getSqlCurrentTimestamp(),
    })
    .where(
      and(
        eq(serviceTimersSchema.jobId, serviceTimer.jobId),
        isNull(serviceTimersSchema.endTime),
        !anyTimer && serviceTimer.jobVehicleContactServiceId
          ? eq(
              serviceTimersSchema.jobVehicleContactServiceId,
              serviceTimer.jobVehicleContactServiceId
            )
          : isNull(serviceTimersSchema.jobVehicleContactServiceId)
      )
    )
    .returning();

  if (serviceTimer.keepWorking) {
    await startTimer(
      {
        ...serviceTimer,
        jobVehicleContactServiceId: undefined,
      },
      dbInstance
    );
  }
};

export const startTimer = async (
  serviceTimer: IServiceTimer,
  dbInstance: TDatabaseOrTransaction = useDb()
) => {
  const timer = await getActiveTimer(serviceTimer.jobId, dbInstance);

  if (timer) {
    if (timer.jobVehicleContactServiceId) throw new TruckupBadRequestError();

    await stopTimer({ serviceTimer, anyTimer: true, dbInstance });
  }

  const newTimer = createServiceTimerSchema.parse({
    ...serviceTimer,
    createdBy: serviceTimer.author,
  });

  await dbInstance.insert(serviceTimersSchema).values(newTimer).returning();
};

export const getTimerById = async (
  timerId: number
): Promise<IServiceTimerSchema> => {
  const timer = await useDb()
    .select()
    .from(serviceTimersSchema)
    .where(eq(serviceTimersSchema.id, timerId))
    .execute();
  return timer[0] || undefined;
};

interface ICheckOverlappingTimerInput {
  providerId: number;
  startTime: Date;
  endTime?: Date;
  timerId?: number;
}

export const checkOverlappingTimer = async ({
  providerId,
  startTime,
  endTime,
  timerId,
}: ICheckOverlappingTimerInput) => {
  const db = useDb();
  const [overlappingTimerCount, totalCount] = await Promise.all([
    db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(serviceTimersSchema)
      .where(
        and(
          eq(serviceTimersSchema.providerId, providerId),
          timerId ? ne(serviceTimersSchema.id, timerId) : undefined,
          or(
            and(
              gte(
                serviceTimersSchema.startTime,
                sql`${startTime.toISOString()}::timestamp`
              ),
              endTime
                ? gte(
                    serviceTimersSchema.startTime,
                    sql`${endTime.toISOString()}::timestamp`
                  )
                : undefined
            ),
            and(
              lte(
                serviceTimersSchema.endTime,
                sql`${startTime.toISOString()}::timestamp`
              ),
              endTime
                ? lte(
                    serviceTimersSchema.endTime,
                    sql`${endTime.toISOString()}::timestamp`
                  )
                : undefined
            )
          )
        )
      )
      .execute(),
    db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(serviceTimersSchema)
      .where(
        and(
          eq(serviceTimersSchema.providerId, providerId),
          timerId ? ne(serviceTimersSchema.id, timerId) : undefined
        )
      )
      .execute(),
  ]);

  return overlappingTimerCount[0].count !== totalCount[0].count;
};

export const isEndTimeGreaterThanStartTime = (
  startTime: Date,
  endTime?: Date
) => (endTime ? startTime.getTime() > endTime.getTime() : false);

export const isTimeInTheFuture = (time: Date) => time.getTime() > Date.now();

export const updateTimerAction = async (
  pathParams: IServiceTimerPatchPath,
  body: IPatchServiceTimerSchema
) => {
  const timer = await getTimerById(pathParams.timerId);

  if (!timer) throw new TruckupNotFoundError();

  if (
    isEndTimeGreaterThanStartTime(
      body.startTime || timer.startTime,
      body.endTime || timer.endTime || undefined
    )
  )
    throw new TruckupLaborEndTimeBeforeStartTimeError();

  if (
    (body.startTime && isTimeInTheFuture(body.startTime)) ||
    (body.endTime && isTimeInTheFuture(body.endTime))
  )
    throw new TruckupLaborOnFutureError();

  const isOverlappingTimer = await checkOverlappingTimer({
    providerId: timer.providerId,
    startTime: body.startTime || timer.startTime,
    endTime: body.endTime || undefined,
    timerId: pathParams.timerId,
  });
  if (isOverlappingTimer) {
    throw new TruckupLaborHasOverlapError();
  }

  const updatedTimer = await updateTimer(pathParams, body);

  if (!updatedTimer.length) throw new TruckupNotFoundError();

  return updatedTimer[0];
};

export const deleteTimerAction = async (
  pathParams: IServiceTimerPatchPath,
  author: string
) => {
  const timer = await getTimerById(pathParams.timerId);

  if (!timer) throw new TruckupNotFoundError();

  await useDb().transaction(async (tx) => {
    const deletedTimer = await deleteTimer({
      timerId: pathParams.timerId,
      dbInstance: tx,
    });

    if (
      deletedTimer &&
      !!deletedTimer.startTime &&
      !deletedTimer.endTime &&
      !!deletedTimer.jobVehicleContactServiceId
    ) {
      await updateServiceStatus({
        id: deletedTimer.jobVehicleContactServiceId,
        status: JobVehicleContactServicesStatus.PAUSED,
        author,
        dbInstance: tx,
      });
    }
  });
};

export const createTimerAction = async (body: IPostServiceTimerSchema) => {
  if (body.endTime && !body.startTime) {
    throw new TruckupBadRequestError();
  }

  if (!body.endTime) {
    const activeTimer = await getActiveTimer(body.jobId);
    if (activeTimer) throw new TruckupLaborAlreadyInProgressError();
  }

  const job = await getOnlyJobById(body.jobId);

  if (!job) throw new TruckupNotFoundError();

  if (
    body.startTime &&
    isEndTimeGreaterThanStartTime(body.startTime, body.endTime || undefined)
  )
    throw new TruckupLaborEndTimeBeforeStartTimeError();

  if (
    (body.startTime && isTimeInTheFuture(body.startTime)) ||
    (body.endTime && isTimeInTheFuture(body.endTime))
  )
    throw new TruckupLaborOnFutureError();

  const isOverlappingTimer =
    !!body.startTime &&
    (await checkOverlappingTimer({
      providerId: body.providerId,
      startTime: body.startTime,
      endTime: body.endTime || undefined,
    }));
  if (isOverlappingTimer) {
    throw new TruckupLaborHasOverlapError();
  }

  let createdTimer;

  await useDb().transaction(async (tx) => {
    createdTimer = await createTimer({ body, dbInstance: tx });

    if (
      !!body.startTime &&
      !body.endTime &&
      !!body.jobVehicleContactServiceId
    ) {
      await updateServiceStatus({
        id: body.jobVehicleContactServiceId,
        status: JobVehicleContactServicesStatus.STARTED,
        author: body.createdBy,
        dbInstance: tx,
      });
    }
  });

  return createdTimer;
};
