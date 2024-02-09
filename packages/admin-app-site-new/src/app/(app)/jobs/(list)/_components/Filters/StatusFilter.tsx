import { useState } from 'react';

import { StatusBadge } from '@/app/(app)/jobs/_components';
import type { JobStatusFilter } from '@/app/(app)/jobs/(list)/_types';
import { Button, Dropdown } from '@/components';
import { Box } from '@/styled-system/jsx';

type StatusFilterProps = {
  initialValue?: JobStatusFilter[];
  onApply?: (statuses: JobStatusFilter[]) => void;
};

export function StatusFilter({
  initialValue = [],
  onApply,
}: StatusFilterProps) {
  const [statuses, setStatuses] = useState<JobStatusFilter[]>(initialValue);

  function handleChangeStatus(status: JobStatusFilter) {
    return () => {
      setStatuses(state => {
        const isAlreadyChecked = state.includes(status);

        if (isAlreadyChecked) {
          return state.filter(s => s !== status);
        }

        return [...state, status];
      });
    };
  }

  function handleApply() {
    const statusesSortedAlphabetically = statuses.sort((a, b) =>
      a.localeCompare(b)
    );

    onApply?.(statusesSortedAlphabetically);
  }

  return (
    <>
      <Dropdown.Heading>Filter by Status</Dropdown.Heading>

      <Dropdown.ItemCheckbox
        name="status"
        checked={statuses.includes('UNASSIGNED')}
        onChange={handleChangeStatus('UNASSIGNED')}
      >
        <StatusBadge status="UNASSIGNED" />
      </Dropdown.ItemCheckbox>
      <Dropdown.ItemCheckbox
        name="status"
        checked={statuses.includes('NOTIFYING')}
        onChange={handleChangeStatus('NOTIFYING')}
      >
        <StatusBadge status="NOTIFYING" />
      </Dropdown.ItemCheckbox>
      <Dropdown.ItemCheckbox
        name="status"
        checked={statuses.includes('ACCEPTED')}
        onChange={handleChangeStatus('ACCEPTED')}
      >
        <StatusBadge status="ACCEPTED" />
      </Dropdown.ItemCheckbox>
      <Dropdown.ItemCheckbox
        name="status"
        checked={statuses.includes('IN_PROGRESS')}
        onChange={handleChangeStatus('IN_PROGRESS')}
      >
        <StatusBadge status="IN_PROGRESS" />
      </Dropdown.ItemCheckbox>
      <Dropdown.ItemCheckbox
        name="status"
        checked={statuses.includes('PAUSE')}
        onChange={handleChangeStatus('PAUSE')}
      >
        <StatusBadge status="PAUSE" />
      </Dropdown.ItemCheckbox>

      <Dropdown.Separator />

      <Dropdown.ItemCheckbox
        name="status"
        checked={statuses.includes('DRAFT')}
        onChange={handleChangeStatus('DRAFT')}
      >
        <StatusBadge status="DRAFT" />
      </Dropdown.ItemCheckbox>
      <Dropdown.ItemCheckbox
        name="status"
        checked={statuses.includes('COMPLETED')}
        onChange={handleChangeStatus('COMPLETED')}
      >
        <StatusBadge status="COMPLETED" />
      </Dropdown.ItemCheckbox>
      <Dropdown.ItemCheckbox
        name="status"
        checked={statuses.includes('CANCELED')}
        onChange={handleChangeStatus('CANCELED')}
      >
        <StatusBadge status="CANCELED" />
      </Dropdown.ItemCheckbox>

      <Box mx={3} pt={2} pb={1}>
        <Button type="button" size="sm" width="100%" onClick={handleApply}>
          Apply
        </Button>
      </Box>
    </>
  );
}
