import { z } from 'zod';
import { useDb } from 'db/dbClient';
import { dbJobComments } from 'db/schema/jobComments';
import { jobs } from 'db/schema/jobs';
import { TruckupForbiddenError, TruckupNotFoundError } from 'src/errors';
import { SQL, and, desc, eq, sql } from 'drizzle-orm';
import { IdScalar, PathIdScalar } from '@utils/schema';
import { users } from 'db/schema/users';
import { providers } from 'db/schema/providers';

// eslint-disable-next-line import/no-self-import
export * as JobComments from './jobComments';

export const roleSchema = z.enum(['AGENT', 'PROVIDER']);
export type IRole = z.infer<typeof roleSchema>;

export const listPathParams = z.object({
  jobId: PathIdScalar,
  vehicleId: PathIdScalar,
});

export const getPathParams = listPathParams.extend({
  commentId: PathIdScalar,
});

export const createPathParams = listPathParams;
export const createBody = z.object({ text: z.string().min(1) });

export const updatePathParams = getPathParams;
export const updateBody = z.object({ text: z.string().min(1) });

export const deletePathParams = getPathParams;

const dbSchema = { jobComments: dbJobComments, jobs };

export const assertAccessProvider = async ({
  providerId,
  jobId,
}: {
  providerId: number;
  jobId: number;
}) => {
  const [{ count }] = await useDb(dbSchema)
    .select({ count: sql<number>`COUNT(*)` })
    .from(jobs)
    .where(and(eq(jobs.id, jobId), eq(jobs.provider_id, providerId)));
  if (count === 1) return true;
  throw new TruckupNotFoundError();
};

export const assertCommentOwner = async ({
  commentId,
  userId,
}: {
  commentId: number;
  userId: number;
}) => {
  const [comment] = await useDb(dbSchema)
    .select({
      userId: dbJobComments.userId,
    })
    .from(dbJobComments)
    .where(eq(dbJobComments.id, commentId));
  if (!comment) throw new TruckupNotFoundError();
  if (comment.userId !== userId) throw new TruckupForbiddenError();
};

export const createSchema = z.object({
  jobId: IdScalar,
  vehicleId: IdScalar,
  userId: IdScalar,
  role: roleSchema,
  text: z.string().min(1),
  createdBy: z.string().min(1),
});

export type ICreateParams = z.infer<typeof createSchema>;
export const create = async (params: ICreateParams) => {
  const values = createSchema.parse(params);
  const db = useDb(dbSchema);
  const [comment] = await db.insert(dbJobComments).values(values).returning();
  return comment;
};

export const updateSchema = z.object({
  commentId: IdScalar,
  text: z.string().min(1),
  updatedBy: z.string().min(1),
  updatedAt: z.instanceof(SQL),
});
export type IUpdateParams = z.infer<typeof updateSchema>;
export const update = async (params: IUpdateParams) => {
  const { commentId, ...updates } = updateSchema.parse(params);
  const [comment] = await useDb(dbSchema)
    .update(dbJobComments)
    .set({
      ...updates,
      editedAt: updates.text !== undefined ? updates.updatedAt : undefined,
    })
    .where(eq(dbJobComments.id, commentId))
    .returning();
  if (comment) return comment;
  throw new TruckupNotFoundError();
};

export const deleteSchema = z.object({ commentId: IdScalar });
export type IDeleteParams = z.infer<typeof deleteSchema>;
export const del = async (params: IDeleteParams) => {
  const { commentId } = deleteSchema.parse(params);
  const [deleted] = await useDb(dbSchema)
    .delete(dbJobComments)
    .where(eq(dbJobComments.id, commentId))
    .returning();
  if (!deleted) throw new TruckupNotFoundError();
  return deleted;
};

export const listSchema = z.object({ jobId: IdScalar, vehicleId: IdScalar });
export type IListParams = z.infer<typeof listSchema>;
export const list = async (params: IListParams) => {
  const { jobId, vehicleId } = listSchema.parse(params);
  const db = useDb(dbSchema);
  const where = and(
    eq(dbJobComments.jobId, jobId),
    eq(dbJobComments.vehicleId, vehicleId)
  );
  const [comments, [{ total }]] = await Promise.all([
    db
      .select({
        id: dbJobComments.id,
        createdAt: dbJobComments.createdAt,
        editedAt: dbJobComments.editedAt,
        jobId: dbJobComments.jobId,
        vehicleId: dbJobComments.vehicleId,
        userId: dbJobComments.userId,
        role: dbJobComments.role,
        text: dbJobComments.text,
        firstname: sql<string>`COALESCE(${providers.firstname}, ${users.username})`,
        lastname: providers.lastname,
      })
      .from(dbJobComments)
      .where(where)
      .orderBy(desc(dbJobComments.createdAt))
      .innerJoin(users, eq(users.id, dbJobComments.userId))
      .leftJoin(providers, eq(providers.app_user_id, dbJobComments.userId)),
    db
      .select({ total: sql<number>`COUNT(*)` })
      .from(dbJobComments)
      .where(where),
  ]);
  return [comments, total] as const;
};
