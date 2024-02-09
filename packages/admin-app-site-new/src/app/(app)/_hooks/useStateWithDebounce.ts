import { startTransition, useRef, useState } from 'react';
import { useDebounce } from 'react-use';

type UseStateWithDebounceOptions<T> = {
  delayMs?: number;
  onDebounce?: (value: T) => void;
};

export function useStateWithDebounce<T>(
  defaultValue: T,
  { delayMs = 200, onDebounce }: UseStateWithDebounceOptions<T> = {}
) {
  const [state, setState] = useState(defaultValue);
  const [debouncedState, setDebouncedState] = useState(defaultValue);
  const isOnInitialPass = useRef(true);

  useDebounce(
    () => {
      startTransition(() => setDebouncedState(state));

      if (!isOnInitialPass.current) {
        onDebounce?.(state);
      }

      isOnInitialPass.current = false;
    },
    delayMs,
    [state]
  );

  return [state, setState, debouncedState, setDebouncedState] as const;
}
