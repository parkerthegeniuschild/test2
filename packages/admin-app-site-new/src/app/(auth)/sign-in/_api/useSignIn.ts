import { signIn as nextAuthSignIn } from 'next-auth/react';
import { useMutation } from '@tanstack/react-query';

type SignInPayload = {
  username: string;
  password: string;
};

async function signIn(payload: SignInPayload) {
  const response = await nextAuthSignIn('truckup', {
    redirect: false,
    ...payload,
  });

  if (response?.error) {
    throw new Error('Invalid credentials', { cause: response.error });
  }

  return { ok: true };
}

type UseSignInOptions = {
  onSuccess?: () => void;
};

export function useSignIn({ onSuccess }: UseSignInOptions = {}) {
  return useMutation({ mutationFn: signIn, onSuccess });
}
