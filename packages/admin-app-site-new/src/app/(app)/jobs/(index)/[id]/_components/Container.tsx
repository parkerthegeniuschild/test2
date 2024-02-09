'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAxiosError } from 'axios';
import { useHydrateAtoms } from 'jotai/utils';

import { useGetPageSize } from '@/app/(app)/_hooks';
import { S } from '@/app/(app)/jobs/(index)/_components';
import { toast } from '@/components';
import { Flex } from '@/styled-system/jsx';

import {
  type GetTimezoneParsedResponse,
  type JobParsed,
  type ServiceTypeRecord,
  useGetJob,
  useGetServiceTypes,
  useGetTimezone,
} from '../_api';
import {
  mountMapInitialState,
  mountPageInitialState,
  mountStep2InitialState,
  mountStep3InitialState,
} from '../_atoms';

import { CommentsDrawer } from './CommentsDrawer';
import { Content } from './Content';
import { Footer } from './Footer';
import { Header } from './Header';
import { InvoiceDrawer } from './InvoiceDrawer';
import { InvoicePreviewController } from './InvoicePreview';
import { Map } from './Map';
import { PhotosDrawer } from './PhotosDrawer';
import { ProvidersDrawer } from './ProvidersDrawer';

interface ContainerProps {
  jobId: string;
  initialJobDetails?: JobParsed;
  initialServiceTypes?: ServiceTypeRecord;
  initialTimezone?: GetTimezoneParsedResponse;
  initialAtomsStates: {
    page: Parameters<typeof mountPageInitialState>[0];
    step2: Parameters<typeof mountStep2InitialState>[0];
    step3: Parameters<typeof mountStep3InitialState>[0];
    map: Parameters<typeof mountMapInitialState>[0];
  };
}

export function Container({
  jobId,
  initialJobDetails,
  initialServiceTypes,
  initialTimezone,
  initialAtomsStates,
}: ContainerProps) {
  useHydrateAtoms([
    mountPageInitialState(initialAtomsStates.page),
    mountStep2InitialState(initialAtomsStates.step2),
    mountStep3InitialState(initialAtomsStates.step3),
    mountMapInitialState(initialAtomsStates.map),
  ]);

  const router = useRouter();

  const getJob = useGetJob(jobId, { initialData: initialJobDetails });
  useGetServiceTypes({ initialData: initialServiceTypes });
  useGetTimezone(
    {
      lat: getJob.data?.location_latitude ?? undefined,
      lng: getJob.data?.location_longitude ?? undefined,
    },
    { initialData: initialTimezone }
  );

  const pageSize = useGetPageSize();

  useEffect(() => {
    if (getJob.isLoadingError) {
      if (isAxiosError(getJob.error) && getJob.error.response?.status === 404) {
        toast.warning('Job not found');
      } else {
        toast.error(
          `Error to load job${
            getJob.error instanceof Error ? `: ${getJob.error.message}` : ''
          }`
        );
      }

      router.push(`/jobs?size=${pageSize}`);
    }
  }, [getJob.isLoadingError, getJob.error, router, pageSize]);

  useEffect(() => {
    document.body.style.overflowY = 'hidden';

    return () => {
      document.body.style.overflowY = '';
    };
  }, []);

  return (
    <S.Container overflow="hidden">
      <Header />

      <Flex flex={1}>
        <S.Container.ContentWrapper>
          <Content />
          <Footer />
        </S.Container.ContentWrapper>

        <Map />
      </Flex>

      <ProvidersDrawer />
      <PhotosDrawer />
      <CommentsDrawer />
      <InvoiceDrawer />

      <InvoicePreviewController />
    </S.Container>
  );
}
