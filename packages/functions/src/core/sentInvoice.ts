import { SQL, and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { useDb } from 'db/dbClient';
import { sentInvoices as sentInvoicesSchema } from 'db/schema/sentInvoices';
import { jobInvoices as jobInvoicesSchema } from 'db/schema/jobInvoices';
import { S3_SIGNED_LINK_EXPIRATION, SentInvoiceStatus } from '@utils/constants';
import { IdScalar } from '@utils/schema';
import { TransformedEvent } from '@utils/helpers';
import { TruckupNotFoundError } from 'src/errors';
import { createReadUrl } from 'clients/storage';
import { Bucket } from 'sst/node/bucket';
import { TDatabaseOrTransaction } from '@utils/dbTransaction';

// eslint-disable-next-line import/no-self-import
export * as SentInvoice from './sentInvoice';

const joinColumns = {
  id: sentInvoicesSchema.id,
  createdBy: sentInvoicesSchema.createdBy,
  createdAt: sentInvoicesSchema.createdAt,
  updatedBy: sentInvoicesSchema.updatedBy,
  updatedAt: sentInvoicesSchema.updatedAt,
  jobInvoiceId: sentInvoicesSchema.jobInvoiceId,
  emailFrom: sentInvoicesSchema.emailFrom,
  emailTo: sentInvoicesSchema.emailTo,
  subject: sentInvoicesSchema.subject,
  body: sentInvoicesSchema.body,
  sentByUser: sentInvoicesSchema.sentByUser,
  sentAt: sentInvoicesSchema.sentAt,
  status: sentInvoicesSchema.status,
  filename: sentInvoicesSchema.filename,
  jobId: jobInvoicesSchema.jobId,
};

const createSchema = z.object({
  createdBy: z.string(),
  jobInvoiceId: IdScalar,
  emailFrom: z.string().email(),
  emailTo: z.string(),
  subject: z.string(),
  body: z.string(),
  sentByUser: IdScalar,
  filename: z.string(),
});

const updateSchema = z.object({
  sentInvoiceId: IdScalar,
  updateSentAt: z.boolean().optional(),
  status: z.enum([
    SentInvoiceStatus.PREVIEW,
    SentInvoiceStatus.SENDING,
    SentInvoiceStatus.SENT,
  ]),
});

export type TCreateParams = z.infer<typeof createSchema>;
export type TUpdateParams = z.infer<typeof updateSchema>;

type TUpdateEvent = {
  updatedBy: string;
  updatedAt: SQL<unknown>;
};

type TListParams = {
  transformedEvent: Omit<TransformedEvent, 'paginate'>;
  jobId?: number;
};

export const create = async (
  params: TCreateParams,
  db: TDatabaseOrTransaction = useDb()
) => {
  const values = createSchema.parse(params);

  const [invoice] = await db
    .insert(sentInvoicesSchema)
    .values(values)
    .returning();

  return invoice;
};

export const update = async (
  params: TUpdateParams,
  { updatedBy, updatedAt }: TUpdateEvent,
  db: TDatabaseOrTransaction = useDb()
) => {
  const { sentInvoiceId, updateSentAt, ...values } = updateSchema.parse(params);

  const [invoice] = await db
    .update(sentInvoicesSchema)
    .set({
      ...values,
      ...(updateSentAt && { sentAt: updatedAt }),
      updatedBy,
      updatedAt,
    })
    .where(eq(sentInvoicesSchema.id, sentInvoiceId))
    .returning();

  if (!invoice) throw new TruckupNotFoundError();
  return invoice;
};

export const list = async (
  { transformedEvent, jobId }: TListParams,
  db: TDatabaseOrTransaction = useDb()
) => {
  const { filters, offset, orderBy, size } = transformedEvent;

  return await db
    .select(joinColumns)
    .from(sentInvoicesSchema)
    .leftJoin(
      jobInvoicesSchema,
      eq(sentInvoicesSchema.jobInvoiceId, jobInvoicesSchema.id)
    )
    .offset(offset)
    .orderBy(orderBy)
    .where(and(jobId ? eq(jobInvoicesSchema.jobId, jobId) : undefined, filters))
    .limit(size)
    .execute();
};

type TInvoiceListResponse = Awaited<ReturnType<typeof list>>[number];

export const linkAdder =
  ({ expiresIn = S3_SIGNED_LINK_EXPIRATION }: { expiresIn?: number } = {}) =>
  async (sentInvoice: TInvoiceListResponse) => {
    const linkData = sentInvoice.status !== SentInvoiceStatus.GENERATING && {
      invoiceUrl: await createReadUrl({
        bucket: Bucket.JobDocumentsBucket.bucketName,
        key: `${sentInvoice.jobId}/${sentInvoice.filename}`,
        expiresIn,
      }),
      invoiceUrlExpiresIn: expiresIn * 1000,
    };
    return {
      ...sentInvoice,
      ...linkData,
    };
  };
