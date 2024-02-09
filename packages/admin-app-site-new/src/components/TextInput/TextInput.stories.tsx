import type { ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { TextInput } from './TextInput';

const meta = {
  title: 'Form/TextInput',
  component: TextInput,
  tags: ['autodocs'],
  parameters: {
    controls: {
      include: [
        'error',
        'leftSlot',
        'rightSlot',
        'size',
        'clearable',
        'disabled',
      ],
    },
  },
  argTypes: {
    leftSlot: {
      options: ['No icon', 'CircleIcon', 'SquareIcon'],
      control: { type: 'select' },
    },
    rightSlot: {
      options: ['No icon', 'CircleIcon', 'SquareIcon'],
      control: { type: 'select' },
    },
  },
} satisfies Meta<typeof TextInput>;

export default meta;

const iconsObject = {
  'No icon': undefined,
  CircleIcon: (
    <div
      style={{
        borderRadius: '50%',
        height: '1rem',
        width: '1rem',
        backgroundColor: 'grey',
        opacity: 0.8,
      }}
    />
  ),
  SquareIcon: (
    <div
      style={{
        height: '1rem',
        width: '1rem',
        backgroundColor: 'grey',
        opacity: 0.8,
      }}
    />
  ),
} as const;

type IconsObjectKeys = keyof typeof iconsObject;

type Story = StoryObj<typeof TextInput>;

export const Default: Story = {
  args: {
    placeholder: 'Placeholder',
    error: false,
    leftSlot: undefined,
    rightSlot: undefined,
    size: 'md',
    disabled: false,
  },
};

Default.render = ({
  leftSlot,
  rightSlot,
  ...args
}: ComponentProps<typeof TextInput>) => (
  <TextInput
    leftSlot={iconsObject[leftSlot as IconsObjectKeys]}
    rightSlot={iconsObject[rightSlot as IconsObjectKeys]}
    {...args}
  />
);
