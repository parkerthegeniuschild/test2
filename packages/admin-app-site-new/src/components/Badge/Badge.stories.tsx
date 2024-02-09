import type { Meta, StoryObj } from '@storybook/react';

import { Badge } from './Badge';

const meta = {
  title: 'Data Display/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    controls: {
      include: ['children', 'size', 'variant', 'duotone', 'content'],
    },
  },
} satisfies Meta<typeof Badge>;

type Story = StoryObj<typeof Badge>;

export default meta;

export const Default: Story = {
  args: {
    children: 'Badge',
    size: 'md',
    variant: 'neutral',
    duotone: false,
    content: 'text',
  },
};
