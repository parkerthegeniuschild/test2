import type { Meta, StoryObj } from '@storybook/react';

import { FilterButton } from './FilterButton';

const meta = {
  title: 'Form/FilterButton',
  component: FilterButton,
  tags: ['autodocs'],
  parameters: {
    controls: {
      include: ['children', 'activeText'],
    },
  },
} satisfies Meta<typeof FilterButton>;

type Story = StoryObj<typeof FilterButton>;

export default meta;

export const Default: Story = {
  args: {
    children: 'Cash Balance',
    activeText: '',
  },
};
