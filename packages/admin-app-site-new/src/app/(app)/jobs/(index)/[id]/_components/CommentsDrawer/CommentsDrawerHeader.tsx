import { useGetComments, useGetJob } from '@/app/(app)/jobs/(index)/[id]/_api';
import { useSelectedVehicleTabIdValue } from '@/app/(app)/jobs/(index)/[id]/_atoms';
import { VehiclePhoto } from '@/app/(app)/jobs/(index)/[id]/_components/VehiclePhoto';
import { useJobId } from '@/app/(app)/jobs/(index)/[id]/_hooks';
import { Drawer, Icon, Spinner } from '@/components';
import { css } from '@/styled-system/css';
import { Center, Flex } from '@/styled-system/jsx';

interface CommentsDrawerHeaderProps {
  onDismiss: () => void;
}

export function CommentsDrawerHeader({ onDismiss }: CommentsDrawerHeaderProps) {
  const jobId = useJobId();

  const selectedVehicleTabId = useSelectedVehicleTabIdValue();

  const getComments = useGetComments(
    { jobId, vehicleId: selectedVehicleTabId },
    { enabled: false }
  );

  const getJob = useGetJob(jobId);

  const selectedVehicleIndex = getJob.data?.jobVehicles.findIndex(
    vehicle => vehicle.id === selectedVehicleTabId
  );
  const selectedVehicle = getJob.data?.jobVehicles[selectedVehicleIndex ?? -1];

  const vehicleName = [
    selectedVehicle?.year,
    selectedVehicle?.manufacturer,
    selectedVehicle?.model,
  ]
    .filter(Boolean)
    .join(' ');

  const vehicleTitle =
    vehicleName || `Vehicle ${(selectedVehicleIndex ?? 0) + 1}`;

  return (
    <Flex
      justify="space-between"
      align="center"
      p={5}
      gap={5}
      borderBottomWidth="1px"
      borderColor="gray.100"
    >
      <Flex align="center" gap={4} h={5}>
        <Center
          h={9}
          w={9}
          rounded="md"
          bgColor="rgba(1, 2, 3, 0.04)"
          color="gray.400"
        >
          {selectedVehicle?.jobPhotos?.length ? (
            <VehiclePhoto
              {...selectedVehicle.jobPhotos[0]}
              className={css({ bgColor: 'white' })}
            />
          ) : (
            <Icon.Image className={css({ transform: 'scale(0.8)' })} />
          )}
        </Center>
        <Flex align="center" gap={3}>
          <Drawer.Heading>{vehicleTitle} comments</Drawer.Heading>

          {getComments.isFetching && <Spinner flexShrink={0} />}
        </Flex>
      </Flex>

      <Drawer.Dismiss style={{ fontSize: '1rem' }} onClick={onDismiss}>
        <Icon.ChevronRightDouble />
      </Drawer.Dismiss>
    </Flex>
  );
}
