import type { Meta, StoryObj } from '@storybook/react';

import { Badge } from '../Badge';

import { Tabs } from './Tabs';

const meta = {
  title: 'Navigation/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: {
    controls: {
      hideNoControlsWarning: true,
      include: [],
    },
  },
} satisfies Meta<typeof Tabs>;

type Story = StoryObj<typeof Tabs>;

export default meta;

export const Default: Story = {
  args: {},
  render: function Default(args) {
    return (
      <Tabs {...args}>
        <Tabs.List style={{ marginBottom: '1rem' }}>
          <Tabs.Tab>Lorem</Tabs.Tab>
          <Tabs.Tab>Ipsum</Tabs.Tab>
          <Tabs.Tab>Dolor</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel>
          <p>Lorem content</p>
        </Tabs.Panel>

        <Tabs.Panel>
          <p>Ipsum content</p>
        </Tabs.Panel>

        <Tabs.Panel>
          <p>Dolor content</p>
        </Tabs.Panel>
      </Tabs>
    );
  },
};

export const WithBadges: Story = {
  args: {},
  render: function WithBadges(args) {
    return (
      <Tabs {...args}>
        <Tabs.List>
          <Tabs.Tab>
            Approved
            <Badge variant="primary" size="sm">
              75
            </Badge>
          </Tabs.Tab>
          <Tabs.Tab>
            Unapproved
            <Badge duotone size="sm">
              49
            </Badge>
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>
    );
  },
};
