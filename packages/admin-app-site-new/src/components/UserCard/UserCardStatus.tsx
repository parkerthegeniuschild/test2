import { match } from 'ts-pattern';

import { type RecipeVariantProps, sva } from '@/styled-system/css';

const generalStyles = sva({
  slots: ['container', 'indicator'],
  base: {
    container: {
      py: 1.5,
      px: 4,
      fontSize: 'sm',
      lineHeight: 1,
      fontWeight: 'medium',
      display: 'flex',
      alignItems: 'center',
      gap: '0.59375rem',
    },
    indicator: {
      height: '7px',
      width: '7px',
      rounded: 'full',
      display: 'block',
    },
  },
  variants: {
    status: {
      online: {
        container: { color: 'primary' },
        indicator: { bg: 'primary' },
      },
      onJob: {
        container: { color: 'primary' },
        indicator: {
          bg: 'transparent',
          borderColor: 'primary',
          borderWidth: '1px',
          boxShadow: '0px 0px 0px 0.5px token(colors.primary) inset',
        },
      },
      offline: {
        container: { color: 'white' },
        indicator: { bg: 'gray.400' },
      },
      unapproved: {
        container: { color: 'danger' },
        indicator: { bg: 'danger' },
      },
    },
  },
});

type UserCardStatusProps = React.ComponentPropsWithoutRef<'p'> & {
  status: Exclude<
    Exclude<RecipeVariantProps<typeof generalStyles>, undefined>['status'],
    undefined
  >;
};

export function UserCardStatus({ status }: UserCardStatusProps) {
  const classes = generalStyles({ status });

  return (
    <p className={classes.container}>
      <span className={classes.indicator} aria-hidden />
      {match(status)
        .with('onJob', () => 'On a job')
        .with('unapproved', () => 'Unapproved')
        .with('online', () => 'Online')
        .with('offline', () => 'Offline')
        .exhaustive()}
    </p>
  );
}
