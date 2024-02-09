import { useState } from 'react';
import { createEvent } from 'react-event-hook';
import Image from 'next/image';
import { Focusable } from '@ariakit/react';

import {
  type CommentsParsed,
  useDeleteComment,
  useGetJob,
  usePatchComment,
} from '@/app/(app)/jobs/(index)/[id]/_api';
import { useSelectedVehicleTabIdValue } from '@/app/(app)/jobs/(index)/[id]/_atoms';
import { useIsJobUnlocked } from '@/app/(app)/jobs/(index)/[id]/_components/UnlockedOnly';
import { useJobId } from '@/app/(app)/jobs/(index)/[id]/_hooks';
import type { Comment } from '@/app/(app)/jobs/(index)/[id]/_types';
import {
  Avatar,
  Button,
  ButtonGroup,
  Icon,
  IconButton,
  Modal,
  Spinner,
  Text,
  toast,
} from '@/components';
import { css } from '@/styled-system/css';
import { Box, Center, Flex, styled } from '@/styled-system/jsx';

import { CommentsDrawerTextarea, SendButton } from './CommentsDrawerTextarea';

const Message = styled(Focusable, {
  base: {
    py: 2.3,
    px: 3,
    bgColor: 'rgba(1, 2, 3, 0.04)',
    rounded: 'lg',
    fontSize: 'sm',
    lineHeight: 'md',
    fontWeight: 'medium',
    color: 'gray.700',
    maxWidth: 'max',
    position: 'relative',
    minWidth: '1px',
    transitionProperty: 'min-width',
    transitionDuration: '50ms',
    transitionTimingFunction: 'easeInOut',
    whiteSpace: 'pre-wrap',

    '& .comments-message-card-button-group': {
      display: 'flex',
      opacity: 0,
      visibility: 'hidden',
      pointerEvents: 'none',
      transitionProperty: 'opacity, visibility',
      transitionDuration: 'fast',
      transitionTimingFunction: 'easeInOut',
    },

    '&:is(:hover, :focus-within, [data-focus-visible])': {
      minWidth: '4.25rem',

      '& .comments-message-card-button-group': {
        opacity: 1,
        visibility: 'visible',
        pointerEvents: 'auto',
      },
    },
  },
  variants: {
    owner: {
      true: {
        bgColor: 'rgba(0, 204, 102, 0.12)',
      },
    },
  },
});

const { emitConfirmEditAnotherMessage, useConfirmEditAnotherMessageListener } =
  createEvent('confirmEditAnotherMessage')<number>();

interface CommentsDrawerMessageProps {
  owner?: boolean;
  editingCommentId: number | null;
  comment: CommentsParsed[number];
  onEditCommentSuccess: (comment: Comment) => void;
  onEditCommentRequest: (commentId: number) => {
    successfulEditRequest: boolean;
  };
  onEditCommentCancel: () => void;
}

export function CommentsDrawerMessage({
  owner = false,
  editingCommentId,
  comment,
  onEditCommentSuccess,
  onEditCommentRequest,
  onEditCommentCancel,
}: CommentsDrawerMessageProps) {
  const jobId = useJobId();
  const selectedVehicleTabId = useSelectedVehicleTabIdValue();

  const isJobUnlocked = useIsJobUnlocked();

  const [editingCommentText, setEditingCommentText] = useState('');

  const [commentIdToBeDeleted, setCommentIdToBeDeleted] = useState<
    number | null
  >(null);

  useConfirmEditAnotherMessageListener(commentId => {
    setEditingCommentText(
      comment.comments.find(_comment => _comment.id === commentId)?.text ?? ''
    );
  });

  const getJob = useGetJob(jobId);
  const patchComment = usePatchComment(
    { jobId, vehicleId: selectedVehicleTabId! },
    {
      onSuccess: onEditCommentSuccess,
      onError(error) {
        toast.error(
          `Error while editing comment${
            error instanceof Error ? `: ${error.message}` : ''
          }`
        );
      },
    }
  );
  const deleteComment = useDeleteComment(
    { jobId, vehicleId: selectedVehicleTabId! },
    {
      refetchCommentsOnSuccess: true,
      onSuccess() {
        setCommentIdToBeDeleted(null);
        void getJob.refetch();
      },
      onError(error) {
        toast.error(
          `Error while deleting comment${
            error instanceof Error ? `: ${error.message}` : ''
          }`
        );
      },
    }
  );

  const isEditingTheFirstComment = editingCommentId === comment.comments[0].id;

  return (
    <>
      <Flex gap={2} direction={owner ? 'row-reverse' : 'row'}>
        <Center
          h="1.625rem"
          w="1.625rem"
          flexShrink={0}
          bgColor={owner ? 'primary' : undefined}
          rounded={owner ? 'full' : undefined}
        >
          {owner ? (
            <Image
              src="/assets/truckup_logo_dark.svg"
              alt="Truckup"
              width={24}
              height={4}
              className={css({ filter: 'brightness(0%)' })}
            />
          ) : (
            <Avatar name={comment.name} flexShrink={0} />
          )}
        </Center>

        <Flex direction="column" gap={0.5} flex={1}>
          {!isEditingTheFirstComment && (
            <Flex
              align="center"
              gap={5}
              h="1.625rem"
              direction={owner ? 'row-reverse' : 'row'}
            >
              <Flex
                align="center"
                gap={1}
                direction={owner ? 'row-reverse' : 'row'}
              >
                <Text fontWeight="medium" color="gray.900">
                  {owner ? 'Admin' : comment.name}
                </Text>
                <Text fontWeight="medium" color="gray.400" fontStyle="italic">
                  {owner ? 'You' : comment.role}
                </Text>
              </Flex>

              <Text size="sm" fontWeight="medium" color="gray.400">
                {comment.formattedDistance}
              </Text>
            </Flex>
          )}

          <Flex
            direction="column"
            gap={1}
            alignItems={owner ? 'flex-end' : 'flex-start'}
          >
            {comment.comments.map(_comment => {
              if (editingCommentId === _comment.id) {
                return (
                  <Box key={_comment.id} w="100%">
                    <CommentsDrawerTextarea
                      active
                      placeholder="Add a comment"
                      value={editingCommentText}
                      onChange={e => setEditingCommentText(e.target.value)}
                    >
                      <SendButton
                        type="button"
                        title="Cancel edit"
                        variant="secondary"
                        disabled={patchComment.isLoading}
                        onClick={onEditCommentCancel}
                      >
                        <Icon.XClose />
                      </SendButton>
                      <SendButton
                        type="button"
                        title="Save message"
                        fontSize="xl"
                        disabled={
                          !editingCommentText.trim() || patchComment.isLoading
                        }
                        onClick={() => {
                          patchComment.mutate({
                            id: _comment.id,
                            text: editingCommentText.trim(),
                          });
                        }}
                      >
                        {patchComment.isLoading ? (
                          <Spinner borderColor="currentColor" />
                        ) : (
                          <Icon.Check width="1em" height="1em" />
                        )}
                      </SendButton>
                    </CommentsDrawerTextarea>
                  </Box>
                );
              }

              return (
                <Message
                  key={_comment.id}
                  owner={owner}
                  disabled={!isJobUnlocked}
                >
                  {_comment.text}
                  {!!_comment.edited_at && (
                    <small
                      className={css({
                        fontSize: 'xs',
                        fontWeight: 'normal',
                        fontStyle: 'italic',
                        color: 'gray.400',
                      })}
                    >
                      &nbsp;edited
                    </small>
                  )}
                  <ButtonGroup
                    className="comments-message-card-button-group"
                    pos="absolute"
                    right={1.5}
                    top={1.5}
                  >
                    <IconButton
                      title="Edit message"
                      onClick={() => {
                        const { successfulEditRequest } = onEditCommentRequest(
                          _comment.id
                        );

                        if (successfulEditRequest) {
                          setEditingCommentText(_comment.text);
                        }
                      }}
                    >
                      <Icon.Edit />
                    </IconButton>
                    <IconButton
                      title="Delete message"
                      onClick={() => setCommentIdToBeDeleted(_comment.id)}
                    >
                      <Icon.Trash className={css({ color: 'danger' })} />
                    </IconButton>
                  </ButtonGroup>
                </Message>
              );
            })}
          </Flex>
        </Flex>

        <Box h="1.625rem" w="1.625rem" flexShrink={0} />
      </Flex>

      <Modal
        unmountOnHide
        open={!!commentIdToBeDeleted}
        hideOnEscape={!deleteComment.isLoading}
        hideOnInteractOutside={!deleteComment.isLoading}
        onClose={() => setCommentIdToBeDeleted(null)}
      >
        <Modal.Heading>Delete message?</Modal.Heading>
        <Modal.Description>
          Are you sure you want to delete this message?
        </Modal.Description>

        <Flex justify="flex-end" gap={2} mt={3}>
          <Modal.Dismiss disabled={deleteComment.isLoading}>
            Cancel
          </Modal.Dismiss>
          <Button
            size="sm"
            danger
            disabled={deleteComment.isLoading}
            loading={deleteComment.isLoading}
            onClick={() => deleteComment.mutate({ id: commentIdToBeDeleted! })}
          >
            Delete
          </Button>
        </Flex>
      </Modal>
    </>
  );
}

export { emitConfirmEditAnotherMessage };
