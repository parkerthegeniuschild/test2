'use client';

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import ReactDatePicker from 'react-date-picker';
import ReactTimePicker from 'react-time-picker';

import { styled } from '@/styled-system/jsx';
import type { StyledVariantProps } from '@/styled-system/types';

import { Button } from '../Button';
import { Icon } from '../icons';
import { Select } from '../Select';

const Wrapper = styled('div', {
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
  },
});

const Container = styled('div', {
  base: {
    display: 'flex',
    alignItems: 'center',
    shadow: 'sm',
    rounded: 'lg',
    position: 'relative',

    _after: {
      content: '""',
      position: 'absolute',
      bottom: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      rounded: 'lg',
      shadow: 'inset',
      zIndex: 2,
    },

    _focusWithin: {
      zIndex: 3,
    },

    '& .react-date-picker, & .react-date-picker__wrapper, & .react-date-picker__inputGroup, & .react-time-picker, & .react-time-picker__wrapper, & .react-time-picker__inputGroup':
      {
        height: '100%',
      },

    '& .react-date-picker__inputGroup__input, & .react-date-picker__inputGroup__leadingZero, & .react-time-picker__inputGroup__input, & .react-time-picker__inputGroup__leadingZero':
      {
        fontFamily: 'inter',
        appearance: 'textfield',
        fontSize: 'sm',
        lineHeight: 1,
        color: 'gray.900',
        fontWeight: 'medium',
        minWidth: '0.5625rem',
      },

    '& .react-date-picker__inputGroup__input, & .react-time-picker__inputGroup__input':
      {
        height: '100%',
        boxSizing: 'content-box',
        bgColor: 'transparent',
        outline: 'none',

        _placeholder: {
          color: 'gray.400',
        },

        '&[class*=-picker__inputGroup__input--hasLeadingZero]': {
          pl: 'calc(0.5625rem)',
          ml: '-0.5625rem',
        },
      },

    '& .react-date-picker__inputGroup__input::-webkit-outer-spin-button, & .react-date-picker__inputGroup__input::-webkit-inner-spin-button, & .react-time-picker__inputGroup__input::-webkit-outer-spin-button, & .react-time-picker__inputGroup__input::-webkit-inner-spin-button':
      {
        WebkitAppearance: 'none',
        m: 0,
      },

    '& .react-time-picker__inputGroup__amPm': {
      display: 'none',
    },

    '& .react-date-picker__inputGroup__divider, & .react-time-picker__inputGroup__divider':
      {
        color: 'gray.400',
        userSelect: 'none',
        fontWeight: 'medium',
        lineHeight: 1,
        display: 'inline-block',
        transform: 'translateY(-1px)',
        letterSpacing: '1px',
      },

    '& .react-date-picker--closed': {
      overflow: 'hidden',
    },

    '& .react-date-picker__calendar': {
      width: '19.5rem!',
      height: 'auto!',
      bgColor: 'white',
      shadow: 'menu.md',
      rounded: 'lg',
      zIndex: 'popover',
      borderWidth: '1px',
      borderColor: 'gray.100',
      left: '-3.25rem!',
      my: '0.3125rem',
      transitionProperty: 'opacity, transform, visibility',
      transitionTimingFunction: 'easeInOut',
      transitionDuration: 'fast',
      position: 'absolute',

      '&--closed': {
        opacity: 0,
        visibility: 'hidden',
        pointerEvents: 'none',
        maxHeight: 0,
      },

      '& .react-calendar': {
        p: 4,

        '&__navigation': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',

          '&__label': {
            fontFamily: 'inter',
            fontSize: 'sm',
            lineHeight: 1,
            fontWeight: 'medium',
            color: 'gray.500',
          },

          '&__arrow': {
            h: 8,
            w: 8,
            rounded: 'md.xl',
            borderWidth: '1px',
            borderColor: 'gray.200',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            shadow: 'sm',
            fontSize: 'md',
            color: 'gray.600',
            transition: 'all token(durations.fast) ease-in-out',
            position: 'relative',
            bgColor: 'white',

            _disabled: {
              opacity: 0.4,
              cursor: 'not-allowed',
            },

            _before: {
              zIndex: -1,
              content: '""',
              position: 'absolute',
              inset: 0,
              bgColor: 'primary',
              opacity: 0,
              width: 'calc(100% + 10px)',
              height: 'calc(100% + 10px)',
              transform: 'translate(-5px, -5px)',
              transition: 'opacity token(durations.fast) ease-in-out',
              rounded: 'calc(token(radii.md.xl) + 4px)',
            },

            _after: {
              content: '""',
              pointerEvents: 'none',
              position: 'absolute',
              left: 0,
              bottom: '-1px',
              width: '100%',
              height: '100%',
              shadow: 'inset',
              rounded: 'calc(token(radii.md.xl) - 1px)',
            },

            _focus: {
              _before: {
                opacity: 0.24,
              },
            },

            _hover: {
              color: 'gray.900',
            },

            _active: {
              color: 'gray.600',
            },
          },
        },

        '&__viewContainer': {
          mt: 3,
        },

        '&__tile, &__month-view__weekdays__weekday': {
          width: 10,
          height: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 'sm',
          lineHeight: 1,
          fontWeight: 'medium',
        },

        '&__month-view__weekdays__weekday': {
          color: 'gray.500',

          '& abbr': {
            textDecoration: 'none',
          },
        },

        '&__tile': {
          color: 'gray.700',
          cursor: 'pointer',
          rounded: 'md.xl',
          position: 'relative',
          transitionProperty: 'background-color, color',
          transitionTimingFunction: 'easeInOut',
          transitionDuration: 'fast',

          _disabled: {
            opacity: 0.2,
            cursor: 'not-allowed',
          },

          _hover: {
            bgColor: 'gray.50',
          },

          _active: {
            bgColor: 'transparent',
          },

          '&--active': {
            bgColor: 'primary',
            color: 'white!',

            _hover: {
              bgColor: 'primary.600!',
            },

            _active: {
              bgColor: 'primary!',
            },
          },

          '&--now': {
            _after: {
              opacity: '1!',
            },
          },

          '&.react-calendar__tile--now.react-calendar__tile--active': {
            _after: {
              bgColor: 'white!',
            },
          },

          _after: {
            content: '""',
            bgColor: 'primary.600',
            w: 1.5,
            h: 1.5,
            rounded: 'full',
            position: 'absolute',
            top: '0.34375rem',
            right: '0.34375rem',
            opacity: 0,
          },
        },

        '&__month-view__days__day--neighboringMonth': {
          opacity: 0.4,
        },
      },
    },
  },
  variants: {
    size: {
      md: { height: 9 },
      sm: { height: 8 },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

const BaseContainer = styled('div', {
  base: {
    height: '100%',
    bgColor: 'white',
    borderWidth: '1px',
    borderColor: 'gray.200',
    transition: 'border token(durations.fast) ease-in-out',
    position: 'relative',

    _before: {
      content: '""',
      zIndex: -1,
      position: 'absolute',
      inset: 0,
      bgColor: 'primary',
      opacity: 0,
      width: 'calc(100% + 10px)',
      height: 'calc(100% + 10px)',
      transform: 'translate(-5px, -5px)',
      pointerEvents: 'none',
      transition: 'opacity token(durations.fast) ease-in-out',
    },

    _focusWithin: {
      borderColor: 'primary',
      zIndex: 1,

      _before: {
        opacity: 0.24,
      },
    },
  },
  variants: {
    error: {
      true: {
        borderColor: 'danger',

        _before: {
          bgColor: 'danger',
        },

        _focusWithin: {
          borderColor: 'danger',
        },
      },
    },
  },
});

const DateContainer = styled(BaseContainer, {
  base: {
    roundedLeft: 'inherit',

    _before: {
      roundedLeft: 'calc(token(radii.lg) + 4px)',
    },
  },
});

const BaseContentContainer = styled('div', {
  base: {
    display: 'flex',
    height: '100%',
    bgColor: 'inherit',
    px: 3,
  },
});

const DateContentContainer = styled(BaseContentContainer, {
  base: {
    gap: 2,
    alignItems: 'center',
    roundedLeft: 'calc(token(radii.lg) - 1px)',
  },
});

const TimeContainer = styled(BaseContainer, {
  base: {
    roundedRight: 'inherit',
    ml: '-1px',

    _before: {
      roundedRight: 'calc(token(radii.lg) + 4px)',
    },
  },
});

const TimeContentContainer = styled(BaseContentContainer, {
  base: {
    gap: 1,
    roundedRight: 'calc(token(radii.lg) - 1px)',
    alignItems: 'baseline',
  },
});

const CalendarButton = styled('button', {
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    appearance: 'none',
    cursor: 'pointer',
    fontSize: 'md',
    transition: 'filter token(durations.fast) ease-in-out',

    _hover: {
      filter: 'brightness(0.7)',
    },

    '& .calendar-icon': {
      color: 'gray.500',
    },

    '& .chevron-icon-container': {
      color: 'gray.400',
      width: 2,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      mx: '1px',

      '& svg': {
        flexShrink: 0,
      },
    },
  },
});

const AmPmButton = styled('button', {
  base: {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.3125rem',
    fontFamily: 'inter',
    fontSize: 'sm',
    lineHeight: 1,
    fontWeight: 'medium',
    color: 'gray.900',

    '& > span': {
      width: 2,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: 'md',
      color: 'gray.400',

      '& svg': {
        flexShrink: 0,
      },
    },
  },
});

export type DateTimePickerElement = {
  focus: () => void;
};

interface DateTimePickerProps extends StyledVariantProps<typeof Container> {
  value: Date | null;
  minDate?: Date;
  maxDate?: Date;
  tabIndex?: number;
  showClearButton?: boolean;
  error?: boolean;
  onChange: (value: Date | null) => void;
}

export const DateTimePicker = forwardRef<
  DateTimePickerElement,
  DateTimePickerProps
>(
  (
    {
      value,
      minDate,
      maxDate,
      tabIndex,
      showClearButton = true,
      size,
      error,
      onChange,
    },
    forwardedRef
  ) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const dateContentContainerRef = useRef<HTMLDivElement>(null);

    const [amOrPm, setAmOrPm] = useState(() => {
      if (value) {
        if (value.getHours() < 12) {
          return 'AM';
        }

        return 'PM';
      }

      return 'AM';
    });
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    useImperativeHandle(forwardedRef, () => ({
      focus() {
        const firstFocusableInput =
          dateContentContainerRef.current?.querySelector(
            'input:not([hidden])'
          ) as HTMLInputElement | null;
        firstFocusableInput?.focus();
      },
    }));

    useEffect(() => {
      const focusableElements = wrapperRef.current?.querySelectorAll(
        'input, button:not([class*=react-calendar])'
      );

      focusableElements?.forEach(el => {
        if (typeof tabIndex === 'number') {
          el.setAttribute('tabindex', String(tabIndex));
          return;
        }

        el.removeAttribute('tabindex');
      });
    }, [tabIndex]);

    function handleDateChange(newValue: Date | null) {
      if (!newValue) {
        onChange(null);
        return;
      }

      const selectedDate = newValue;
      const newDate = new Date(value || new Date());
      newDate.setMonth(selectedDate.getMonth());
      newDate.setDate(selectedDate.getDate());
      newDate.setFullYear(selectedDate.getFullYear());

      if (amOrPm !== 'AM' && !value && newDate.getHours() < 12) {
        newDate.setHours(newDate.getHours() + 12);
      }

      if (!value) {
        setAmOrPm(newDate.getHours() < 12 ? 'AM' : 'PM');
      }

      onChange(newDate);
    }

    function handleTimeChange(v: string | null) {
      if (!v) {
        return;
      }

      const [hours, minutes] = v.split(':').map(Number);
      const newValue = value ? new Date(value) : new Date();

      newValue.setHours(hours);
      newValue.setMinutes(minutes);

      if (newValue.getHours() < 12 && amOrPm === 'PM') {
        newValue.setHours(newValue.getHours() + 12);
      }

      if (newValue.getHours() >= 12 && amOrPm === 'AM') {
        newValue.setHours(newValue.getHours() - 12);
      }

      onChange(newValue);
    }

    function handleAmPmChange(newAmOrPm: string) {
      setAmOrPm(newAmOrPm);

      if (!value) {
        return;
      }

      const newDate = new Date(value || new Date());

      if (newAmOrPm === 'AM') {
        newDate.setHours(newDate.getHours() - 12);
      } else {
        newDate.setHours(newDate.getHours() + 12);
      }

      onChange(newDate);
    }

    function handleTimePickerBlur(e: React.FocusEvent<HTMLInputElement>) {
      const timeInputs = e.target.parentElement?.querySelectorAll(
        'input[data-input]'
      ) as NodeListOf<HTMLInputElement>;

      const [hourInput, minutesInput] = timeInputs;

      if (!value && hourInput.value && minutesInput.value) {
        handleTimeChange(`${hourInput.value}:${minutesInput.value}`);
      }
    }

    function handleClearDate() {
      onChange(null);
      setAmOrPm('AM');
    }

    return (
      <Wrapper ref={wrapperRef}>
        <Container size={size}>
          <DateContainer error={error}>
            <DateContentContainer ref={dateContentContainerRef}>
              <CalendarButton
                type="button"
                title="Open calendar"
                onPointerDown={() => setIsCalendarOpen(state => !state)}
              >
                <Icon.Calendar className="calendar-icon" />
                <span className="chevron-icon-container">
                  <Icon.ChevronDown />
                </span>
              </CalendarButton>

              <ReactDatePicker
                clearIcon={null}
                calendarIcon={null}
                isOpen={isCalendarOpen}
                inputRef={ref => {
                  ref?.setAttribute('tabindex', '0');
                }}
                dayPlaceholder="DD"
                monthPlaceholder="MM"
                yearPlaceholder="YYYY"
                showLeadingZeros
                minDetail="month"
                locale="en-US"
                prevLabel={<Icon.ChevronLeft />}
                nextLabel={<Icon.ChevronRight />}
                prev2Label={null}
                next2Label={null}
                minDate={minDate}
                maxDate={maxDate}
                value={value}
                onChange={v => handleDateChange(v as Date)}
                onCalendarOpen={() => setIsCalendarOpen(true)}
                onCalendarClose={() => setIsCalendarOpen(false)}
              />
            </DateContentContainer>
          </DateContainer>

          <TimeContainer error={error}>
            <TimeContentContainer>
              <ReactTimePicker
                clearIcon={null}
                clockIcon={null}
                hourPlaceholder="00"
                minutePlaceholder="00"
                value={value}
                onChange={handleTimeChange}
                onBlur={handleTimePickerBlur}
              />

              <Select
                resetStyles
                sameWidth={false}
                placement="bottom"
                popoverProps={{ portal: true, gutter: 14 }}
                render={
                  <AmPmButton>
                    {amOrPm}
                    <span>
                      <Icon.ChevronDown />
                    </span>
                  </AmPmButton>
                }
                value={amOrPm}
                onChange={v => handleAmPmChange(v as string)}
              >
                <Select.Item value="AM" />
                <Select.Item value="PM" />
              </Select>
            </TimeContentContainer>
          </TimeContainer>
        </Container>

        {showClearButton && (
          <Button variant="tertiary" size={size} onClick={handleClearDate}>
            Clear
          </Button>
        )}
      </Wrapper>
    );
  }
);

DateTimePicker.displayName = 'DateTimePicker';
