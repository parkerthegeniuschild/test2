import { useState } from 'react';

import { S } from '@/app/(app)/jobs/(index)/_components';
import {
  type PriceSummaryParsed,
  useFetchStripePaymentConfirmation,
  useGetPriceSummary,
  usePatchPayment,
  usePostPayment,
} from '@/app/(app)/jobs/(index)/[id]/_api';
import {
  useJobWorkflowStatus,
  usePageAtom,
  useShouldBlurSection,
} from '@/app/(app)/jobs/(index)/[id]/_atoms';
import { PublishedOnly } from '@/app/(app)/jobs/(index)/[id]/_components/PublishedOnly';
import { useJobId } from '@/app/(app)/jobs/(index)/[id]/_hooks';
import { Badge, Icon, Text, TextButton, toast, Transition } from '@/components';
import { css } from '@/styled-system/css';
import { Box, Flex } from '@/styled-system/jsx';

import { PaymentForm } from './PaymentForm';
import { PriceSummaryContent } from './PriceSummaryContent';

export function PriceSummary() {
  const jobId = useJobId();

  const pageAtom = usePageAtom();
  const shouldBlurSection = useShouldBlurSection();
  const jobWorkflowStatus = useJobWorkflowStatus();

  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<
    PriceSummaryParsed['payments']['entries'][number] | null
  >(null);

  const getPriceSummary = useGetPriceSummary(
    { jobId },
    { enabled: jobWorkflowStatus === 'published' }
  );
  const postPayment = usePostPayment({
    async onAfterMutate() {
      await getPriceSummary.refetch();
    },
    onSuccess() {
      pageAtom.setPriceSummaryFocusedSection(null);

      toast.success('Payment created successfully');
    },
    onError(error) {
      toast.error(
        `Error while creating payment${
          error instanceof Error ? `: ${error.message}` : ''
        }`
      );
    },
  });
  const patchPayment = usePatchPayment({
    async onAfterMutate() {
      await getPriceSummary.refetch();
    },
    onSuccess() {
      pageAtom.setPriceSummaryFocusedSection(null);
      setEditingPayment(null);

      toast.success('Payment updated successfully');
    },
    onError(error) {
      toast.error(
        `Error while updating payment${
          error instanceof Error ? `: ${error.message}` : ''
        }`
      );
    },
  });
  const fetchStripePaymentConfirmation = useFetchStripePaymentConfirmation({
    async onAfterMutate() {
      await getPriceSummary.refetch();
    },
    onSuccess() {
      pageAtom.setPriceSummaryFocusedSection(null);

      toast.success('Payment created successfully');
    },
    onError(error) {
      toast.error(
        `Error while processing payment${
          error instanceof Error ? `: ${error.message}` : ''
        }.\nIt may take a few minutes for the payment to be processed.\nTry refreshing the page.`,
        { duration: 6000 }
      );
      pageAtom.setPriceSummaryFocusedSection(null);
      void getPriceSummary.refetch();
    },
  });

  const isOnPaymentForm =
    !!pageAtom.data.priceSummaryFocusedSection?.includes('payment');

  function handleSummaryOpenChange(isOpen: boolean) {
    setIsSummaryOpen(isOpen);

    if (isOpen) {
      void getPriceSummary.refetch();
    }
  }

  return (
    <Transition.Collapse
      open={isSummaryOpen}
      onOpenChange={handleSummaryOpenChange}
      placement="top"
      px={3}
      mx={-3}
      css={{
        '--container-y-shift': isOnPaymentForm ? 0 : 'token(spacing.2.3)',
        ...(isOnPaymentForm ? { py: 1, my: -1 } : {}),
      }}
      transform="translateY(calc(var(--container-y-shift) * -1))"
      // eslint-disable-next-line react/no-unstable-nested-components
      trigger={props => {
        if (isOnPaymentForm) {
          return null;
        }

        return (
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
            <TextButton
              {...props}
              maxW="max"
              colorScheme={isSummaryOpen ? 'gray' : 'primary'}
              css={shouldBlurSection ? S.blurredStyles.raw() : {}}
              tabIndex={shouldBlurSection ? -1 : undefined}
              rightSlot={
                isSummaryOpen ? (
                  <Icon.Times className={css({ fontSize: '1.1875rem' })} />
                ) : (
                  <Icon.ChevronDown
                    className={css({
                      fontSize: '1.1875rem',
                      transform: 'rotate(180deg)',
                    })}
                  />
                )
              }
            >
              {isSummaryOpen ? 'Close summary' : 'Price summary'}
            </TextButton>

            {!!getPriceSummary.data && (
              <PublishedOnly>
                <Flex
                  align="center"
                  gap={1.5}
                  css={shouldBlurSection ? S.blurredStyles.raw() : {}}
                >
                  {getPriceSummary.data.status === 'paid' ? (
                    <Badge size="sm" variant="primary" duotone>
                      Paid
                    </Badge>
                  ) : (
                    <Badge size="sm" variant="danger" duotone>
                      Unpaid
                    </Badge>
                  )}

                  <Flex align="baseline" gap={0.75}>
                    {getPriceSummary.data.status === 'unpaid' && (
                      <Text fontWeight="medium" color="gray.700">
                        Balance:
                      </Text>
                    )}
                    <Text fontSize="md" fontWeight="semibold" color="gray.900">
                      {getPriceSummary.data.status === 'paid'
                        ? getPriceSummary.data.payments.totalAmountPaid
                        : getPriceSummary.data.totalBalance}
                    </Text>
                  </Flex>
                </Flex>
              </PublishedOnly>
            )}
          </Flex>
        );
      }}
    >
      <Box h="var(--container-y-shift)" />

      {isOnPaymentForm && getPriceSummary.data ? (
        <PaymentForm
          formattedBalance={getPriceSummary.data.totalBalance}
          balanceInCents={getPriceSummary.data.balance_cents}
          paymentMethodToText={getPriceSummary.data.paymentMethodToText}
          initialValues={
            editingPayment
              ? {
                  amount: editingPayment.amount_cents / 100,
                  identifier: editingPayment.identifier,
                  // TODO: adjust that when API is ready
                  paymentMethod: editingPayment.payment_method as 'cash',
                }
              : null
          }
          loading={
            postPayment.isLoading ||
            patchPayment.isLoading ||
            fetchStripePaymentConfirmation.isLoading
          }
          onSubmit={({ paymentIntentId, ...payload }) => {
            const providerId =
              payload.paymentMethod === 'cash'
                ? Number(payload.identifier)
                : null;

            if (pageAtom.data.priceSummaryFocusedSection === 'add_payment') {
              if (payload.paymentMethod === 'credit_card' && paymentIntentId) {
                fetchStripePaymentConfirmation.mutate({
                  jobId,
                  paymentIntentId,
                });
                return;
              }

              postPayment.mutate({ jobId, ...payload, providerId });
            }

            if (
              pageAtom.data.priceSummaryFocusedSection === 'edit_payment' &&
              editingPayment
            ) {
              patchPayment.mutate({
                id: editingPayment.id,
                jobId,
                ...payload,
                providerId,
              });
            }
          }}
          onCancel={() => {
            pageAtom.setPriceSummaryFocusedSection(null);
            setEditingPayment(null);
          }}
        />
      ) : (
        <PriceSummaryContent
          onEditPaymentRequest={payment => {
            setEditingPayment(payment);
            pageAtom.setPriceSummaryFocusedSection('edit_payment');
          }}
        />
      )}

      <Box mb="calc(var(--container-y-shift) * -1)" />
    </Transition.Collapse>
  );
}
