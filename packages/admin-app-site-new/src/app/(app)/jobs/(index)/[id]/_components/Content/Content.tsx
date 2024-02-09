import { useParams } from 'next/navigation';

import { S } from '@/app/(app)/jobs/(index)/_components';
import { useGetJob } from '@/app/(app)/jobs/(index)/[id]/_api';
import { usePageAtom } from '@/app/(app)/jobs/(index)/[id]/_atoms';
import { css } from '@/styled-system/css';

import { Step1Box } from './Step1Box';
import { Step2Box } from './Step2Box';
import { Step3Box } from './Step3Box';

export function Content() {
  const params = useParams();
  const getJob = useGetJob(params.id as string);

  const pageAtom = usePageAtom();

  if (!getJob.data) {
    return null;
  }

  return (
    <S.Content.Container
      {...{ inert: pageAtom.data.priceSummaryFocusedSection ? '' : undefined }}
      css={
        pageAtom.data.priceSummaryFocusedSection ? S.blurredStyles.raw() : {}
      }
    >
      <Step1Box />

      <hr className={css({ borderColor: 'gray.200' })} />

      <Step2Box />

      {pageAtom.data.currentStep >= 3 && (
        <>
          <hr className={css({ borderColor: 'gray.200' })} />
          <Step3Box />
        </>
      )}
    </S.Content.Container>
  );
}
