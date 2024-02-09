import { Icon, Text } from '@/components';
import { css } from '@/styled-system/css';

type ClearFiltersButtonProps = {
  onClick: () => void;
};

export function ClearFiltersButton({ onClick }: ClearFiltersButtonProps) {
  return (
    <Text
      as="button"
      css={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        lineHeight: 1,
        fontWeight: 'semibold',
        color: 'gray.500',
        cursor: 'pointer',
        ml: 1,
        alignSelf: 'center',
      }}
      onClick={onClick}
    >
      <span className={css({ fontSize: 'md' })} aria-hidden>
        <Icon.Times />
      </span>
      Clear filters
    </Text>
  );
}
