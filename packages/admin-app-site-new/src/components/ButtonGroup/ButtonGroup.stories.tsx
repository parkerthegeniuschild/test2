import type { Meta, StoryObj } from '@storybook/react';

import { css } from '@/styled-system/css';

import { IconButton } from '../IconButton';
import { Icon } from '../icons';

import { ButtonGroup } from './ButtonGroup';

const meta = {
  title: 'Form/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs'],
  parameters: {
    controls: {
      include: [],
    },
  },
} satisfies Meta<typeof ButtonGroup>;

type Story = StoryObj<typeof ButtonGroup>;

export default meta;

export const Default: Story = {
  args: {},
  render: function Default(args) {
    return (
      <ButtonGroup {...args}>
        <IconButton>
          <Icon.Edit />
        </IconButton>
        <IconButton>
          <Icon.Trash className={css({ color: 'danger' })} />
        </IconButton>
      </ButtonGroup>
    );
  },
};
