import { useId } from 'react';

import { styled } from '@/styled-system/jsx';

const Wrapper = styled('span', {
  base: {
    display: 'inline-flex',
    flexDirection: 'column',
    position: 'relative',
  },
});

const Container = styled('span', {
  base: {
    position: 'relative',
    display: 'inline-flex',
    transform: 'translateY(1px)',
  },
});

const PinTipWrapper = styled('span', {
  base: {
    width: '12px',
    height: '6.22px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    alignSelf: 'center',

    '& svg': {
      pointerEvents: 'none',
      flexShrink: 0,
    },
  },
});

const PinContainer = styled('span', {
  base: {
    fontFamily: 'inter',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textTransform: 'uppercase',
    w: 7,
    h: 7,
    bgColor: 'gray.800',
    rounded: 'full',
    color: 'white',
    fontSize: '0.6875rem',
    fontWeight: 'semibold',
    shadow: '0 0 0 0.75px white, 0px 0px 6px 2px rgba(0, 0, 0, 0.40)',
    zIndex: 1,
    borderWidth: '1px',
    borderColor: 'white',
    userSelect: 'none',
    position: 'relative',
  },
});

const Circle = styled('span', {
  base: {
    w: 3.5,
    h: 3.5,
    bgColor: 'white',
    rounded: 'full',
    shadow:
      '0px 0px 2px 0px rgba(0, 0, 0, 0.16), 0px 0px 8px 3px rgba(0, 0, 0, 0.24)',
    borderWidth: '1px',
    borderColor: 'white',
    position: 'absolute',
    left: '50%',
    top: 'calc(100% - 3px)',
    transform: 'translateX(-46%)',

    _after: {
      content: '""',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 'calc(100% - 1px)',
      height: 'calc(100% - 1px)',
      rounded: 'full',
      bgColor: 'gray.800',
    },
  },
});

const NameHighlight = styled('span', {
  base: {
    fontFamily: 'inter',
    bgColor: 'gray.500',
    color: 'white',
    fontSize: 'xs',
    lineHeight: 1,
    fontWeight: 'medium',
    whiteSpace: 'nowrap',
    py: 1.5,
    px: 2,
    rounded: 'sm',
    shadow: 'menu.md',
    display: 'block',
    position: 'absolute',
    bottom: 'calc(-100% + -0.3125rem)',
    left: '-50%',
    transform: 'translateX(calc(-50% + 1.75rem))',
    opacity: 0,
    visibility: 'hidden',
    pointerEvents: 'none',
    transitionProperty: 'opacity, visibility',
    transitionDuration: 'fast',
    transitionTimingFunction: 'easeInOut',
  },
  variants: {
    show: {
      true: {
        opacity: 1,
        visibility: 'visible',
        pointerEvents: 'auto',
      },
    },
  },
});

function PinTip() {
  const filterId = useId();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="127"
      height="122"
      fill="none"
      viewBox="0 0 127 122"
    >
      <g filter={`url(#${filterId})`}>
        <path
          fill="#fff"
          d="M63.5 58h6c-3 0-4.14 2.074-4.72 4.971-.28 1.028-.79 1.25-1.28 1.25s-1-.222-1.28-1.25C61.64 60.074 60.5 58 57.5 58h6z"
        />
      </g>
      <defs>
        <filter
          id={filterId}
          width="126.075"
          height="120.297"
          x="0.463"
          y="0.963"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="28.519" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.28 0" />
          <feBlend
            in2="BackgroundImageFix"
            result="effect1_dropShadow_7436_180788"
          />
          <feBlend
            in="SourceGraphic"
            in2="effect1_dropShadow_7436_180788"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
}

interface ProviderPinProps {
  providerInitials: string;
  providerName: string;
  showNameHighlight?: boolean;
}

export function ProviderPin({
  providerInitials,
  providerName,
  showNameHighlight,
}: ProviderPinProps) {
  return (
    <Wrapper>
      <Container>
        <PinContainer>{providerInitials}</PinContainer>
        <Circle />
      </Container>

      <PinTipWrapper>
        <PinTip />
      </PinTipWrapper>

      <NameHighlight show={showNameHighlight}>{providerName}</NameHighlight>
    </Wrapper>
  );
}
