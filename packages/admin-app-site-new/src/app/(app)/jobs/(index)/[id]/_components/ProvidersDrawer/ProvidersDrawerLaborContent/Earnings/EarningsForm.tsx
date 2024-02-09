import { Controller, useForm } from 'react-hook-form';
import { mergeRefs } from 'react-merge-refs';
import { FocusTrapRegion } from '@ariakit/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNumberFormat } from '@react-input/number-format';
import { Decimal } from 'decimal.js';
import { z } from 'zod';

import { format } from '@/app/_utils';
import { Button, ErrorMessage, StackedInput, Text } from '@/components';
import { css } from '@/styled-system/css';
import { Flex } from '@/styled-system/jsx';

const formSchema = z.object({
  description: z.string().refine(v => v.trim().length > 0),
  quantity: z.string().superRefine((v, ctx) => {
    const valueAsNumber = Number(v.replace(/,/g, ''));

    if (v === '' || Number.isNaN(valueAsNumber)) {
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_type,
        expected: 'number',
        received: typeof v,
      });
    }

    if (valueAsNumber <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_small,
        inclusive: true,
        minimum: 0,
        type: 'number',
      });
    }
  }),
  price: z.number().positive(),
});

type FormData = z.infer<typeof formSchema>;

export type EarningDataModel = Omit<FormData, 'quantity'> & {
  quantity: number;
};

interface EarningsFormProps {
  initialValues?: EarningDataModel;
  loading?: boolean;
  shouldLockFields?: boolean;
  onSubmit: (data: EarningDataModel) => void;
  onCancel: () => void;
}

export function EarningsForm({
  initialValues,
  loading,
  shouldLockFields,
  onCancel,
  onSubmit,
}: EarningsFormProps) {
  const quantityInputRef = useNumberFormat({
    locales: 'en',
    maximumFractionDigits: 3,
    minimumFractionDigits: 0,
    signDisplay: 'never',
  });
  const priceInputRef = useNumberFormat({
    locales: 'en',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    signDisplay: 'never',
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues
      ? {
          ...initialValues,
          quantity: format.number(initialValues.quantity, {
            maximumFractionDigits: 3,
            minimumFractionDigits: 0,
            signDisplay: 'never',
          }),
        }
      : undefined,
  });

  const isOnCreateMode = !initialValues;

  const quantityValue = watch('quantity');
  const priceValue = watch('price');
  const finalPrice =
    !Number.isNaN(Number.parseFloat(quantityValue)) &&
    !Number.isNaN(Number.parseFloat(priceValue?.toString()))
      ? format.currency(
          // ensure cents are always floored to 2 decimal places
          Math.trunc(
            new Decimal(quantityValue).times(priceValue).times(100).toNumber()
          ) / 100
        )
      : null;

  function handleFormSubmit(payload: FormData) {
    onSubmit({
      description: payload.description.trim(),
      price: payload.price,
      quantity: Number(payload.quantity.replace(/,/g, '')),
    });
  }

  return (
    <FocusTrapRegion enabled>
      <form
        className={css({
          zIndex: 0,
          position: 'relative',
          display: 'flex',
          flexDir: 'column',
          gap: 3,
        })}
        noValidate
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <StackedInput>
          <StackedInput.TextInput
            required
            label="Description"
            placeholder="Enter description"
            autoComplete="off"
            error={!!errors.description}
            disabled={shouldLockFields}
            {...register('description')}
          />

          <StackedInput.HStack>
            <Controller
              control={control}
              name="quantity"
              render={({ field, fieldState }) => (
                <StackedInput.TextInput
                  required
                  label="Qty"
                  placeholder="1"
                  autoComplete="off"
                  error={!!fieldState.error}
                  {...field}
                  disabled={shouldLockFields}
                  ref={mergeRefs([field.ref, quantityInputRef])}
                  value={field.value ?? ''}
                />
              )}
            />
            <Controller
              control={control}
              name="price"
              render={({ field, fieldState }) => (
                <StackedInput.TextInput
                  required
                  label="$"
                  placeholder="0.00"
                  autoComplete="off"
                  error={!!fieldState.error}
                  {...field}
                  ref={mergeRefs([field.ref, priceInputRef])}
                  value={
                    typeof field.value === 'number'
                      ? format.currency(field.value).replace(/\$/g, '')
                      : ''
                  }
                  onChange={e =>
                    field.onChange(
                      e.target.value === ''
                        ? ''
                        : Number(e.target.value.replace(/,/g, ''))
                    )
                  }
                />
              )}
            />
          </StackedInput.HStack>
        </StackedInput>

        <Flex direction="column" gap={2} css={{ _empty: { display: 'none' } }}>
          {!!errors.description && (
            <ErrorMessage>Please enter a description</ErrorMessage>
          )}

          {errors.quantity?.type === 'invalid_type' && (
            <ErrorMessage>Please enter a quantity</ErrorMessage>
          )}
          {errors.quantity?.type === 'too_small' && (
            <ErrorMessage>Please enter a quantity greater than 0</ErrorMessage>
          )}

          {errors.price?.type === 'invalid_type' && (
            <ErrorMessage>Please enter a rate</ErrorMessage>
          )}
          {errors.price?.type === 'too_small' && (
            <ErrorMessage>Please enter a rate greater than 0</ErrorMessage>
          )}
        </Flex>

        <Flex align="center" gap={3}>
          <Button
            size="sm"
            variant="secondary"
            disabled={loading}
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button size="sm" type="submit" disabled={loading} loading={loading}>
            {isOnCreateMode ? 'Add' : 'Save'}
          </Button>

          {!!finalPrice && (
            <Text ml="auto" fontWeight="medium" color="gray.700">
              {finalPrice}
            </Text>
          )}
        </Flex>
      </form>
    </FocusTrapRegion>
  );
}
