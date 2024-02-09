import { useEffect, useReducer, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDebounce } from 'react-use';
import { FocusTrapRegion } from '@ariakit/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { nanoid } from 'nanoid';
import { z } from 'zod';

import { clearObject, format, nextTickScheduler } from '@/app/_utils';
import { useFetchPlaceDetails, useGetPlaces } from '@/app/(app)/_api';
import { isValidPostalCode } from '@/app/(app)/_utils';
import { useCustomerAtom } from '@/app/(app)/jobs/(index)/_atoms';
import { UsdotMaskedInput } from '@/app/(app)/jobs/(index)/_components/Form';
import {
  useGetCompanies,
  usePostCompany,
} from '@/app/(app)/jobs/(index)/create/_api';
import {
  Button,
  ErrorMessage,
  Icon,
  Spinner,
  StackedInput,
  Tabs,
  Text,
  toast,
} from '@/components';
import { css } from '@/styled-system/css';
import { Center, Flex } from '@/styled-system/jsx';
import { flex } from '@/styled-system/patterns';

const formSchema = z.object({
  name: z.string().nonempty(),
  type: z.enum(['fleet', 'broker']),
  usdot: z.string().refine(value => value === '' || /^\d{6,8}$/.test(value)),
  address1: z.string().optional(),
  address2: z.string(),
  city: z.string(),
  state: z.string(),
  zipcode: z.string().refine(value => value === '' || isValidPostalCode(value)),
  country: z.string(),
});

type FormData = z.infer<typeof formSchema>;

export function CustomerForm() {
  const customerAtom = useCustomerAtom();

  const queryClient = useQueryClient();

  const postCompany = usePostCompany({
    onSuccess(data) {
      customerAtom.goToCardState(data);

      void queryClient.invalidateQueries({
        queryKey: [useGetCompanies.queryKey],
      });

      toast.success('Company created successfully');
    },
    onError(error) {
      toast.error(
        `Error while creating company${
          error instanceof Error ? `: ${error.message}` : ''
        }`
      );
    },
  });

  const {
    handleSubmit,
    register,
    control,
    watch,
    setValue,
    formState: { errors },
    setFocus,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: customerAtom.data.initialName ?? '' },
  });

  useEffect(() => {
    nextTickScheduler(() => setFocus('name'));
  }, [setFocus]);

  const addressValue = watch('address1');

  const [placesSessionToken, regeneratePlacesSessionToken] = useReducer(
    () => nanoid(),
    nanoid()
  );
  const [selectedPlaceId, setSelectedPlaceId] = useState('');
  const [debouncedAddress, setDebouncedAddress] = useState('');

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
      const country = data.address_components.find(({ types }) =>
        types.includes('country')
      );
      const postalCode = data.address_components.find(({ types }) =>
        types.includes('postal_code')
      );

      setValue(
        'address1',
        [streetNumber?.long_name, route?.long_name].filter(Boolean).join(' ')
      );
      setValue('address2', subpremise?.long_name ?? '');
      setValue('city', city?.long_name ?? '');
      setValue('state', state?.short_name ?? '');
      setValue('zipcode', postalCode?.long_name ?? '');
      setValue('country', country?.short_name ?? '');

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

  function handleFormSubmit(payload: FormData) {
    const clearedPayload = clearObject(payload);

    postCompany.mutate(clearedPayload);
  }

  return (
    <FocusTrapRegion enabled render={<Flex direction="column" gap={5} />}>
      <Tabs>
        <Tabs.List>
          <Tabs.Tab full>Company</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel
          render={
            <form
              noValidate
              className={css(flex.raw({ direction: 'column', gap: 5 }))}
              onSubmit={handleSubmit(handleFormSubmit)}
            />
          }
        >
          <div>
            <StackedInput>
              <StackedInput.TextInput
                required
                label="Company name"
                placeholder="Enter company name"
                autoComplete="off"
                error={!!errors.name}
                {...register('name')}
              />
              <Controller
                control={control}
                name="type"
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <StackedInput.Select
                    ref={ref}
                    label="Type"
                    placeholder="Select type"
                    required
                    error={!!errors.type}
                    value={value ?? ''}
                    activeText={
                      value ? format.string.capitalize(value) : undefined
                    }
                    buttonProps={{ onBlur }}
                    onChange={onChange}
                  >
                    <StackedInput.Select.Item value="fleet">
                      Fleet
                    </StackedInput.Select.Item>
                    <StackedInput.Select.Item value="broker">
                      Broker
                    </StackedInput.Select.Item>
                  </StackedInput.Select>
                )}
              />
              <UsdotMaskedInput
                label="USDOT #"
                autoComplete="off"
                error={!!errors.usdot}
                {...register('usdot')}
              />
            </StackedInput>

            {errors.name || errors.type || errors.usdot ? (
              <ErrorMessage mt={2}>
                Please{' '}
                {[
                  errors.name || errors.type ? 'enter company details' : '',
                  errors.usdot ? 'fix USDOT #' : '',
                ]
                  .filter(Boolean)
                  .join(' and ')}
              </ErrorMessage>
            ) : null}
          </div>

          <div>
            <Text
              fontWeight="medium"
              color="gray.600"
              mb={2}
              display="flex"
              alignItems="center"
              gap={2}
            >
              Physical Address
              {fetchPlaceDetails.isLoading && <Spinner as="span" />}
            </Text>

            <StackedInput>
              <Controller
                control={control}
                name="address1"
                disabled={fetchPlaceDetails.isLoading}
                render={({ field }) => (
                  <StackedInput.Combobox
                    label="Address line 1"
                    placeholder="Street address"
                    data-1p-ignore
                    {...field}
                    onChange={value => {
                      if (value.trim() === '') {
                        setDebouncedAddress('');
                      }

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
                              <Icon.MarkerPin
                                className={css({ flexShrink: 0 })}
                              />
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
                autoComplete="off"
                data-1p-ignore
                disabled={fetchPlaceDetails.isLoading}
                {...register('address2')}
              />
              <StackedInput.TextInput
                label="City"
                placeholder="Enter city"
                autoComplete="off"
                data-1p-ignore
                disabled={fetchPlaceDetails.isLoading}
                {...register('city')}
              />
              <StackedInput.TextInput
                label="State / Province"
                placeholder="Enter state / province"
                autoComplete="off"
                data-1p-ignore
                disabled={fetchPlaceDetails.isLoading}
                {...register('state')}
              />
              <StackedInput.TextInput
                label="Zip Code"
                placeholder="00000"
                autoComplete="off"
                data-1p-ignore
                error={!!errors.zipcode}
                disabled={fetchPlaceDetails.isLoading}
                {...register('zipcode')}
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

            {!!errors.zipcode && (
              <ErrorMessage mt={2}>Please fix zip code</ErrorMessage>
            )}
          </div>

          <Flex justify="flex-end" gap={3}>
            <Button
              size="sm"
              variant="secondary"
              disabled={postCompany.isLoading}
              onClick={customerAtom.goToAutocompleteState}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              type="submit"
              disabled={postCompany.isLoading}
              loading={postCompany.isLoading}
            >
              Add Customer
            </Button>
          </Flex>
        </Tabs.Panel>
      </Tabs>
    </FocusTrapRegion>
  );
}
