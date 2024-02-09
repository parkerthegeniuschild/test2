import type { Meta, StoryObj } from '@storybook/react';

import { Heading } from './Heading';

const meta = {
  title: 'Typography/Heading',
  component: Heading,
  tags: ['autodocs'],
  parameters: {
    controls: {
      include: ['children', 'variant'],
    },
  },
} satisfies Meta<typeof Heading>;

type Story = StoryObj<typeof Heading>;

export default meta;

export const Default: Story = {
  args: {
    children: 'Lorem Ipsum',
    variant: 'heading',
  },
};
