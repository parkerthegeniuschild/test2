import { useState } from 'react';

import { useGetComments } from '@/app/(app)/jobs/(index)/[id]/_api';
import {
  usePageAtom,
  useSelectedVehicleTabIdValue,
} from '@/app/(app)/jobs/(index)/[id]/_atoms';
import { useIsJobUnlocked } from '@/app/(app)/jobs/(index)/[id]/_components/UnlockedOnly';
import { useJobId } from '@/app/(app)/jobs/(index)/[id]/_hooks';
import type { Comment } from '@/app/(app)/jobs/(index)/[id]/_types';
import { Button, ErrorMessage, Modal } from '@/components';
import { Flex } from '@/styled-system/jsx';

import {
  CommentsDrawerMessage,
  emitConfirmEditAnotherMessage,
} from './CommentsDrawerMessage';

export function CommentsDrawerChat() {
  const jobId = useJobId();
  const pageAtom = usePageAtom();
  const selectedVehicleTabId = useSelectedVehicleTabIdValue();

  const isJobUnlocked = useIsJobUnlocked();

  const getComments = useGetComments(
    {
      jobId,
      vehicleId: selectedVehicleTabId,
    },
    { enabled: !!pageAtom.data.isVehicleCommentsDrawerOpen }
  );

  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [commentIdToBeEdited, setCommentIdToBeEdited] = useState<number | null>(
    null
  );

  function handleEditCommentRequest(commentId: number) {
    if (!editingCommentId) {
      setEditingCommentId(commentId);
      return { successfulEditRequest: true };
    }

    setCommentIdToBeEdited(commentId);
    return { successfulEditRequest: false };
  }

  function handleEditCommentSuccess(comment: Comment) {
    getComments.updateData(
      getComments.data?.map(_comment => ({
        ..._comment,
        comments: _comment.comments.map(c =>
          c.id === comment.id ? comment : c
        ),
      })) ?? []
    );
    setEditingCommentId(null);
  }

  return (
    <>
      <Flex
        direction="column-reverse"
        overflow="auto"
        gap={5}
        px={5}
        pt={5}
        pb={isJobUnlocked ? 3 : 5}
        flex={1}
      >
        {!getComments.data && getComments.isError && (
          <ErrorMessage mx="auto">
            Error to fetch comments
            {getComments.error instanceof Error
              ? `: ${getComments.error.message}`
              : ''}
          </ErrorMessage>
        )}

        {getComments.data?.map(comment => (
          <CommentsDrawerMessage
            key={comment.id}
            comment={comment}
            owner={comment.role.toLowerCase() === 'agent'}
            editingCommentId={editingCommentId}
            onEditCommentSuccess={handleEditCommentSuccess}
            onEditCommentCancel={() => setEditingCommentId(null)}
            onEditCommentRequest={handleEditCommentRequest}
          />
        ))}
      </Flex>

      <Modal
        unmountOnHide
        open={!!commentIdToBeEdited}
        onClose={() => setCommentIdToBeEdited(null)}
      >
        <Modal.Heading>Edit another message?</Modal.Heading>
        <Modal.Description>
          You will lose any unsaved changes to your currently edited message.
        </Modal.Description>

        <Flex justify="flex-end" gap={2} mt={3}>
          <Modal.Dismiss>Keep editing</Modal.Dismiss>
          <Button
            size="sm"
            danger
            onClick={() => {
              setEditingCommentId(commentIdToBeEdited!);
              emitConfirmEditAnotherMessage(commentIdToBeEdited!);
              setCommentIdToBeEdited(null);
            }}
          >
            Continue
          </Button>
        </Flex>
      </Modal>
    </>
  );
}
