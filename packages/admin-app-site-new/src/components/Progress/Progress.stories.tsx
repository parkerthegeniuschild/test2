import type { Meta, StoryObj } from '@storybook/react';

import { Progress } from './Progress';

const meta = {
  title: 'Feedback/Progress',
  component: Progress,
  tags: ['autodocs'],
  parameters: {
    controls: {
      include: ['value'],
    },
  },
  argTypes: {
    value: {
      control: {
        type: 'range',
        min: 0,
        max: 100,
      },
    },
  },
} satisfies Meta<typeof Progress>;

type Story = StoryObj<typeof Progress>;

export default meta;

export const Default: Story = {
  decorators: [
    Story => (
      <div style={{ width: '600px' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    value: 50,
  },
};
