import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Flex } from '@/styled-system/jsx';

import { Button } from '../Button';
import { Text } from '../Text';

import { Drawer } from './Drawer';

const meta = {
  title: 'Overlay/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  parameters: {
    controls: {
      include: ['size'],
    },
  },
  argTypes: {
    size: {
      options: ['sm', 'md', 'lg'],
      control: { type: 'inline-radio' },
    },
  },
} satisfies Meta<typeof Drawer>;

type Story = StoryObj<typeof Drawer>;

export default meta;

export const Default: Story = {
  args: { size: 'md' },
  render: function Default(args) {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open</Button>

        <Drawer {...args} open={isOpen} onClose={() => setIsOpen(false)}>
          <Flex
            justify="space-between"
            align="center"
            p={5}
            borderBottomWidth="1px"
            borderColor="gray.100"
          >
            <Drawer.Heading>Drawer Heading</Drawer.Heading>

            <Drawer.Dismiss />
          </Flex>

          <Text p={5}>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Pariatur
            autem facilis est, nostrum quis quasi eum debitis eaque sit natus,
            dolore ipsa sint aliquid. Velit temporibus saepe quos exercitationem
            earum voluptate tenetur labore non doloribus animi, provident
            pariatur sunt suscipit, dolor sit dignissimos quisquam accusantium
            esse laboriosam porro maiores in.
            <br />
            <br />
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Incidunt
            illo eius aliquam quam sunt ratione quae! Libero, debitis sapiente?
            Ab modi id blanditiis consequatur cupiditate laborum adipisci,
            tempora laudantium ipsa nobis tempore atque exercitationem aliquam
            ipsam fuga placeat! Impedit excepturi nam fuga saepe odio nesciunt
            quaerat laborum enim libero facilis.
          </Text>
        </Drawer>
      </>
    );
  },
};
