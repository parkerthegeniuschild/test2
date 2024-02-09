import type { Meta, StoryObj } from '@storybook/react';

import { Text } from './Text';

const meta = {
  title: 'Typography/Text',
  component: Text,
  tags: ['autodocs'],
  parameters: {
    controls: {
      include: ['children', 'size'],
    },
  },
  decorators: [Story => <div style={{ maxWidth: '800px' }}>{Story()}</div>],
} satisfies Meta<typeof Text>;

type Story = StoryObj<typeof Text>;

export default meta;

export const Default: Story = {
  args: {
    children:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque, voluptas facere! Provident accusamus hic repellendus, pariatur ipsum impedit non assumenda repudiandae numquam velit harum. Aspernatur mollitia voluptatem officiis illo aliquam.',
    size: 'md',
  },
};
