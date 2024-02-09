import { useCallback, useState } from 'react';

import { Drawer, type DrawerProps } from '@/components';
import { Box, Flex } from '@/styled-system/jsx';

import { NewProviderForm } from './NewProviderForm';

export function NewProviderDrawer({
  open,
  onClose,
}: Pick<DrawerProps, 'open' | 'onClose'>) {
  const [isPostRequestInFlight, setIsPostRequestInFlight] = useState(false);

  const closeFn = useCallback(
    () => !isPostRequestInFlight && onClose?.(),
    [isPostRequestInFlight, onClose]
  );

  return (
    <Drawer open={open} onClose={closeFn} unmountOnHide>
      <Flex
        justify="space-between"
        align="center"
        p={5}
        borderBottomWidth="1px"
        borderColor="gray.100"
      >
        <Drawer.Heading>New Provider</Drawer.Heading>
        <Drawer.Dismiss />
      </Flex>

      <Box p={5}>
        <NewProviderForm
          onClose={closeFn}
          onPostRequestInFlightChange={setIsPostRequestInFlight}
          onSuccessfulCreate={onClose}
        />
      </Box>
    </Drawer>
  );
}
