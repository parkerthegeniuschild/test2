import { useState } from 'react';

import { format } from '@/app/_utils/format';
import { ClearFiltersButton, ColumnsButton } from '@/app/(app)/_components';
import { Dropdown, FilterButton, Icon, TextInput } from '@/components';
import { Box, Flex } from '@/styled-system/jsx';

import { INITIAL_CASH_BALANCE } from '../../_constants';
import type { CashBalanceFilterModel } from '../../_types';

import { CashBalanceFilter, cashBalanceFilters } from './CashBalanceFilter';

type FiltersProps = {
  columnsVisibility: Record<string, boolean>;
  cashBalance: CashBalanceFilterModel;
  search: string;
  onChangeColumnVisibility: (columnId: string, visible: boolean) => void;
  onCashBalanceChange: (cashBalance: CashBalanceFilterModel) => void;
  onSearchChange: (search: string) => void;
  onClearFilters: () => void;
  onClearSearch: () => void;
};

export function Filters({
  columnsVisibility,
  cashBalance,
  search,
  onChangeColumnVisibility,
  onCashBalanceChange,
  onSearchChange,
  onClearFilters,
  onClearSearch,
}: FiltersProps) {
  const [isCashBalanceDropdownOpen, setIsCashBalanceDropdownOpen] =
    useState(false);

  const isCashBalanceActive = cashBalance.values[0].length > 0;

  function getColumnVisibility(columnId: string) {
    return typeof columnsVisibility[columnId] === 'boolean'
      ? columnsVisibility[columnId]
      : true;
  }

  function handleChangeColumnVisibility(columnId: string) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      onChangeColumnVisibility(
        columnId,
        e.target.checked === undefined
          ? !getColumnVisibility(columnId)
          : e.target.checked
      );
    };
  }

  return (
    <Flex justify="space-between" align="center" css={{ px: 6 }}>
      <Flex gap={2}>
        <Dropdown
          trigger={
            <FilterButton
              activeText={
                isCashBalanceActive
                  ? cashBalanceFilters
                      .find(f => f.operator === cashBalance.operator)
                      ?.activeText(
                        format.currency(
                          Number.parseFloat(cashBalance.values[0])
                        ),
                        format.currency(
                          Number.parseFloat(cashBalance.values[1])
                        )
                      )
                  : ''
              }
              onClear={() => {
                onCashBalanceChange(INITIAL_CASH_BALANCE);
                setIsCashBalanceDropdownOpen(false);
              }}
            >
              Cash Balance
            </FilterButton>
          }
          css={{ width: '18.75rem' }}
          open={isCashBalanceDropdownOpen}
          onOpenChange={setIsCashBalanceDropdownOpen}
          unmountOnHide
        >
          <CashBalanceFilter
            initialValue={cashBalance}
            onSubmit={payload => {
              onCashBalanceChange(payload);
              setIsCashBalanceDropdownOpen(false);
            }}
          />
        </Dropdown>

        {/* <Select
          const proRewardsIconWrapperCss = css({ ml: 'auto', fontSize: 'md' });
          render={<FilterButton>Pro Rewards</FilterButton>}
          resetStyles
          sameWidth={false}
          popoverProps={{ className: css({ width: '11.25rem' }) }}
        >
          <Select.Heading>Filter by Pro Rewards</Select.Heading>

          <Select.Item value="emerald">
            Emerald
            <span className={proRewardsIconWrapperCss}>
              <Icon.ProRewards.Emerald />
            </span>
          </Select.Item>
          <Select.Item value="gold">
            Gold
            <span className={proRewardsIconWrapperCss}>
              <Icon.ProRewards.Gold />
            </span>
          </Select.Item>
          <Select.Item value="platinum">
            Platinum
            <span className={proRewardsIconWrapperCss}>
              <Icon.ProRewards.Platinum />
            </span>
          </Select.Item>
          <Select.Item value="diamond">
            Diamond
            <span className={proRewardsIconWrapperCss}>
              <Icon.ProRewards.Diamond />
            </span>
          </Select.Item>
        </Select> */}

        {isCashBalanceActive && <ClearFiltersButton onClick={onClearFilters} />}
      </Flex>

      <Flex gap={2}>
        <Box width="12.5rem">
          <TextInput
            placeholder="Search"
            leftSlot={<Icon.Search />}
            containerProps={{ css: { height: 8 } }}
            clearable={search.length > 0}
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            onClear={onClearSearch}
          />
        </Box>

        <Dropdown trigger={<ColumnsButton columns={columnsVisibility} />}>
          <Dropdown.Heading>Show columns</Dropdown.Heading>

          <Dropdown.ItemCheckbox name="columns" checked disabled>
            Name
          </Dropdown.ItemCheckbox>
          <Dropdown.ItemCheckbox name="columns" checked disabled>
            Phone Number
          </Dropdown.ItemCheckbox>
          {/* <Dropdown.ItemCheckbox name="columns" checked disabled>
            Pro Rewards
          </Dropdown.ItemCheckbox> */}
          <Dropdown.ItemCheckbox
            name="columns"
            checked={getColumnVisibility('rating')}
            onChange={handleChangeColumnVisibility('rating')}
          >
            Star Rating
          </Dropdown.ItemCheckbox>
          <Dropdown.ItemCheckbox
            name="columns"
            checked={getColumnVisibility('onTimeArrival')}
            onChange={handleChangeColumnVisibility('onTimeArrival')}
          >
            On-time Arrival
          </Dropdown.ItemCheckbox>
          <Dropdown.ItemCheckbox
            name="columns"
            checked={getColumnVisibility('acceptedRate')}
            onChange={handleChangeColumnVisibility('acceptedRate')}
          >
            Accept Rate
          </Dropdown.ItemCheckbox>
          <Dropdown.ItemCheckbox
            name="columns"
            checked={getColumnVisibility('lastJob')}
            onChange={handleChangeColumnVisibility('lastJob')}
          >
            Last Job
          </Dropdown.ItemCheckbox>
          <Dropdown.ItemCheckbox name="columns" checked disabled>
            Jobs
          </Dropdown.ItemCheckbox>
          <Dropdown.ItemCheckbox name="columns" checked disabled>
            Cash Balance
          </Dropdown.ItemCheckbox>
        </Dropdown>
      </Flex>
    </Flex>
  );
}
