import { css, cva, sva } from '@/styled-system/css';
import { styled } from '@/styled-system/jsx';

import { Icon } from '../icons';
import { Tooltip, type TooltipProps } from '../Tooltip';

const generalStyles = sva({
  slots: ['container', 'divider', 'wrapper', 'stat'],
  base: {
    container: {
      mt: 1.5,
      display: 'flex',
      flexDir: 'column',
      gap: 3,
    },
    divider: {
      height: 0,
      width: '100%',
      borderTopWidth: '1px',
      borderColor: 'rgba(255, 255, 255, 0.12)',
    },
    wrapper: {
      display: 'flex',
      gap: 2,
    },
  },
});

const Stat = styled(
  'span',
  cva({
    base: {
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      color: 'white',
      fontSize: 'xs',
      fontWeight: 'medium',
      lineHeight: 1,
      cursor: 'help',

      '& svg': {
        color: 'gray.400',
      },
    },
    variants: {
      poor: {
        true: {
          color: 'danger',

          '& svg': {
            color: 'inherit',
          },
        },
      },
    },
  })
);

type UserCardStatsTooltipProps = {
  render: TooltipProps['render'];
  description: string;
  children: React.ReactNode;
};

function UserCardStatsTooltip({
  children,
  description,
  render,
}: UserCardStatsTooltipProps) {
  return (
    <Tooltip
      gutter={4}
      render={render}
      description={description}
      aria-label={description}
      placement="top"
      portal={false}
    >
      {children}
    </Tooltip>
  );
}

type UserCardStatsProps = {
  stats: {
    starRating: {
      value: string;
      poor?: boolean;
    };
    onTimeArrival: {
      value: string;
      poor?: boolean;
    };
    acceptRate: {
      value: string;
      poor?: boolean;
    };
  };
};

export function UserCardStats({ stats }: UserCardStatsProps) {
  const isSomePoor = Object.values(stats).some(stat => stat.poor);

  const classes = generalStyles();

  return (
    <div className={classes.container}>
      <hr className={classes.divider} />

      <div className={classes.wrapper}>
        <UserCardStatsTooltip
          render={<Stat poor={stats.starRating.poor} />}
          description="Star rating"
        >
          <Icon.Star />
          {stats.starRating.value}
        </UserCardStatsTooltip>

        <UserCardStatsTooltip
          render={<Stat poor={stats.onTimeArrival.poor} />}
          description="On-time arrival"
        >
          <Icon.Hourglass />
          {stats.onTimeArrival.value}
        </UserCardStatsTooltip>

        <UserCardStatsTooltip
          render={<Stat poor={stats.acceptRate.poor} />}
          description="Accept rate"
        >
          <Icon.CheckCircleBroken />
          {stats.acceptRate.value}
        </UserCardStatsTooltip>

        {isSomePoor ? (
          <Icon.PatchTimes className={css({ ml: 'auto', color: 'danger' })} />
        ) : (
          <Icon.PatchCheck className={css({ ml: 'auto', color: 'primary' })} />
        )}
      </div>
    </div>
  );
}
