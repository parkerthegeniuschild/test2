import { MOCKED_NEXT_PUBLIC_API_URL } from '@/tests/helpers';

export const api = {
  sst(path: string) {
    return new URL(path, MOCKED_NEXT_PUBLIC_API_URL).toString();
  },
};
