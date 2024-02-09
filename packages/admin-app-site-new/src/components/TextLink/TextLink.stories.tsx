import type { Meta, StoryObj } from '@storybook/react';

import { TextLink } from './TextLink';

const meta = {
  title: 'Typography/TextLink',
  component: TextLink,
  tags: ['autodocs'],
  parameters: {
    controls: {
      include: ['children'],
    },
  },
} satisfies Meta<typeof TextLink>;

type Story = StoryObj<typeof TextLink>;

export default meta;

export const Default: Story = {
  args: {
    children: 'Lorem Ipsum',
    href: '#!',
  },
};
