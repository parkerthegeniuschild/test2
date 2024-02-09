import { useState } from 'react';
import { FocusTrapRegion } from '@ariakit/react';
import { useNumberFormat } from '@react-input/number-format';
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import type {
  StripeCardElementChangeEvent,
  StripeCardElementOptions,
  StripeError,
} from '@stripe/stripe-js';
import { Decimal } from 'decimal.js';
import { match } from 'ts-pattern';

import { getStripe } from '@/app/_lib/stripe';
import { format } from '@/app/_utils';
import {
  type PriceSummaryParsed,
  useGetJob,
  usePostPaymentIntent,
} from '@/app/(app)/jobs/(index)/[id]/_api';
import { useJobId } from '@/app/(app)/jobs/(index)/[id]/_hooks';
import {
  Alert,
  Button,
  ErrorMessage,
  Heading,
  Label,
  Modal,
  Select,
  Text,
  Textarea,
  TextInput,
} from '@/components';
import { css } from '@/styled-system/css';
import { Box, Flex, styled } from '@/styled-system/jsx';
import { flex } from '@/styled-system/patterns';
import { tokens } from '@/styles';

const creditCardElementOptions: StripeCardElementOptions = {
  disableLink: true,
  iconStyle: 'solid',
  style: {
    base: {
      fontFamily: 'Inter, sans-serif',
      fontSmoothing: 'antialiased',
      iconColor: tokens.colors.gray[400].value,
      fontWeight: tokens.fontWeights.medium.value,
      color: tokens.colors.gray[900].value,
      backgroundColor: '#fff',

      '::placeholder': {
        color: tokens.colors.gray[400].value,
      },

      ':-webkit-autofill': {
        backgroundColor: '#fff',
      },
    },
    invalid: {
      iconColor: tokens.colors.danger[500].value,
      color: tokens.colors.gray[900].value,
    },
  },
};

const CreditCardContainer = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'relative',
    bgColor: 'white',
    h: 9,
    pl: 3,
    pr: 1.25,
    borderWidth: '1px',
    borderColor: 'gray.200',
    rounded: 'lg',
    shadow: 'sm',
    transitionProperty: 'border-color',
    transitionDuration: 'fast',
    transitionTimingFunction: 'ease-in-out',

    _before: {
      content: '""',
      zIndex: -1,
      position: 'absolute',
      inset: 0,
      bgColor: 'primary',
      opacity: 0,
      width: 'calc(100% + 10px)',
      height: 'calc(100% + 10px)',
      transform: 'translate(-5px, -5px)',
      rounded: 'calc(token(radii.lg) + 4px)',
      transition: 'opacity token(durations.fast) ease-in-out',
    },

    _after: {
      content: '""',
      position: 'absolute',
      left: 0,
      bottom: '-1px',
      shadow: 'inset',
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      rounded: 'calc(token(radii.lg) - 1px)',
    },
  },
  variants: {
    focused: {
      true: {
        borderColor: 'primary',

        _before: {
          opacity: 0.24,
        },
      },
    },
    error: {
      true: {
        borderColor: 'danger',

        _before: {
          bgColor: 'danger',
        },
      },
    },
  },
  compoundVariants: [
    {
      focused: true,
      error: true,
      css: {
        borderColor: 'danger',

        _before: {
          bgColor: 'danger',
        },
      },
    },
  ],
});

type PaymentMethod = keyof PriceSummaryParsed['paymentMethodToText'];

interface PaymentFormProps {
  formattedBalance: string;
  balanceInCents: number;
  paymentMethodToText: PriceSummaryParsed['paymentMethodToText'];
  initialValues?: {
    paymentMethod: PaymentMethod;
    amount: number;
    identifier: string;
  } | null;
  loading?: boolean;
  onSubmit: (payload: {
    amountCents: number;
    identifier: string;
    paymentMethod: PaymentMethod;
    paymentIntentId?: string;
  }) => void;
  onCancel: () => void;
}

function Form({
  formattedBalance,
  balanceInCents,
  paymentMethodToText,
  initialValues,
  loading,
  onSubmit,
  onCancel,
}: PaymentFormProps) {
  const jobId = useJobId();

  const getJob = useGetJob(jobId);
  const postPaymentIntent = usePostPaymentIntent();

  const amountInputRef = useNumberFormat({
    locales: 'en',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    signDisplay: 'never',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    initialValues?.paymentMethod ?? 'cash'
  );
  const [amount, setAmount] = useState<number | null>(
    initialValues?.amount ?? (balanceInCents <= 0 ? null : balanceInCents / 100)
  );
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isConfirmSaveModalOpen, setIsConfirmSaveModalOpen] = useState(false);
  const [isConfirmOverpayModalOpen, setIsConfirmOverpayModalOpen] =
    useState(false);

  const providerOptions = [
    ...(getJob.data?.provider
      ? [
          {
            id: getJob.data.provider.id.toString(),
            name: getJob.data.provider.name,
          },
        ]
      : []),
  ];

  const [identifier, setIdentifier] = useState(
    initialValues?.identifier ?? providerOptions[0]?.id ?? ''
  );

  const [paymentStatus, setPaymentStatus] = useState<
    | {
        status: 'initial' | 'processing' | 'success';
      }
    | { status: 'error'; title: string; message: string }
  >({ status: 'initial' });
  const [creditCardFormStatus, setCreditCardFormStatus] = useState<
    (Partial<StripeCardElementChangeEvent> & { focused?: boolean }) | null
  >(null);

  const stripe = useStripe();
  const elements = useElements();

  const isOnEditMode = !!initialValues;
  const isOnCreateMode = !initialValues;

  const isAmountEmpty = amount === null;
  const isAmountNonPositive = typeof amount === 'number' && amount <= 0;

  const isIdentifierEmpty = identifier.trim() === '';

  function handlePaymentMethodChange(newPaymentMethod: PaymentMethod) {
    const oldPaymentMethod = paymentMethod;

    setPaymentMethod(newPaymentMethod);
    setCreditCardFormStatus(null);
    setPaymentStatus({ status: 'initial' });

    if (newPaymentMethod === 'cash') {
      setIdentifier(providerOptions[0]?.id ?? '');
      return;
    }

    const shouldEraseIdentifier =
      oldPaymentMethod === 'cash' ||
      oldPaymentMethod === 'discount' ||
      newPaymentMethod === 'discount' ||
      newPaymentMethod === 'credit_card';

    if (shouldEraseIdentifier) {
      setIdentifier('');
    }
  }

  function handleAmountChange(newAmount: number | null) {
    setAmount(newAmount);

    if (isOnCreateMode) {
      elements?.update({
        amount:
          typeof newAmount === 'number'
            ? new Decimal(newAmount).times(100).toNumber()
            : undefined,
      });
    }
  }

  function setPaymentStatusError(error: StripeError) {
    const declineCode =
      error.decline_code === 'generic_decline'
        ? 'declined'
        : error.decline_code;

    setPaymentStatus({
      status: 'error',
      title:
        format.string.capitalize(declineCode?.replaceAll('_', ' ')) ?? 'Error',
      message: error.message ?? 'An unknown error occurred',
    });
  }

  async function handlePaymentRequest(overpay?: boolean) {
    if (typeof amount !== 'number') {
      return;
    }

    if (paymentMethod === 'credit_card') {
      setPaymentStatus({ status: 'processing' });

      const submitResponse = await elements!.submit();

      if (submitResponse.error) {
        setPaymentStatusError(submitResponse.error);
        return;
      }

      try {
        const { client_secret: clientSecret } =
          await postPaymentIntent.mutateAsync({
            jobId,
            overpay: !!overpay,
            amountCents: new Decimal(amount).times(100).toNumber(),
          });

        const { error: confirmError, paymentIntent } =
          await stripe!.confirmCardPayment(clientSecret, {
            payment_method: { card: elements!.getElement('card')! },
          });

        if (confirmError) {
          setPaymentStatusError(confirmError);
          return;
        }

        setPaymentStatus({ status: 'success' });
        onSubmit({
          amountCents: new Decimal(amount).times(100).toNumber(),
          identifier,
          paymentMethod,
          paymentIntentId: paymentIntent.id,
        });
      } catch (err) {
        const error = err as StripeError;

        setPaymentStatusError(error);
      }

      return;
    }

    onSubmit({
      amountCents: new Decimal(amount).times(100).toNumber(),
      identifier,
      paymentMethod,
    });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setHasSubmitted(true);

    const hasAnyError = [
      isAmountEmpty,
      isAmountNonPositive,
      paymentMethod !== 'credit_card' && isIdentifierEmpty,
    ].some(Boolean);
    const stripeHasLoaded = !!stripe && !!elements;

    if (
      hasAnyError ||
      (paymentMethod === 'credit_card' &&
        (!stripeHasLoaded || !creditCardFormStatus?.complete))
    ) {
      return;
    }

    const safeAmountCents = new Decimal(amount!).times(100).toNumber();

    const isAmountGreaterThanBalance = isOnCreateMode
      ? safeAmountCents > balanceInCents
      : safeAmountCents >
        balanceInCents +
          new Decimal(initialValues.amount).times(100).toNumber();

    if (isAmountGreaterThanBalance) {
      setIsConfirmOverpayModalOpen(true);
      return;
    }

    if (isOnEditMode) {
      setIsConfirmSaveModalOpen(true);
      return;
    }

    void handlePaymentRequest();
  }

  return (
    <>
      <FocusTrapRegion
        render={
          <form
            className={flex({ direction: 'column', gap: 5 })}
            noValidate
            onSubmit={handleSubmit}
          />
        }
        enabled
      >
        <Heading as="h2" variant="subheading" fontSize="md">
          {isOnEditMode ? 'Edit' : 'Add'} payment
        </Heading>

        <Flex direction="column" gap={2} maxW="15.5rem">
          <Label as="span" required color="gray.600">
            Payment options
          </Label>
          <Select
            value={paymentMethod}
            activeText={paymentMethodToText[paymentMethod].title}
            disabled={paymentStatus.status === 'processing'}
            onChange={(v: PaymentMethod) => handlePaymentMethodChange(v)}
          >
            <Select.Group>
              <Select.GroupLabel>Standard Payments</Select.GroupLabel>
              <Select.Item value="cash">
                {paymentMethodToText.cash.title}
              </Select.Item>
              <Select.Item value="check">
                {paymentMethodToText.check.title}
              </Select.Item>
              {isOnCreateMode && (
                <Select.Item value="credit_card">
                  {paymentMethodToText.credit_card.title}
                </Select.Item>
              )}
            </Select.Group>
            <Select.Separator />
            <Select.Group>
              <Select.GroupLabel>Mobile Apps</Select.GroupLabel>
              <Select.Item value="zelle">
                {paymentMethodToText.zelle.title}
              </Select.Item>
              <Select.Item value="cash_app">
                {paymentMethodToText.cash_app.title}
              </Select.Item>
            </Select.Group>
            <Select.Group>
              <Select.GroupLabel>Fleet Checks</Select.GroupLabel>
              <Select.Item value="t_chek">
                {paymentMethodToText.t_chek.title}
              </Select.Item>
              <Select.Item value="comchek">
                {paymentMethodToText.comchek.title}
              </Select.Item>
              <Select.Item value="efs_check">
                {paymentMethodToText.efs_check.title}
              </Select.Item>
            </Select.Group>
            <Select.Group>
              <Select.GroupLabel>Other</Select.GroupLabel>
              <Select.Item value="discount">
                {paymentMethodToText.discount.title}
              </Select.Item>
            </Select.Group>
          </Select>
        </Flex>

        <Flex direction="column" gap={2}>
          <Flex gap={5} align="flex-end">
            <Label required text="Amount" color="gray.600" w="15.5rem">
              <TextInput
                ref={amountInputRef}
                leftSlot="$"
                placeholder="0.00"
                textAlign="right"
                error={hasSubmitted && (isAmountEmpty || isAmountNonPositive)}
                value={
                  typeof amount === 'number'
                    ? format.currency(amount).replace(/\$/g, '')
                    : ''
                }
                onChange={e =>
                  handleAmountChange(
                    e.target.value === ''
                      ? null
                      : Number(e.target.value.replace(/,/g, ''))
                  )
                }
              />
            </Label>

            {!!formattedBalance && (
              <Flex h={9} align="center">
                <Flex gap={0.75} align="baseline" flexShrink={0}>
                  <Text fontWeight="medium" color="gray.700">
                    Balance:
                  </Text>
                  <Text fontSize="md" fontWeight="semibold" color="gray.900">
                    {formattedBalance}
                  </Text>
                </Flex>
              </Flex>
            )}
          </Flex>

          {isAmountEmpty && hasSubmitted && (
            <ErrorMessage>Please enter an amount</ErrorMessage>
          )}
          {isAmountNonPositive && hasSubmitted && (
            <ErrorMessage>Please enter an amount greater than 0</ErrorMessage>
          )}
        </Flex>

        {match(paymentMethod)
          .with('cash', () => (
            <Flex direction="column" gap={2} maxW="15.5rem">
              <Label as="span" required color="gray.600">
                Received by
              </Label>
              <Select
                placeholder="Select a provider"
                activeText={
                  providerOptions.find(({ id }) => id === identifier)?.name
                }
                value={identifier}
                onChange={(v: string) => setIdentifier(v)}
              >
                {providerOptions.length === 0 && (
                  <Text
                    fontWeight="medium"
                    fontSize="xs"
                    color="gray.700"
                    h={8}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    No providers on the job
                  </Text>
                )}

                {providerOptions.map(({ id, name }) => (
                  <Select.Item key={id} value={id}>
                    {name}
                  </Select.Item>
                ))}
              </Select>
            </Flex>
          ))
          .with(
            'check',
            'zelle',
            'cash_app',
            't_chek',
            'comchek',
            'efs_check',
            method => {
              const description = paymentMethodToText[
                method
              ].description.replace('{{param}}', '');

              return (
                <Label required text={description} color="gray.600" w="15.5rem">
                  <TextInput
                    placeholder={`Enter ${
                      description.startsWith('RS Trans')
                        ? description
                        : description.toLowerCase()
                    }`}
                    error={isIdentifierEmpty && hasSubmitted}
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                  />

                  {isIdentifierEmpty && hasSubmitted && (
                    <ErrorMessage whiteSpace="nowrap">
                      Please enter the{' '}
                      {description.startsWith('RS Trans')
                        ? description
                        : description.toLowerCase()}
                    </ErrorMessage>
                  )}
                </Label>
              );
            }
          )
          .with('credit_card', () => (
            <Flex direction="column" gap={3}>
              {paymentStatus.status === 'error' && (
                <Alert
                  variant="danger"
                  title={paymentStatus.title}
                  description={paymentStatus.message}
                />
              )}

              <Flex direction="column" gap={2}>
                <Label
                  as="span"
                  required
                  color="gray.600"
                  onClick={() => elements?.getElement('card')?.focus()}
                >
                  Card details
                </Label>
                <CreditCardContainer
                  focused={creditCardFormStatus?.focused}
                  error={
                    !!creditCardFormStatus?.error ||
                    (hasSubmitted && !creditCardFormStatus?.complete)
                  }
                  onClick={() => elements?.getElement('card')?.focus()}
                >
                  <CardElement
                    options={creditCardElementOptions}
                    onChange={e =>
                      setCreditCardFormStatus(state => ({
                        ...state,
                        ...e,
                      }))
                    }
                    onFocus={() =>
                      setCreditCardFormStatus(state => ({
                        ...state,
                        focused: true,
                      }))
                    }
                    onBlur={() =>
                      setCreditCardFormStatus(state => ({
                        ...state,
                        focused: false,
                      }))
                    }
                  />
                </CreditCardContainer>

                {!!creditCardFormStatus?.error && (
                  <ErrorMessage>
                    {/\.$/.test(creditCardFormStatus.error.message)
                      ? creditCardFormStatus.error.message.slice(0, -1)
                      : creditCardFormStatus.error.message}
                  </ErrorMessage>
                )}

                {!creditCardFormStatus?.error &&
                  hasSubmitted &&
                  !creditCardFormStatus?.complete && (
                    <ErrorMessage>
                      Please enter all the card details
                    </ErrorMessage>
                  )}
              </Flex>
            </Flex>
          ))
          .with('discount', () => (
            <Label required text="Reason" color="gray.600">
              <Textarea
                placeholder="Describe here"
                rows={3}
                error={isIdentifierEmpty && hasSubmitted}
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
              />

              {isIdentifierEmpty && hasSubmitted && (
                <ErrorMessage whiteSpace="nowrap">
                  Please enter a reason
                </ErrorMessage>
              )}
            </Label>
          ))
          .exhaustive()}

        <Box borderTopWidth="1px" borderColor="gray.200" />

        <Flex align="center" justify="flex-end" gap={3}>
          <Button
            variant="secondary"
            size="sm"
            disabled={paymentStatus.status === 'processing' || loading}
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={paymentStatus.status === 'processing' || loading}
            loading={paymentStatus.status === 'processing' || loading}
          >
            {isOnEditMode ? 'Save' : 'Add'} payment
          </Button>
        </Flex>
      </FocusTrapRegion>

      <Modal
        unmountOnHide
        open={isConfirmSaveModalOpen}
        onClose={() => setIsConfirmSaveModalOpen(false)}
      >
        <Modal.Heading>Save changes?</Modal.Heading>
        <Modal.Description>
          Are you sure you want to save the edits to this payment?
        </Modal.Description>

        <Flex mt={3} gap={2} justify="flex-end">
          <Modal.Dismiss>Cancel</Modal.Dismiss>
          <Button
            size="sm"
            onClick={() => {
              void handlePaymentRequest();
              setIsConfirmSaveModalOpen(false);
            }}
          >
            Save changes
          </Button>
        </Flex>
      </Modal>

      <Modal
        unmountOnHide
        open={isConfirmOverpayModalOpen}
        onClose={() => setIsConfirmOverpayModalOpen(false)}
      >
        <Modal.Heading>Amount exceeds balance</Modal.Heading>
        <Modal.Description>
          The amount you entered exceeds the available balance. Are you sure you
          want to add a {paymentMethod === 'discount' ? 'discount' : 'payment'}{' '}
          for{' '}
          <strong className={css({ fontWeight: 'semibold' })}>
            {format.currency(amount!)}
          </strong>
          ?
        </Modal.Description>

        <Flex mt={3} gap={2} justify="flex-end">
          <Modal.Dismiss>Cancel</Modal.Dismiss>
          <Button
            size="sm"
            onClick={() => {
              void handlePaymentRequest(true);
              setIsConfirmOverpayModalOpen(false);
            }}
          >
            {isOnEditMode ? 'Save' : 'Add'} payment
          </Button>
        </Flex>
      </Modal>
    </>
  );
}

export function PaymentForm({
  balanceInCents,
  initialValues,
  ...props
}: PaymentFormProps) {
  const isOnEditMode = !!initialValues;

  return (
    <Elements
      stripe={isOnEditMode ? null : getStripe()}
      options={{
        currency: 'usd',
        mode: 'payment',
        amount: balanceInCents <= 0 ? 100 : balanceInCents,
        fonts: [
          {
            cssSrc:
              'https://fonts.googleapis.com/css2?family=Inter:wght@500&display=swap',
          },
        ],
      }}
    >
      <Form
        {...props}
        initialValues={initialValues}
        balanceInCents={balanceInCents}
      />
    </Elements>
  );
}
