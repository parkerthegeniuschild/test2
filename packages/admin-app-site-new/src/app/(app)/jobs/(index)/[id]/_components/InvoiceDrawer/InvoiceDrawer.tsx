import { useState } from 'react';

import {
  type EmailedInvoiceEntryParsed,
  useIsFetchingEmailedInvoices,
} from '@/app/(app)/jobs/(index)/[id]/_api';
import {
  useJobWorkflowStatus,
  usePageAtom,
} from '@/app/(app)/jobs/(index)/[id]/_atoms';
import { Drawer as DSDrawer, Icon, Spinner } from '@/components';
import { Flex } from '@/styled-system/jsx';

import { Drawer } from '../Drawer';

import { InvoiceDrawerContent } from './InvoiceDrawerContent';
import { InvoiceDrawerEmailView } from './InvoiceDrawerEmailView';

export function InvoiceDrawer() {
  const pageAtom = usePageAtom();
  const jobWorkflowStatus = useJobWorkflowStatus();

  const isFetchingEmailedInvoices = useIsFetchingEmailedInvoices();

  const [emailViewData, setEmailViewData] =
    useState<EmailedInvoiceEntryParsed | null>(null);

  if (jobWorkflowStatus === 'draft') {
    return null;
  }

  return (
    <Drawer
      data-open={!!pageAtom.data.isInvoiceDrawerOpen}
      {...{ inert: pageAtom.data.isInvoiceDrawerOpen ? undefined : '' }}
      css={{
        width: '41rem',
        height: 'calc(100vh - 5.25rem)!',
        top: 'unset',
        bottom: 2,
        overflow: 'hidden',
        display: 'flex',
        flexDir: 'column',
        zIndex: 'docked',
      }}
    >
      {emailViewData ? (
        <InvoiceDrawerEmailView
          emailViewData={emailViewData}
          onBack={() => setEmailViewData(null)}
        />
      ) : (
        <>
          <Flex
            justify="space-between"
            align="center"
            p={5}
            gap={5}
            borderBottomWidth="1px"
            borderColor="gray.100"
          >
            <Flex align="center" gap={3}>
              <DSDrawer.Heading>Send invoice</DSDrawer.Heading>

              {isFetchingEmailedInvoices && <Spinner />}
            </Flex>

            <DSDrawer.Dismiss
              style={{ fontSize: '1rem' }}
              onClick={() => pageAtom.closeDrawer('invoice')}
            >
              <Icon.XClose />
            </DSDrawer.Dismiss>
          </Flex>

          <InvoiceDrawerContent
            onViewEmailRequest={setEmailViewData}
            onCancel={() => pageAtom.closeDrawer('invoice')}
          />
        </>
      )}
    </Drawer>
  );
}
