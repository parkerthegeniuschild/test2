import type { Meta, StoryObj } from '@storybook/react';

import { Avatar } from '../Avatar';

import { UserCard } from './UserCard';

const meta = {
  title: 'Overlay/UserCard',
  component: UserCard,
  tags: ['autodocs'],
  parameters: {
    controls: {
      include: [],
    },
  },
} satisfies Meta<typeof UserCard>;

type Story = StoryObj<typeof UserCard>;

export default meta;

export const Dispatcher: Story = {
  render: function Dispatcher(args) {
    return (
      <UserCard
        {...args}
        trigger={<Avatar name="David Curtis" size="lg" userRole="dispatcher" />}
      >
        <UserCard.Header>
          <UserCard.Name>David Curtis</UserCard.Name>
          <UserCard.Role userRole="dispatcher" />
        </UserCard.Header>

        <UserCard.Item>
          <UserCard.Phone>(816) 324-3200</UserCard.Phone>
          <UserCard.Phone disableSMS>(201) 651-1111 Ext 1111</UserCard.Phone>
        </UserCard.Item>
      </UserCard>
    );
  },
};

export const Driver: Story = {
  render: function Driver(args) {
    return (
      <UserCard
        {...args}
        trigger={<Avatar name="Calaway Mark" size="lg" userRole="driver" />}
      >
        <UserCard.Header>
          <UserCard.Name>Calaway Mark</UserCard.Name>
          <UserCard.Role userRole="driver" />
        </UserCard.Header>

        <UserCard.Item>
          <UserCard.Phone>(816) 324-3200</UserCard.Phone>
          <UserCard.Phone disableSMS>(201) 651-1111 Ext 1111</UserCard.Phone>
        </UserCard.Item>
      </UserCard>
    );
  },
};

export const DriverDispatcher: Story = {
  name: 'Driver + Dispatcher',
  render: function DriverDispatcher(args) {
    return (
      <UserCard
        {...args}
        trigger={<Avatar name="David Curtis" size="lg" userRole="driver" />}
      >
        <UserCard.Header>
          <UserCard.Name>David Curtis</UserCard.Name>
          <UserCard.Role userRole={['driver', 'dispatcher']} />
        </UserCard.Header>

        <UserCard.Item>
          <UserCard.Phone>(816) 324-3200</UserCard.Phone>
          <UserCard.Phone disableSMS>(201) 651-1111 Ext 202020</UserCard.Phone>
        </UserCard.Item>
      </UserCard>
    );
  },
};

export const Provider = {
  parameters: {
    controls: {
      include: [
        'status',
        'missingPermissions',
        'starRating',
        'onTimeArrival',
        'acceptRate',
      ],
    },
  },
  argTypes: {
    status: {
      options: ['online', 'onJob', 'offline', 'unapproved'],
      control: { type: 'inline-radio' },
    },
    missingPermissions: {
      control: { type: 'boolean' },
    },
    starRating: {
      control: { type: 'range', min: 0, max: 5, step: 0.1 },
    },
    onTimeArrival: {
      control: { type: 'range', min: 0, max: 100 },
    },
    acceptRate: {
      control: { type: 'range', min: 0, max: 100 },
    },
  },
  args: {
    status: 'online',
    missingPermissions: false,
    starRating: 4.5,
    onTimeArrival: 90,
    acceptRate: 90,
  },
  render: function Provider({
    status,
    missingPermissions,
    starRating,
    onTimeArrival,
    acceptRate,
    ...args
  }: {
    status: 'online' | 'onJob' | 'offline';
    missingPermissions: boolean;
    starRating: number;
    onTimeArrival: number;
    acceptRate: number;
  }) {
    return (
      <UserCard
        {...args}
        size="lg"
        trigger={<Avatar name="Justin Smalley" size="lg" />}
      >
        <UserCard.Header>
          <UserCard.Name>Justin Smalley</UserCard.Name>
          <UserCard.Role userRole="provider" />
          {!!missingPermissions && <UserCard.PermissionsAlert />}

          <UserCard.Stats
            stats={{
              starRating: {
                value: starRating.toFixed(1),
                poor: starRating < 4.5,
              },
              acceptRate: { value: `${acceptRate}%`, poor: acceptRate < 80 },
              onTimeArrival: {
                value: `${onTimeArrival}%`,
                poor: onTimeArrival < 80,
              },
            }}
          />
        </UserCard.Header>

        <UserCard.Item>
          <UserCard.Status status={status} />
        </UserCard.Item>

        <UserCard.Item>
          <UserCard.Phone withSMS={false}>(816) 324-3200</UserCard.Phone>
        </UserCard.Item>
      </UserCard>
    );
  },
};
