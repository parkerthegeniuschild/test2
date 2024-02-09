/* eslint-disable no-param-reassign */
import NextAuth, { type AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

import { serverEnv } from '@/env';

type SignInPayload = {
  username: string;
  password: string;
};

type LoginAPIResponse = {
  token: string;
};

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'truckup',
      credentials: {},
      async authorize(credentials) {
        const { username, password } = credentials as SignInPayload;

        try {
          const response = await axios<LoginAPIResponse>({
            baseURL: serverEnv.NEXT_PUBLIC_API_URL,
            url: '/auth/password',
            method: 'post',
            data: { username, password },
          });

          return {
            id: '1',
            accessToken: response.data.token,
          };
        } catch (err) {
          if (axios.isAxiosError(err)) {
            console.error('Error while logging in', err.message);
          } else {
            console.error('Error while logging in', err);
          }

          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
      }

      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;

      return session;
    },
  },
  pages: {
    signIn: '/sign-in',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
