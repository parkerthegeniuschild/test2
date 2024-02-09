import type { Meta, StoryObj } from '@storybook/react';

import { Icon } from '../icons';

import { Tooltip } from './Tooltip';

const meta = {
  title: 'Overlay/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    controls: {
      include: ['description', 'placement'],
    },
  },
  argTypes: {
    description: { control: { type: 'text' } },
  },
} satisfies Meta<typeof Tooltip>;

type Story = StoryObj<typeof Tooltip>;

export default meta;

export const Default: Story = {
  args: {
    description: 'What an awesome tooltip!',
    placement: 'top',
    render: (
      // eslint-disable-next-line jsx-a11y/control-has-associated-label
      <button
        type="button"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: '#3d444d',
          cursor: 'help',
        }}
      />
    ),
    children: (
      <>
        Hover me <Icon.HelpCircle style={{ fontSize: '16px' }} />
      </>
    ),
  },
};
