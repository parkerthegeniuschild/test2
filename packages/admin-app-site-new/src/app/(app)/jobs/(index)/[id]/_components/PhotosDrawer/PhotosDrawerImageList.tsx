import { useEffect, useState } from 'react';

import { S } from '@/app/(app)/jobs/(index)/_components';
import { useGetJob } from '@/app/(app)/jobs/(index)/[id]/_api';
import {
  usePageAtom,
  useSelectedVehicleTabIdValue,
} from '@/app/(app)/jobs/(index)/[id]/_atoms';
import { useIsJobUnlocked } from '@/app/(app)/jobs/(index)/[id]/_components/UnlockedOnly';
import { VehiclePhoto } from '@/app/(app)/jobs/(index)/[id]/_components/VehiclePhoto';
import { useJobId } from '@/app/(app)/jobs/(index)/[id]/_hooks';
import { Button, Icon } from '@/components';
import { Box, Flex, styled } from '@/styled-system/jsx';

import { ConfirmPhotoDeleteModal } from './ConfirmPhotoDeleteModal';

const PhotoContainer = styled(S.Common.ActionButtonsContainer, {
  base: {
    minH: '23rem',
    h: '23rem',
    rounded: 'md.xl',
    outlineOffset: '-2px',
    position: 'relative',
  },
});

export function PhotosDrawerImageList() {
  const jobId = useJobId();

  const pageAtom = usePageAtom();
  const selectedVehicleTabId = useSelectedVehicleTabIdValue();

  const isJobUnlocked = useIsJobUnlocked();

  const getJob = useGetJob(jobId);

  const [shouldShowList, setShouldShowList] = useState(
    !!pageAtom.data.isVehiclePhotosDrawerOpen
  );
  const [photoIdToBeDeleted, setPhotoIdToBeDeleted] = useState<number | null>(
    null
  );

  const selectedVehicle = getJob.data?.jobVehicles.find(
    vehicle => vehicle.id === selectedVehicleTabId
  );

  useEffect(() => {
    // trick to prevent the images from loading when the drawer is closed
    if (pageAtom.data.isVehiclePhotosDrawerOpen) {
      setShouldShowList(true);
    }
  }, [pageAtom.data.isVehiclePhotosDrawerOpen]);

  function handleSuccessfulPhotoDelete() {
    getJob.updateData({
      jobVehicles: getJob.data?.jobVehicles.map(vehicle =>
        vehicle.id === selectedVehicleTabId
          ? {
              ...vehicle,
              jobPhotos: vehicle.jobPhotos?.filter(
                photo => photo.id !== photoIdToBeDeleted
              ),
            }
          : vehicle
      ),
    });
    setPhotoIdToBeDeleted(null);
  }

  if (!shouldShowList) {
    return null;
  }

  return (
    <Flex direction="column" gap={3}>
      {selectedVehicle?.jobPhotos?.map(photo => (
        <PhotoContainer key={photo.id} disabled={!isJobUnlocked}>
          <VehiclePhoto id={photo.id} url={photo.url} loading="lazy" />

          <Box
            className="actions-container"
            pos="absolute"
            right={4}
            top={4}
            zIndex={1}
          >
            <Button
              leftSlot={<Icon.Trash />}
              variant="secondary"
              danger
              size="xs"
              onClick={() => setPhotoIdToBeDeleted(photo.id)}
            >
              Delete
            </Button>
          </Box>
        </PhotoContainer>
      ))}

      <ConfirmPhotoDeleteModal
        open={!!photoIdToBeDeleted}
        photoId={photoIdToBeDeleted ?? -1}
        vehicleId={selectedVehicle?.id ?? -1}
        onClose={() => setPhotoIdToBeDeleted(null)}
        onSuccessfulDelete={handleSuccessfulPhotoDelete}
      />
    </Flex>
  );
}
