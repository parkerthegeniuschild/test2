import { useRef } from 'react';
import { useDebounce } from 'react-use';

export function useFormFieldDebounce(
  fn: () => void,
  deps?: React.DependencyList,
  { enabled = true } = {}
) {
  const isFirstDebouncePass = useRef(true);

  return useDebounce(
    () => {
      if (!isFirstDebouncePass.current && enabled) {
        fn();
      }

      isFirstDebouncePass.current = false;
    },
    200,
    deps
  );
}
