'use client';

import { useQueryClient } from '@tanstack/react-query';

import { useRouter } from '@/app/(app)/_hooks';
import { Map, S } from '@/app/(app)/jobs/(index)/_components';
import { usePostJob } from '@/app/(app)/jobs/(index)/create/_api';
import { useGetJobs } from '@/app/(app)/jobs/(list)/_api';
import { toast } from '@/components';
import { Flex } from '@/styled-system/jsx';

import { Content } from './Content';
import { Footer } from './Footer';
import { Header } from './Header';

export function Container() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const postJob = usePostJob({
    onSuccess(data) {
      router.push(`/jobs/${data.id}`);
      void queryClient.invalidateQueries({ queryKey: [useGetJobs.queryKey] });
    },
    onError(error) {
      toast.error(
        `Error while creating job${
          error instanceof Error ? `: ${error.message}` : ''
        }`
      );
    },
  });

  return (
    <S.Container>
      <Header isLoading={postJob.isLoading || postJob.isSuccess} />

      <Flex flex={1}>
        <S.Container.ContentWrapper>
          <Content />
          <Footer
            isLoading={postJob.isLoading || postJob.isSuccess}
            onSaveJob={postJob.mutate}
          />
        </S.Container.ContentWrapper>

        <Map />
      </Flex>
    </S.Container>
  );
}
