import { format } from '@/app/_utils';
import { S } from '@/app/(app)/jobs/(index)/_components';
import { useGetJob } from '@/app/(app)/jobs/(index)/[id]/_api';
import {
  usePageAtom,
  useShouldBlurSection,
} from '@/app/(app)/jobs/(index)/[id]/_atoms';
import { UnlockedOnly } from '@/app/(app)/jobs/(index)/[id]/_components/UnlockedOnly';
import { VehiclePhoto } from '@/app/(app)/jobs/(index)/[id]/_components/VehiclePhoto';
import { useJobId } from '@/app/(app)/jobs/(index)/[id]/_hooks';
import type { VehicleContact } from '@/app/(app)/jobs/(index)/[id]/_types';
import { Button, Icon, Text, TextButton } from '@/components';
import { css } from '@/styled-system/css';
import { Center, Flex } from '@/styled-system/jsx';

interface VehicleShowcaseProps {
  vehicleId: number;
  onEditRequest?: (vehicle: VehicleContact) => void;
}

export function VehicleShowcase({
  vehicleId,
  onEditRequest,
}: VehicleShowcaseProps) {
  const jobId = useJobId();
  const getJob = useGetJob(jobId);

  const pageAtom = usePageAtom();
  const shouldBlurSection = useShouldBlurSection();

  const vehicle = getJob.data?.jobVehicles.find(
    _vehicle => _vehicle.id === vehicleId
  );

  return (
    <Flex
      direction="column"
      gap={5}
      mt={6}
      css={shouldBlurSection ? S.blurredStyles.raw() : {}}
    >
      <Flex gap={3} minH="3.875rem">
        <Center
          w="3.75rem"
          h="3.75rem"
          bgColor="rgba(1, 2, 3, 0.04)"
          rounded="lg"
          color="gray.400"
        >
          {vehicle?.jobPhotos?.length ? (
            <VehiclePhoto
              {...vehicle.jobPhotos[0]}
              className={css({ bgColor: 'gray.50' })}
            />
          ) : (
            <Icon.Image />
          )}
        </Center>

        <Flex direction="column" gap={2.3} flex={1}>
          <Text
            color="gray.900"
            fontSize="md"
            fontWeight="semibold"
            css={{ _empty: { display: 'none' } }}
          >
            {[vehicle?.year, vehicle?.manufacturer, vehicle?.model]
              .filter(Boolean)
              .join(' ')}
          </Text>
          <Flex direction="column" gap={1.75} fontWeight="medium">
            <Text color="gray.400">
              {vehicle?.type}
              {!!vehicle?.color && (
                <>
                  <S.Common.Dot />
                  {vehicle.color}
                </>
              )}
              {typeof vehicle?.mileage === 'number' && (
                <>
                  <S.Common.Dot />
                  {format.number(vehicle.mileage)} miles
                </>
              )}
              {!!vehicle?.unit && (
                <>
                  <S.Common.Dot />
                  Unit {vehicle.unit}
                </>
              )}
            </Text>
            <Text color="gray.400" css={{ _empty: { display: 'none' } }}>
              {!!vehicle?.vin_serial && (
                <span
                  className={css({
                    color: 'gray.500',
                    fontFamily: 'firacode',
                    letterSpacing: '0.56px',
                  })}
                >
                  VIN {vehicle.vin_serial}
                </span>
              )}
              {!!vehicle?.vin_serial && !!vehicle.usdot && <S.Common.Dot />}
              {!!vehicle?.usdot && `USDOT #${vehicle.usdot}`}
            </Text>
          </Flex>
        </Flex>

        <UnlockedOnly>
          {!!vehicle && (
            <TextButton
              alignSelf="flex-start"
              tabIndex={shouldBlurSection ? -1 : undefined}
              onClick={() => onEditRequest?.(vehicle)}
            >
              Edit
            </TextButton>
          )}
        </UnlockedOnly>
      </Flex>

      <Flex gap={3} align="center">
        <Button
          variant="secondary"
          size="xs"
          leftSlot={<Icon.Image2 />}
          tabIndex={shouldBlurSection ? -1 : undefined}
          onClick={() => pageAtom.openDrawer('photos')}
        >
          Photos ({vehicle?.jobPhotos?.length ?? 0})
        </Button>
        <Button
          variant="secondary"
          size="xs"
          leftSlot={<Icon.MessageTextSquare />}
          tabIndex={shouldBlurSection ? -1 : undefined}
          onClick={() => {
            pageAtom.openDrawer('comments');

            // if data is older than 10 seconds
            if (getJob.dataUpdatedAt < Date.now() - 10000) {
              void getJob.refetch();
            }
          }}
        >
          Comments ({vehicle?.commentsCount ?? 0})
        </Button>
      </Flex>
    </Flex>
  );
}
