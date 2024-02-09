import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { css } from '@/styled-system/css';

import { Icon } from '../icons';

import { Sidebar } from './Sidebar';

const meta = {
  title: 'Navigation/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  parameters: {
    controls: {
      include: ['open'],
    },
  },
  decorators: [
    Story => (
      <div style={{ height: '600px' }}>
        <style>
          {`#storybook-root {
              margin: unset !important;
              padding: 0 !important;
            }`}
        </style>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Sidebar>;

type Story = StoryObj<typeof Sidebar>;

export default meta;

export const Default: Story = {
  args: {
    open: true,
  },
  render: function Component(args) {
    const [selectedItem, setSelectedItem] = useState('Map');
    const [open, setOpen] = useState(!!args.open);

    useEffect(() => {
      setOpen(!!args.open);
    }, [args.open]);

    function handleItemClick(item: string) {
      return () => setSelectedItem(item);
    }

    function handleHamburgerClick() {
      setOpen(state => !state);
    }

    return (
      <Sidebar {...args} open={open}>
        <Sidebar.Header onHamburgerClick={handleHamburgerClick}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/truckup_logo_dark.svg" alt="Truckup" />
        </Sidebar.Header>

        <Sidebar.Body>
          <Sidebar.Item
            leftSlot={<Icon.Map />}
            active={selectedItem === 'Map'}
            onClick={handleItemClick('Map')}
          >
            Map
          </Sidebar.Item>
          <Sidebar.Item
            leftSlot={<Icon.Tool />}
            active={selectedItem === 'Jobs'}
            onClick={handleItemClick('Jobs')}
          >
            Jobs
          </Sidebar.Item>
        </Sidebar.Body>

        <Sidebar.Footer>
          <Sidebar.Item leftSlot={<Icon.Settings />}>Settings</Sidebar.Item>

          <Sidebar.Profile
            avatarUrl="https://i.pravatar.cc/300?u=truckup"
            username="John Doe"
            userHandle="johndoe"
          >
            <Sidebar.Profile.Item>
              <Icon.Edit
                className={css({ color: 'gray.500', fontSize: 'md' })}
              />
              Edit profile
            </Sidebar.Profile.Item>
            <Sidebar.Profile.Item css={{ color: 'danger' }}>
              <Icon.Logout />
              Sign out
            </Sidebar.Profile.Item>
          </Sidebar.Profile>
        </Sidebar.Footer>
      </Sidebar>
    );
  },
};
