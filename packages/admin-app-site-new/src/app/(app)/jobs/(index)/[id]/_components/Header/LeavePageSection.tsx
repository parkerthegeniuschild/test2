import { useCallback, useEffect } from 'react';

import { useGetPageSize, useRouter } from '@/app/(app)/_hooks';
import { Icon, TextButton } from '@/components';
import { Flex, styled } from '@/styled-system/jsx';

const Kbd = styled('kbd', {
  base: {
    textTransform: 'uppercase',
    fontSize: '2xs.xl',
    fontWeight: 'medium',
    color: 'gray.700',
    lineHeight: 1,
    bgColor: 'white',
    height: 5,
    width: '2.125rem',
    rounded: 'sm',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: '1px',
    borderColor: 'gray.100',
    shadow: 'sm',
    position: 'relative',

    _after: {
      content: '""',
      position: 'absolute',
      height: '100%',
      width: '100%',
      shadow: 'inset',
      rounded: 'calc(token(radii.sm) - 1px)',
      bottom: '-1px',
      pointerEvents: 'none',
    },
  },
});

export function LeavePageSection() {
  const router = useRouter();

  const pageSize = useGetPageSize();

  const handleLeavePage = useCallback(() => {
    router.push(`/jobs?size=${pageSize}`);
  }, [pageSize, router]);

  useEffect(() => {
    function handleLeavePageShortcut(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        const isAnyOverlayComponentOpened = !!document.querySelector(
          '[data-enter],.react-date-picker--open'
        );

        if (isAnyOverlayComponentOpened) {
          return;
        }

        handleLeavePage();
      }
    }

    document.addEventListener('keydown', handleLeavePageShortcut);

    return () => {
      document.removeEventListener('keydown', handleLeavePageShortcut);
    };
  }, [handleLeavePage]);

  return (
    <Flex align="center" gap={2}>
      <Kbd>Esc</Kbd>
      <TextButton
        colorScheme="lightGray"
        fontSize="md"
        title="Return to jobs page"
        onClick={handleLeavePage}
      >
        <Icon.XClose />
      </TextButton>
    </Flex>
  );
}
