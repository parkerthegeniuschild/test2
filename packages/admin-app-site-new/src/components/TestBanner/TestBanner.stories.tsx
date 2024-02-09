import type { Meta, StoryObj } from '@storybook/react';

import { TestBanner } from './TestBanner';

const meta = {
  title: 'Feedback/TestBanner',
  component: TestBanner,
  tags: ['autodocs'],
  parameters: {
    controls: {
      include: ['children'],
    },
  },
  decorators: [
    Story => (
      <div style={{ width: 600, position: 'relative' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TestBanner>;

type Story = StoryObj<typeof TestBanner>;

export default meta;

export const Default: Story = {
  args: {
    children: 'Development',
    containerProps: {
      css: { position: 'absolute' },
    },
  },
};
