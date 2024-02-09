import { useState } from 'react';

import { Button, Dropdown } from '@/components';
import { Box } from '@/styled-system/jsx';

import type { PendingReviewState } from '../../_types';

type PendingReviewFilterProps = {
  initialValue?: PendingReviewState;
  onApply?: (pendingReview: PendingReviewState) => void;
};

export function PendingReviewFilter({
  initialValue = 'all',
  onApply,
}: PendingReviewFilterProps) {
  const [pendingReview, setPendingReview] =
    useState<PendingReviewState>(initialValue);

  function handleChangePendingReview(state: 'yes' | 'no') {
    return () => setPendingReview(pendingReview === state ? 'all' : state);
  }

  function handleApply() {
    onApply?.(pendingReview);
  }

  return (
    <>
      <Dropdown.Heading>Filter by Pending Review</Dropdown.Heading>

      <Dropdown.ItemCheckbox
        checkStyle="checkmark"
        name="pr"
        checked={pendingReview === 'yes'}
        onChange={handleChangePendingReview('yes')}
      >
        Yes
      </Dropdown.ItemCheckbox>
      <Dropdown.ItemCheckbox
        checkStyle="checkmark"
        name="pr"
        checked={pendingReview === 'no'}
        onChange={handleChangePendingReview('no')}
      >
        No
      </Dropdown.ItemCheckbox>

      <Box mx={3} pt={2} pb={1}>
        <Button type="button" size="sm" width="100%" onClick={handleApply}>
          Apply
        </Button>
      </Box>
    </>
  );
}
