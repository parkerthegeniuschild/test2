import { cva, type RecipeVariantProps } from '@/styled-system/css';
import { styled } from '@/styled-system/jsx';
import type { StyledComponent } from '@/styled-system/types/jsx';

const textLinkStyles = cva({
  base: {
    fontFamily: 'inter',
    lineHeight: 1,
    fontSize: 'sm',
    fontWeight: 'medium',
    color: 'primary',

    '&:hover, &:focus': {
      textDecoration: 'underline',
    },
  },
});

export const TextLink = styled('a', textLinkStyles) as StyledComponent<
  'a',
  RecipeVariantProps<typeof textLinkStyles> & {
    as?: React.ElementType;
  }
>;
