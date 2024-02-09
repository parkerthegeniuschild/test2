import { Icon, Tooltip } from '@/components';
import { css } from '@/styled-system/css';

interface ToggleOpenButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export function ToggleOpenButton({ isOpen, onClick }: ToggleOpenButtonProps) {
  return (
    <Tooltip
      description={isOpen ? 'Collapse side panel' : 'Expand side panel'}
      aria-label={isOpen ? 'Collapse side panel' : 'Expand side panel'}
      closeOnClick
      placement="left"
      render={
        // eslint-disable-next-line jsx-a11y/control-has-associated-label
        <button
          type="button"
          className={css({
            pos: 'absolute',
            top: '50%',
            transform: isOpen
              ? 'translateX(-100%)'
              : 'translateX(calc(-100% + -0.5rem))',
            left: 0,
            bgColor: 'white',
            zIndex: -1,
            fontSize: 'md',
            width: '1.75rem',
            height: '2.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            roundedLeft: 'lg',
            color: 'gray.600',
            shadow: 'menu.md',
            transition: 'transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms',
          })}
        />
      }
      onClick={onClick}
    >
      <Icon.ChevronRightDouble
        className={css(isOpen ? {} : { transform: 'scaleX(-1)' })}
      />
    </Tooltip>
  );
}
