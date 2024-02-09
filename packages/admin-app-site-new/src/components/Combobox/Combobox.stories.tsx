import { startTransition, useMemo, useState } from 'react';
import { faker } from '@faker-js/faker';
import type { Meta, StoryObj } from '@storybook/react';

import { css } from '@/styled-system/css';
import { Box } from '@/styled-system/jsx';

import { Avatar } from '../Avatar';
import { Icon } from '../icons';
import { Label } from '../Label';
import { Text } from '../Text';

import { Combobox } from './Combobox';

const meta = {
  title: 'Form/Combobox',
  component: Combobox,
  tags: ['autodocs'],
  parameters: {
    controls: {
      include: ['size'],
    },
  },
} satisfies Meta<typeof Combobox>;

type Story = StoryObj<typeof Combobox>;

export default meta;

const fruits = [
  {
    label: '🍎 Apple',
    value: 'Apple',
  },
  {
    label: '🍇 Grape',
    value: 'Grape',
  },
  {
    label: '🍊 Orange',
    value: 'Orange',
  },
  {
    label: '🍓 Strawberry',
    value: 'Strawberry',
  },
  {
    label: '🍉 Watermelon',
    value: 'Watermelon',
  },
];

export const Default: Story = {
  render: function Default(args) {
    const [selectedOption, setSelectedOption] = useState('');
    const [value, setValue] = useState('');
    const [searchValue, setSearchValue] = useState('');

    const matches = fruits.filter(fruit =>
      fruit.label.toLowerCase().includes(searchValue.toLowerCase())
    );

    return (
      <Label>
        Your favorite food
        <Combobox
          {...args}
          placeholder="e.g., Apple"
          value={value}
          onChange={v => {
            const selectedFruit = fruits.find(fruit => fruit.value === v);

            if (selectedFruit || v === '') {
              setSelectedOption(selectedFruit ? selectedFruit.value : '');
            }

            setValue(v);
            startTransition(() => setSearchValue(v));
          }}
          onOpenChange={open => {
            if (!open && !fruits.some(fruit => fruit.value === value)) {
              setSearchValue(selectedOption);
              setValue(selectedOption);
            }
          }}
        >
          {matches.length ? (
            matches.map(fruit => (
              <Combobox.Item key={fruit.value} value={fruit.value}>
                {fruit.label}
              </Combobox.Item>
            ))
          ) : (
            <Text textAlign="center" lineHeight="md" py={1.5}>
              No matches
            </Text>
          )}
        </Combobox>
      </Label>
    );
  },
};

export const FreeSolo: Story = {
  render: function FreeSolo(args) {
    const [searchValue, setSearchValue] = useState('');

    const matches = fruits.filter(fruit =>
      fruit.label.toLowerCase().includes(searchValue.toLowerCase())
    );

    return (
      <Label>
        Your favorite food
        <Combobox
          {...args}
          placeholder="e.g., Apple"
          onChange={v => startTransition(() => setSearchValue(v))}
        >
          {matches.length
            ? matches.map(fruit => (
                <Combobox.Item key={fruit.value} value={fruit.value}>
                  {fruit.label}
                </Combobox.Item>
              ))
            : null}
        </Combobox>
      </Label>
    );
  },
};

const customers = Array.from({ length: 50 }, (_, i) => {
  const type = Math.random() > 0.5 ? ('company' as const) : ('person' as const);

  return {
    id: i.toString(),
    type,
    name:
      type === 'company'
        ? faker.company.name()
        : `${faker.person.firstName()} ${faker.person.lastName()}`,
    description:
      type === 'company'
        ? `USDOT #${faker.phone.number('#######')}`
        : faker.phone.number('(###) ###-####'),
  };
});

export const Creatable: Story = {
  args: {
    size: 'lg',
  },
  argTypes: {
    size: { control: { disable: true } },
  },
  render: function Creatable(args) {
    const [selectedOption, setSelectedOption] = useState<
      (typeof customers)[number] | null
    >(null);
    const [value, setValue] = useState('');
    const [searchValue, setSearchValue] = useState('');

    const matches = customers.filter(customer =>
      customer.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    return (
      <Label width={500}>
        Customer
        <Combobox
          {...args}
          placeholder="Search by company or person"
          value={value}
          fixedSlot={
            <>
              <Combobox.Item>
                <Icon.Plus className={css({ color: 'gray.700' })} />
                {value.trim().length > 0
                  ? `Add "${value.trim()}" as company`
                  : 'Add new company'}
              </Combobox.Item>
              <Combobox.Item>
                <Icon.Plus className={css({ color: 'gray.700' })} />
                {value.trim().length > 0
                  ? `Add "${value.trim()}" as person`
                  : 'Add new person'}
              </Combobox.Item>
            </>
          }
          onChange={v => {
            if (v === '') {
              setSelectedOption(null);
            }

            setValue(v);
            startTransition(() => setSearchValue(v));
          }}
          onOpenChange={open => {
            if (!open) {
              setSearchValue(selectedOption?.name ?? '');
              setValue(selectedOption?.name ?? '');
            }
          }}
        >
          {matches.length ? (
            matches.map(customer => (
              <Combobox.Item
                key={customer.id}
                active={customer.id === selectedOption?.id}
                value={customer.id}
                onClick={() => {
                  setSelectedOption(customer);
                  setValue(customer.name);
                  setSearchValue(customer.name);
                }}
                endSlot={
                  <Text
                    css={{ display: 'flex', alignItems: 'center', gap: 1.5 }}
                  >
                    <Text as="span" css={{ fontSize: '2xs.xl' }}>
                      {customer.type === 'company' ? (
                        <Icon.Building />
                      ) : (
                        <Icon.User />
                      )}
                    </Text>
                    {customer.type === 'company' ? 'Company' : 'Person'}
                  </Text>
                }
              >
                <Box
                  css={{
                    width: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Avatar
                    size="sm"
                    icon={
                      customer.type === 'company' ? Icon.Building : undefined
                    }
                    name={
                      customer.type === 'person' ? customer.name : undefined
                    }
                    css={{ flexShrink: 0 }}
                  />
                </Box>
                <Text
                  css={{
                    color: 'gray.900',
                    fontWeight: 'semibold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span
                    className={css({
                      maxWidth: '13rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      lineHeight: 'sm',
                    })}
                  >
                    {customer.name}
                  </span>
                  <Text
                    as="span"
                    css={{
                      fontSize: 'xs',
                      fontWeight: 'normal',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {customer.description}
                  </Text>
                </Text>
              </Combobox.Item>
            ))
          ) : (
            <Text textAlign="center" lineHeight="md" py={2.3}>
              No matches
            </Text>
          )}
        </Combobox>
      </Label>
    );
  },
};

const dispatchers = Array.from({ length: 15 }, (_, i) => {
  const group = i < 3 ? ('Company Dispatchers' as const) : ('Others' as const);

  return {
    id: i.toString(),
    group,
    name: `${faker.person.firstName()} ${faker.person.lastName()}`,
    description: faker.phone.number('(###) ###-####'),
  };
});

export const Group: Story = {
  args: {
    size: 'lg',
  },
  argTypes: {
    size: { control: { disable: true } },
  },
  render: function Group(args) {
    const [selectedOption, setSelectedOption] = useState<
      (typeof dispatchers)[number] | null
    >(null);
    const [value, setValue] = useState('');
    const [searchValue, setSearchValue] = useState('');

    const matches = useMemo(() => {
      const items = dispatchers.filter(dispatcher =>
        dispatcher.name.toLowerCase().includes(searchValue.toLowerCase())
      );

      return items.reduce((acc, dispatcher) => {
        const groupIndex = acc.findIndex(
          ([group]) => group === dispatcher.group
        );

        if (groupIndex === -1) {
          acc.push([dispatcher.group, [dispatcher]]);
        } else {
          acc[groupIndex][1].push(dispatcher);
        }

        return acc;
      }, [] as ['Company Dispatchers' | 'Others', (typeof dispatchers)[number][]][]);
    }, [searchValue]);

    return (
      <Label width={500}>
        Dispatchers
        <Combobox
          {...args}
          placeholder="Search by person"
          value={value}
          onChange={v => {
            if (v === '') {
              setSelectedOption(null);
            }

            setValue(v);
            startTransition(() => setSearchValue(v));
          }}
          onOpenChange={open => {
            if (!open) {
              setSearchValue(selectedOption?.name ?? '');
              setValue(selectedOption?.name ?? '');
            }
          }}
        >
          {matches.length ? (
            matches.map(([type, items]) => (
              <Combobox.Group key={type} label={type}>
                {items.map(item => (
                  <Combobox.Item
                    key={item.id}
                    active={item.id === selectedOption?.id}
                    value={item.id}
                    onClick={() => {
                      setSelectedOption(item);
                      setValue(item.name);
                      setSearchValue(item.name);
                    }}
                  >
                    <Box
                      css={{
                        width: 4,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Avatar
                        size="sm"
                        userRole="dispatcher"
                        name={item.name}
                        css={{ flexShrink: 0 }}
                      />
                    </Box>
                    <Text
                      css={{
                        color: 'gray.900',
                        fontWeight: 'semibold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                      }}
                    >
                      {item.name}
                      <Text
                        as="span"
                        css={{ fontSize: 'xs', fontWeight: 'normal' }}
                      >
                        {item.description}
                      </Text>
                    </Text>
                  </Combobox.Item>
                ))}
              </Combobox.Group>
            ))
          ) : (
            <Text textAlign="center" lineHeight="md" py={2.3}>
              No matches
            </Text>
          )}
        </Combobox>
      </Label>
    );
  },
};
