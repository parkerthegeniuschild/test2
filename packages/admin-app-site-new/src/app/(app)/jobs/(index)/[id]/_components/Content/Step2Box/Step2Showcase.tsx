import { useParams } from 'next/navigation';

import { S } from '@/app/(app)/jobs/(index)/_components';
import { useGetJob } from '@/app/(app)/jobs/(index)/[id]/_api';
import {
  useMapAtom,
  usePageAtom,
  useShouldBlurSection,
  useStep2Atom,
} from '@/app/(app)/jobs/(index)/[id]/_atoms';
import { UnlockedOnly } from '@/app/(app)/jobs/(index)/[id]/_components/UnlockedOnly';
import { Heading, Icon, Text, TextButton, Tooltip } from '@/components';
import { css } from '@/styled-system/css';
import { Flex } from '@/styled-system/jsx';

import { ServiceTimeShowcase } from './ServiceTimeShowcase';

export function Step2Showcase() {
  const params = useParams();
  const getJob = useGetJob(params.id as string);

  const shouldBlurSection = useShouldBlurSection();
  const pageAtom = usePageAtom();
  const mapAtom = useMapAtom();
  const step2Atom = useStep2Atom();

  function handleEditRequest() {
    pageAtom.setFocusedSection('address');
    mapAtom.showJobMarkerHint();
    mapAtom.setJobMarkerLocation({
      latitude: getJob.data!.location_latitude!,
      longitude: getJob.data!.location_longitude!,
    });
    step2Atom.setInitialData({
      address: getJob.data?.location_address,
      city: getJob.data?.location_city,
      street: getJob.data?.location_street,
      streetNumber: getJob.data?.location_street_number,
      zip: getJob.data?.location_zip,
      locationType: getJob.data?.location_type,
      locationDetails: getJob.data?.location_details,
      locationNotes: getJob.data?.location_notes,
      state: getJob.data?.location_state,
      shouldValidateFields: false,
    });
  }

  return (
    <Flex
      px="var(--content-padding-x)"
      py={5}
      gap={5}
      css={shouldBlurSection ? S.blurredStyles.raw() : {}}
    >
      <Flex direction="column" gap={2.3} flex={1}>
        <Flex align="center" gap={2}>
          <Heading as="h2" fontSize="md" fontWeight="semibold">
            {getJob.data?.location_address}
          </Heading>

          <Tooltip
            showArrow
            tabIndex={-1}
            gutter={0}
            variant="popover"
            className={css({
              cursor: 'help!',
              alignSelf: 'flex-start',
              transform: 'translateY(1px)',
            })}
            description={
              <>
                <Text color="gray.50" fontWeight="semibold">
                  {getJob.data?.location_details}
                </Text>
                {!!getJob.data?.location_notes?.trim() && (
                  <Text
                    mt={1}
                    color="gray.100"
                    fontSize="xs"
                    fontWeight="normal"
                    lineHeight="1.0625rem"
                  >
                    {getJob.data?.location_notes}
                  </Text>
                )}
              </>
            }
            aria-label={[
              getJob.data?.location_details,
              getJob.data?.location_notes,
            ]
              .filter(Boolean)
              .join(' - ')}
            placement="bottom"
            render={
              <TextButton
                colorScheme="lightGray"
                css={{ _active: { color: 'gray.600' } }}
              />
            }
          >
            <Icon.Sticker />
          </Tooltip>
        </Flex>

        <Flex align="center" gap={1.75}>
          <ServiceTimeShowcase />
          {/* <Box borderRightWidth="1px" h={3.5} borderColor="gray.300" />
          <Text fontWeight="medium" color="gray.400">
            ETA 8:00 AM - 12:00 PM
          </Text> */}
        </Flex>
      </Flex>

      <UnlockedOnly>
        <TextButton
          type="button"
          alignSelf="flex-start"
          tabIndex={shouldBlurSection ? -1 : undefined}
          disabled={pageAtom.data.isPublishing}
          onClick={handleEditRequest}
        >
          Edit
        </TextButton>
      </UnlockedOnly>
    </Flex>
  );
}
