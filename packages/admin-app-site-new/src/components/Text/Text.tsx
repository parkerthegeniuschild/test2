import { cva, type RecipeVariantProps } from '@/styled-system/css';
import { styled } from '@/styled-system/jsx';
import type { StyledComponent } from '@/styled-system/types/jsx';

const textStyles = cva({
  base: {
    fontFamily: 'inter',
    color: 'gray.500',
    lineHeight: 1,
  },
  variants: {
    size: {
      sm: {
        fontSize: 'xs',
      },
      md: {
        fontSize: 'sm',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export const Text = styled('p', textStyles) as StyledComponent<
  'p',
  RecipeVariantProps<typeof textStyles> & {
    as?: React.ElementType;
  }
>;
