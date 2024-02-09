import { useState } from 'react';

import { S } from '@/app/(app)/jobs/(index)/_components';
import {
  type PriceSummaryParsed,
  useFetchInvoicePreview,
  useGetPriceSummary,
} from '@/app/(app)/jobs/(index)/[id]/_api';
import {
  useJobWorkflowStatus,
  usePageAtom,
} from '@/app/(app)/jobs/(index)/[id]/_atoms';
import { PublishedOnly } from '@/app/(app)/jobs/(index)/[id]/_components/PublishedOnly';
import { emitViewInvoiceRequest } from '@/app/(app)/jobs/(index)/[id]/_events';
import { useJobId } from '@/app/(app)/jobs/(index)/[id]/_hooks';
import {
  Button,
  ErrorMessage,
  Icon,
  Spinner,
  Text,
  TextButton,
  toast,
} from '@/components';
import { Box, Flex } from '@/styled-system/jsx';

import { ConfirmPaymentRemovalModal } from './ConfirmPaymentRemovalModal';
import { CostEntry } from './CostEntry';
import { InvoiceMessage } from './InvoiceMessage';
import { PriceEntry } from './PriceEntry';

interface PriceSummaryContentProps {
  onEditPaymentRequest: (
    payment: PriceSummaryParsed['payments']['entries'][number]
  ) => void;
}

export function PriceSummaryContent({
  onEditPaymentRequest,
}: PriceSummaryContentProps) {
  const jobId = useJobId();
  const jobWorkflowStatus = useJobWorkflowStatus();

  const pageAtom = usePageAtom();

  const getPriceSummary = useGetPriceSummary({ jobId });

  const fetchInvoicePreview = useFetchInvoicePreview({
    onSuccess(data) {
      emitViewInvoiceRequest({
        invoiceUrl: `data:application/pdf;base64,${data.invoice_base_64}`,
      });
    },
    onError(error) {
      toast.error(
        `Error while fetching invoice preview${
          error instanceof Error ? `: ${error.message}` : ''
        }`
      );
    },
  });

  const [paymentIdToBeRemoved, setPaymentIdToBeRemoved] = useState<
    number | null
  >(null);

  return (
    <>
      <Flex
        direction="column"
        gap={5}
        css={pageAtom.data.focusedSection ? S.blurredStyles.raw() : {}}
        {...{
          inert: pageAtom.data.focusedSection ? '' : undefined,
        }}
      >
        <Flex
          align="center"
          justify="space-between"
          h={jobWorkflowStatus === 'published' ? 4 : undefined}
          css={
            pageAtom.data.priceSummaryFocusedSection
              ? S.blurredStyles.raw()
              : {}
          }
          {...{
            inert: pageAtom.data.priceSummaryFocusedSection ? '' : undefined,
          }}
        >
          <Flex align="center" gap={3}>
            <Text
              as="strong"
              fontSize="md"
              fontWeight="semibold"
              color="gray.400"
            >
              Price summary
            </Text>

            {getPriceSummary.isFetching && <Spinner />}
          </Flex>

          <Flex gap={3}>
            <Button
              size="xs"
              variant="secondary"
              leftSlot={<Icon.File />}
              disabled={
                jobWorkflowStatus === 'draft' || fetchInvoicePreview.isLoading
              }
              loading={fetchInvoicePreview.isLoading}
              onClick={() => fetchInvoicePreview.mutate({ jobId })}
            >
              View invoice
            </Button>
            <Button
              size="xs"
              variant="secondary"
              leftSlot={<Icon.SendAngled />}
              disabled={jobWorkflowStatus === 'draft'}
              onClick={() => pageAtom.openDrawer('invoice')}
            >
              Send invoice
            </Button>
          </Flex>
        </Flex>

        <PublishedOnly>
          <InvoiceMessage />
        </PublishedOnly>

        <Flex
          direction="column"
          gap={5}
          css={
            pageAtom.data.priceSummaryFocusedSection
              ? S.blurredStyles.raw()
              : {}
          }
          {...{
            inert: pageAtom.data.priceSummaryFocusedSection ? '' : undefined,
          }}
        >
          {!!getPriceSummary.data && (
            <>
              <Flex direction="column" gap={3}>
                <CostEntry
                  label="Labor"
                  value={getPriceSummary.data.charge.laborHoursTotalPrice}
                  description={
                    <Flex align="center">
                      {typeof getPriceSummary.data.charge.labor_hours_amount ===
                        'number' &&
                        getPriceSummary.data.charge.labor_hours_amount > 0 && (
                          <>
                            <Text>
                              {getPriceSummary.data.charge.surpassed_minimum
                                ? `${getPriceSummary.data.charge.labor_hours_amount} hours`
                                : `${getPriceSummary.data.charge.labor_hours_amount}hr minimum`}
                            </Text>
                            <S.Common.Dot />
                          </>
                        )}
                      <Text>
                        {getPriceSummary.data.charge.laborHoursPrice}/hr
                      </Text>
                    </Flex>
                  }
                />
                <PublishedOnly>
                  <CostEntry
                    label="Parts"
                    value={getPriceSummary.data.charge.partsPrice}
                  />
                </PublishedOnly>
                <CostEntry
                  label="Callout"
                  value={getPriceSummary.data.charge.calloutPrice}
                />
              </Flex>

              <Box aria-hidden borderTopWidth="1px" borderColor="gray.200" />

              <Flex direction="column" gap={3}>
                <CostEntry
                  label="Subtotal"
                  value={getPriceSummary.data.charge.subtotalPrice}
                />
                <CostEntry
                  label={`Tax (${getPriceSummary.data.charge.taxPercentage})`}
                  value={getPriceSummary.data.charge.taxPrice}
                />
                <CostEntry
                  highlight
                  label="Total"
                  value={getPriceSummary.data.charge.totalPrice}
                />
              </Flex>

              <PublishedOnly>
                <Box aria-hidden borderTopWidth="1px" borderColor="gray.200" />

                {getPriceSummary.data.payments.entries.length > 0 && (
                  <Flex direction="column" gap={4}>
                    {getPriceSummary.data.payments.entries.map(entry => (
                      <PriceEntry
                        key={entry.id}
                        type={entry.paymentMethodTitle}
                        description={entry.paymentMethodDescription}
                        date={entry.timestamp}
                        value={entry.amountPaid}
                        onEditRequest={() => onEditPaymentRequest(entry)}
                        onDeleteRequest={() =>
                          setPaymentIdToBeRemoved(entry.id)
                        }
                      />
                    ))}
                  </Flex>
                )}

                <TextButton
                  leftSlot={<Icon.Plus />}
                  maxW="max"
                  onClick={() =>
                    pageAtom.setPriceSummaryFocusedSection('add_payment')
                  }
                >
                  Add payment
                </TextButton>

                <Box aria-hidden borderTopWidth="1px" borderColor="gray.200" />
              </PublishedOnly>
            </>
          )}

          {getPriceSummary.isError && !getPriceSummary.data && (
            <ErrorMessage>
              Some error occurred while fetching price summary data
              {getPriceSummary.error instanceof Error &&
                `: ${getPriceSummary.error.message}`}
            </ErrorMessage>
          )}

          {(getPriceSummary.isLoading || getPriceSummary.isError) && (
            <Box aria-hidden borderTopWidth="1px" borderColor="gray.200" />
          )}

          <div aria-hidden />
        </Flex>
      </Flex>

      <PublishedOnly>
        <ConfirmPaymentRemovalModal
          open={typeof paymentIdToBeRemoved === 'number'}
          paymentId={paymentIdToBeRemoved ?? -1}
          onSuccessfulRemoval={() => setPaymentIdToBeRemoved(null)}
          onClose={() => setPaymentIdToBeRemoved(null)}
        />
      </PublishedOnly>
    </>
  );
}
