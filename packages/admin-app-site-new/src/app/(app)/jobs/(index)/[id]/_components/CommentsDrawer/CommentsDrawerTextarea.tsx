import { Textarea, type TextareaProps } from '@/components';
import { Flex, styled } from '@/styled-system/jsx';

export const SendButton = styled('button', {
  base: {
    width: '2.125rem',
    height: '2.125rem',
    rounded: 'full',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 'lg',
    cursor: 'pointer',
    transitionProperty: 'background-color, color, opacity',
    transitionDuration: 'fast',
    transitionTimingFunction: 'ease-in-out',

    _disabled: {
      pointerEvents: 'none',
    },
  },
  variants: {
    variant: {
      primary: {
        color: 'white',
        bgColor: 'primary',

        _hover: {
          bgColor: 'primary.600',
        },

        _active: {
          bgColor: 'primary',
        },

        _disabled: {
          bgColor: 'rgba(1, 2, 3, 0.06)',
          color: 'gray.300',
        },
      },
      secondary: {
        color: 'gray.500',
        bgColor: 'rgba(1, 2, 3, 0.06)',

        _hover: {
          bgColor: 'rgba(1, 2, 3, 0.12)',
        },

        _active: {
          bgColor: 'rgba(1, 2, 3, 0.06)',
        },

        _disabled: {
          opacity: 0.6,
        },
      },
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});

export function CommentsDrawerTextarea({ children, ...props }: TextareaProps) {
  return (
    <Textarea rows={4} {...props}>
      <Flex
        gap={1.75}
        alignSelf="flex-end"
        ml={1}
        transform="translateY(0.125rem)"
      >
        {children}
      </Flex>
    </Textarea>
  );
}
