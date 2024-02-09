import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FocusTrapRegion } from '@ariakit/react';
import { zodResolver } from '@hookform/resolvers/zod';

import { clearObject, format } from '@/app/_utils';
import { useDispatcherAtom } from '@/app/(app)/jobs/(index)/_atoms';
import type { Dispatcher } from '@/app/(app)/jobs/(index)/_types';
import { Avatar, Button } from '@/components';
import { css } from '@/styled-system/css';
import { Flex } from '@/styled-system/jsx';

import { type FormData, formSchema, PersonForm } from '../PersonForm';

import { ConfirmDispatcherUpdateModal } from './ConfirmDispatcherUpdateModal';
import { DispatcherCardContainer } from './DispatcherCardContainer';

interface DispatchersEditionProps {
  dispatcher: Dispatcher;
}

export function DispatchersEdition({ dispatcher }: DispatchersEditionProps) {
  const dispatcherAtom = useDispatcherAtom();

  const [editPayload, setEditPayload] = useState<FormData | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors, isDirty },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: dispatcher.firstname.trim(),
      lastname: dispatcher.lastname?.trim() ?? '',
      email: dispatcher.email ?? '',
      phone: dispatcher.phone
        ? format.phoneNumber(dispatcher.phone).slice(0, 14)
        : '',
      phoneExtension: dispatcher.phone ? dispatcher.phone.slice(11) : '',
      secondaryPhone: dispatcher.secondary_phone
        ? format.phoneNumber(dispatcher.secondary_phone).slice(0, 14)
        : '',
      secondaryPhoneExtension: dispatcher.secondary_phone
        ? dispatcher.secondary_phone.slice(11)
        : '',
    },
  });

  const firstname = watch('firstname').trim();
  const lastname = watch('lastname').trim();

  function handleRemoveFromJob() {
    dispatcherAtom.removeDispatcher(dispatcher.id);
    dispatcherAtom.setEditingDispatcher(null);
  }

  function handleFormSubmit(payload: FormData) {
    if (!isDirty) {
      dispatcherAtom.setEditingDispatcher(null);
      return;
    }

    const clearedPayload = clearObject(payload);

    setEditPayload(clearedPayload);
    setIsConfirmModalOpen(true);
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
        <Flex gap={3} mt={2.3}>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => dispatcherAtom.setEditingDispatcher(null)}
          >
            Cancel
          </Button>
          <Button size="sm" type="submit">
            Save changes
          </Button>

          <Button
            size="sm"
            variant="secondary"
            ml="auto"
            danger
            onClick={handleRemoveFromJob}
          >
            Remove from job
          </Button>
        </Flex>
      </PersonForm>

      <ConfirmDispatcherUpdateModal
        open={isConfirmModalOpen}
        originalData={dispatcher}
        updatedData={editPayload}
        onClose={() => setIsConfirmModalOpen(false)}
      />
    </FocusTrapRegion>
  );
}
