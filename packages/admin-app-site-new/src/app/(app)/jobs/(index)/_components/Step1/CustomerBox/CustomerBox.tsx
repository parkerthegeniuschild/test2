import { useParams } from 'next/navigation';

import { useIsMounted } from '@/app/(app)/_hooks';
import {
  useCustomerAtom,
  useShouldBlurSection,
} from '@/app/(app)/jobs/(index)/_atoms';
import { blurredStyles } from '@/app/(app)/jobs/(index)/_components/styles';
import { Box } from '@/styled-system/jsx';

import { CustomerAutocomplete } from './CustomerAutocomplete';
import { CustomerCard } from './CustomerCard';
import { CustomerForm } from './CustomerForm';

export function CustomerBox() {
  const shouldBlurSection = useShouldBlurSection();

  const customerAtom = useCustomerAtom();

  const isMounted = useIsMounted();

  const isOnJobDetailsScreen = !!useParams().id;

  if (customerAtom.data.state === 'card') {
    return (
      <Box css={shouldBlurSection ? blurredStyles.raw() : {}}>
        <CustomerCard />
      </Box>
    );
  }

  if (customerAtom.data.state === 'form') {
    return <CustomerForm />;
  }

  return (
    <Box css={shouldBlurSection ? blurredStyles.raw() : {}}>
      <CustomerAutocomplete showOnFocus={isMounted || isOnJobDetailsScreen} />
    </Box>
  );
}
