import { useQuery, useQueryClient } from '@tanstack/react-query';

import {
  differenceInMinutes,
  formatDistanceToNowStrict,
} from '@/app/_lib/dateFns';
import { api } from '@/app/_services/api';
import { format } from '@/app/_utils';

import type { Comment } from '../_types';

type GetCommentsParams = {
  jobId: string;
  vehicleId: number;
};

type GetCommentsAPIResponse = {
  data: Comment[];
};

async function getComments({ jobId, vehicleId }: GetCommentsParams) {
  const response = await api.get<GetCommentsAPIResponse>(
    `/jobs/${jobId}/vehicles/${vehicleId}/comments`,
    {
      params: {
        // TODO: add an infinite scroll pagination instead of fixing the size
        size: 999,
      },
    }
  );

  const groupedComments: Array<{
    id: number;
    userId: number;
    name: string;
    role: string;
    formattedDistance: string;
    comments: Comment[];
  }> = [];

  response.data.data.reverse().forEach(comment => {
    const lastComment = groupedComments.at(-1);

    const diffInMinutesFromLastCommentToCurrent = differenceInMinutes(
      new Date(comment.created_at),
      lastComment?.comments.at(-1)?.created_at
        ? new Date(lastComment?.comments.at(-1)!.created_at)
        : new Date()
    );

    const MINUTES_THRESHOLD = 5;

    if (
      !lastComment ||
      lastComment.userId !== comment.user_id ||
      diffInMinutesFromLastCommentToCurrent > MINUTES_THRESHOLD
    ) {
      const formattedDistance = formatDistanceToNowStrict(
        new Date(comment.created_at),
        { addSuffix: true }
      );

      groupedComments.push({
        id: comment.id,
        userId: comment.user_id,
        name: [comment.firstname, comment.lastname].filter(Boolean).join(' '),
        role: format.string.capitalize(comment.role.toLowerCase()),
        formattedDistance: formattedDistance.includes('0 seconds')
          ? 'just now'
          : formattedDistance,
        comments: [comment],
      });
      return;
    }

    lastComment.comments.push(comment);
  });

  return groupedComments.reverse();
}

export type CommentsParsed = Awaited<ReturnType<typeof getComments>>;

type UseGetCommentsParams = {
  enabled?: boolean;
};

const QUERY_KEY = 'useGetComments';

export function useGetComments(
  params: Partial<GetCommentsParams>,
  { enabled = true }: UseGetCommentsParams = {}
) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [QUERY_KEY, params],
    queryFn: () => getComments(params as GetCommentsParams),
    enabled: !!params.jobId && Number.isInteger(params.vehicleId) && enabled,
    refetchInterval: 30 * 1000, // 30 seconds
  });

  return Object.assign(query, {
    updateData(payload: CommentsParsed) {
      queryClient.setQueryData([QUERY_KEY, params], payload);
    },
  });
}
