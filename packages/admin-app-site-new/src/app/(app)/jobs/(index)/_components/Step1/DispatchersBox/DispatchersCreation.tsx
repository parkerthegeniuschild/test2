import { useForm } from 'react-hook-form';
import { FocusTrapRegion } from '@ariakit/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';

import { clearObject } from '@/app/_utils';
import {
  useCustomerAtom,
  useDispatcherAtom,
} from '@/app/(app)/jobs/(index)/_atoms';
import {
  useGetDispatchers,
  usePostDispatcher,
} from '@/app/(app)/jobs/(index)/create/_api';
import { Avatar, Button, toast } from '@/components';
import { css } from '@/styled-system/css';
import { Flex } from '@/styled-system/jsx';

import { type FormData, formSchema, PersonForm } from '../PersonForm';

import { DispatcherCardContainer } from './DispatcherCardContainer';

export function DispatchersCreation() {
  const customerAtom = useCustomerAtom();
  const dispatcherAtom = useDispatcherAtom();

  const queryClient = useQueryClient();

  const postDispatcher = usePostDispatcher({
    onSuccess(data) {
      dispatcherAtom.goToAutocompleteState();
      dispatcherAtom.addDispatcher(data);

      if (typeof data.company_id === 'number') {
        void queryClient.invalidateQueries({
          queryKey: [
            useGetDispatchers.queryKey,
            { companyId: data.company_id },
          ],
        });
      }

      toast.success('Dispatcher created successfully');
    },
    onError(error) {
      toast.error(
        `Error while creating dispatcher${
          error instanceof Error ? `: ${error.message}` : ''
        }`
      );
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: dispatcherAtom.data.initialName ?? '',
      lastname: dispatcherAtom.data.initialLastName ?? '',
    },
  });

  const firstname = watch('firstname')?.trim() ?? '';
  const lastname = watch('lastname')?.trim() ?? '';

  function handleFormSubmit(payload: FormData) {
    const clearedPayload = clearObject(payload);

    postDispatcher.mutate({
      company_id: customerAtom.data.company?.id,
      firstname: clearedPayload.firstname,
      lastname: clearedPayload.lastname,
      email: clearedPayload.email,
      phone: `1${clearedPayload.phone.replace(/\D/g, '')}${
        clearedPayload.phoneExtension ?? ''
      }`,
      secondary_phone: clearedPayload.secondaryPhone
        ? `1${clearedPayload.secondaryPhone.replace(/\D/g, '')}${
            clearedPayload.secondaryPhoneExtension ?? ''
          }`
        : undefined,
    });
  }

  return (
    <FocusTrapRegion
      enabled
      render={<DispatcherCardContainer focusable={false} />}
    >
      <Avatar
        name={`${firstname} ${lastname}`.trim()}
        initialsProps={{ className: css({ color: 'blue.600!' }) }}
        flexShrink={0}
      />

      <PersonForm
        register={register}
        errors={errors}
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <Flex justify="flex-end" gap={3} mt={2.3}>
          <Button
            size="sm"
            variant="secondary"
            onClick={dispatcherAtom.goToAutocompleteState}
            disabled={postDispatcher.isLoading}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            type="submit"
            disabled={postDispatcher.isLoading}
            loading={postDispatcher.isLoading}
          >
            Add Dispatcher
          </Button>
        </Flex>
      </PersonForm>
    </FocusTrapRegion>
  );
}
