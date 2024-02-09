import type { SentInvoicesByJobIdSchema } from '@gettruckup/bindings';

import type { JobStatus } from '@/app/(app)/jobs/_types';
import type {
  Company,
  Dispatcher,
  Driver,
} from '@/app/(app)/jobs/(index)/_types';

export type Coordinate = {
  latitude: number;
  longitude: number;
};

export type ServiceType = { id: number; name: string };

export type Vehicle = {
  id: number;
  type?: string | null;
  year?: number | null;
  unit?: string | null;
  model?: string | null;
  color?: string | null;
  vin_serial?: string | null;
  usdot?: string | null;
  mileage?: number | null;
  manufacturer?: string | null;
};

export type VehicleService = {
  id: number;
  description: string;
  service_id: number | null;
  status: 'READY' | 'STARTED' | 'PAUSED' | 'COMPLETED';
};

export type ServicePart = {
  id: number;
  name: string;
  description?: string | null;
  quantity: number;
  price: number | string;
  markup: number;
};

export type JobService = VehicleService & {
  jobServiceParts: ServicePart[];
};

export type VehiclePhoto = {
  id: number;
  url: string;
  vehicleId: number;
};

export type VehicleContact = Vehicle & {
  commentsCount?: number;
  jobPhotos?: VehiclePhoto[];
  jobServices: JobService[];
};

export type Job = {
  id: number;
  dispatcher_id: number;
  company_id: number | null;
  status_id: JobStatus;
  is_abandoned: boolean;
  customer_ref: string | null;
  company?: Company;
  provider_rate_cents: number;
  provider_callout_cents: number;
  invoice_message: string | null;
  dispatcher: Dispatcher & { is_no_text_messages: boolean };
  provider?: {
    id: number;
    firstname: string;
    lastname?: string;
    is_blocked: boolean;
    is_onjob: boolean;
    is_online: boolean;
    rating: number;
    phone?: string;
    position?: {
      distance: number;
      created_at?: string;
      updated_at?: string;
      location?: {
        latitude: number;
        longitude: number;
      };
    };
  } | null;
  jobDrivers: Driver[];
  location_address: string | null;
  location_city: string | null;
  location_state: string | null;
  location_type: string | null;
  location_street: string | null;
  location_street_number: string | null;
  location_zip: string | null;
  location_latitude: number | null;
  location_longitude: number | null;
  location_details: string | null;
  location_notes: string | null;
  jobVehicles: VehicleContact[] | null;
  created_at: string;
};

export type JobRequest = {
  id: number;
  provider_id: number;
  status:
    | 'NOTIFYING'
    | 'LOST'
    | 'NO_RESPONSE'
    | 'ASSIGNED'
    | 'ACCEPTED'
    | 'CANCELED'
    | 'COMPLETED'
    | 'DECLINED'
    | 'REMOVED';
  created_at: string;
  updated_at: string | null;
};

export type Comment = {
  id: number;
  firstname: string;
  lastname: string;
  role: 'AGENT' | 'PROVIDER';
  user_id: number;
  created_at: string;
  edited_at: string | null;
  text: string;
};

export type Labor = {
  seconds_worked: number;
  service_id: number | null;
  vehicle_id: number | null;
  timers: Array<{
    id: number;
    seconds_worked: number;
    start_time: string;
    end_time: string | null;
  }>;
};

export type EmailedInvoiceEntry = SentInvoicesByJobIdSchema['data'][number];
