import { useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import { nextTickScheduler } from '@/app/_utils';
import { useGetPageSize } from '@/app/(app)/_hooks';
import { useGetJob, useLeaveJob } from '@/app/(app)/jobs/(index)/[id]/_api';
import { useJobId } from '@/app/(app)/jobs/(index)/[id]/_hooks';
import {
  Button,
  ErrorMessage,
  Modal,
  Select,
  Text,
  Textarea,
} from '@/components';
import { css } from '@/styled-system/css';
import { Flex } from '@/styled-system/jsx';

type FormFields = {
  reason: string;
  reasonText: string;
};

interface LeaveJobModalProps {
  open: boolean;
  onClose: () => void;
}

export function LeaveJobModal({ open, onClose }: LeaveJobModalProps) {
  const router = useRouter();

  const jobId = useJobId();

  const [isNavigating, startNavigationTransition] = useTransition();

  const pageSize = useGetPageSize();

  const getJob = useGetJob(jobId);
  const leaveJob = useLeaveJob({
    onSuccess() {
      nextTickScheduler(getJob.removeQueries);
    },
    onMutate() {
      startNavigationTransition(() => router.push(`/jobs?size=${pageSize}`));
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    register,
    watch,
    formState: { errors },
  } = useForm<FormFields>();

  const reasonValue = watch('reason');

  function handleClose() {
    if (isNavigating) {
      return;
    }

    onClose();
  }

  function handleUnmount() {
    reset();
  }

  function handleFormSubmit(payload: FormFields) {
    leaveJob.mutate({
      id: jobId,
      reason: payload.reason === 'Other' ? payload.reasonText : payload.reason,
    });
  }

  return (
    <Modal
      open={open}
      hideOnEscape={!isNavigating}
      hideOnInteractOutside={!isNavigating}
      onClose={handleClose}
      onUnmount={handleUnmount}
    >
      <Modal.Heading>Leave new job workflow?</Modal.Heading>
      <Modal.Description>
        This job is still a draft and will not be assigned to a provider if you
        leave this workflow. To proceed, please select a reason for leaving.
      </Modal.Description>

      <form
        className={css({ mt: 2 })}
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <Controller
          control={control}
          rules={{ required: true }}
          name="reason"
          render={({ field: { onChange, onBlur, value, ref }, fieldState }) => (
            <Select
              ref={ref}
              popoverProps={{ modal: true }}
              buttonProps={{ onBlur }}
              error={!!fieldState.error}
              activeText={value || 'Select a reason'}
              value={value ?? ''}
              onChange={onChange}
            >
              <Select.Item value="No providers available" />
              <Select.Item value="No providers accepted" />
              <Select.Item value="Price too high" />
              <Select.Item value="Too long of wait" />
              <Select.Item value="Other" />
            </Select>
          )}
        />

        {!!errors.reason && (
          <ErrorMessage mt={2}>Please select a reason.</ErrorMessage>
        )}

        {reasonValue === 'Other' && (
          <Flex direction="column" gap={2} mt={3}>
            <Textarea
              placeholder="Reason for leaving"
              rows={4}
              error={!!errors.reasonText}
              {...register('reasonText', { required: true })}
            />

            {errors.reasonText ? (
              <ErrorMessage>
                A note is required when “Other” is selected.
              </ErrorMessage>
            ) : (
              <Text lineHeight="md">
                A note is required when “Other” is selected.
              </Text>
            )}
          </Flex>
        )}

        <Flex justify="flex-end" align="center" gap={2} mt={5}>
          <Modal.Dismiss disabled={isNavigating}>Cancel</Modal.Dismiss>
          <Button
            size="sm"
            danger
            type="submit"
            disabled={isNavigating}
            loading={isNavigating}
          >
            Leave
          </Button>
        </Flex>
      </form>
    </Modal>
  );
}
