import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { DateTimePicker } from './DateTimePicker';

const meta = {
  title: 'Form/DateTimePicker',
  component: DateTimePicker,
  tags: ['autodocs'],
  parameters: {
    controls: {
      include: ['size'],
    },
  },
} satisfies Meta<typeof DateTimePicker>;

type Story = StoryObj<typeof DateTimePicker>;

export default meta;

export const Default: Story = {
  args: {
    size: 'md',
  },
  render: function Default(args) {
    const [value, setValue] = useState<Date | null>(new Date(2024, 0, 2));

    return <DateTimePicker {...args} value={value} onChange={setValue} />;
  },
};
