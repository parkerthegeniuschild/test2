import { Flex } from '@/styled-system/jsx';

import { CommentsDrawerChat } from './CommentsDrawerChat';
import { CommentsDrawerSendBox } from './CommentsDrawerSendBox';

export function CommentsDrawerContent() {
  return (
    <Flex direction="column" flex={1} overflow="hidden">
      <CommentsDrawerChat />
      <CommentsDrawerSendBox />
    </Flex>
  );
}
