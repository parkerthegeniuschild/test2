import type { Meta, StoryObj } from '@storybook/react';

import { PasswordInput } from './PasswordInput';

const meta = {
  title: 'Form/PasswordInput',
  component: PasswordInput,
  tags: ['autodocs'],
  parameters: {
    controls: {
      include: ['error', 'size'],
    },
  },
} satisfies Meta<typeof PasswordInput>;

type Story = StoryObj<typeof PasswordInput>;

export default meta;

export const Default: Story = {
  args: {
    error: false,
    size: 'md',
    placeholder: 'Enter your password',
  },
};
