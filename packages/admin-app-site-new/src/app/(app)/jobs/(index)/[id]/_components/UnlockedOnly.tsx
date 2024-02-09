import type { JobStatus } from '@/app/(app)/jobs/_types';
import { useGetJob } from '@/app/(app)/jobs/(index)/[id]/_api';
import { useJobId } from '@/app/(app)/jobs/(index)/[id]/_hooks';

interface UnlockedOnlyProps {
  fallback?: React.ReactNode;
}

const LOCKED_STATUS: JobStatus[] = ['COMPLETED', 'CANCELED'];

export function UnlockedOnly({
  children,
  fallback = null,
}: React.PropsWithChildren<UnlockedOnlyProps>) {
  const jobId = useJobId();
  const getJob = useGetJob(jobId);

  if (getJob.data && LOCKED_STATUS.includes(getJob.data.status_id)) {
    return fallback;
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
}

export function useIsJobUnlocked() {
  const jobId = useJobId();
  const getJob = useGetJob(jobId);

  return getJob.data && !LOCKED_STATUS.includes(getJob.data.status_id);
}
