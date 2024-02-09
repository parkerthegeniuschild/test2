'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import { TopLoader } from '@/app/_components/TopLoader';
import {
  Button,
  Checkbox,
  ErrorMessage,
  Label,
  PasswordInput,
  TextInput,
  TextLink,
} from '@/components';
import { css } from '@/styled-system/css';

import { useSignIn } from '../_api/useSignIn';

type FormValues = {
  username: string;
  password: string;
  rememberMe: boolean;
};

export function Form() {
  const router = useRouter();

  const signIn = useSignIn({
    onSuccess() {
      TopLoader.start();
      const callbackUrl =
        new URLSearchParams(window.location.search).get('callbackUrl') ?? '/';
      router.replace(callbackUrl);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm<FormValues>({ mode: 'onBlur' });

  useEffect(() => {
    setFocus('username');
  }, [setFocus]);

  function handleFormSubmit(payload: FormValues) {
    signIn.mutate(payload);
  }

  return (
    <>
      {signIn.isError && (
        <div className={css({ maxW: 'fit' })}>
          <ErrorMessage>
            You entered an incorrect username or password.
          </ErrorMessage>
          <ErrorMessage
            showIcon={false}
            css={{ justifyContent: 'flex-end', mr: '0.3125rem' }}
          >
            Please try again or try{' '}
            <strong className={css({ fontWeight: 'medium' })}>
              resetting your password
            </strong>
            .
          </ErrorMessage>
        </div>
      )}

      <form
        className={css({ display: 'flex', flexDirection: 'column', gap: 5 })}
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <Label>
          Username
          <TextInput
            placeholder="Enter your username"
            error={!!errors.username}
            {...register('username', { required: true })}
          />
          {errors.username?.type === 'required' && (
            <ErrorMessage>Please enter a username</ErrorMessage>
          )}
        </Label>

        <Label>
          Password
          <PasswordInput
            placeholder="Enter your password"
            error={!!errors.password}
            {...register('password', { required: true })}
          />
          {errors.password?.type === 'required' && (
            <ErrorMessage>Please enter a password</ErrorMessage>
          )}
        </Label>

        <div
          className={css({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          })}
        >
          <Checkbox {...register('rememberMe')}>Remember me</Checkbox>

          <TextLink href="#!">Forgot password?</TextLink>
        </div>

        <Button
          type="submit"
          full
          css={{ mt: 1 }}
          disabled={signIn.isLoading || signIn.isSuccess}
          loading={signIn.isLoading || signIn.isSuccess}
        >
          Sign in
        </Button>
      </form>
    </>
  );
}
