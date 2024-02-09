import { cva, type RecipeVariantProps } from '@/styled-system/css';
import { styled } from '@/styled-system/jsx';
import type { StyledComponent } from '@/styled-system/types/jsx';

const headingStyles = cva({
  base: {
    fontFamily: 'inter',
    color: 'gray.900',
    lineHeight: 1,
  },
  variants: {
    variant: {
      heading: {
        fontWeight: 'bold',
        fontSize: '2xl',
      },
      subheading: {
        fontWeight: 'semibold',
        fontSize: 'xl',
      },
    },
  },
  defaultVariants: {
    variant: 'heading',
  },
});

export const Heading = styled('h1', headingStyles) as StyledComponent<
  'h1',
  RecipeVariantProps<typeof headingStyles> & {
    as?: React.ElementType;
  }
>;
