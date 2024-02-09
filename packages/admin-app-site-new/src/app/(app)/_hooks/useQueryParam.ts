import { useState } from 'react';
import { useDebounce } from 'react-use';
import { match, P } from 'ts-pattern';
import { useQueryParam as _useQueryParam } from 'use-query-params';

import {
  DelimitedArrayParam,
  NumberParam,
  ObjectParam,
  type QueryParamConfig,
  StringParam,
  withDefault,
} from '@/app/_lib/serializeQueryParams';

type UseQueryParamOptions<T> = {
  removeDefaultsFromUrl?: boolean;
  param?: 'string';
  skipSync?: (value: T) => boolean;
  transformer?: (
    value:
      | T
      | (T extends object
          ? {
              [key in keyof T]: T[key] extends string
                ? T[key]
                : T[key] | string;
            }
          : T)
  ) => T;
};

export function useQueryParam<T>(
  key: string,
  defaultValue: T,
  {
    removeDefaultsFromUrl = true,
    param,
    skipSync,
    transformer,
  }: UseQueryParamOptions<T> = {}
) {
  const matchedParam = (param
    ? match(param)
        .with('string', () => StringParam)
        .exhaustive()
    : match(defaultValue)
        .with(P.number, () => NumberParam)
        .with(P.string, () => StringParam)
        .with(P.array(), () => DelimitedArrayParam)
        .otherwise(() => ObjectParam)) as unknown as QueryParamConfig<T>;

  const [state, setState] = _useQueryParam(
    key,
    withDefault(matchedParam, defaultValue),
    { removeDefaultsFromUrl, enableBatching: true }
  );
  const [unsyncedState, setUnsyncedState] = useState(
    transformer ? transformer(state) : state
  );

  function updateState(value: React.SetStateAction<T>) {
    const shouldSkipSync = skipSync?.(
      typeof value === 'function'
        ? (value as (p: T) => T)(unsyncedState)
        : value
    );

    setState(shouldSkipSync ? defaultValue : value);

    setUnsyncedState(value);
  }

  return [unsyncedState, updateState] as const;
}

type UseQueryParamDebouncedOptions<T> = UseQueryParamOptions<T> & {
  delayMs?: number;
};

export function useQueryParamDebounced<T>(
  key: string,
  defaultValue: T,
  { delayMs = 200, ...options }: UseQueryParamDebouncedOptions<T> = {}
) {
  const [queryParam, setQueryParam] = useQueryParam<T>(
    key,
    defaultValue,
    options
  );
  const [state, setState] = useState(queryParam);
  const [debouncedState, setDebouncedState] = useState(queryParam);

  useDebounce(
    () => {
      setDebouncedState(state);
      setQueryParam(state);
    },
    delayMs,
    [state]
  );

  function resetState() {
    setState(defaultValue);
    setDebouncedState(defaultValue);
    setQueryParam(defaultValue);
  }

  return [state, setState, debouncedState, resetState] as const;
}
