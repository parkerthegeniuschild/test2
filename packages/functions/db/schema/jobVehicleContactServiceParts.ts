import { relations } from 'drizzle-orm';
import {
  AnyPgColumn,
  bigint,
  bigserial,
  numeric,
  pgTable,
  smallint,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { PositiveIntScalar } from '@utils/schema';
import { jobVehicleContactServices } from './jobVehicleContactServices';
import { providers } from './providers';

export const jobVehicleContactServiceParts = pgTable(
  'job_vehicle_contact_service_part',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    created_by: varchar('created_by', { length: 256 }).notNull(),
    created_at: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_by: varchar('updated_by', { length: 256 }),
    updated_at: timestamp('updated_at', { withTimezone: true }),
    // This indicates that the service was created by the provider, and they can edit
    provider_id: bigint('provider_id', { mode: 'number' }).references(
      () => providers.id
    ),
    job_vehicle_contact_service_id: bigint('job_vehicle_contact_service_id', {
      mode: 'number',
    })
      .notNull()
      .references((): AnyPgColumn => jobVehicleContactServices.id, {
        onUpdate: 'cascade',
        onDelete: 'cascade',
      }),
    name: varchar('name', { length: 256 }).notNull(),
    description: text('description'),
    quantity: smallint('quantity'),
    price: numeric('price'),
    price_cents: bigint('price_cents', { mode: 'number' }),
    markup: smallint('markup'),
    old_id: bigint('old_id', { mode: 'number' }),
  }
);

export const jobVehicleContactServicePartsRelations = relations(
  jobVehicleContactServiceParts,
  ({ one }) => ({
    jobVehicleService: one(jobVehicleContactServices, {
      fields: [jobVehicleContactServiceParts.job_vehicle_contact_service_id],
      references: [jobVehicleContactServices.id],
    }),
  })
);

export const createJobVehicleContactServicePartSchema = createInsertSchema(
  jobVehicleContactServiceParts
).pick({
  name: true,
  description: true,
  quantity: true,
  price: true,
  markup: true,
});

export const updateJobVehicleContactServicePartSchema = createInsertSchema(
  jobVehicleContactServiceParts,
  {
    name: (schema) => schema.name.optional(),
    description: (schema) => schema.description.optional(),
    quantity: (schema) => schema.quantity.optional(),
    price: (schema) => schema.price.optional(),
    markup: (schema) => schema.markup.optional(),
  }
).pick({
  name: true,
  description: true,
  quantity: true,
  price: true,
  markup: true,
});

export const selectJobVehicleContactServicePartSchema = createSelectSchema(
  jobVehicleContactServiceParts
);

export const selectJobVehicleContactServicePartSchemaForPublish =
  createSelectSchema(jobVehicleContactServiceParts, {
    name: (schema) => schema.name.nonempty(),
  });

export type ISelectJobVehicleContactServicePartSchemaForPublish = z.infer<
  typeof selectJobVehicleContactServicePartSchemaForPublish
>;

export const selectJobVehicleContactServicePartSchemaWithDefaultValues =
  createSelectSchema(jobVehicleContactServiceParts, {
    name: z.string().nonempty(),
    price: z.string().nonempty(),
    price_cents: PositiveIntScalar,
    markup: z.number().positive(),
    quantity: z.number().positive(),
  });

export type ISelectJobVehicleContactServicePartSchemaWithDefaultValues =
  z.infer<typeof selectJobVehicleContactServicePartSchemaWithDefaultValues>;
