import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Table } from './Table';

const meta = {
  title: 'Data Display/Table',
  component: Table,
  tags: ['autodocs'],
  parameters: {
    controls: {
      hideNoControlsWarning: true,
      include: [],
    },
  },
} satisfies Meta<typeof Table>;

type Story = StoryObj<typeof Table>;

export default meta;

const invoices = [
  {
    invoice: 'INV001',
    paymentStatus: 'Paid',
    totalAmount: '$250.00',
    paymentMethod: 'Credit Card',
  },
  {
    invoice: 'INV002',
    paymentStatus: 'Pending',
    totalAmount: '$150.00',
    paymentMethod: 'PayPal',
  },
  {
    invoice: 'INV003',
    paymentStatus: 'Unpaid',
    totalAmount: '$350.00',
    paymentMethod: 'Bank Transfer',
  },
  {
    invoice: 'INV004',
    paymentStatus: 'Paid',
    totalAmount: '$450.00',
    paymentMethod: 'Credit Card',
  },
  {
    invoice: 'INV005',
    paymentStatus: 'Paid',
    totalAmount: '$550.00',
    paymentMethod: 'PayPal',
  },
  {
    invoice: 'INV006',
    paymentStatus: 'Pending',
    totalAmount: '$200.00',
    paymentMethod: 'Bank Transfer',
  },
  {
    invoice: 'INV007',
    paymentStatus: 'Unpaid',
    totalAmount: '$300.00',
    paymentMethod: 'Credit Card',
  },
];

export const Default: Story = {
  render: function Default(args) {
    return (
      <Table {...args}>
        <Table.Header>
          <Table.Row>
            <Table.Head>Invoice</Table.Head>
            <Table.Head>Status</Table.Head>
            <Table.Head>Method</Table.Head>
            <Table.Head>Amount</Table.Head>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {invoices.map(invoice => (
            <Table.Row key={invoice.invoice}>
              <Table.Cell>{invoice.invoice}</Table.Cell>
              <Table.Cell>{invoice.paymentStatus}</Table.Cell>
              <Table.Cell>{invoice.paymentMethod}</Table.Cell>
              <Table.Cell>{invoice.totalAmount}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  },
};

type OrderModel = Record<string, 'asc' | 'desc' | undefined>;

export const Sortable: Story = {
  args: {},
  render: function Sortable(args) {
    const [order, setOrder] = useState<OrderModel>({});

    function handleOrderChange(field: string) {
      return (newOrder: 'asc' | 'desc') => {
        setOrder(state => ({
          ...state,
          [field]: newOrder === state[field] ? undefined : newOrder,
        }));
      };
    }

    return (
      <Table {...args}>
        <Table.Header>
          <Table.Row>
            <Table.Head
              sortOrder={order.invoice}
              onSort={handleOrderChange('invoice')}
              onClearSort={() =>
                setOrder(state => ({ ...state, invoice: undefined }))
              }
            >
              Invoice
            </Table.Head>
            <Table.Head
              sortOrder={order.status}
              onSort={handleOrderChange('status')}
              onClearSort={() =>
                setOrder(state => ({ ...state, status: undefined }))
              }
            >
              Status
            </Table.Head>
            <Table.Head
              hideColumnDisabled
              sortOrder={order.method}
              onSort={handleOrderChange('method')}
              onClearSort={() =>
                setOrder(state => ({ ...state, method: undefined }))
              }
            >
              Method
            </Table.Head>
            <Table.Head
              sortOrder={order.amount}
              onSort={handleOrderChange('amount')}
              onClearSort={() =>
                setOrder(state => ({ ...state, amount: undefined }))
              }
            >
              Amount
            </Table.Head>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {invoices.map(invoice => (
            <Table.Row key={invoice.invoice}>
              <Table.Cell>{invoice.invoice}</Table.Cell>
              <Table.Cell>{invoice.paymentStatus}</Table.Cell>
              <Table.Cell>{invoice.paymentMethod}</Table.Cell>
              <Table.Cell>{invoice.totalAmount}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  },
};

const providers = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  name: 'Kadin Aminoff',
  number: '(940) 224-4718',
  proRewards: 'Gold',
  starRating: 4.8,
  onTimeArrival: '87%',
  acceptRate: '90%',
  lastJob: 'Sep 5, 2022',
  jobs: 120,
  cashBalance: '$429.00',
}));

export const WithScroll: Story = {
  args: {},
  decorators: [
    Story => (
      <div style={{ maxWidth: 400, maxHeight: 400 }}>
        <Story />
      </div>
    ),
  ],
  render: function WithScroll(args) {
    return (
      <Table {...args}>
        <Table.Header>
          <Table.Row>
            <Table.Head>Name</Table.Head>
            <Table.Head>Phone Number</Table.Head>
            <Table.Head>Pro Rewards</Table.Head>
            <Table.Head>Star Rating</Table.Head>
            <Table.Head>On-time Arrival</Table.Head>
            <Table.Head>Accept Rate</Table.Head>
            <Table.Head>Last Job</Table.Head>
            <Table.Head>Jobs</Table.Head>
            <Table.Head>Cash Balance</Table.Head>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {providers.map(provider => (
            <Table.Row key={provider.id}>
              <Table.Cell>{provider.name}</Table.Cell>
              <Table.Cell>{provider.number}</Table.Cell>
              <Table.Cell>{provider.proRewards}</Table.Cell>
              <Table.Cell>{provider.starRating}</Table.Cell>
              <Table.Cell>{provider.onTimeArrival}</Table.Cell>
              <Table.Cell>{provider.acceptRate}</Table.Cell>
              <Table.Cell>{provider.lastJob}</Table.Cell>
              <Table.Cell>{provider.jobs}</Table.Cell>
              <Table.Cell>{provider.cashBalance}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  },
};
