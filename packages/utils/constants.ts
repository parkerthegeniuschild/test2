import type { Algorithm } from 'fast-jwt';
export * as default from './constants';

export const ROLE = {
  PROVIDER: 'ROLE_PROVIDER',
  AGENT: 'ROLE_AGENT',
} as const;

export const ProviderType = {
  BACKUP: 'BACKUP',
  PRO: 'PRO',
} as const;

export const JobStatuses = {
  UNASSIGNED: 'UNASSIGNED',
  NOTIFYING: 'NOTIFYING',
  ACCEPTED: 'ACCEPTED',
  MANUAL: 'MANUAL',
  PAUSE: 'PAUSE',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED_PENDING_REVIEW: 'COMPLETED_PENDING_REVIEW',
  CANCELED_PENDING_REVIEW: 'CANCELED_PENDING_REVIEW',
  COMPLETED: 'COMPLETED',
  CANCELED: 'CANCELED',
  DRAFT: 'DRAFT',
} as const;

export const JobRequestStatus = {
  UNASSIGNED: 'UNASSIGNED',
  NOTIFYING: 'NOTIFYING',
  LOST: 'LOST',
  NO_RESPONSE: 'NO_RESPONSE',
  ASSIGNED: 'ASSIGNED',
  ACCEPTED: 'ACCEPTED',
  CANCELED: 'CANCELED',
  COMPLETED: 'COMPLETED',
  DECLINED: 'DECLINED',
  REMOVED: 'REMOVED',
} as const;

export const CompanyType = {
  FLEET: 'Fleet',
} as const;

export const JobServiceType = {
  TRUCK_REPAIR_ONE_HOUR_MIN: 'Truck Repair - 1 hour min',
  TRUCK_REPAIR_TWO_HOUR_MIN: 'Truck Repair - 2 hour min',
} as const;

export const ImageType = {
  PNG: 'image/png',
  JPEG: 'image/jpeg',
  JPG: 'image/jpg',
} as const;

export const TransactionLogType = {
  CREDIT: 'CREDIT',
  DEBIT: 'DEBIT',
} as const;

export const TransactionLogSource = {
  JOB_PAYMENT: 'JOB_PAYMENT',
  PROVIDER_INITIAL_BALANCE: 'PROVIDER_INITIAL_BALANCE',
  PROVIDER_PAYOUT: 'PROVIDER_PAYOUT',
  AGENT_ADJUSTMENT: 'AGENT_ADJUSTMENT',
} as const;

export const Method = {
  POST: 'post',
  GET: 'get',
  PATCH: 'patch',
  DELETE: 'delete',
} as const;

export const ErrorMessage = {
  UNAUTHORIZED: 'Unauthorized',
  BAD_REQUEST: 'Bad request',
  FORBIDDEN: 'Forbidden',
  INTERNAL_SERVER_ERROR: 'Internal server error',
} as const;

export const MethodCode = {
  [Method.GET]: '200',
  [Method.POST]: '201',
  [Method.PATCH]: '200',
  [Method.DELETE]: '200',
} as const;

export const SuccessMessage = {
  [MethodCode[Method.GET]]: 'OK',
  [MethodCode[Method.POST]]: 'Created',
} as const;

export const Audience = {
  ADMINS: 'Admins',
  USERS: 'Users',
  COMMON: 'Common',
  PUBLIC: 'Public',
} as const;

export const ApiDocsTag = {
  [Audience.ADMINS]: {
    name: Audience.ADMINS,
    description:
      "All endpoints tagged 'Admins' in this API are restricted to administrators only. Authentication as an admin is required to access these endpoints, ensuring secure management and control over sensitive functionalities related to user operations and system administration.",
  },
  [Audience.USERS]: {
    name: Audience.USERS,
    description:
      "All endpoints tagged 'Users' within this API are designed for regular user interactions. These functionalities are accessible only to authenticated users, ensuring a secure environment for managing personal information and conducting user-specific operations within the system.",
  },
  [Audience.COMMON]: {
    name: Audience.COMMON,
    description:
      "All endpoints tagged 'Common' in this API are open to both administrators and regular users. These functionalities provide shared access, allowing common operations that are applicable to both user roles for a seamless and collaborative user experience within the system.",
  },
  [Audience.PUBLIC]: {
    name: Audience.PUBLIC,
    description:
      "All endpoints tagged 'Public' in this API are open to the public, with no auth.",
  },
} as const;

export const SentInvoiceStatus = {
  GENERATING: 'GENERATING',
  PREVIEW: 'PREVIEW',
  SENDING: 'SENDING',
  SENT: 'SENT',
} as const;

export const DBSortOrder = {
  ASCENDING: 'asc',
  DESCENDING: 'desc',
} as const;

export const PDF_MARGINS_DEFAULT = {
  top: '77px',
  bottom: '61px',
  left: '30px',
  right: '30px',
};

export type Role = (typeof ROLE)[keyof typeof ROLE];
export const ROLE_NAMES: string[] = Object.values(ROLE);

export const STAGE = {
  PROD: 'prod',
  STAGING: 'staging',
  DEV: 'dev',
} as const;
export const NON_SANDBOX_STAGES: string[] = [STAGE.PROD, STAGE.STAGING];

export const NODE_ENV = { TEST: 'test' } as const;

export const LEGACY_API_URL = 'https://uat-api.truckup.dev/api';

export const DISPATCHERS_TYPE_ID = 1058;

export const ZONE = {
  [STAGE.PROD]: 'truckup.com',
  [STAGE.STAGING]: 'truckup-staging.com',
  [STAGE.DEV]: 'truckup.tech',
};
/**
 * Auth configuration
 */
const REQUEST_TIMEOUT_SECONDS = 15;
const OTP_EXPIRATION_MINUTES = 15;
const OTP_BYTES = 3;
const CHALLENGE_BYTES = 16;
export const AUTH = {
  MOCK_PHONE: '11111111111',
  MOCK_OTP: 111111,
  MOCK_OTP_HASH: 'vLFfghR5tNV3K9DKhmwArV-SbjWAcgZZzIDTnJ0JgCo',
  MOCK_CHALLENGE: 'FAyT-DEokUYaSUyKK2CD7w',
  MOCK_CHALLENGE_HASH: 'ngYS4W8hkX7yi27rrJ5Oeo80pOPWAj27K8xD9DHdUtI',
  REQUEST_TIMEOUT_SECONDS,
  REQUEST_TIMEOUT: REQUEST_TIMEOUT_SECONDS * 1000,
  OTP_EXPIRATION_MINUTES,
  OTP_EXPIRATION: OTP_EXPIRATION_MINUTES * 60 * 1000,
  MAX_STRIKES: 5,
  ALGO: 'sha256',
  ENCODING: 'base64url' satisfies BufferEncoding,
  OTP_BYTES,
  CHALLENGE_BYTES,
  TOTAL_BYTES: OTP_BYTES + CHALLENGE_BYTES,
  JWT_ALGO: 'ES256' satisfies Algorithm,
  JWT_VERSION: 1,
  JWT_KID: 1,
  JWT_PUBLIC_KEY: `-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEtDyeht+GBTicMHlZ8YSPlBafVJaG
xId55EoHheWZZrILyY1gn7pAeglfNRFnIHjuIYsHcf7S5lTfAw84dqg6oA==
-----END PUBLIC KEY-----`,
  JWT_EXPIRATION: 30 * 24 * 60 * 60 * 1000, // 30 days
  JWT_EXPIRATION_AGENT: 7 * 24 * 60 * 60 * 1000, // 7 days
  VERSION_HEADER: 'X-TUP-Auth-Version',
  AUTH_VERSION: '1',
  AUTH_VERSION_LEGACY: '0',
} as const;

export const ERROR = {
  jobNotAvailable: 'JOB_NOT_AVAILABLE',
  noJob: 'NO_JOB',
  notApproved: 'NOT_APPROVED',
  providerNoLocation: 'PROVIDER_NO_LOCATION',
  error400: {
    missingRequiredFields: 'MISSING_REQUIRED_FIELDS',
    markupCantBeLessThanMin: 'MARKUP_CANT_BE_LESS_THAN_MIN',
  },
} as const;

export const MANUFACTURERS_LIST = [
  { manufacturer: 'Chevrolet' },
  { manufacturer: 'Ford' },
  { manufacturer: 'Freightliner' },
  { manufacturer: 'GMC' },
  { manufacturer: 'Hino' },
  { manufacturer: 'International' },
  { manufacturer: 'Isuzu' },
  { manufacturer: 'Kenworth' },
  { manufacturer: 'Mack' },
  { manufacturer: 'Mitsubishi' },
  { manufacturer: 'Peterbilt' },
  { manufacturer: 'Ram' },
  { manufacturer: 'Volvo' },
  { manufacturer: 'Western Star' },
  { manufacturer: 'Other' },
];

export const PARTS_MARKUP_DENOMINATOR = 100;

export const VEHICLE_COLORS: Record<
  string,
  { backgroundColor: string; border?: string }
> = {
  White: {
    backgroundColor: 'white',
    border: '1px solid #dde1e5',
  },
  Black: {
    backgroundColor: '#262c33',
  },
  Gray: {
    backgroundColor: '#e4e8ed',
  },
  Yellow: {
    backgroundColor: '#eab308',
  },
  Orange: {
    backgroundColor: '#ff800a',
  },
  Pink: {
    backgroundColor: '#d53f8c',
  },
  Red: {
    backgroundColor: '#e53e3e',
  },
  Green: {
    backgroundColor: '#38a169',
  },
  Blue: {
    backgroundColor: '#1c92FF',
  },
  Purple: {
    backgroundColor: '#af00cc',
  },
  Tan: {
    backgroundColor: 'tan',
  },
  Brown: {
    backgroundColor: 'brown',
  },
};

export const VehicleType = {
  TRUCK_WITH_TRAILER: 'Truck with trailer',
  TRUCK_ONLY: 'Truck only',
  TRUCK: 'Truck',
  TRAILER_ONLY: 'Trailer only',
  DUMP_TRUCK: 'Dump truck',
  BUS: 'Bus',
  RV: 'RV',
  EQUIPMENT: 'Equipment',
  UNKNOWN: 'UNKNOWN',
} as const;

export const S3_SIGNED_LINK_EXPIRATION = 604800; // 7 days in seconds

export const DEFAULT_PROVIDER_RATES = {
  rate: 65,
  callout: 25,
};

export const DEFAULT_JOB_RATE_CENTS = {
  callout: 11500,
  rate: 14500,
  fuelSurcharge: 0,
};

export const DEFAULT_TAX_RATE = 0;
