import {
  useJobWorkflowStatus,
  usePageAtom,
  useSelectedVehicleTabIdValue,
} from '@/app/(app)/jobs/(index)/[id]/_atoms';

import { Drawer } from '../Drawer';

import { CommentsDrawerContent } from './CommentsDrawerContent';
import { CommentsDrawerHeader } from './CommentsDrawerHeader';

export function CommentsDrawer() {
  const pageAtom = usePageAtom();
  const selectedVehicleTabId = useSelectedVehicleTabIdValue();
  const jobWorkflowStatus = useJobWorkflowStatus();

  if (jobWorkflowStatus === 'draft') {
    return null;
  }

  return (
    <Drawer
      size="lg"
      data-open={!!pageAtom.data.isVehicleCommentsDrawerOpen}
      {...{ inert: pageAtom.data.isVehicleCommentsDrawerOpen ? undefined : '' }}
      css={{
        height: 'calc(100vh - 5.25rem)!',
        top: 'unset',
        bottom: 2,
        overflow: 'hidden',
        display: 'flex',
        flexDir: 'column',
      }}
    >
      <CommentsDrawerHeader
        onDismiss={() => pageAtom.closeDrawer('comments')}
      />

      <CommentsDrawerContent key={selectedVehicleTabId} />
    </Drawer>
  );
}
