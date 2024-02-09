import { StatusBadge } from '@/app/(app)/jobs/_components';
import { S } from '@/app/(app)/jobs/(index)/_components';
import { Heading } from '@/components';

interface HeaderProps {
  isLoading?: boolean;
}

export function Header({ isLoading }: HeaderProps) {
  return (
    <S.Header.Container>
      <S.Header.LeftBar>
        <Heading variant="subheading">New Job</Heading>

        <S.Header.LeftBarEndContainer>
          <StatusBadge status="DRAFT">
            {isLoading ? 'Saving Draft...' : null}
          </StatusBadge>

          <S.Header.DashedCircle />
        </S.Header.LeftBarEndContainer>
      </S.Header.LeftBar>
    </S.Header.Container>
  );
}
