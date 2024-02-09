import { useState } from 'react';
import { match } from 'ts-pattern';

import { ClearFiltersButton, ColumnsButton } from '@/app/(app)/_components';
import { Dropdown, FilterButton } from '@/components';
import { Flex } from '@/styled-system/jsx';

import type { JobStatusFilter, PendingReviewState } from '../../_types';
import { statusToText } from '../../_utils';

import { PendingReviewFilter } from './PendingReviewFilter';
import { StatusFilter } from './StatusFilter';

function formatStatusesToActiveText(statuses: JobStatusFilter[]) {
  if (statuses.length === 0) {
    return undefined;
  }

  const SHOW_PRIORITY: JobStatusFilter[] = [
    'COMPLETED',
    'CANCELED',
    'DRAFT',
    'UNASSIGNED',
    'NOTIFYING',
    'ACCEPTED',
    'IN_PROGRESS',
    'PAUSE',
    'MANUAL',
  ];
  const statusesSortedByPriority = [...statuses].sort((a, b) => {
    const aIndex = SHOW_PRIORITY.indexOf(a);
    const bIndex = SHOW_PRIORITY.indexOf(b);

    if (aIndex === -1 && bIndex === -1) {
      return 0;
    }

    if (aIndex === -1) {
      return 1;
    }

    if (bIndex === -1) {
      return -1;
    }

    return aIndex - bIndex;
  });

  const [firstStatus] = statusesSortedByPriority;
  const readableStatus = statusToText(firstStatus);

  if (statuses.length === 1) {
    return readableStatus;
  }

  return `${readableStatus} and ${statuses.length - 1} more`;
}

type FiltersProps = {
  columnsVisibility: Record<string, boolean>;
  statuses: JobStatusFilter[];
  pendingReview: PendingReviewState;
  onChangeColumnVisibility: (columnId: string, visible: boolean) => void;
  onChangeStatuses: (statuses: JobStatusFilter[]) => void;
  onChangePendingReview: (pendingReview: PendingReviewState) => void;
  onClearFilters: () => void;
};

export function Filters({
  columnsVisibility,
  statuses,
  pendingReview,
  onChangeColumnVisibility,
  onChangeStatuses,
  onChangePendingReview,
  onClearFilters,
}: FiltersProps) {
  const [isStatusesDropdownOpen, setIsStatusesDropdownOpen] = useState(false);
  const [isPendingReviewDropdownOpen, setIsPendingReviewDropdownOpen] =
    useState(false);

  const isFiltersActive = statuses.length > 0 || pendingReview !== 'all';

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
    <Flex justify="space-between" align="center" px={6}>
      <Flex gap={2}>
        {/* <Dropdown
          trigger={<FilterButton>Provider</FilterButton>}
          css={{ width: '15rem' }}
        >
          <Dropdown.Heading>Filter by Providers</Dropdown.Heading>

          <form
            className={css({
              mt: 2,
              mb: 1,
              px: 4,
              display: 'flex',
              flexDir: 'column',
              gap: 3,
            })}
          >
            <TextInput placeholder="Enter provider name" size="sm" />
            <Button type="submit" size="sm">
              Apply
            </Button>
          </form>
        </Dropdown> */}

        <Dropdown
          trigger={
            <FilterButton
              activeText={formatStatusesToActiveText(statuses)}
              onClear={() => {
                onChangeStatuses([]);
                setIsStatusesDropdownOpen(false);
              }}
            >
              Status
            </FilterButton>
          }
          unmountOnHide
          open={isStatusesDropdownOpen}
          onOpenChange={setIsStatusesDropdownOpen}
        >
          <StatusFilter
            initialValue={statuses}
            onApply={payload => {
              onChangeStatuses(payload);
              setIsStatusesDropdownOpen(false);
            }}
          />
        </Dropdown>

        <Dropdown
          trigger={
            <FilterButton
              activeText={match(pendingReview)
                .with('no', () => 'No')
                .with('yes', () => 'Yes')
                .otherwise(() => undefined)}
              onClear={() => {
                onChangePendingReview('all');
                setIsPendingReviewDropdownOpen(false);
              }}
            >
              Pending Review
            </FilterButton>
          }
          unmountOnHide
          css={{ minWidth: '11.75rem' }}
          open={isPendingReviewDropdownOpen}
          onOpenChange={setIsPendingReviewDropdownOpen}
        >
          <PendingReviewFilter
            initialValue={pendingReview}
            onApply={payload => {
              onChangePendingReview(payload);
              setIsPendingReviewDropdownOpen(false);
            }}
          />
        </Dropdown>

        {isFiltersActive && <ClearFiltersButton onClick={onClearFilters} />}
      </Flex>

      <Flex gap={2}>
        {/* <Box width="12.5rem">
          <TextInput
            placeholder="Search"
            leftSlot={<Icon.Search />}
            containerProps={{ css: { height: 8 } }}
          />
        </Box> */}

        <Dropdown trigger={<ColumnsButton columns={columnsVisibility} />}>
          <Dropdown.Heading>Show columns</Dropdown.Heading>

          <Dropdown.ItemCheckbox name="columns" checked disabled>
            Job #
          </Dropdown.ItemCheckbox>
          <Dropdown.ItemCheckbox name="columns" checked disabled>
            Status
          </Dropdown.ItemCheckbox>
          <Dropdown.ItemCheckbox name="columns" checked disabled>
            Company
          </Dropdown.ItemCheckbox>
          <Dropdown.ItemCheckbox name="columns" checked disabled>
            Contacts
          </Dropdown.ItemCheckbox>
          <Dropdown.ItemCheckbox name="columns" checked disabled>
            Provider
          </Dropdown.ItemCheckbox>
          <Dropdown.ItemCheckbox
            name="columns"
            checked={getColumnVisibility('service')}
            onChange={handleChangeColumnVisibility('service')}
          >
            Service
          </Dropdown.ItemCheckbox>
          <Dropdown.ItemCheckbox
            name="columns"
            checked={getColumnVisibility('serviceArea')}
            onChange={handleChangeColumnVisibility('serviceArea')}
          >
            Service Area
          </Dropdown.ItemCheckbox>
          <Dropdown.ItemCheckbox
            name="columns"
            checked={getColumnVisibility('duration')}
            onChange={handleChangeColumnVisibility('duration')}
          >
            Duration
          </Dropdown.ItemCheckbox>
          <Dropdown.ItemCheckbox
            name="columns"
            checked={getColumnVisibility('price')}
            onChange={handleChangeColumnVisibility('price')}
          >
            Price
          </Dropdown.ItemCheckbox>
          <Dropdown.ItemCheckbox name="columns" checked disabled>
            Created
          </Dropdown.ItemCheckbox>
        </Dropdown>
      </Flex>
    </Flex>
  );
}
