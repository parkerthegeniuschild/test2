import type { Meta, StoryObj } from '@storybook/react';

import { css } from '@/styled-system/css';

import { Select } from './Select';

const meta = {
  title: 'Form/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    controls: {
      include: ['size', 'label', 'error', 'disabled'],
    },
  },
  argTypes: {
    label: {
      control: { type: 'text' },
    },
    size: {
      options: ['xs', 'sm', 'md'],
      control: { type: 'inline-radio' },
    },
  },
} satisfies Meta<typeof Select>;

type Story = StoryObj<typeof Select>;

export default meta;

export const Default: Story = {
  args: {
    label: 'Favorite fruit',
    size: 'md',
    error: false,
    disabled: false,
  },
  render: function Default(args) {
    return (
      <Select {...args} className={css({ minWidth: 164 })}>
        <Select.Heading>Select a fruit</Select.Heading>
        <Select.Item value="Apple" />
        <Select.Item value="Banana" />
        <Select.Item value="Grape" />
        <Select.Item value="Orange" />
      </Select>
    );
  },
};

export const Grouped: Story = {
  args: {
    label: 'Payment options',
    size: 'md',
    error: false,
    disabled: false,
  },
  render: function Grouped(args) {
    return (
      <Select {...args} className={css({ minWidth: 164 })}>
        <Select.Group>
          <Select.GroupLabel>Standard Payments</Select.GroupLabel>
          <Select.Item value="Cash" />
          <Select.Item value="Check" />
          <Select.Item value="Credit Card" />
        </Select.Group>
        <Select.Separator />
        <Select.Group>
          <Select.GroupLabel>Mobile Apps</Select.GroupLabel>
          <Select.Item value="Zelle" />
          <Select.Item value="Cash App" />
        </Select.Group>
        <Select.Group>
          <Select.GroupLabel>Fleet Checks</Select.GroupLabel>
          <Select.Item value="T-Chek" />
          <Select.Item value="Comchek" />
          <Select.Item value="EFS Check" />
        </Select.Group>
      </Select>
    );
  },
};
