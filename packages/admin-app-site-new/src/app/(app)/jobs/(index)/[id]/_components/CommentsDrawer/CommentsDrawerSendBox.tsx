import { useState } from 'react';

import { useGetJob, usePostComment } from '@/app/(app)/jobs/(index)/[id]/_api';
import { useSelectedVehicleTabIdValue } from '@/app/(app)/jobs/(index)/[id]/_atoms';
import { UnlockedOnly } from '@/app/(app)/jobs/(index)/[id]/_components/UnlockedOnly';
import { useJobId } from '@/app/(app)/jobs/(index)/[id]/_hooks';
import { Icon, Spinner, Text, toast } from '@/components';
import { Flex } from '@/styled-system/jsx';

import { CommentsDrawerTextarea, SendButton } from './CommentsDrawerTextarea';

export function CommentsDrawerSendBox() {
  const jobId = useJobId();
  const selectedVehicleTabId = useSelectedVehicleTabIdValue();

  const [comment, setComment] = useState('');

  const getJob = useGetJob(jobId);
  const postComment = usePostComment(
    { jobId, vehicleId: selectedVehicleTabId! },
    {
      refetchCommentsOnSuccess: true,
      onSuccess() {
        setComment('');
        void getJob.refetch();
      },
      onError(error) {
        toast.error(
          `Error while creating comment${
            error instanceof Error ? `: ${error.message}` : ''
          }`
        );
      },
    }
  );

  function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!comment.trim()) {
      return;
    }

    postComment.mutate({ text: comment.trim() });
  }

  return (
    <UnlockedOnly>
      <Flex direction="column" gap={3} p={3}>
        <Text textAlign="center" size="sm" color="gray.400">
          Public comments. These comments will be visible to the customer.
        </Text>

        <form onSubmit={handleFormSubmit}>
          <CommentsDrawerTextarea
            rows={3}
            placeholder="Add a comment"
            value={comment}
            onChange={e => setComment(e.target.value)}
          >
            <SendButton
              type="submit"
              title="Send message"
              disabled={!comment.trim() || postComment.isLoading}
            >
              {postComment.isLoading ? (
                <Spinner borderColor="currentColor" />
              ) : (
                <Icon.Send />
              )}
            </SendButton>
          </CommentsDrawerTextarea>
        </form>
      </Flex>
    </UnlockedOnly>
  );
}
