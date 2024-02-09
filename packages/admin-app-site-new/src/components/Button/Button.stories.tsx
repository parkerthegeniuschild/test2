import type { Meta, StoryObj } from '@storybook/react';

import { Button } from './Button';

const meta = {
  title: 'Form/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    controls: {
      include: [
        'children',
        'variant',
        'size',
        'leftSlot',
        'rightSlot',
        'loading',
        'full',
        'disabled',
        'danger',
      ],
    },
  },
  decorators: [
    Story => (
      <div style={{ width: 300, display: 'grid', placeItems: 'center' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    full: {
      description:
        'If true, the button will take up the full width of its container.',
    },
    size: {
      options: ['xs', 'sm', 'md'],
      control: { type: 'inline-radio' },
    },
    variant: {
      options: ['primary', 'secondary', 'tertiary', 'quaternary'],
      control: { type: 'inline-radio' },
    },
    leftSlot: {
      options: ['No icon', 'CircleIcon'],
      control: { type: 'select' },
    },
    rightSlot: {
      options: ['No icon', 'CircleIcon'],
      control: { type: 'select' },
    },
  },
} satisfies Meta<typeof Button>;

type Story = StoryObj<typeof Button>;

export default meta;

function CircleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      fill="none"
      viewBox="0 0 16 16"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M8 14.667A6.667 6.667 0 108 1.333a6.667 6.667 0 000 13.334z"
      />
    </svg>
  );
}

export const Default: Story = {
  args: {
    children: 'Lorem Ipsum',
    size: 'md',
    variant: 'primary',
    loading: false,
    full: false,
    disabled: false,
    danger: false,
  },
  render: ({ leftSlot, rightSlot, ...args }) => (
    <Button
      {...args}
      leftSlot={leftSlot === 'CircleIcon' ? <CircleIcon /> : undefined}
      rightSlot={rightSlot === 'CircleIcon' ? <CircleIcon /> : undefined}
    />
  ),
};
