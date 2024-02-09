import type { Meta, StoryObj } from '@storybook/react';

import { Avatar } from '../Avatar';

import { AvatarGroup } from './AvatarGroup';

const meta = {
  title: 'Data Display/AvatarGroup',
  component: AvatarGroup,
  tags: ['autodocs'],
  parameters: {
    controls: {
      include: ['max', 'size'],
    },
    backgrounds: { default: 'white' },
  },
  argTypes: {
    max: {
      control: {
        type: 'number',
        min: 1,
      },
    },
  },
} satisfies Meta<typeof AvatarGroup>;

type Story = StoryObj<typeof AvatarGroup>;

export default meta;

export const Default: Story = {
  args: {
    max: 3,
  },
  render: function Default(args) {
    return (
      <AvatarGroup {...args}>
        <Avatar name="Daryl Coss" />
        <Avatar name="Nary Doe" />
        <Avatar name="Castell Morr" />
        <Avatar name="Kurt Doe" />
        <Avatar name="Bob Doe" />
      </AvatarGroup>
    );
  },
};
