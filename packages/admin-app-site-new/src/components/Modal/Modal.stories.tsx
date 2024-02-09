import type { Meta, StoryObj } from '@storybook/react';

import { css } from '@/styled-system/css';

import { Button } from '../Button';

import { Modal } from './Modal';

const meta = {
  title: 'Overlay/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: {
    controls: {
      include: ['size'],
    },
  },
} satisfies Meta<typeof Modal>;

type Story = StoryObj<typeof Modal>;

export default meta;

export const Default: Story = {
  args: {
    trigger: <Button>Click me!</Button>,
  },
  render: function Default(args) {
    return (
      <Modal {...args}>
        <Modal.Heading>Modal Heading</Modal.Heading>
        <Modal.Description>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Provident,
          voluptate.
        </Modal.Description>

        <Modal.Dismiss className={css({ ml: 'auto', mt: 3 })}>
          Close
        </Modal.Dismiss>
      </Modal>
    );
  },
};
