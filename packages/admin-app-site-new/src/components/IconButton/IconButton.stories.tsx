import type { Meta, StoryObj } from '@storybook/react';

import { IconButton } from './IconButton';

const meta = {
  title: 'Form/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  parameters: {
    controls: {
      include: ['size', 'variant', 'disabled', 'loading'],
    },
  },
  argTypes: {
    size: {
      options: ['xs', 'sm', 'md'],
      control: { type: 'inline-radio' },
    },
  },
} satisfies Meta<typeof IconButton>;

type Story = StoryObj<typeof IconButton>;

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
    children: <CircleIcon />,
    size: 'md',
    variant: 'primary',
    disabled: false,
    loading: false,
  },
};
