import { format } from '@/app/_utils';
import {
  useDispatcherAtom,
  useShouldBlurSection,
} from '@/app/(app)/jobs/(index)/_atoms';
import {
  blurredStyles,
  Common,
} from '@/app/(app)/jobs/(index)/_components/styles';
import type { Dispatcher } from '@/app/(app)/jobs/(index)/_types';
import { Avatar, ButtonGroup, Icon, IconButton, Text } from '@/components';
import { css } from '@/styled-system/css';

import { DispatcherCardContainer } from './DispatcherCardContainer';
import { DispatchersEdition } from './DispatchersEdition';

interface DispatchersCardProps {
  dispatcher: Dispatcher;
}

export function DispatchersCard({ dispatcher }: DispatchersCardProps) {
  const shouldBlurSection = useShouldBlurSection();

  const dispatcherAtom = useDispatcherAtom();

  if (dispatcherAtom.data.currentEditingDispatcherId === dispatcher.id) {
    return <DispatchersEdition dispatcher={dispatcher} />;
  }

  return (
    <DispatcherCardContainer
      data-dispatcher-card={dispatcher.id}
      focusable={!shouldBlurSection}
      css={shouldBlurSection ? blurredStyles.raw() : {}}
    >
      <Avatar
        name={`${dispatcher.firstname} ${
          dispatcher.lastname?.trim() ?? ''
        }`.trim()}
        initialsProps={{ className: css({ color: 'blue.600!' }) }}
      />

      <div>
        <Text fontWeight="semibold" color="gray.700">
          {dispatcher.firstname} {dispatcher.lastname}
          {!!dispatcher.email && (
            <Text as="span" fontWeight="medium" color="gray.400" ml={1.5}>
              {dispatcher.email}
            </Text>
          )}
        </Text>
        <Text
          mt={2.1}
          fontWeight="medium"
          color="gray.400"
          css={{ _empty: { display: 'none' } }}
        >
          {!!dispatcher.phone && format.phoneNumber(dispatcher.phone)}
          {!!dispatcher.secondary_phone && (
            <>
              <Common.Dot />
              {format.phoneNumber(dispatcher.secondary_phone)}
            </>
          )}
        </Text>
      </div>

      <ButtonGroup
        className="actions-container"
        pos="absolute"
        right={1.5}
        top={1.5}
      >
        <IconButton
          title="Edit dispatcher"
          onClick={() => dispatcherAtom.setEditingDispatcher(dispatcher.id)}
        >
          <Icon.Edit />
        </IconButton>
        <IconButton
          title="Remove dispatcher"
          onClick={() => dispatcherAtom.removeDispatcher(dispatcher.id)}
        >
          <Icon.Trash className={css({ color: 'danger' })} />
        </IconButton>
      </ButtonGroup>
    </DispatcherCardContainer>
  );
}
