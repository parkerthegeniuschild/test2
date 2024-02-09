import { useQueryClient } from '@tanstack/react-query';

import { clearObject, format } from '@/app/_utils';
import { useDispatcherAtom } from '@/app/(app)/jobs/(index)/_atoms';
import { Common } from '@/app/(app)/jobs/(index)/_components/styles';
import { emitDispatcherEdit } from '@/app/(app)/jobs/(index)/_events';
import type { Dispatcher } from '@/app/(app)/jobs/(index)/_types';
import {
  useGetDispatchers,
  usePatchDispatcher,
} from '@/app/(app)/jobs/(index)/create/_api';
import { Button, Icon, Modal, Text, toast } from '@/components';
import { css } from '@/styled-system/css';
import { Box, Flex } from '@/styled-system/jsx';

import type { FormData } from '../PersonForm';

interface ConfirmDispatcherUpdateModalProps {
  open?: boolean;
  originalData: Dispatcher;
  updatedData: FormData | null;
  onClose?: () => void;
}

export function ConfirmDispatcherUpdateModal({
  open,
  originalData,
  updatedData,
  onClose,
}: ConfirmDispatcherUpdateModalProps) {
  const dispatcherAtom = useDispatcherAtom();

  const queryClient = useQueryClient();

  const patchDispatcher = usePatchDispatcher({
    onSuccess(data) {
      onClose?.();
      dispatcherAtom.setEditingDispatcher(null);
      dispatcherAtom.updateDispatcher(data);
      emitDispatcherEdit();

      if (typeof originalData.company_id === 'number') {
        queryClient.removeQueries({
          queryKey: [
            useGetDispatchers.queryKey,
            { companyId: originalData.company_id },
          ],
        });
      }

      toast.success('Dispatcher updated successfully');
    },
    onError(error) {
      toast.error(
        `Error while updating dispatcher${
          error instanceof Error ? `: ${error.message}` : ''
        }`
      );
    },
  });

  const originalName = `${originalData.firstname.trim()} ${
    originalData.lastname?.trim() ?? ''
  }`.trim();
  const originalPhone = originalData.phone
    ? format.phoneNumber(originalData.phone)
    : null;
  const originalSecondaryPhone = originalData.secondary_phone
    ? format.phoneNumber(originalData.secondary_phone)
    : null;

  const updatedDataName = `${updatedData?.firstname.trim()} ${
    updatedData?.lastname?.trim() ?? ''
  }`.trim();
  const updatedDataPhone = `${updatedData?.phone}${
    updatedData?.phoneExtension ? ` Ext ${updatedData.phoneExtension}` : ''
  }`;
  const updatedDataSecondaryPhone = updatedData?.secondaryPhone
    ? `${updatedData.secondaryPhone}${
        updatedData.secondaryPhoneExtension
          ? ` Ext ${updatedData.secondaryPhoneExtension}`
          : ''
      }`
    : null;

  function handlePatchDispatcher() {
    if (!updatedData) {
      return;
    }

    const clearedUpdatedData = clearObject(updatedData);

    patchDispatcher.mutate({
      id: originalData.id,
      firstname: clearedUpdatedData.firstname,
      lastname: clearedUpdatedData.lastname ?? '',
      email: clearedUpdatedData.email ?? '',
      phone: `1${clearedUpdatedData.phone.replace(/\D/g, '')}${
        clearedUpdatedData.phoneExtension ?? ''
      }`,
      secondary_phone: clearedUpdatedData.secondaryPhone
        ? `1${clearedUpdatedData.secondaryPhone.replace(/\D/g, '')}${
            clearedUpdatedData.secondaryPhoneExtension ?? ''
          }`
        : '',
    });
  }

  function handleModalClose() {
    if (patchDispatcher.isLoading) {
      return;
    }

    patchDispatcher.reset();
    onClose?.();
  }

  return (
    <Modal
      open={open}
      hideOnEscape={!patchDispatcher.isLoading}
      hideOnInteractOutside={!patchDispatcher.isLoading}
      unmountOnHide
      onClose={handleModalClose}
    >
      <Modal.Heading>Is this the same person?</Modal.Heading>
      <Modal.Description>
        Only update this record if it&rsquo;s the same person. If you are trying
        to create a new person, first remove this record from the job, then add
        a new person.
      </Modal.Description>

      <Flex
        direction="column"
        gap={1}
        rounded="lg"
        bgColor="rgba(1, 2, 3, 0.04)"
        p={3}
        mt={2}
      >
        <div>
          <Text fontWeight="semibold" color="gray.700">
            {originalName}
          </Text>
          <Text
            mt={2.1}
            fontWeight="medium"
            color="gray.400"
            css={{ _empty: { display: 'none' } }}
          >
            {originalPhone}
            {!!originalSecondaryPhone && (
              <>
                <Common.Dot />
                {originalSecondaryPhone}
              </>
            )}
          </Text>
          {!!originalData.email && (
            <Text mt={1.75} fontWeight="medium" color="gray.400">
              {originalData.email}
            </Text>
          )}
        </div>

        <Flex aria-hidden align="center" gap={3}>
          <Box height="1px" bgColor="gray.200" flex={1} ml={-3} />

          <Flex
            fontSize="2xs.xl"
            h={4}
            w={4}
            bgColor="gray.500"
            color="white"
            justify="center"
            align="center"
            rounded="full"
            transform="rotate(180deg)"
          >
            <Icon.ArrowUp />
          </Flex>
        </Flex>

        {!!updatedData && (
          <div>
            <Text
              fontWeight="semibold"
              color={originalName !== updatedDataName ? 'danger' : 'gray.700'}
            >
              {updatedDataName}
            </Text>
            <Text mt={2.1} fontWeight="medium" color="gray.400">
              <span
                className={css({
                  color:
                    originalPhone !== updatedDataPhone ? 'danger' : undefined,
                })}
              >
                {updatedDataPhone}
              </span>
              {!!updatedDataSecondaryPhone && (
                <>
                  <Common.Dot />
                  <span
                    className={css({
                      color:
                        originalSecondaryPhone !== updatedDataSecondaryPhone
                          ? 'danger'
                          : undefined,
                    })}
                  >
                    {updatedDataSecondaryPhone}
                  </span>
                </>
              )}
            </Text>
            {!!updatedData.email && (
              <Text
                mt={1.75}
                fontWeight="medium"
                color={
                  originalData.email?.trim() !== updatedData.email.trim()
                    ? 'danger'
                    : 'gray.400'
                }
              >
                {updatedData.email}
              </Text>
            )}
          </div>
        )}
      </Flex>

      <Flex justify="flex-end" align="center" gap={2} mt={3}>
        <Modal.Dismiss disabled={patchDispatcher.isLoading}>
          No, cancel
        </Modal.Dismiss>
        <Button
          size="sm"
          disabled={patchDispatcher.isLoading}
          loading={patchDispatcher.isLoading}
          onClick={handlePatchDispatcher}
        >
          Yes, they&apos;re the same
        </Button>
      </Flex>
    </Modal>
  );
}
