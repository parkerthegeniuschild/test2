import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';
import { Icon } from '../icons';

import { Dropdown } from './Dropdown';

const meta = {
  title: 'Overlay/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  parameters: {
    controls: {
      include: ['shadow', 'borderless'],
    },
  },
} satisfies Meta<typeof Dropdown>;

type Story = StoryObj<typeof Dropdown>;

export default meta;

export const Default: Story = {
  args: {
    trigger: <Button>Click me!</Button>,
    children: (
      <>
        <Dropdown.Item>Lorem</Dropdown.Item>
        <Dropdown.Item>Ipsum</Dropdown.Item>
        <Dropdown.Separator />
        <Dropdown.Item>Dolor</Dropdown.Item>
      </>
    ),
    shadow: 'md',
    borderless: false,
  },
};

export const WithCheckbox: Story = {
  args: {},
  parameters: {
    controls: {
      hideNoControlsWarning: true,
      include: [],
    },
  },
  render: function WithCheckbox(args) {
    const [values, setValues] = useState({
      columns: ['name', 'phone_number', 'jobs'],
    });

    return (
      <Dropdown
        {...args}
        placement="bottom-end"
        trigger={
          <Button variant="secondary" size="sm" leftSlot={<Icon.Columns />}>
            Columns
          </Button>
        }
        values={values}
        onValuesChange={(v: typeof values) => setValues(v)}
      >
        <Dropdown.Heading>Show columns</Dropdown.Heading>

        <Dropdown.ItemCheckbox name="columns" value="name">
          Name
        </Dropdown.ItemCheckbox>
        <Dropdown.ItemCheckbox name="columns" value="phone_number" disabled>
          Phone Number
        </Dropdown.ItemCheckbox>
        <Dropdown.ItemCheckbox name="columns" value="jobs">
          Jobs
        </Dropdown.ItemCheckbox>
      </Dropdown>
    );
  },
};
