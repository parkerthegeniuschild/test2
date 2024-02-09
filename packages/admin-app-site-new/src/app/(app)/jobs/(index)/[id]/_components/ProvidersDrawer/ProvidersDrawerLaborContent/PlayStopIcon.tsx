import { Icon } from '@/components';
import { Center } from '@/styled-system/jsx';

interface PlayStopIconProps {
  state: 'play' | 'stop';
}

export function PlayStopIcon({ state }: PlayStopIconProps) {
  return (
    <Center
      w={4}
      h={4}
      rounded="full"
      bgColor={state === 'play' ? 'primary' : 'warning'}
      fontSize="0.5rem"
      color="white"
    >
      {state === 'play' && <Icon.Play />}
      {state === 'stop' && <Icon.Stop />}
    </Center>
  );
}
