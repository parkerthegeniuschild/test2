import { cva, type RecipeVariantProps } from '@/styled-system/css';
import { styled } from '@/styled-system/jsx';
import type { StyledComponent } from '@/styled-system/types/jsx';

const spinnerStyles = cva({
  base: {
    height: '3.5',
    width: '3.5',
    rounded: 'full',
    border: '2px solid',
    borderColor: 'gray.900',
    animation: 'sweep 1s linear alternate infinite, spin 0.8s linear infinite',
    display: 'block',
  },
});

export const Spinner = styled('div', spinnerStyles) as StyledComponent<
  'div',
  RecipeVariantProps<typeof spinnerStyles> & {
    as?: React.ElementType;
  }
>;
