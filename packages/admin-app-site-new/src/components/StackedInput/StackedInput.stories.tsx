import { startTransition, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { StackedInput } from './StackedInput';

const meta = {
  title: 'Form/StackedInput',
  component: StackedInput,
  tags: ['autodocs'],
  parameters: {
    controls: {
      include: [],
    },
  },
} satisfies Meta<typeof StackedInput>;

type Story = StoryObj<typeof StackedInput>;

export default meta;

const manufacturers = [
  'Volvo',
  'Mack',
  'Peterbilt',
  'Kenworth',
  'Freightliner',
  'International',
  'Western Star',
  'Ford',
  'Chevrolet',
  'GMC',
  'Dodge',
  'Ram',
  'Toyota',
  'Nissan',
];

export const Default: Story = {
  render: function Default(args) {
    const [searchValue, setSearchValue] = useState('');

    const matches = manufacturers.filter(manufacturer =>
      manufacturer.toLowerCase().includes(searchValue.toLowerCase())
    );

    return (
      <StackedInput {...args}>
        <StackedInput.TextInput
          required
          label="Company name"
          placeholder="Enter company name"
        />
        <StackedInput.Select label="Type" required>
          <StackedInput.Select.Item value="Fleet">
            Fleet
          </StackedInput.Select.Item>
          <StackedInput.Select.Item value="Broker">
            Broker
          </StackedInput.Select.Item>
        </StackedInput.Select>
        <StackedInput.TextInput
          label="Primary phone"
          placeholder="(000) 000-0000"
        >
          <StackedInput.TextInput.SubInput placeholder="Ext" />
        </StackedInput.TextInput>
        <StackedInput.HStack>
          <StackedInput.TextInput
            required
            label="Year"
            placeholder="Enter year"
          />
          <StackedInput.TextInput label="Unit #" placeholder="Enter unit #" />
        </StackedInput.HStack>
        <StackedInput.Combobox
          label="Manufacturer"
          placeholder="Search manufacturer"
          onChange={v => startTransition(() => setSearchValue(v))}
        >
          {matches.length
            ? matches.map(manufacturer => (
                <StackedInput.Combobox.Item
                  key={manufacturer}
                  value={manufacturer}
                >
                  {manufacturer}
                </StackedInput.Combobox.Item>
              ))
            : null}
        </StackedInput.Combobox>
      </StackedInput>
    );
  },
};

export const WithError: Story = {
  render: function WithError(args) {
    const [searchValue, setSearchValue] = useState('');

    const matches = manufacturers.filter(manufacturer =>
      manufacturer.toLowerCase().includes(searchValue.toLowerCase())
    );

    return (
      <StackedInput {...args}>
        <StackedInput.TextInput
          required
          label="Company name"
          placeholder="Enter company name"
          error
        />
        <StackedInput.Select label="Type" required error>
          <StackedInput.Select.Item value="Fleet">
            Fleet
          </StackedInput.Select.Item>
          <StackedInput.Select.Item value="Broker">
            Broker
          </StackedInput.Select.Item>
        </StackedInput.Select>
        <StackedInput.TextInput
          label="USDOT #"
          placeholder="Enter USDOT #"
          error
        />
        <StackedInput.Combobox
          label="Manufacturer"
          placeholder="Search manufacturer"
          onChange={v => startTransition(() => setSearchValue(v))}
          error
        >
          {matches.length
            ? matches.map(manufacturer => (
                <StackedInput.Combobox.Item
                  key={manufacturer}
                  value={manufacturer}
                >
                  {manufacturer}
                </StackedInput.Combobox.Item>
              ))
            : null}
        </StackedInput.Combobox>
      </StackedInput>
    );
  },
};

export const WithoutLabels: Story = {
  render: function WithoutLabels(args) {
    const [locationType, setLocationType] = useState('');

    return (
      <div style={{ width: '31.5rem' }}>
        <StackedInput {...args}>
          <StackedInput.Select
            required
            placeholder="Select location type"
            value={locationType}
            onChange={v => setLocationType(v as string)}
          >
            <StackedInput.Select.Item value="Highway">
              Highway
            </StackedInput.Select.Item>
            <StackedInput.Select.Item value="Street">
              Street
            </StackedInput.Select.Item>
            <StackedInput.Select.Item value="Parking lot">
              Parking lot
            </StackedInput.Select.Item>
            <StackedInput.Select.Item value="Loading dock">
              Loading dock
            </StackedInput.Select.Item>
            <StackedInput.Select.Item value="Driveway">
              Driveway
            </StackedInput.Select.Item>
            <StackedInput.Select.Item value="Garage">
              Garage
            </StackedInput.Select.Item>
            <StackedInput.Select.Item value="On-ramp">
              On-ramp
            </StackedInput.Select.Item>
            <StackedInput.Select.Item value="Off-ramp">
              Off-ramp
            </StackedInput.Select.Item>
            <StackedInput.Select.Item value="Rest stop">
              Rest stop
            </StackedInput.Select.Item>
            <StackedInput.Select.Item value="Weigh station">
              Weigh station
            </StackedInput.Select.Item>
          </StackedInput.Select>
          <StackedInput.Textarea
            rows={4}
            placeholder="Helpful info to locate & identify the vehicle or location"
          />
        </StackedInput>
      </div>
    );
  },
};
