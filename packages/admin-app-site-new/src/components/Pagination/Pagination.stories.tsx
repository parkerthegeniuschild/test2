import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Pagination } from './Pagination';

const meta = {
  title: 'Navigation/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  parameters: {
    controls: {
      include: ['totalPages'],
    },
  },
} satisfies Meta<typeof Pagination>;

type Story = StoryObj<typeof Pagination>;

export default meta;

export const Default: Story = {
  args: {
    totalPages: 100,
  },
  render: function Default(args) {
    const [currentPage, setCurrentPage] = useState(1);

    return (
      <Pagination
        {...args}
        currentPage={currentPage}
        onChange={value => setCurrentPage(value)}
      />
    );
  },
};
