import { useParams } from 'next/navigation';

import { useStep1Atom } from '@/app/(app)/jobs/(index)/_atoms';
import { S } from '@/app/(app)/jobs/(index)/_components';
import { useGetJob } from '@/app/(app)/jobs/(index)/[id]/_api';
import {
  usePageAtom,
  useShouldBlurSection,
} from '@/app/(app)/jobs/(index)/[id]/_atoms';
import { UnlockedOnly } from '@/app/(app)/jobs/(index)/[id]/_components/UnlockedOnly';
import {
  Avatar,
  AvatarGroup,
  Heading,
  Text,
  TextButton,
  UserCard,
} from '@/components';
import { css } from '@/styled-system/css';
import { Flex, styled } from '@/styled-system/jsx';

const SupportText = styled('p', {
  base: {
    fontSize: 'sm',
    lineHeight: 1,
    fontWeight: 'medium',
    color: 'gray.400',

    _empty: { display: 'none' },
  },
});

export function Step1Showcase() {
  const params = useParams();
  const getJob = useGetJob(params.id as string);

  const shouldBlurSection = useShouldBlurSection();
  const pageAtom = usePageAtom();
  const step1Atom = useStep1Atom();

  function handleEditRequest() {
    if (!getJob.data) {
      return;
    }

    pageAtom.setFocusedSection('customer');
    step1Atom.setInitialData({
      company: getJob.data.company,
      dispatchers: [getJob.data.dispatcher],
      drivers: getJob.data.jobDrivers,
      customerReference: getJob.data.customer_ref ?? '',
    });
  }

  if (!getJob.data) {
    return null;
  }

  return (
    <Flex
      justify="space-between"
      px="var(--content-padding-x)"
      pt={5}
      pb={4}
      gap={2}
      css={shouldBlurSection ? S.blurredStyles.raw() : {}}
    >
      <Flex direction="column" gap={2.3}>
        <Heading as="h2" fontSize="md" fontWeight="semibold">
          {getJob.data.company?.name ?? getJob.data.dispatcher.name}
        </Heading>
        <Flex direction="column" gap={1.75}>
          {!!getJob.data.company && (
            <>
              <SupportText display="flex" alignItems="center">
                {getJob.data.company.type}
                {!!getJob.data.company.usdot && (
                  <>
                    <S.Common.Dot />
                    {`USDOT #${getJob.data.company.usdot}`}
                  </>
                )}
              </SupportText>
              {!!getJob.data.company.addressText && (
                <SupportText>{getJob.data.company.addressText}</SupportText>
              )}
            </>
          )}

          {!getJob.data.company && (
            <>
              <SupportText>
                Person
                {!!getJob.data.dispatcher.email && (
                  <>
                    <S.Common.Dot />
                    {getJob.data.dispatcher.email}
                  </>
                )}
              </SupportText>

              <SupportText>
                {getJob.data.dispatcher.formattedPhone}
                {!!getJob.data.dispatcher.formattedSecondaryPhone && (
                  <>
                    <S.Common.Dot />
                    {getJob.data.dispatcher.formattedSecondaryPhone}
                  </>
                )}
              </SupportText>
            </>
          )}
        </Flex>

        {!!getJob.data.customer_ref && (
          <Text fontWeight="medium">
            Customer ref:{' '}
            <span className={css({ color: 'gray.400' })}>
              {getJob.data.customer_ref}
            </span>
          </Text>
        )}
      </Flex>

      <Flex direction="column" justify="space-between" align="flex-end" gap={6}>
        <UnlockedOnly fallback={<div className={css({ h: 3.5 })} />}>
          <TextButton
            type="button"
            tabIndex={shouldBlurSection ? -1 : undefined}
            disabled={pageAtom.data.isPublishing}
            onClick={handleEditRequest}
          >
            Edit
          </TextButton>
        </UnlockedOnly>

        <AvatarGroup>
          <UserCard
            tabIndex={-1}
            trigger={
              <Avatar
                name={getJob.data.dispatcher.name}
                userRole="dispatcher"
              />
            }
          >
            <UserCard.Header>
              <UserCard.Name>{getJob.data.dispatcher.name}</UserCard.Name>
              <UserCard.Role userRole="dispatcher" />
            </UserCard.Header>

            {!!getJob.data.dispatcher.formattedPhone && (
              <UserCard.Item>
                <UserCard.Phone
                  disableSMS={getJob.data.dispatcher.is_no_text_messages}
                >
                  {getJob.data.dispatcher.formattedPhone}
                </UserCard.Phone>
                {!!getJob.data.dispatcher.formattedSecondaryPhone && (
                  <UserCard.Phone
                    disableSMS={getJob.data.dispatcher.is_no_text_messages}
                  >
                    {getJob.data.dispatcher.formattedSecondaryPhone}
                  </UserCard.Phone>
                )}
              </UserCard.Item>
            )}
          </UserCard>
          <>
            {getJob.data.jobDrivers.map(driver => (
              <UserCard
                key={driver.id}
                trigger={<Avatar name={driver.name} userRole="driver" />}
                tabIndex={-1}
              >
                <UserCard.Header>
                  <UserCard.Name>{driver.name}</UserCard.Name>
                  <UserCard.Role userRole="driver" />
                </UserCard.Header>

                {!!driver.formattedPhone && (
                  <UserCard.Item>
                    <UserCard.Phone>{driver.formattedPhone}</UserCard.Phone>
                    {!!driver.formattedSecondaryPhone && (
                      <UserCard.Phone>
                        {driver.formattedSecondaryPhone}
                      </UserCard.Phone>
                    )}
                  </UserCard.Item>
                )}
              </UserCard>
            ))}
          </>
        </AvatarGroup>
      </Flex>
    </Flex>
  );
}
