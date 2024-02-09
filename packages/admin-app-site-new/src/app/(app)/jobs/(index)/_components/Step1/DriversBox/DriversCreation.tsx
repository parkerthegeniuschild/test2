import { useForm } from 'react-hook-form';
import { FocusTrapRegion } from '@ariakit/react';
import { zodResolver } from '@hookform/resolvers/zod';

import { clearObject } from '@/app/_utils';
import { useDriverAtom } from '@/app/(app)/jobs/(index)/_atoms';
import { Avatar, Button } from '@/components';
import { css } from '@/styled-system/css';
import { Flex } from '@/styled-system/jsx';

import { type FormData, formSchema, PersonForm } from '../PersonForm';

import { DriverCardContainer } from './DriverCardContainer';

export function DriversCreation() {
  const driverAtom = useDriverAtom();

  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: driverAtom.data.initialName ?? '',
      lastname: driverAtom.data.initialLastName ?? '',
    },
  });

  const firstname = watch('firstname')?.trim() ?? '';
  const lastname = watch('lastname')?.trim() ?? '';

  function handleFormSubmit(payload: FormData) {
    const clearedPayload = clearObject(payload);

    driverAtom.goToAutocompleteState();
    driverAtom.addDriver({
      id: Math.floor(Math.random() * 10000000),
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
    <FocusTrapRegion enabled render={<DriverCardContainer focusable={false} />}>
      <Avatar
        name={`${firstname} ${lastname}`.trim()}
        initialsProps={{ className: css({ color: 'primary.600!' }) }}
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
            onClick={driverAtom.goToAutocompleteState}
          >
            Cancel
          </Button>
          <Button size="sm" type="submit">
            Add Driver
          </Button>
        </Flex>
      </PersonForm>
    </FocusTrapRegion>
  );
}
