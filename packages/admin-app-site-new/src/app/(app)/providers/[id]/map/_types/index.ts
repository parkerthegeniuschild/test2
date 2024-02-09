export type RecentLocation = {
  id: number;
  timestamp: string;
  providerId: number;
  jobId?: number;
  speed?: number;
  course?: number;
  longitude: number;
  latitude: number;
  accuracy?: number;
  isMoving: boolean;
};
