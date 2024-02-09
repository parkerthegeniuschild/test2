import { Icon } from '@/components';
import { styled } from '@/styled-system/jsx';

const Wrapper = styled('span', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    zIndex: 2,

    '& .job-pin-ellipse': {
      opacity: 0,
      color: 'danger',
      position: 'absolute',
      top: '100%',
      transform: 'translateY(-50%)',
      zIndex: -2,
      pointerEvents: 'none',
    },

    _after: {
      '--ellipse-height': '0.375rem',
      '--ellipse-width': '0.875rem',

      content: '""',
      position: 'absolute',
      top: '100%',
      transform: 'translateY(-50%)',
      display: 'block',
      height: 'var(--ellipse-height)',
      width: 'var(--ellipse-width)',
      bgColor: 'danger',
      opacity: 0,
      zIndex: -1,
      clipPath:
        'ellipse(calc(var(--ellipse-width) / 2) calc(var(--ellipse-height) / 2))',
      pointerEvents: 'none',
    },

    '& .job-pin-ellipse, &::after': {
      transitionProperty: 'opacity',
      transitionDuration: 'fast',
      transitionTimingFunction: 'ease-out',
    },
  },
  variants: {
    showHint: {
      true: {
        _before: {
          content: '"Drag the map pin to reposition"',
          position: 'absolute',
          fontFamily: 'inter',
          fontSize: 'sm',
          lineHeight: 1,
          color: 'gray.900',
          fontWeight: 'semibold',
          width: 'max',
          bgColor: 'white',
          height: 8,
          px: 3,
          display: 'flex',
          alignItems: 'center',
          rounded: 'md.xl',
          shadow:
            '0px 4px 2px -2px rgba(1, 2, 3, 0.08), 0px 7px 13px -3px rgba(1, 2, 3, 0.26)',
          pointerEvents: 'none',
          bottom: 'calc(-100% + -8px)',
        },
      },
    },
    showEllipses: {
      true: {
        '& .job-pin-ellipse': {
          opacity: 1,
        },

        _after: {
          opacity: 0.72,
        },
      },
    },
  },
});

const Container = styled('span', {
  base: {
    fontFamily: 'inter',
    bgColor: 'danger',
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 0.75,
    fontSize: '2xs.xl',
    lineHeight: 1,
    fontWeight: 'semibold',
    height: 8,
    width: '3.75rem',
    rounded: 'full',
    borderWidth: '1px',
    borderColor: 'white',
    shadow:
      '0 0 0 0.75px white, 0px 1px 2px 1px rgba(1, 2, 3, 0.08), 0px 8px 24px 1px rgba(1, 2, 3, 0.24)',
    textTransform: 'uppercase',
    position: 'relative',
    userSelect: 'none',
  },
});

const PinTipWrapper = styled('span', {
  base: {
    width: '12px',
    height: '6.22px',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    '& svg': {
      pointerEvents: 'none',
      flexShrink: 0,
    },
  },
});

function PinTip() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="127"
      height="122"
      fill="none"
      viewBox="0 0 127 122"
    >
      <g filter="url(#filter0_d_7436_180788)">
        <path
          fill="#fff"
          d="M63.5 58h6c-3 0-4.14 2.074-4.72 4.971-.28 1.028-.79 1.25-1.28 1.25s-1-.222-1.28-1.25C61.64 60.074 60.5 58 57.5 58h6z"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_7436_180788"
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

function Ellipse() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="49"
      height="20"
      fill="none"
      viewBox="0 0 49 20"
      className="job-pin-ellipse"
    >
      <ellipse
        cx="24.5"
        cy="10"
        fill="currentColor"
        opacity="0.24"
        rx="24"
        ry="10"
      />
    </svg>
  );
}

interface JobPinProps {
  showHint?: boolean;
  showEllipses?: boolean;
}

export function JobPin({ showHint = true, showEllipses }: JobPinProps) {
  return (
    <Wrapper showHint={showHint} showEllipses={showEllipses}>
      <Container>
        <Icon.MarkerPin />
        Job
      </Container>

      <PinTipWrapper>
        <PinTip />
      </PinTipWrapper>

      <Ellipse />
    </Wrapper>
  );
}
