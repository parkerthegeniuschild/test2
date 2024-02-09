import { Common } from '@/app/(app)/jobs/(index)/_components/styles';
import { styled } from '@/styled-system/jsx';

export const DispatcherCardContainer = styled(Common.ActionButtonsContainer, {
  base: {
    bgColor: 'rgba(28, 146, 255, 0.04)',
    borderWidth: '1px',
    borderColor: 'blue',
    rounded: 'lg',
    p: 3,
    display: 'flex',
    gap: 2.3,
    position: 'relative',
  },
});
