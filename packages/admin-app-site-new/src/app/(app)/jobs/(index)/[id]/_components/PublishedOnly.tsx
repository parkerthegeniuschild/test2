import { useJobWorkflowStatus } from '@/app/(app)/jobs/(index)/[id]/_atoms';

export function PublishedOnly({ children }: React.PropsWithChildren) {
  const jobWorkflowStatus = useJobWorkflowStatus();

  if (jobWorkflowStatus === 'published') {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{children}</>;
  }

  return null;
}
