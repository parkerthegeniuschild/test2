import type { Meta, StoryObj } from '@storybook/react';

import { NumberInput } from './NumberInput';

const meta = {
  title: 'Form/NumberInput',
  component: NumberInput,
  tags: ['autodocs'],
  parameters: {
    controls: {
      include: ['error', 'min', 'disabled'],
    },
  },
} satisfies Meta<typeof NumberInput>;

type Story = StoryObj<typeof NumberInput>;

export default meta;

export const Default: Story = {
  args: {
    placeholder: '0',
    error: false,
    disabled: false,
  },
};
