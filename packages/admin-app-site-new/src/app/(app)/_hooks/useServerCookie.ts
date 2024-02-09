import { useState } from 'react';
import { parseCookies } from 'nookies';

import { env } from '@/env';

export function setServerCookie<T>(name: string, value: T) {
  if (env.NODE_ENV === 'test') {
    return;
  }

  void fetch('/api/cookies', {
    method: 'PUT',
    body: JSON.stringify({ name, value }),
  });
}

export function useServerCookie<T>(name: string, defaultValue: T) {
  const [state, setState] = useState(() => {
    const cookies = parseCookies();

    if (cookies[name]) {
      return JSON.parse(cookies[name]) as T;
    }

    return defaultValue;
  });

  function updateState(value: React.SetStateAction<T>) {
    setServerCookie(
      name,
      typeof value === 'function' ? (value as (p: T) => T)(state) : value
    );
    setState(value);
  }

  return [state, updateState] as const;
}
