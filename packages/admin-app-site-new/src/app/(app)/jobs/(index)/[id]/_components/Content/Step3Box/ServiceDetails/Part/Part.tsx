import { memo } from 'react';

import { S } from '@/app/(app)/jobs/(index)/_components';
import {
  usePageAtom,
  useShouldBlurSection,
} from '@/app/(app)/jobs/(index)/[id]/_atoms';
import { useIsJobUnlocked } from '@/app/(app)/jobs/(index)/[id]/_components/UnlockedOnly';
import { formatPrice } from '@/app/(app)/jobs/(index)/[id]/_utils';
import { Badge, Text } from '@/components';
import { styled } from '@/styled-system/jsx';
import { flex } from '@/styled-system/patterns';

import { PartForm, type PartFormProps } from './PartForm';

const PartButton = styled('button', {
  base: {
    bgColor: 'white',
    height: 9,
    px: 3,
    borderWidth: '1px',
    borderColor: 'gray.200',
    rounded: 'lg',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 3,
    cursor: 'pointer',
    transitionProperty: 'border-color, opacity',
    transitionDuration: 'fast',
    transitionTimingFunction: 'ease-in-out',
    position: 'relative',
    shadow: 'sm',

    _hover: {
      borderColor: 'gray.400',
    },

    _disabled: { opacity: 0.6, pointerEvents: 'none' },

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
});

interface PartProps extends PartFormProps {
  showForm?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

function PartRoot({
  showForm,
  part,
  id,
  serviceId,
  vehicleId,
  disabled,
  onClick,
  ...props
}: PartProps) {
  const pageAtom = usePageAtom();
  const shouldBlurSection = useShouldBlurSection();

  const isJobUnlocked = useIsJobUnlocked();

  const shouldBlurButton =
    (shouldBlurSection &&
      !pageAtom.data.focusedSection?.includes('vehicle_creation')) ||
    pageAtom.data.focusedSection?.includes('part_creation') ||
    pageAtom.data.focusedSection?.includes('part_editing');

  const totalCost = part
    ? part.quantity *
      Number.parseFloat(part.price.toString().replace(/,/g, '')) *
      (part.markup / 100 + 1)
    : null;

  if (showForm) {
    return (
      <PartForm
        id={id}
        serviceId={serviceId}
        vehicleId={vehicleId}
        part={part}
        {...props}
      />
    );
  }

  return (
    <PartButton
      type="button"
      css={shouldBlurButton ? S.blurredStyles.raw() : {}}
      tabIndex={shouldBlurButton ? -1 : undefined}
      disabled={disabled || !isJobUnlocked}
      opacity={isJobUnlocked ? undefined : '1!'}
      onClick={onClick}
    >
      <span
        className={flex({
          align: 'center',
          gap: 2,
          maxW: '100%',
          overflow: 'hidden',
        })}
      >
        <Badge content="number" duotone>
          {part?.quantity}
        </Badge>

        <span
          className={flex({
            align: 'center',
            gap: 1.5,
            maxW: '100%',
            overflow: 'hidden',
            h: 4,
          })}
        >
          <Text as="span" fontWeight="medium" color="gray.700">
            {part?.name}
          </Text>
          {!!part?.description && (
            <Text
              as="span"
              fontSize="xs"
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
              display="block"
              maxWidth="100%"
              flex={1}
              height="calc(token(fontSizes.xs) + 1px)"
              transform="translateY(1px)"
            >
              {part.description}
            </Text>
          )}
        </span>
      </span>

      {!!totalCost && (
        <Text as="span" fontWeight="medium" color="gray.700">
          ${formatPrice(totalCost)}
        </Text>
      )}
    </PartButton>
  );
}

export const Part = memo(PartRoot);
