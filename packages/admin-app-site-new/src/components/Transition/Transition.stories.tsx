import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Box } from '@/styled-system/jsx';

import { Button } from '../Button';

import { Transition } from './Transition';

const meta = {
  title: 'Data Display/Transition',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: {
      include: ['placement'],
    },
  },
} satisfies Meta<typeof Transition.Collapse>;

type Story = StoryObj<typeof Transition.Collapse>;

export default meta;

export const Collapse: Story = {
  args: {
    placement: 'bottom',
  },
  render: function Collapse(args) {
    const [open, setOpen] = useState(false);

    return (
      <div
        style={{
          width: 300,
          display: 'flex',
          flexDirection: 'column',
          margin: '0 auto',
        }}
      >
        <Transition.Collapse
          {...args}
          open={open}
          onOpenChange={setOpen}
          trigger={<Button>{open ? 'Hide' : 'Show'} content</Button>}
        >
          <Box py={2}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero
            incidunt pariatur odit corrupti accusamus illum rerum praesentium
            est dignissimos tempore, cum ullam vitae quaerat recusandae
            voluptate, non enim obcaecati veniam.
          </Box>
        </Transition.Collapse>
      </div>
    );
  },
};

export const Fade: Story = {
  args: {
    placement: 'bottom',
  },
  render: function Fade(args) {
    const [open, setOpen] = useState(false);

    return (
      <div
        style={{
          width: 300,
          display: 'flex',
          flexDirection: 'column',
          margin: '0 auto',
        }}
      >
        <Transition.Fade
          {...args}
          open={open}
          onOpenChange={setOpen}
          trigger={<Button>{open ? 'Hide' : 'Show'} content</Button>}
        >
          <Box py={2}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero
            incidunt pariatur odit corrupti accusamus illum rerum praesentium
            est dignissimos tempore, cum ullam vitae quaerat recusandae
            voluptate, non enim obcaecati veniam.
          </Box>
        </Transition.Fade>
      </div>
    );
  },
};
