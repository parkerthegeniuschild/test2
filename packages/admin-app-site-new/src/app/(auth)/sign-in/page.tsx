import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { Heading, Text } from '@/components';
import { css } from '@/styled-system/css';

import { authOptions } from '../api/auth/[...nextauth]/route';

import { Form } from './_components';

export const metadata = { title: 'Sign in' };

export default async function SignInPage() {
  const isLoggedIn = !!(await getServerSession(authOptions));

  if (isLoggedIn) {
    redirect('/');
  }

  return (
    <div
      className={css({
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        w: '100%',
      })}
    >
      <div>
        <Heading css={{ fontSize: '3.5xl', lineHeight: '2.5rem' }}>
          Sign in
        </Heading>
        <Text css={{ lineHeight: '1.375rem', mt: 3 }}>
          Sign in to the Admin Panel to continue
        </Text>
      </div>

      <Form />
    </div>
  );
}
