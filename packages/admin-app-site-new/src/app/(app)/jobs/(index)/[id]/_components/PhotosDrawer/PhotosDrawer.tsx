import {
  useJobWorkflowStatus,
  usePageAtom,
  useSelectedVehicleTabIdValue,
} from '@/app/(app)/jobs/(index)/[id]/_atoms';

import { Drawer } from '../Drawer';

import { PhotosDrawerContent } from './PhotosDrawerContent';
import { PhotosDrawerHeader } from './PhotosDrawerHeader';

export function PhotosDrawer() {
  const pageAtom = usePageAtom();
  const selectedVehicleTabId = useSelectedVehicleTabIdValue();
  const jobWorkflowStatus = useJobWorkflowStatus();

  if (jobWorkflowStatus === 'draft') {
    return null;
  }

  return (
    <Drawer
      size="lg"
      data-open={!!pageAtom.data.isVehiclePhotosDrawerOpen}
      {...{ inert: pageAtom.data.isVehiclePhotosDrawerOpen ? undefined : '' }}
      css={{
        height: 'calc(100vh - 5.25rem)!',
        top: 'unset',
        bottom: 2,
        overflow: 'hidden',
      }}
    >
      <PhotosDrawerHeader onDismiss={() => pageAtom.closeDrawer('photos')} />

      <PhotosDrawerContent key={selectedVehicleTabId} />
    </Drawer>
  );
}
