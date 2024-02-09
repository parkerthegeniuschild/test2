import type { Meta, StoryObj } from '@storybook/react';

import { TextButton } from './TextButton';

const meta = {
  title: 'Form/TextButton',
  component: TextButton,
  tags: ['autodocs'],
  parameters: {
    controls: {
      include: [
        'children',
        'size',
        'colorScheme',
        'leftSlot',
        'rightSlot',
        'disabled',
      ],
    },
  },
  argTypes: {
    leftSlot: {
      options: ['No icon', 'CircleIcon'],
      control: { type: 'select' },
    },
    rightSlot: {
      options: ['No icon', 'CircleIcon'],
      control: { type: 'select' },
    },
  },
} satisfies Meta<typeof TextButton>;

type Story = StoryObj<typeof TextButton>;

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
    children: 'Button',
    size: 'sm',
    colorScheme: 'primary',
    disabled: false,
  },
  render: function Default({ rightSlot, leftSlot, ...args }) {
    return (
      <TextButton
        {...args}
        leftSlot={leftSlot === 'CircleIcon' ? <CircleIcon /> : undefined}
        rightSlot={rightSlot === 'CircleIcon' ? <CircleIcon /> : undefined}
      />
    );
  },
};
