import { Common } from '@/app/(app)/jobs/(index)/_components/styles';
import { styled } from '@/styled-system/jsx';

export const DriverCardContainer = styled(Common.ActionButtonsContainer, {
  base: {
    bgColor: 'rgba(0, 204, 102, 0.04)',
    borderWidth: '1px',
    borderColor: 'primary',
    rounded: 'lg',
    p: 3,
    display: 'flex',
    gap: 2.3,
    position: 'relative',
  },
});
