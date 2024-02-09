import { useId, useRef, useState } from 'react';

import { format } from '@/app/_utils';
import { Icon, Text } from '@/components';
import { css } from '@/styled-system/css';
import { Flex, styled } from '@/styled-system/jsx';

import type { RecentLocation } from '../_types';

const Wrapper = styled('span', {
  base: {
    display: 'inline-flex',
    flexDirection: 'column',
    cursor: 'help',
  },
});

const Container = styled('span', {
  base: {
    '--pin-bg-color': 'token(colors.danger.600)',

    position: 'relative',
    display: 'inline-flex',
    transform: 'translateY(1px)',
  },
  variants: {
    isMoving: {
      true: {
        '--pin-bg-color': 'token(colors.primary.600)',
      },
    },
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
    bgColor: 'var(--pin-bg-color)',
    rounded: 'full',
    color: 'white',
    fontSize: '0.6875rem',
    fontWeight: 'semibold',
    shadow: '0 0 0 0.75px white, 0px 0px 6px 2px rgba(0, 0, 0, 0.40)',
    zIndex: 1,
    borderWidth: '1px',
    borderColor: 'white',
    position: 'relative',

    '& .info-container': {
      display: 'none',
    },
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
    transform: 'translateX(-50%)',

    _after: {
      content: '""',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 'calc(100% - 1px)',
      height: 'calc(100% - 1px)',
      rounded: 'full',
      bgColor: 'var(--pin-bg-color)',
    },
  },
});

const TextValue = styled('span', {
  base: {
    bgColor: 'rgba(1, 2, 3, 0.1)',
    p: 1,
    rounded: 'sm',
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

function PersonWalkingIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="0"
      viewBox="0 0 320 512"
    >
      <path
        stroke="none"
        d="M208 96c26.5 0 48-21.5 48-48S234.5 0 208 0s-48 21.5-48 48 21.5 48 48 48zm94.5 149.1l-23.3-11.8-9.7-29.4c-14.7-44.6-55.7-75.8-102.2-75.9-36-.1-55.9 10.1-93.3 25.2-21.6 8.7-39.3 25.2-49.7 46.2L17.6 213c-7.8 15.8-1.5 35 14.2 42.9 15.6 7.9 34.6 1.5 42.5-14.3L81 228c3.5-7 9.3-12.5 16.5-15.4l26.8-10.8-15.2 60.7c-5.2 20.8.4 42.9 14.9 58.8l59.9 65.4c7.2 7.9 12.3 17.4 14.9 27.7l18.3 73.3c4.3 17.1 21.7 27.6 38.8 23.3 17.1-4.3 27.6-21.7 23.3-38.8l-22.2-89c-2.6-10.3-7.7-19.9-14.9-27.7l-45.5-49.7 17.2-68.7 5.5 16.5c5.3 16.1 16.7 29.4 31.7 37l23.3 11.8c15.6 7.9 34.6 1.5 42.5-14.3 7.7-15.7 1.4-35.1-14.3-43zM73.6 385.8c-3.2 8.1-8 15.4-14.2 21.5l-50 50.1c-12.5 12.5-12.5 32.8 0 45.3s32.7 12.5 45.2 0l59.4-59.4c6.1-6.1 10.9-13.4 14.2-21.5l13.5-33.8c-55.3-60.3-38.7-41.8-47.4-53.7l-20.7 51.5z"
      />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <rect width="13" height="13" x="9" y="9" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  );
}

interface ProviderPinProps {
  location: RecentLocation;
}

export function ProviderPin({ location }: ProviderPinProps) {
  const [hasSuccessfullyCopied, setHasSuccessfullyCopied] = useState(false);

  const successfulCopyTimeout = useRef<NodeJS.Timeout | null>(null);

  async function handleCopyLocationData() {
    if (successfulCopyTimeout.current) {
      clearTimeout(successfulCopyTimeout.current);
    }

    const locationData = JSON.stringify(location, null, 2);
    await navigator.clipboard.writeText(locationData);
    setHasSuccessfullyCopied(true);

    const timeoutId = setTimeout(() => {
      setHasSuccessfullyCopied(false);
    }, 2000);
    successfulCopyTimeout.current = timeoutId;
  }

  return (
    <Wrapper>
      <Container isMoving={location.isMoving}>
        <PinContainer className="pin-container">
          {location.isMoving ? (
            <PersonWalkingIcon />
          ) : (
            <Icon.AlertHexagon width="16" height="16" />
          )}

          <Flex className="info-container" direction="column" gap={3}>
            <button
              type="button"
              onClick={handleCopyLocationData}
              className={css({
                position: 'absolute',
                bottom: 2,
                right: 4,
                color: 'white',
                fontSize: '1.125rem',
                cursor: 'pointer',
              })}
            >
              {hasSuccessfullyCopied ? (
                <Icon.Check width="1em" height="1em" />
              ) : (
                <CopyIcon />
              )}
            </button>

            <Text color="inherit">
              ID: <TextValue>{location.id}</TextValue>
            </Text>
            {!!location.jobId && (
              <Text color="inherit">
                Job ID: <TextValue>{location.jobId}</TextValue>
              </Text>
            )}
            <Text color="inherit">
              Provider ID: <TextValue>{location.providerId}</TextValue>
            </Text>
            <Text color="inherit" whiteSpace="nowrap">
              Timestamp:{' '}
              <TextValue>
                {new Intl.DateTimeFormat('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  second: 'numeric',
                }).format(new Date(location.timestamp))}
              </TextValue>
            </Text>
            {!!location.speed && (
              <Text color="inherit">
                Speed: <TextValue>{location.speed} MPH</TextValue>
              </Text>
            )}
            {!!location.course && (
              <Text color="inherit">
                Course: <TextValue>{location.course}</TextValue>
              </Text>
            )}
            <Text color="inherit">
              Longitude: <TextValue>{location.longitude}</TextValue>
            </Text>
            <Text color="inherit">
              Latitude: <TextValue>{location.latitude}</TextValue>
            </Text>
            {!!location.accuracy && (
              <Text color="inherit">
                Accuracy: <TextValue>{location.accuracy}</TextValue>
              </Text>
            )}
            <Text color="inherit">
              Is Moving?{' '}
              <TextValue>
                {format.string.capitalize(String(location.isMoving))}
              </TextValue>
            </Text>
          </Flex>
        </PinContainer>
        <Circle />
      </Container>

      <PinTipWrapper>
        <PinTip />
      </PinTipWrapper>
    </Wrapper>
  );
}
