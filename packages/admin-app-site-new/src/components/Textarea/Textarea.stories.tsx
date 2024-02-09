import type { Meta, StoryObj } from '@storybook/react';

import { Textarea } from './Textarea';

const meta = {
  title: 'Form/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  parameters: {
    controls: {
      include: ['error'],
    },
  },
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    placeholder: 'This is the textarea placeholder',
    rows: 4,
    error: false,
  },
  decorators: [
    Story => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
};
