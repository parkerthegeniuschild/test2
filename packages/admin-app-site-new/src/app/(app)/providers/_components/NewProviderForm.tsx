import { useEffect, useReducer, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDebounce } from 'react-use';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { nanoid } from 'nanoid';
import { z } from 'zod';

import { clearObject, nextTickScheduler } from '@/app/_utils';
import { useFetchPlaceDetails, useGetPlaces } from '@/app/(app)/_api';
import { PhoneNumberMaskedInput } from '@/app/(app)/_components';
import { PHONE_NUMBER_REGEX } from '@/app/(app)/_constants';
import { isValidPostalCode } from '@/app/(app)/_utils';
import {
  useGetProviders,
  useGetProvidersCount,
  usePostProvider,
} from '@/app/(app)/providers/_api';
import {
  Button,
  ErrorMessage,
  Icon,
  Spinner,
  StackedInput,
  Text,
  toast,
} from '@/components';
import { css } from '@/styled-system/css';
import { Center, Flex, VStack } from '@/styled-system/jsx';

const formSchema = z.object({
  firstname: z
    .string()
    .nonempty()
    .refine(data => data.trim()),
  lastname: z.string().nonempty(),
  phone: z.string().nonempty().regex(PHONE_NUMBER_REGEX),
  email: z.string().nonempty().email(),
  address1: z.string().nonempty(),
  address2: z.string().optional(),
  city: z.string().nonempty(),
  state: z.string().nonempty(),
  zip: z.string().nonempty().refine(isValidPostalCode),
  country: z.string().optional(),
});

export type FormData = z.infer<typeof formSchema>;

interface NewProviderFormProps {
  onClose?: () => void;
  onPostRequestInFlightChange: (isPostRequestInFlight: boolean) => void;
  onSuccessfulCreate?: () => void;
}

export function NewProviderForm({
  onClose,
  onPostRequestInFlightChange,
  onSuccessfulCreate,
}: NewProviderFormProps) {
  const queryClient = useQueryClient();

  const {
    register,
    setFocus,
    setValue,
    control,
    watch,
    formState: { errors },
    handleSubmit,
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const postProvider = usePostProvider({
    onSuccess(data) {
      if (data.id) {
        onPostRequestInFlightChange(false);
        onSuccessfulCreate?.();

        void queryClient.invalidateQueries({
          queryKey: [useGetProviders.queryKey],
        });
        void queryClient.invalidateQueries({
          queryKey: [useGetProvidersCount.queryKey],
        });

        toast.success('Provider created successfully');
      }
    },
    onError(error) {
      onPostRequestInFlightChange(false);
      toast.error(
        `Error while creating provider${
          error instanceof Error ? `: ${error.message}` : ''
        }`
      );
    },
  });

  const [placesSessionToken, regeneratePlacesSessionToken] = useReducer(
    () => nanoid(),
    nanoid()
  );

  const [selectedPlaceId, setSelectedPlaceId] = useState('');
  const [debouncedAddress, setDebouncedAddress] = useState('');

  const addressValue = watch('address1');

  useDebounce(() => setDebouncedAddress(addressValue ?? ''), 200, [
    addressValue,
  ]);

  const getPlaces = useGetPlaces(
    {
      query: debouncedAddress,
      sessionToken: placesSessionToken,
    },
    { enabled: !selectedPlaceId }
  );

  const fetchPlaceDetails = useFetchPlaceDetails({
    onSuccess(data) {
      regeneratePlacesSessionToken();

      const subpremise = data.address_components.find(({ types }) =>
        types.includes('subpremise')
      );
      const streetNumber = data.address_components.find(({ types }) =>
        types.includes('street_number')
      );
      const route = data.address_components.find(({ types }) =>
        types.includes('route')
      );
      const city = data.address_components.find(({ types }) =>
        types.includes('locality')
      );
      const state = data.address_components.find(({ types }) =>
        types.includes('administrative_area_level_1')
      );
      const postalCode = data.address_components.find(({ types }) =>
        types.includes('postal_code')
      );
      const country = data.address_components.find(({ types }) =>
        types.includes('country')
      );

      setValue(
        'address1',
        [streetNumber?.long_name, route?.long_name].filter(Boolean).join(' ')
      );
      setValue('address2', subpremise?.long_name ?? '');
      setValue('city', city?.long_name ?? '');
      setValue('state', state?.short_name ?? '');
      setValue('zip', postalCode?.long_name ?? '');
      setValue('country', country?.short_name ?? '');

      void trigger();
      nextTickScheduler(() => setFocus('address1'));
    },
  });

  function handleAddressSelect(placeId: string) {
    setSelectedPlaceId(placeId);
    fetchPlaceDetails.mutate({
      place_id: placeId,
      sessionToken: placesSessionToken,
      fields: ['address_components'],
    });
  }

  function handleFormSubmit(data: FormData) {
    onPostRequestInFlightChange(true);

    const payload = clearObject({
      ...data,
      // TODO: Abstract phone number formatting
      phone: `1${data.phone.replace(/\D/g, '')}`,
    });

    postProvider.mutate(payload);
  }

  useEffect(() => {
    nextTickScheduler(() => setFocus('firstname'));
  }, [setFocus]);

  return (
    <form noValidate onSubmit={handleSubmit(handleFormSubmit)}>
      <fieldset>
        <StackedInput>
          <StackedInput.TextInput
            label="First name"
            placeholder="Enter first name"
            required
            data-1p-ignore
            autoComplete="off"
            error={!!errors?.firstname}
            {...register('firstname')}
          />
          <StackedInput.TextInput
            label="Last name"
            placeholder="Enter last name"
            required
            data-1p-ignore
            autoComplete="off"
            error={!!errors?.lastname}
            {...register('lastname')}
          />
          <StackedInput.TextInput
            label="Email"
            placeholder="Enter email"
            required
            data-1p-ignore
            autoComplete="off"
            error={!!errors?.email}
            {...register('email')}
          />
          <PhoneNumberMaskedInput
            label="Phone number"
            required
            autoComplete="off"
            data-1p-ignore
            error={!!errors?.phone}
            {...register('phone')}
          />
        </StackedInput>
      </fieldset>

      <VStack
        gap={2}
        alignItems="flex-start"
        mt={2}
        css={{ _empty: { display: 'none' } }}
      >
        {(errors?.firstname ||
          errors?.lastname ||
          errors.email?.type === z.ZodIssueCode.too_small ||
          errors?.phone?.type === z.ZodIssueCode.too_small) && (
          <ErrorMessage>Please enter person info</ErrorMessage>
        )}

        {errors?.email?.type === z.ZodIssueCode.invalid_string && (
          <ErrorMessage>Please enter a valid email</ErrorMessage>
        )}

        {errors?.phone?.type === z.ZodIssueCode.invalid_string && (
          <ErrorMessage>Please enter a valid phone</ErrorMessage>
        )}
      </VStack>

      <Text
        fontWeight="medium"
        color="gray.600"
        mt={5}
        mb={2}
        display="flex"
        alignItems="center"
        gap={2}
      >
        Physical Address
        {fetchPlaceDetails.isLoading && <Spinner as="span" />}
      </Text>

      <fieldset>
        <StackedInput>
          <Controller
            control={control}
            name="address1"
            disabled={fetchPlaceDetails.isLoading}
            render={({ field }) => (
              <StackedInput.Combobox
                label="Address line 1"
                placeholder="Street address"
                required
                data-1p-ignore
                {...field}
                error={!!errors?.address1}
                onChange={value => {
                  if (value.trim() === '') setDebouncedAddress('');

                  field.onChange(value);
                }}
                inputProps={{ onChange: () => setSelectedPlaceId('') }}
              >
                {(getPlaces.data?.length ?? 0) > 0
                  ? getPlaces.data?.map(place => (
                      <StackedInput.Combobox.Item
                        key={place.place_id}
                        value=""
                        active={place.place_id === selectedPlaceId}
                        onClick={() => handleAddressSelect(place.place_id)}
                      >
                        <Center color="gray.300" w={3} h={3}>
                          <Icon.MarkerPin className={css({ flexShrink: 0 })} />
                        </Center>
                        <span className={css({ display: 'block' })}>
                          <strong className={css({ fontWeight: 'bold' })}>
                            {place.structured_formatting.main_text}
                          </strong>
                          <small
                            className={css({
                              fontWeight: 'medium',
                              fontSize: '2xs.xl',
                              ml: 1,
                            })}
                          >
                            {place.structured_formatting.secondary_text}
                          </small>
                        </span>
                      </StackedInput.Combobox.Item>
                    ))
                  : null}
              </StackedInput.Combobox>
            )}
          />
          <StackedInput.TextInput
            label="Address line 2"
            placeholder="Apartment, unit, suite, or floor #"
            disabled={fetchPlaceDetails.isLoading}
            autoComplete="off"
            data-1p-ignore
            {...register('address2')}
          />
          <StackedInput.TextInput
            label="City"
            placeholder="Enter city"
            required
            disabled={fetchPlaceDetails.isLoading}
            autoComplete="off"
            data-1p-ignore
            {...register('city')}
            error={!!errors?.city}
          />
          <StackedInput.TextInput
            label="State / Province"
            placeholder="Enter state / province"
            required
            disabled={fetchPlaceDetails.isLoading}
            autoComplete="off"
            data-1p-ignore
            {...register('state')}
            error={!!errors?.state}
          />
          <StackedInput.TextInput
            label="Zip Code"
            placeholder="00000"
            required
            disabled={fetchPlaceDetails.isLoading}
            autoComplete="off"
            data-1p-ignore
            {...register('zip')}
            error={!!errors?.zip}
          />
          <StackedInput.TextInput
            label="Country"
            placeholder="Enter country"
            disabled={fetchPlaceDetails.isLoading}
            autoComplete="off"
            data-1p-ignore
            {...register('country')}
          />
        </StackedInput>
      </fieldset>

      <VStack
        gap={2}
        alignItems="flex-start"
        mt={2}
        css={{ _empty: { display: 'none' } }}
      >
        {(errors.address1 ||
          errors.city ||
          errors.state ||
          errors.zip?.type === z.ZodIssueCode.too_small) && (
          <ErrorMessage>Please enter address info</ErrorMessage>
        )}

        {errors.zip?.type === z.ZodIssueCode.custom && (
          <ErrorMessage>Please enter a valid zip code</ErrorMessage>
        )}
      </VStack>

      <Flex gap={3} mt={5} justifyContent="flex-end">
        <Button
          size="sm"
          variant="secondary"
          onClick={onClose}
          disabled={postProvider.isLoading}
        >
          Cancel
        </Button>
        <Button
          size="sm"
          type="submit"
          disabled={postProvider.isLoading}
          loading={postProvider.isLoading}
        >
          Add Provider
        </Button>
      </Flex>
    </form>
  );
}
