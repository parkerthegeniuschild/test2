import type { Meta, StoryObj } from '@storybook/react';

import { Alert } from './Alert';

const meta = {
  title: 'Feedback/Alert',
  component: Alert,
  tags: ['autodocs'],
  parameters: {
    controls: {
      include: ['title', 'description', 'variant'],
    },
  },
  decorators: [
    Story => (
      <div style={{ width: 400 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Alert>;

type Story = StoryObj<typeof Alert>;

export default meta;

export const Default: Story = {
  args: {
    variant: 'warning',
    title: 'Insufficient funds',
    description:
      "We're sorry, but your payment cannot be processed due to insufficient funds in the account. Please check the account balance or use another payment method.",
  },
};
