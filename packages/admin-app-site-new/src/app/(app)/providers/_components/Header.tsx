import { useState } from 'react';

import {
  useGetProvidersCount,
  type UseGetProvidersCountOptions,
} from '@/app/(app)/providers/_api';
import { Badge, Button, Heading, Spinner, Tabs } from '@/components';
import { css } from '@/styled-system/css';
import { Flex } from '@/styled-system/jsx';

import { type Status, statusSchema } from '../_types';

import { NewProviderDrawer } from './NewProviderDrawer';

type HeaderProps = {
  isLoading: boolean;
  initialProvidersCount?: UseGetProvidersCountOptions['initialData'];
  status: Status;
  onStatusChange: (status: Status) => void;
};

export function Header({
  isLoading,
  initialProvidersCount,
  status,
  onStatusChange,
}: HeaderProps) {
  const getProvidersCount = useGetProvidersCount({
    initialData: initialProvidersCount,
  });

  const [isNewProviderDrawerOpen, setIsNewProviderDrawerOpen] = useState(false);

  return (
    <>
      <header>
        <Flex justify="space-between" align="center" css={{ px: 6, pt: 4.5 }}>
          <Heading css={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            Providers
            {isLoading && <Spinner as="span" aria-label="Loading" />}
          </Heading>

          <Flex gap={3}>
            <Button size="sm" onClick={() => setIsNewProviderDrawerOpen(true)}>
              New Provider
            </Button>
          </Flex>
        </Flex>

        <NewProviderDrawer
          open={isNewProviderDrawerOpen}
          onClose={() => setIsNewProviderDrawerOpen(false)}
        />
      </header>

      <Tabs
        selectedId={status}
        setSelectedId={id => {
          const parsedStatus = statusSchema.safeParse(id);

          if (parsedStatus.success) {
            onStatusChange(parsedStatus.data);
          }
        }}
      >
        <Tabs.List bordered className={css({ px: 6, mt: 7, mb: 4 })}>
          <Tabs.Tab id="approved">
            Approved
            {getProvidersCount.isSuccess && (
              <Badge content="number" variant="primary" size="md">
                {getProvidersCount.data.approved}
              </Badge>
            )}
          </Tabs.Tab>
          <Tabs.Tab id="unapproved">
            Unapproved
            {getProvidersCount.isSuccess && (
              <Badge content="number" duotone size="md">
                {getProvidersCount.data.unapproved}
              </Badge>
            )}
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>
    </>
  );
}
