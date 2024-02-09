import { getServerSession, type Session } from 'next-auth';
import { getSession, signOut } from 'next-auth/react';
import axios, { type CreateAxiosDefaults } from 'axios';

import { authOptions } from '@/app/(auth)/api/auth/[...nextauth]/route';
import { env } from '@/env';
import { isClient, isServer } from '@/environments';

type FailedRequestItem = {
  onSuccess: () => void;
  onFailure: (error: unknown) => void;
};

class ApiBuilder {
  private session: Session | null = null;

  private unauthorizedRequestsQueue: FailedRequestItem[] = [];

  private loadingSessionPromise: Promise<void> | null = null;

  constructor() {
    if (isClient() && env.NODE_ENV !== 'test') {
      this.loadingSessionPromise = new Promise((resolve, reject) =>
        getSession()
          .then(session => {
            this.session = session;

            this.unauthorizedRequestsQueue.forEach(request =>
              request.onSuccess()
            );
            this.unauthorizedRequestsQueue = [];

            resolve();
          })
          .catch(error => {
            this.unauthorizedRequestsQueue.forEach(request =>
              request.onFailure(error)
            );
            this.unauthorizedRequestsQueue = [];

            reject(error);
          })
      );
    }
  }

  public init(config: CreateAxiosDefaults = {}) {
    const api = axios.create(config);

    if (env.NODE_ENV === 'test') {
      return api;
    }

    api.interceptors.request.use(async requestConfig => {
      let session: Session | null = null;

      if (isClient()) {
        session = this.session;
      }

      if (isServer()) {
        session = await getServerSession(authOptions);
      }

      if (!session && isClient()) {
        await this.loadingSessionPromise;

        session = this.session;
      }

      if (!session) {
        return requestConfig;
      }

      requestConfig.headers.setAuthorization(`Bearer ${session.accessToken}`);

      return requestConfig;
    });

    api.interceptors.response.use(
      response => response,
      error => {
        if (
          axios.isAxiosError(error) &&
          error.response?.status === 403 &&
          isClient()
        ) {
          void signOut({ callbackUrl: '/sign-in' });
        }

        if (
          axios.isAxiosError(error) &&
          error.response?.status === 401 &&
          isClient()
        ) {
          const originalConfig = error.config;

          if (this.session) {
            return Promise.resolve(api(originalConfig!));
          }

          return new Promise((resolve, reject) => {
            this.unauthorizedRequestsQueue.push({
              onSuccess() {
                resolve(api(originalConfig!));
              },
              onFailure(err) {
                reject(err);
              },
            });
          });
        }

        return Promise.reject(error);
      }
    );

    return api;
  }
}

export const api = new ApiBuilder().init({
  baseURL: env.NEXT_PUBLIC_API_URL,
  headers: { 'X-TUP-Auth-Version': 1 },
});
