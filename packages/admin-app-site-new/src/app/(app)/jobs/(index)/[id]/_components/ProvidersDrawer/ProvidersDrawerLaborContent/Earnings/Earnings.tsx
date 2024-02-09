import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { S } from '@/app/(app)/jobs/(index)/_components';
import {
  useGetPriceSummary,
  useGetProviderEarnings,
  usePatchJob,
  usePatchProviderEarning,
  usePostProviderEarning,
} from '@/app/(app)/jobs/(index)/[id]/_api';
import { UnlockedOnly } from '@/app/(app)/jobs/(index)/[id]/_components/UnlockedOnly';
import { useJobId } from '@/app/(app)/jobs/(index)/[id]/_hooks';
import { Icon, Spinner, Text, TextButton, toast } from '@/components';
import { Flex } from '@/styled-system/jsx';

import type { EarningsFocusedSection } from '../types';

import { ConfirmEarningRemovalModal } from './ConfirmEarningRemovalModal';
import { EarningEntry } from './EarningEntry';
import { type EarningDataModel, EarningsForm } from './EarningsForm';

interface EarningsProps {
  focusedSection: EarningsFocusedSection | null;
  providerId: number;
  onFocusedSectionChange: (section: EarningsFocusedSection | null) => void;
}

export function Earnings({
  focusedSection,
  providerId,
  onFocusedSectionChange,
}: EarningsProps) {
  const jobId = useJobId();

  const queryClient = useQueryClient();

  const [editingEarning, setEditingEarning] = useState<EarningDataModel | null>(
    null
  );
  const [isRemovalModalOpen, setIsRemovalModalOpen] = useState(false);
  const [deletingEarning, setDeletingEarning] = useState<{
    id: number;
    description: string;
  } | null>(null);

  const getProviderEarnings = useGetProviderEarnings({ jobId });
  const postProviderEarning = usePostProviderEarning({
    async onAfterMutate() {
      await getProviderEarnings.refetch();
    },
    onSuccess() {
      onFocusedSectionChange(null);

      toast.success('Earning created successfully');
    },
    onError(error) {
      toast.error(
        `Error while creating earning${
          error instanceof Error ? `: ${error.message}` : ''
        }`
      );
    },
  });
  const patchProviderEarning = usePatchProviderEarning({
    async onAfterMutate() {
      await getProviderEarnings.refetch();
    },
    onSuccess() {
      setEditingEarning(null);
      onFocusedSectionChange(null);

      toast.success('Earning updated successfully');
    },
    onError(error) {
      toast.error(
        `Error while updating earning${
          error instanceof Error ? `: ${error.message}` : ''
        }`
      );
    },
  });
  const patchJob = usePatchJob(jobId, {
    async onAfterMutate() {
      await getProviderEarnings.refetch();
    },
    onSuccess() {
      onFocusedSectionChange(null);

      void queryClient.invalidateQueries({
        queryKey: [useGetPriceSummary.queryKey],
      });

      toast.success('Earning updated successfully');
    },
  });

  return (
    <Flex
      direction="column"
      gap={5}
      pb={5}
      mb={5}
      borderBottomWidth="1px"
      borderColor="gray.100"
    >
      <Flex align="center" gap={3}>
        <Text as="strong" fontSize="md" fontWeight="semibold" color="gray.400">
          Total earnings
        </Text>

        {getProviderEarnings.isFetching && <Spinner />}
      </Flex>

      <Flex
        direction="column"
        gap={3}
        css={{
          _empty: { display: 'none' },
          ...(focusedSection?.action === 'create' ? S.blurredStyles.raw() : {}),
        }}
        {...{ inert: focusedSection?.action === 'create' ? '' : undefined }}
      >
        {!!getProviderEarnings.data && (
          <>
            {focusedSection &&
            'earning' in focusedSection &&
            focusedSection.earning === 'per_hour' ? (
              <EarningsForm
                shouldLockFields
                initialValues={{
                  description: 'Per hour',
                  quantity: getProviderEarnings.data.per_hour_amount,
                  price: getProviderEarnings.data.per_hour_rate_cents / 100,
                }}
                loading={patchJob.isLoading}
                onCancel={() => onFocusedSectionChange(null)}
                onSubmit={payload =>
                  patchJob.mutate({ provider_rate_cents: payload.price * 100 })
                }
              />
            ) : (
              <EarningEntry
                allowDelete={false}
                description="Per hour"
                quantity={getProviderEarnings.data.per_hour_amount}
                value={getProviderEarnings.data.perHourPrice}
                totalValue={getProviderEarnings.data.perHourTotalPrice}
                blur={focusedSection?.action === 'edit'}
                onEditRequest={() =>
                  onFocusedSectionChange({
                    action: 'edit',
                    earning: 'per_hour',
                  })
                }
              />
            )}

            {focusedSection &&
            'earning' in focusedSection &&
            focusedSection.earning === 'callout' ? (
              <EarningsForm
                shouldLockFields
                initialValues={{
                  description: 'Callout',
                  quantity: 1,
                  price: getProviderEarnings.data.callout_rate_cents / 100,
                }}
                loading={patchJob.isLoading}
                onCancel={() => onFocusedSectionChange(null)}
                onSubmit={payload =>
                  patchJob.mutate({
                    provider_callout_cents: payload.price * 100,
                  })
                }
              />
            ) : (
              <EarningEntry
                allowDelete={false}
                description="Callout"
                quantity={1}
                value={getProviderEarnings.data.calloutPrice}
                totalValue={getProviderEarnings.data.calloutPrice}
                blur={focusedSection?.action === 'edit'}
                onEditRequest={() =>
                  onFocusedSectionChange({
                    action: 'edit',
                    earning: 'callout',
                  })
                }
              />
            )}
          </>
        )}

        {getProviderEarnings.data?.items.map(earning => {
          if (
            focusedSection?.action === 'edit' &&
            'id' in focusedSection &&
            focusedSection.id === earning.id &&
            editingEarning
          ) {
            return (
              <EarningsForm
                key={earning.id}
                initialValues={editingEarning}
                loading={patchProviderEarning.isLoading}
                onCancel={() => {
                  setEditingEarning(null);
                  onFocusedSectionChange(null);
                }}
                onSubmit={payload =>
                  patchProviderEarning.mutate({
                    ...payload,
                    id: earning.id,
                    jobId,
                  })
                }
              />
            );
          }

          return (
            <EarningEntry
              key={earning.id}
              description={earning.description}
              quantity={earning.quantity}
              value={earning.unitPrice}
              totalValue={earning.totalPrice}
              blur={focusedSection?.action === 'edit'}
              onEditRequest={() => {
                onFocusedSectionChange({ action: 'edit', id: earning.id });
                setEditingEarning({
                  description: earning.description,
                  quantity: earning.quantity,
                  price: earning.unit_price_cents / 100,
                });
              }}
              onDeleteRequest={() => {
                setDeletingEarning(earning);
                setIsRemovalModalOpen(true);
              }}
            />
          );
        })}

        {!!getProviderEarnings.data && (
          <Flex
            align="center"
            fontSize="md"
            fontWeight="semibold"
            color="gray.700"
            gap={4}
            css={focusedSection?.action === 'edit' ? S.blurredStyles.raw() : {}}
            {...{ inert: focusedSection?.action === 'edit' ? '' : undefined }}
          >
            <Text flex={1} fontSize="inherit" color="inherit">
              Total
            </Text>
            <Text fontSize="inherit" color="inherit">
              {getProviderEarnings.data.totalPrice}
            </Text>
          </Flex>
        )}
      </Flex>

      {focusedSection?.action === 'create' && (
        <EarningsForm
          loading={postProviderEarning.isLoading}
          onCancel={() => onFocusedSectionChange(null)}
          onSubmit={payload =>
            postProviderEarning.mutate({
              ...payload,
              providerId,
              jobId,
            })
          }
        />
      )}

      <UnlockedOnly>
        {focusedSection?.action !== 'create' && (
          <TextButton
            leftSlot={<Icon.Plus />}
            maxW="max"
            disabled={focusedSection?.action === 'edit'}
            onClick={() => onFocusedSectionChange({ action: 'create' })}
          >
            Add earning
          </TextButton>
        )}
      </UnlockedOnly>

      <ConfirmEarningRemovalModal
        open={isRemovalModalOpen}
        description={deletingEarning?.description ?? ''}
        earningId={deletingEarning?.id ?? 0}
        onSuccessfulRemoval={() => setIsRemovalModalOpen(false)}
        onClose={() => setIsRemovalModalOpen(false)}
        onUnmount={() => setDeletingEarning(null)}
      />
    </Flex>
  );
}
