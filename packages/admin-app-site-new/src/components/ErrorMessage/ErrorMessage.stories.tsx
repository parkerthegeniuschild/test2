import type { Meta, StoryObj } from '@storybook/react';

import { ErrorMessage } from './ErrorMessage';

const meta = {
  title: 'Typography/ErrorMessage',
  component: ErrorMessage,
  tags: ['autodocs'],
  parameters: {
    controls: {
      include: ['children', 'showIcon'],
    },
  },
} satisfies Meta<typeof ErrorMessage>;

type Story = StoryObj<typeof ErrorMessage>;

export default meta;

export const Default: Story = {
  args: {
    children: 'This is an error message',
    showIcon: true,
  },
};
