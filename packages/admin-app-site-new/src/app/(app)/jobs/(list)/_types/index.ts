import { z } from 'zod';

import type { JobStatus } from '@/app/(app)/jobs/_types';

export type JobStatusFilter = Exclude<
  JobStatus,
  'COMPLETED_PENDING_REVIEW' | 'CANCELED_PENDING_REVIEW'
>;

export type Job = {
  id: number;
  created_at: string;
  status_id: JobStatus;
  total_cost: string;
  payment_sum: string;
  location_city: string;
  location_state: string;
  is_abandoned: boolean;
  company: { name: string } | null;
  jobLeaveReason: Array<{ reason: string }>;
  jobDrivers: Array<{
    id: number;
    firstname: string;
    lastname: string | null;
    phone: string;
    secondary_phone: string | null;
  }> | null;
  jobVehicle?: {
    vehicle: {
      vehicleDriver: {
        driver: {
          firstname: string;
          lastname: string | null;
          phone: string;
          is_no_text_messages: boolean;
        };
      } | null;
    };
  };
  jobRequest: {
    location_city: string;
    location_state: string;
  } | null;
  dispatcher: {
    firstname: string;
    lastname: string | null;
    phone: string;
    secondary_phone: string | null;
    is_no_text_messages: boolean;
  } | null;
  provider: {
    firstname: string;
    lastname: string | null;
    rating: number;
    is_blocked: boolean;
    is_onjob: boolean;
    is_online: boolean;
    phone: string;
  } | null;
};

export const pendingReviewStateSchema = z.enum(['yes', 'no', 'all']);

export type PendingReviewState = z.infer<typeof pendingReviewStateSchema>;

export type TabState = 'unpaid' | null;
