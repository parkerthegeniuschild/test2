export type JobStatus =
  | 'DRAFT'
  | 'UNASSIGNED'
  | 'NOTIFYING'
  | 'ACCEPTED'
  | 'MANUAL'
  | 'PAUSE'
  | 'IN_PROGRESS'
  | 'COMPLETED_PENDING_REVIEW'
  | 'CANCELED_PENDING_REVIEW'
  | 'COMPLETED'
  | 'CANCELED';