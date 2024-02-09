import { useState } from 'react';
import type { CamelCase } from 'type-fest';

import type { OrderModel } from '@/app/_types/order';
import {
  type EmailedInvoiceEntryParsed,
  useGetEmailedInvoices,
} from '@/app/(app)/jobs/(index)/[id]/_api';
import { usePageAtom } from '@/app/(app)/jobs/(index)/[id]/_atoms';
import { emitViewInvoiceRequest } from '@/app/(app)/jobs/(index)/[id]/_events';
import { useJobId } from '@/app/(app)/jobs/(index)/[id]/_hooks';
import type { EmailedInvoiceEntry } from '@/app/(app)/jobs/(index)/[id]/_types';
import { Icon, Table, TextButton, Tooltip } from '@/components';
import { Flex, styled } from '@/styled-system/jsx';

const TableHeader = styled(Table.Header, {
  base: {
    bgColor: 'gray.50',
    borderBottomWidth: '1px',

    _before: { display: 'none' },

    _after: {
      bottom: 0,
      height: '1px',
    },
  },
});

const TableHead = styled(Table.Head, {
  base: {
    '&:first-child': { pl: '4!' },
    '&:last-child': { pr: '3!' },
  },
});

const TableBody = styled(Table.Body, {
  base: {
    border: 0,

    '& tr': {
      _hover: { bgColor: 'transparent' },
    },
  },
});

const TableCell = styled(Table.Cell, {
  base: {
    lineHeight: 'lg',
    py: 3,
    verticalAlign: 'unset',

    '&:first-child': { pl: 4 },
    '&:last-child': { pr: 3 },
  },
});

interface InvoiceDrawerTableProps {
  onViewEmailRequest: (emailViewData: EmailedInvoiceEntryParsed) => void;
}

export function InvoiceDrawerTable({
  onViewEmailRequest,
}: InvoiceDrawerTableProps) {
  const jobId = useJobId();

  const pageAtom = usePageAtom();

  const [order, setOrder] = useState<
    OrderModel<CamelCase<keyof EmailedInvoiceEntry>>
  >({ createdAt: 'desc' });

  const getEmailedInvoices = useGetEmailedInvoices(
    { jobId, order },
    { enabled: !!pageAtom.data.isInvoiceDrawerOpen }
  );

  function handleOrderChange(field: CamelCase<keyof EmailedInvoiceEntry>) {
    return (newOrder: 'asc' | 'desc' | null) => {
      setOrder(state => {
        const newState = { ...state };

        if (newOrder === newState[field] || newOrder === null) {
          delete newState[field];
        } else {
          newState[field] = newOrder;
        }

        return newState;
      });
    };
  }

  return (
    <Table
      wrapperProps={{
        borderWidth: '1px',
        borderColor: 'gray.200',
        rounded: 'lg',
        whiteSpace: 'unset',
        style: {
          borderBottomColor: getEmailedInvoices.isLoading
            ? 'transparent'
            : undefined,
        },
      }}
    >
      <TableHeader>
        <Table.Row>
          <TableHead
            w="7.5rem"
            sortType="numeric"
            showHideColumnOption={false}
            sortOrder={order.createdAt}
            onSort={handleOrderChange('createdAt')}
            onClearSort={() => handleOrderChange('createdAt')(null)}
          >
            Date
          </TableHead>
          <TableHead
            showHideColumnOption={false}
            sortOrder={order.emailTo}
            onSort={handleOrderChange('emailTo')}
            onClearSort={() => handleOrderChange('emailTo')(null)}
          >
            To
          </TableHead>
          <TableHead
            showHideColumnOption={false}
            sortOrder={order.subject}
            onSort={handleOrderChange('subject')}
            onClearSort={() => handleOrderChange('subject')(null)}
          >
            Subject
          </TableHead>
          <TableHead />
        </Table.Row>
      </TableHeader>

      <TableBody isPreviousData={getEmailedInvoices.isPreviousData}>
        {getEmailedInvoices.data?.data.map(record => (
          <Table.Row key={record.id}>
            <TableCell minW="7.5rem">
              {[record.formattedDate, record.formattedTime].join(' ')}
            </TableCell>
            <TableCell>{record.email_to}</TableCell>
            <TableCell>{record.subject}</TableCell>

            <TableCell
              w={20}
              maxW={20}
              borderLeftWidth="1px"
              borderColor="gray.200"
              pos="relative"
            >
              <Flex
                pos="absolute"
                top={3}
                left="50%"
                transform="translateX(-50%)"
                h="1.375rem"
                gap={4}
                justify="center"
                align="center"
              >
                <Tooltip
                  description="View the invoice"
                  aria-label="View the invoice"
                  placement="top"
                  render={
                    <TextButton
                      colorScheme="lightGray"
                      fontSize="md"
                      onClick={() =>
                        emitViewInvoiceRequest({
                          invoiceUrl: record.invoice_url,
                        })
                      }
                    />
                  }
                  unmountOnHide
                >
                  <Icon.File />
                </Tooltip>
                <Tooltip
                  description="View the email"
                  aria-label="View the email"
                  placement="top"
                  render={
                    <TextButton
                      colorScheme="lightGray"
                      fontSize="md"
                      onClick={() => onViewEmailRequest(record)}
                    />
                  }
                  unmountOnHide
                >
                  <Icon.Eye2 />
                </Tooltip>
              </Flex>
            </TableCell>
          </Table.Row>
        ))}

        {!getEmailedInvoices.data && getEmailedInvoices.isError && (
          <Table.Row>
            <Table.Cell colSpan={4} textAlign="center">
              Some error occurred while fetching emailed invoices
              {getEmailedInvoices.error instanceof Error &&
                `: ${getEmailedInvoices.error.message}`}
            </Table.Cell>
          </Table.Row>
        )}

        {getEmailedInvoices.isSuccess &&
          getEmailedInvoices.data?.data.length === 0 && (
            <Table.Row>
              <Table.Cell colSpan={4} textAlign="center">
                No emailed invoices found for this job
              </Table.Cell>
            </Table.Row>
          )}
      </TableBody>
    </Table>
  );
}
