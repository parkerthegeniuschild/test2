import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import { z } from 'zod';

import {
  PhoneNumberExtensionMaskedInput,
  PhoneNumberMaskedInput,
} from '@/app/(app)/_components';
import {
  PHONE_NUMBER_EXTENSION_REGEX,
  PHONE_NUMBER_REGEX,
} from '@/app/(app)/_constants';
import { ErrorMessage, StackedInput } from '@/components';
import { css } from '@/styled-system/css';
import { VStack } from '@/styled-system/jsx';

export const formSchema = z
  .object({
    firstname: z
      .string()
      .nonempty()
      .refine(data => data.trim()),
    lastname: z.string(),
    phone: z.string().nonempty().regex(PHONE_NUMBER_REGEX),
    phoneExtension: z
      .string()
      .refine(
        value => value === '' || PHONE_NUMBER_EXTENSION_REGEX.test(value)
      ),
    secondaryPhone: z.string().regex(PHONE_NUMBER_REGEX).or(z.literal('')),
    secondaryPhoneExtension: z
      .string()
      .refine(
        value => value === '' || PHONE_NUMBER_EXTENSION_REGEX.test(value)
      ),
    email: z.string().email().or(z.literal('')),
  })
  .superRefine((data, ctx) => {
    if (data.secondaryPhoneExtension && !data.secondaryPhone) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Phone extension can't be set without a phone",
        path: ['secondaryPhone'],
      });
    }
  });

export type FormData = z.infer<typeof formSchema>;

interface PersonFormProps {
  register?: UseFormRegister<FormData>;
  errors?: FieldErrors<FormData>;
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function PersonForm({
  children,
  register,
  errors,
  onSubmit,
}: React.PropsWithChildren<PersonFormProps>) {
  return (
    <form noValidate className={css({ w: '100%' })} onSubmit={onSubmit}>
      <StackedInput>
        <StackedInput.TextInput
          required
          autoFocus
          label="First name"
          placeholder="Enter first name"
          error={!!errors?.firstname}
          autoComplete="off"
          data-1p-ignore
          {...register?.('firstname')}
        />
        <StackedInput.TextInput
          label="Last name"
          placeholder="Enter last name"
          autoComplete="off"
          data-1p-ignore
          {...register?.('lastname')}
        />
        <PhoneNumberMaskedInput
          required
          label="Primary phone"
          autoComplete="off"
          error={!!errors?.phone || !!errors?.phoneExtension}
          {...register?.('phone')}
        >
          <PhoneNumberExtensionMaskedInput
            autoComplete="off"
            {...register?.('phoneExtension')}
          />
        </PhoneNumberMaskedInput>
        <PhoneNumberMaskedInput
          label="Secondary phone"
          error={!!errors?.secondaryPhone || !!errors?.secondaryPhoneExtension}
          autoComplete="off"
          {...register?.('secondaryPhone')}
        >
          <PhoneNumberExtensionMaskedInput
            autoComplete="off"
            {...register?.('secondaryPhoneExtension')}
          />
        </PhoneNumberMaskedInput>
        <StackedInput.TextInput
          type="email"
          label="Email"
          placeholder="Enter email address"
          data-1p-ignore
          autoComplete="off"
          error={!!errors?.email}
          {...register?.('email')}
        />
      </StackedInput>

      <VStack
        gap={2}
        alignItems="flex-start"
        mt={2}
        css={{ _empty: { display: 'none' } }}
      >
        {errors?.firstname ||
        errors?.phone?.type === z.ZodIssueCode.too_small ? (
          <ErrorMessage>Please enter person info</ErrorMessage>
        ) : null}

        {errors?.phone?.type === z.ZodIssueCode.invalid_string && (
          <ErrorMessage>Please enter a valid primary phone</ErrorMessage>
        )}

        {errors?.secondaryPhone?.type === z.ZodIssueCode.invalid_string && (
          <ErrorMessage>Please enter a valid secondary phone</ErrorMessage>
        )}

        {errors?.secondaryPhone?.type === z.ZodIssueCode.custom && (
          <ErrorMessage>{errors.secondaryPhone.message}</ErrorMessage>
        )}

        {errors?.email?.type === z.ZodIssueCode.invalid_string && (
          <ErrorMessage>Please enter a valid email</ErrorMessage>
        )}
      </VStack>

      {children}
    </form>
  );
}
