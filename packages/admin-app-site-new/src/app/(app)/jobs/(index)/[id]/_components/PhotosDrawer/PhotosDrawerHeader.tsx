import { useGetJob } from '@/app/(app)/jobs/(index)/[id]/_api';
import { useSelectedVehicleTabIdValue } from '@/app/(app)/jobs/(index)/[id]/_atoms';
import { useJobId } from '@/app/(app)/jobs/(index)/[id]/_hooks';
import { Drawer, Icon } from '@/components';
import { Flex } from '@/styled-system/jsx';

interface PhotosDrawerHeaderProps {
  onDismiss: () => void;
}

export function PhotosDrawerHeader({ onDismiss }: PhotosDrawerHeaderProps) {
  const jobId = useJobId();

  const selectedVehicleTabId = useSelectedVehicleTabIdValue();

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
      <Drawer.Heading>{vehicleTitle} photos</Drawer.Heading>

      <Drawer.Dismiss style={{ fontSize: '1rem' }} onClick={onDismiss}>
        <Icon.ChevronRightDouble />
      </Drawer.Dismiss>
    </Flex>
  );
}
