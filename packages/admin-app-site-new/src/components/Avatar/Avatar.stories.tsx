import type { Meta, StoryObj } from '@storybook/react';

import { Avatar } from './Avatar';

const meta = {
  title: 'Data Display/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: {
    controls: {
      include: ['src', 'name', 'size', 'status'],
    },
  },
  argTypes: {
    size: {
      options: ['2xs', 'xs', 'sm', 'md', 'lg'],
      control: { type: 'inline-radio' },
    },
  },
} satisfies Meta<typeof Avatar>;

type Story = StoryObj<typeof Avatar>;

export default meta;

export const Default: Story = {
  args: {
    src: 'https://i.pravatar.cc/300?u=truckup',
    name: 'John Doe',
    size: 'md',
  },
};

export const Dark: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
  args: {
    src: 'https://i.pravatar.cc/300?u=truckup',
    name: 'John Doe',
    theme: 'dark',
    size: 'md',
  },
};

export const Initials: Story = {
  parameters: {
    controls: {
      include: ['src', 'name', 'size', 'theme', 'userRole', 'status'],
    },
  },
  argTypes: {
    status: {
      options: ['online', 'offline', 'unapproved', 'onJob'],
      control: { type: 'inline-radio' },
    },
  },
  args: {
    name: 'John Doe',
    size: 'md',
    theme: 'light',
  },
};
