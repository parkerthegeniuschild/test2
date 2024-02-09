import { useState } from 'react';

import { useGetJob } from '@/app/(app)/jobs/(index)/[id]/_api';
import { usePageAtom } from '@/app/(app)/jobs/(index)/[id]/_atoms';
import { useVehicleLocationSelectListener } from '@/app/(app)/jobs/(index)/[id]/_events';
import { useJobId } from '@/app/(app)/jobs/(index)/[id]/_hooks';
import { Flex } from '@/styled-system/jsx';

import { Drawer } from '../Drawer';

import { ProvidersDrawerLaborContent } from './ProvidersDrawerLaborContent';
import { ProvidersDrawerMainContent } from './ProvidersDrawerMainContent';
import { ToggleOpenButton } from './ToggleOpenButton';

export function ProvidersDrawer() {
  const jobId = useJobId();

  const pageAtom = usePageAtom();

  const getJob = useGetJob(jobId);

  const isJobLocationSet =
    typeof getJob.data?.location_latitude === 'number' &&
    typeof getJob.data?.location_longitude === 'number';

  const [isOpen, setIsOpen] = useState(isJobLocationSet);
  const [showProvidersList, setShowProvidersList] = useState(
    !getJob.data?.provider
  );
  const [selectedProviderId, setSelectedProviderId] = useState<number | null>(
    null
  );

  useVehicleLocationSelectListener(() => setIsOpen(true));

  const isOtherDrawerOpen = Boolean(
    pageAtom.data.isVehiclePhotosDrawerOpen ||
      pageAtom.data.isVehicleCommentsDrawerOpen ||
      pageAtom.data.isInvoiceDrawerOpen
  );
  const shouldOpenDrawer = isOpen && !isOtherDrawerOpen;

  if (!isJobLocationSet) {
    return null;
  }

  return (
    <Drawer
      size="sm"
      data-open={shouldOpenDrawer}
      css={{
        height: 'calc(100vh - 5.25rem)!',
        top: 'unset',
        bottom: 2,
        display: 'flex',
        shadow: 'none',
        rounded: 0,
        bgColor: 'transparent',
      }}
    >
      {!isOtherDrawerOpen && (
        <ToggleOpenButton
          isOpen={isOpen}
          onClick={() => setIsOpen(state => !state)}
        />
      )}

      <Flex
        direction="column"
        flex={1}
        shadow="menu.md"
        rounded="lg.xl"
        bgColor="white"
        {...{ inert: shouldOpenDrawer ? undefined : '' }}
      >
        {typeof selectedProviderId !== 'number' ? (
          <ProvidersDrawerMainContent
            enableQueries={isJobLocationSet}
            showProvidersList={showProvidersList}
            onShowProvidersList={() => setShowProvidersList(true)}
            onSelectProvider={setSelectedProviderId}
          />
        ) : (
          <ProvidersDrawerLaborContent
            enableQueries={shouldOpenDrawer}
            onBack={() => setSelectedProviderId(null)}
          />
        )}
      </Flex>
    </Drawer>
  );
}
