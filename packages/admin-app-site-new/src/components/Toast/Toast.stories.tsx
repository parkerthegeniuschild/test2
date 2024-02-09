import type { Meta, StoryObj } from '@storybook/react';

import { Flex } from '@/styled-system/jsx';

import { Button } from '../Button';

import { toast, Toaster } from './Toast';

const meta = {
  title: 'Overlay/Toast',
  component: Toaster,
  tags: ['autodocs'],
  parameters: {
    controls: {
      include: [],
    },
  },
} satisfies Meta<typeof Toaster>;

type Story = StoryObj<typeof Toaster>;

export default meta;

export const Default: Story = {
  render: function Default(args) {
    return (
      <>
        <Flex gap={4}>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => toast('Lorem Ipsum')}
          >
            Regular
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => toast.success('Lorem Ipsum')}
          >
            Success
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => toast.warning('Lorem Ipsum')}
          >
            Warning
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => toast.error('Lorem Ipsum')}
          >
            Error
          </Button>
        </Flex>

        <Toaster {...args} />
      </>
    );
  },
};
