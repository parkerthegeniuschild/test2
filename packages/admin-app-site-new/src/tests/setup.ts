// eslint-disable-next-line import/no-extraneous-dependencies
import '@testing-library/jest-dom';

import { server } from '@/mocks';

import { MOCKED_NEXT_PUBLIC_API_URL } from './helpers';

process.env.NEXT_PUBLIC_API_URL = MOCKED_NEXT_PUBLIC_API_URL;

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

afterAll(() => server.close());

afterEach(() => server.resetHandlers());

Element.prototype.scrollTo = () => {};
