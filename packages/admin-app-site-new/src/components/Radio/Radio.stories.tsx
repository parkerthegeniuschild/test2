import type { Meta, StoryObj } from '@storybook/react';

import { Stack } from '@/styled-system/jsx';

import { Radio } from './Radio';

const meta = {
  title: 'Form/Radio',
  component: Radio,
  tags: ['autodocs'],
  parameters: {
    controls: {
      hideNoControlsWarning: true,
      include: [],
    },
  },
} satisfies Meta<typeof Radio>;

type Story = StoryObj<typeof Radio>;

export default meta;

export const Default: Story = {
  args: {},
  render: function Default(args) {
    return (
      <Radio.Group defaultValue="1">
        <Stack gap={4}>
          <Radio {...args} value="1">
            First
          </Radio>
          <Radio {...args} value="2">
            Second
          </Radio>
          <Radio {...args} value="3">
            Third
          </Radio>
        </Stack>
      </Radio.Group>
    );
  },
};
