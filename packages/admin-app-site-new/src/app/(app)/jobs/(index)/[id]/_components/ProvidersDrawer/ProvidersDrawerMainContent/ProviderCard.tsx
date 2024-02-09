import { match } from 'ts-pattern';

import { PROVIDER } from '@/app/(app)/_constants';
import type { JobRequest } from '@/app/(app)/jobs/(index)/[id]/_types';
import {
  Avatar,
  type AvatarProps,
  Icon,
  Text,
  TextButton,
  Tooltip,
  UserCard,
} from '@/components';
import { css } from '@/styled-system/css';
import { Box, Flex, styled } from '@/styled-system/jsx';

const Container = styled('div', {
  base: {
    display: 'flex',
    gap: 2.3,
    p: 3,
    borderWidth: '1px',
    borderColor: 'gray.200',
    rounded: 'lg',
    bgColor: 'white',
    shadow: 'sm',
    position: 'relative',

    _after: {
      content: '""',
      position: 'absolute',
      height: '100%',
      width: '100%',
      pointerEvents: 'none',
      shadow: 'inset',
      left: 0,
      bottom: '-1px',
      rounded: 'calc(token(radii.lg) - 1px)',
    },
  },
  variants: {
    status: {
      NOTIFYING: {
        borderStyle: 'dashed',
        borderColor: 'warning',
        borderWidth: '1.5px',
      },
      LOST: {
        borderStyle: 'dashed',
        borderColor: 'danger.450',
        borderWidth: '1.5px',
      },
      DECLINED: {
        borderStyle: 'dashed',
        borderColor: 'danger',
        borderWidth: '1.5px',
      },
      CANCELED: {
        borderStyle: 'dashed',
        borderColor: 'gray.700',
        borderWidth: '1.5px',
      },
      ACCEPTED: {
        borderStyle: 'dashed',
        borderColor: 'primary',
        borderWidth: '1.5px',
      },
    },
  },
});

type ContainerProps = React.ComponentPropsWithoutRef<typeof Container>;
type ContainerStatus = NonNullable<ContainerProps['status']>;

const STATUS_TO_CORRESPONDENT: Partial<
  Record<JobRequest['status'], ContainerStatus>
> = {
  NO_RESPONSE: 'DECLINED',
  REMOVED: 'ACCEPTED',
};

interface ProviderCardProps extends Omit<ContainerProps, 'status'> {
  status?: JobRequest['status'];
  statusText?: string;
  lastKnownLocation?: string | null;
  supportButton?: React.ReactNode;
  data: {
    name: string;
    status: NonNullable<AvatarProps['status']>;
    distance?: string;
    rating: string | null;
    rawRating: number;
    phone: string | null;
  };
}

function ProviderCardRoot({
  data,
  status,
  statusText,
  lastKnownLocation,
  supportButton,
  children,
  ...props
}: ProviderCardProps) {
  const isInvalidStatus = !status || ['ASSIGNED', 'COMPLETED'].includes(status);

  return (
    <Container
      status={
        isInvalidStatus
          ? undefined
          : ((STATUS_TO_CORRESPONDENT[status] ?? status) as ContainerStatus)
      }
      {...props}
    >
      <UserCard
        size="lg"
        trigger={<Avatar name={data.name} status={data.status} />}
      >
        <UserCard.Header>
          <UserCard.Name>{data.name}</UserCard.Name>
          <UserCard.Role userRole="provider" />
          <UserCard.Stats
            stats={{
              starRating: {
                value: data.rating ?? '-',
                poor: data.rawRating < PROVIDER.MINIMUM_ACCEPTABLE_RATING,
              },
              acceptRate: { value: '-' },
              onTimeArrival: { value: '-' },
            }}
          />
        </UserCard.Header>

        <UserCard.Item>
          <UserCard.Status status={data.status} />
        </UserCard.Item>

        {!!data.phone && (
          <UserCard.Item>
            <UserCard.Phone withSMS={false}>{data.phone}</UserCard.Phone>
          </UserCard.Item>
        )}
      </UserCard>

      <Flex direction="column" gap={2.3} flex={1}>
        <Flex justify="space-between" gap={2}>
          <Flex direction="column" gap={1.75}>
            <Text color="gray.900" fontWeight="semibold">
              {data.name}
            </Text>
            <Flex align="center" gap={1.25}>
              {!!data.distance && (
                <Text color="gray.400" fontWeight="medium">
                  {data.distance} mi
                  {/* <S.Common.Dot mx={1.25} />
                31 min */}
                </Text>
              )}

              {!!lastKnownLocation && (
                <Tooltip
                  description={`Last known location ${lastKnownLocation}`}
                  aria-label={`Last known location ${lastKnownLocation}`}
                  placement="top"
                  forceShowOnHover
                  className={css({ cursor: 'help!' })}
                  render={
                    <TextButton
                      colorScheme="lightGray"
                      css={{ _active: { bgColor: 'inherit' } }}
                    />
                  }
                >
                  <Icon.ClockSnooze />
                </Tooltip>
              )}
            </Flex>
          </Flex>

          {supportButton}
        </Flex>

        {!isInvalidStatus && (
          <Text
            size="sm"
            display="flex"
            alignItems="center"
            gap={1}
            fontWeight="medium"
            color="gray.400"
          >
            {match(status)
              .with('NOTIFYING', () => (
                <>
                  <Icon.BellRinging
                    className={css({ color: 'warning.600', fontSize: 'sm' })}
                  />
                  <Text as="span" color="warning.600">
                    Notified
                  </Text>
                </>
              ))
              .with('LOST', () => (
                <>
                  <Icon.XCircle
                    className={css({ color: 'danger.450', fontSize: 'sm' })}
                  />
                  <Text as="span" color="danger.450">
                    Lost
                  </Text>
                </>
              ))
              .with('DECLINED', () => (
                <>
                  <Icon.XCircle
                    className={css({ color: 'danger', fontSize: 'sm' })}
                  />
                  <Text as="span" color="danger">
                    Declined
                  </Text>
                </>
              ))
              .with('NO_RESPONSE', () => (
                <>
                  <Icon.XCircle
                    className={css({ color: 'danger', fontSize: 'sm' })}
                  />
                  <Text as="span" color="danger">
                    No response
                  </Text>
                </>
              ))
              .with('CANCELED', () => (
                <>
                  <Icon.XCircle
                    className={css({ color: 'gray.900', fontSize: 'sm' })}
                  />
                  <Text as="span" color="gray.900">
                    Canceled
                  </Text>
                </>
              ))
              .with('ACCEPTED', 'REMOVED', () => (
                <>
                  <Icon.CheckCircle
                    className={css({ color: 'primary', fontSize: 'sm' })}
                  />
                  <Text as="span" color="primary">
                    Accepted
                  </Text>
                </>
              ))
              .otherwise(() => null)}
            {statusText}
          </Text>
        )}

        {children}
      </Flex>
    </Container>
  );
}

function ProviderCardFooter({ children }: React.PropsWithChildren) {
  return (
    <>
      <hr className={css({ borderColor: 'gray.100' })} />

      <Box h={3.5}>{children}</Box>
    </>
  );
}

export const ProviderCard = Object.assign(ProviderCardRoot, {
  Footer: ProviderCardFooter,
});
