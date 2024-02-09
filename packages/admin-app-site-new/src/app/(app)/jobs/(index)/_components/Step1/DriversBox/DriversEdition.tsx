import { useForm } from 'react-hook-form';
import { FocusTrapRegion } from '@ariakit/react';
import { zodResolver } from '@hookform/resolvers/zod';

import { clearObject, format } from '@/app/_utils';
import { useDriverAtom } from '@/app/(app)/jobs/(index)/_atoms';
import type { Driver } from '@/app/(app)/jobs/(index)/_types';
import { Avatar, Button } from '@/components';
import { css } from '@/styled-system/css';
import { Flex } from '@/styled-system/jsx';

import { type FormData, formSchema, PersonForm } from '../PersonForm';

import { DriverCardContainer } from './DriverCardContainer';

interface DriversEditionProps {
  driver: Driver;
}

export function DriversEdition({ driver }: DriversEditionProps) {
  const driverAtom = useDriverAtom();

  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: driver.firstname.trim(),
      lastname: driver.lastname?.trim() ?? '',
      email: driver.email ?? '',
      phone: driver.phone ? format.phoneNumber(driver.phone).slice(0, 14) : '',
      phoneExtension: driver.phone ? driver.phone.slice(11) : '',
      secondaryPhone: driver.secondary_phone
        ? format.phoneNumber(driver.secondary_phone).slice(0, 14)
        : '',
      secondaryPhoneExtension: driver.secondary_phone
        ? driver.secondary_phone.slice(11)
        : '',
    },
  });

  const firstname = watch('firstname').trim();
  const lastname = watch('lastname').trim();

  function handleRemoveFromJob() {
    driverAtom.removeDriver(driver.id);
    driverAtom.setEditingDriver(null);
  }

  function handleFormSubmit(payload: FormData) {
    const clearedPayload = clearObject(payload);

    driverAtom.setEditingDriver(null);
    driverAtom.updateDriver({
      id: driver.id,
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
        <Flex gap={3} mt={2.3}>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => driverAtom.setEditingDriver(null)}
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
    </FocusTrapRegion>
  );
}
