import { useJobWorkflowStatus } from '@/app/(app)/jobs/(index)/[id]/_atoms';

export function DraftOnly({ children }: React.PropsWithChildren) {
  const jobWorkflowStatus = useJobWorkflowStatus();

  if (jobWorkflowStatus === 'draft') {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{children}</>;
  }

  return null;
}
