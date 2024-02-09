import { VehicleType } from './constants';
import { type TTemplates } from '../functions/clients/templates';
import { Enum } from './types';

type TCompany = {
  name: string;
  address1: string | null;
  address2: string | null;
  city: string | null;
  state: string | null;
  zipcode: string | null;
};

type TDispatcher = {
  firstname: string | null;
  lastname: string | null;
};

type TJob = {
  id: number;
  created_at: Date;
  invoice_message: string | null;
  location_address: string | null;
  customer_ref: string | null;
  company: TCompany | null;
  dispatcher: TDispatcher | null;
  jobVehicles: TJobVehicle[];
};

export type TJobServiceParts = {
  id: number;
  name: string;
  quantity: number | null;
  price_cents: number | null;
  markup: number | null;
};

type TService = {
  id: number;
  name: string;
  description: string | null;
};

export type TJobService = {
  id: number;
  description: string;
  jobServiceParts: TJobServiceParts[];
  service: TService | null;
};

export type TJobVehicle = {
  id: number;
  type: Enum<typeof VehicleType> | null;
  year: number | null;
  manufacturer: string | null;
  model: string | null;
  vin_serial: string | null;
  mileage: string | null;
  unit: string | null;
  jobServices: TJobService[];
};

type TCharge = {
  surpassedMinimum: boolean;
  laborHoursAmount: number;
  laborHoursUnitPriceCents: number;
  laborHoursUnitPriceCentsTotal: number;
  calloutPriceCents: number;
  fuelSurchargeCents: number;
  totalPriceCents: number;
};

type TPayment = {
  totalAmountPaidCents: number;
};

type TData = {
  job: TJob;
  charge: TCharge;
  payments: TPayment;
  balanceCents: number;
  invoiceId?: number;
};

export type TInvoiceDataGenerator = {
  data: TData;
  templates: TTemplates;
};

export type TVehicleTemplateReplacer = {
  data: TJobVehicle[];
  vehicleTemplate: TTemplates['vehicleTemplate'];
  serviceTemplate: TTemplates['serviceTemplate'];
  serviceSubTotalTemplate: TTemplates['serviceSubTotalTemplate'];
  partTemplate: TTemplates['partTemplate'];
};

export type TContentTemplateReplacer = {
  data: TData;
  contentTemplate: TTemplates['contentTemplate'];
};

export type TGetInvoiceFilePath = {
  prefix: string;
  jobId: number;
};

export type TmapEntryReplacer = {
  dataMap: Record<string, unknown>;
  originalContent: string;
};

export type TGetDraweeData = {
  company: TCompany | null;
  dispatcher: TDispatcher | null;
};
