import type { Meta, StoryObj } from '@storybook/react';

import { Spinner } from './Spinner';

const meta = {
  title: 'Feedback/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  parameters: {
    controls: {
      include: ['borderColor'],
    },
  },
  argTypes: {
    borderColor: {
      control: {
        type: 'color',
      },
    },
  },
} satisfies Meta<typeof Spinner>;

type Story = StoryObj<typeof Spinner>;

export default meta;

export const Default: Story = {};

Default.render = args => (
  <Spinner {...args} style={{ borderColor: args.borderColor?.toString() }} />
);
