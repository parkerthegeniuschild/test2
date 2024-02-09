import { useMutation } from '@tanstack/react-query';

import { api } from '@/app/_services/api';

type PatchLeaveJobPayload = {
  id: string;
  reason: string;
};

function leaveJob({ id, ...payload }: PatchLeaveJobPayload) {
  return api.patch(`/jobs/${id}/leave`, payload);
}

type UsePatchLeaveParams = {
  onSuccess?: () => void;
  onMutate?: (payload: PatchLeaveJobPayload) => void;
};

export function useLeaveJob({ onSuccess, onMutate }: UsePatchLeaveParams = {}) {
  return useMutation({ mutationFn: leaveJob, onSuccess, onMutate });
}
