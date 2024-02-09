import { useState } from 'react';
import * as Ariakit from '@ariakit/react';

import { Button } from '@/components';
import { Box, Center, styled } from '@/styled-system/jsx';

const Container = styled(Center, {
  base: {
    h: '4.5rem',
    opacity: 0,
    transitionProperty: 'opacity',
    transitionTimingFunction: 'easeInOut',
    transitionDuration: 'fast',

    '&[data-enter]': {
      opacity: 1,
    },
  },
});

interface SpotlightCardProps {
  className?: string;
  onSpotlight?: () => void;
  onClick?: () => void;
}

export function SpotlightCard({
  children,
  className,
  onSpotlight,
  onClick,
}: React.PropsWithChildren<SpotlightCardProps>) {
  const [open, setOpen] = useState(false);

  function handleClickRow(e: React.UIEvent) {
    const cardElement = e.currentTarget;
    const clickedElement = e.target as HTMLElement;
    const parentClickableElement = clickedElement.closest('[tabindex],button');

    const hasClickedOnAnInsideButton = cardElement !== parentClickableElement;

    if (hasClickedOnAnInsideButton) {
      return;
    }

    onClick?.();
  }

  return (
    <Ariakit.HovercardProvider
      animated
      placement="left"
      showTimeout={200}
      hideTimeout={150}
      open={open}
      setOpen={setOpen}
    >
      <Ariakit.HovercardAnchor
        render={<div />}
        className={className}
        onFocusVisible={() => setOpen(true)}
        onClick={handleClickRow}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            handleClickRow(e);
          }
        }}
      >
        {children}
      </Ariakit.HovercardAnchor>

      <Ariakit.Hovercard unmountOnHide render={<Container />}>
        <Box mr={2} shadow="menu.md" rounded="md.xl">
          <Button
            size="sm"
            onClick={() => {
              setOpen(false);
              onSpotlight?.();
            }}
          >
            Spotlight
          </Button>
        </Box>
      </Ariakit.Hovercard>
    </Ariakit.HovercardProvider>
  );
}
