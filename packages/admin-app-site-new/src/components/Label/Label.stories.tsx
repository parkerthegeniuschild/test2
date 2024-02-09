import type { Meta, StoryObj } from '@storybook/react';

import { Label } from './Label';

const meta = {
  title: 'Form/Label',
  component: Label,
  tags: ['autodocs'],
  parameters: {
    controls: {
      include: ['children', 'required'],
    },
  },
} satisfies Meta<typeof Label>;

type Story = StoryObj<typeof Label>;

export default meta;

export const Default: Story = {
  args: {
    children: 'Lorem Ipsum',
    required: false,
  },
};
