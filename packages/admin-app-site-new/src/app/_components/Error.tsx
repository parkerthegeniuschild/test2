import { Text, TextButton } from '@/components';
import { Center } from '@/styled-system/jsx';

interface ErrorProps {
  onTryAgain?: () => void;
}

export function Error({ onTryAgain }: ErrorProps) {
  return (
    <Center minH="100vh" gap={3} flexDir="column" fontSize="md">
      <Text fontSize="inherit">Oops! Something went wrong.</Text>
      <Text display="flex" fontSize="inherit">
        Please{' '}
        <TextButton
          ml={1}
          fontSize="inherit"
          onClick={() => (onTryAgain ? onTryAgain() : window.location.reload())}
        >
          try again
        </TextButton>
        .
      </Text>
    </Center>
  );
}
