import { Fragment, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import type { Operator } from '@/app/_types/api';
import { nextTickScheduler } from '@/app/_utils/nextTickScheduler';
import {
  Button,
  Dropdown,
  ErrorMessage,
  Icon,
  Select,
  Text,
  TextInput,
} from '@/components';
import { css } from '@/styled-system/css';
import { Flex } from '@/styled-system/jsx';

import type { CashBalanceFilterModel } from '../../_types';

export const cashBalanceFilters = [
  {
    operator: 'eq',
    label: 'Is equal to',
    activeText: (balance: string) => `Exactly ${balance}`,
  },
  {
    operator: 'between',
    label: 'Is between',
    activeText: (balanceFrom: string, balanceTo: string) =>
      `${balanceFrom} to ${balanceTo}`,
  },
  {
    operator: 'gt',
    label: 'Is more than',
    activeText: (balance: string) => `More than ${balance}`,
  },
  {
    operator: 'lt',
    label: 'Is less than',
    activeText: (balance: string) => `Less than ${balance}`,
  },
] as const;

interface CashBalanceFilterProps {
  initialValue: CashBalanceFilterModel;
  onSubmit?: (payload: CashBalanceFilterModel) => void;
}

const formSchema = z.object({
  balance: z
    .array(
      z.object({
        value: z
          .string()
          .regex(/^-?[0-9]*(\.[0-9]+)?$/, { message: 'Invalid number' }),
      })
    )
    .superRefine((arr, ctx) => {
      const isBetweenOperator = arr.length === 2;

      if (isBetweenOperator) {
        const filledField = arr.findIndex(({ value }) => value.length > 0);
        const emptyField = arr.findIndex(({ value }) => value.length === 0);
        const isOneFilled = filledField !== -1 && emptyField !== -1;

        if (isOneFilled) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Required field',
            path: [`${emptyField}.value`],
          });
        }
      }

      const isBothNumeric = arr.every(
        ({ value }) => !Number.isNaN(Number.parseFloat(value))
      );
      const isFromGreaterThanTo =
        Number.parseFloat(arr[0].value) > Number.parseFloat(arr[1]?.value);

      if (isBothNumeric && isFromGreaterThanTo) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Out of range',
          path: ['1.value'],
        });
      }
    }),
});

export function CashBalanceFilter({
  initialValue,
  onSubmit,
}: CashBalanceFilterProps) {
  const [cashBalanceOperator, setCashBalanceOperator] = useState(
    initialValue.operator
  );

  const {
    control,
    register,
    setFocus,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      balance: initialValue.values.map(value => ({ value })),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'balance',
  });

  function handleChangeOperator(operator: Operator) {
    if (operator === 'between') {
      append({ value: '' });
    } else {
      remove(1);
    }

    nextTickScheduler(() => setFocus('balance.0.value'));

    setCashBalanceOperator(operator);
  }

  function handleFormSubmit(payload: { balance: Array<{ value: string }> }) {
    onSubmit?.({
      operator: cashBalanceOperator,
      values: payload.balance.map(({ value }) => value),
    });
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Dropdown.Heading>Filter by Cash Balance</Dropdown.Heading>

      <Flex direction="column" gap={2} css={{ px: 4, py: 2 }}>
        <Select
          size="sm"
          activeText={
            cashBalanceFilters.find(f => f.operator === cashBalanceOperator)
              ?.label
          }
          value={cashBalanceOperator}
          onChange={handleChangeOperator}
        >
          {cashBalanceFilters.map(({ label, operator }) => (
            <Select.Item key={operator} value={operator}>
              {label}
            </Select.Item>
          ))}
        </Select>

        <Flex justify="flex-end" align="center" gap={3}>
          <Icon.CornerDownRight
            className={css({
              flexShrink: 0,
              alignSelf: 'flex-start',
              transform: 'translateY(0.5rem)',
              fontSize: 'md',
            })}
          />
          <Flex align="baseline" gap={2} width="14.75rem">
            {fields.map((field, index) => (
              <Fragment key={field.id}>
                {index > 0 && <Text fontWeight="medium">to</Text>}

                <Flex direction="column" gap={1} flex={1}>
                  <TextInput
                    size="sm"
                    leftSlot="$"
                    placeholder="0.00"
                    autoComplete="off"
                    autoCorrect="off"
                    inputMode="decimal"
                    textAlign="right"
                    error={!!errors.balance?.[index]}
                    {...register(`balance.${index}.value`)}
                  />
                  {!!errors.balance?.[index] && (
                    <ErrorMessage fontSize="2xs.xl">
                      {errors.balance?.[index]?.value?.message}
                    </ErrorMessage>
                  )}
                </Flex>
              </Fragment>
            ))}
          </Flex>
        </Flex>
      </Flex>

      <Flex css={{ px: 4, py: 2 }}>
        <Button type="submit" size="sm" width="100%">
          Apply
        </Button>
      </Flex>
    </form>
  );
}
