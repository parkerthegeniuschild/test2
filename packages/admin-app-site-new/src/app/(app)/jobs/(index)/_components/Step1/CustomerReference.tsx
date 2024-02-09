import { HelpTooltip } from '@/app/(app)/_components';
import {
  useShouldBlurSection,
  useStep1Atom,
} from '@/app/(app)/jobs/(index)/_atoms';
import { blurredStyles } from '@/app/(app)/jobs/(index)/_components/styles';
import { Label, TextInput } from '@/components';
import { Box, Flex } from '@/styled-system/jsx';

export function CustomerReference() {
  const step1Atom = useStep1Atom();
  const shouldBlurSection = useShouldBlurSection();

  return (
    <Flex
      gap={2}
      direction="column"
      css={shouldBlurSection ? blurredStyles.raw() : {}}
    >
      <Flex align="center" gap={1.5}>
        <Label color="gray.600" htmlFor="customer-reference-number-input">
          Customer reference #
        </Label>

        <HelpTooltip
          description="Customer's internal number to reference this job"
          tabIndex={-1}
        />
      </Flex>

      <Box maxW="15.25rem">
        <TextInput
          id="customer-reference-number-input"
          placeholder="Enter reference #"
          tabIndex={shouldBlurSection ? -1 : undefined}
          autoComplete="off"
          value={step1Atom.data.customerReference}
          onChange={e => step1Atom.setCustomerReference(e.target.value)}
        />
      </Box>
    </Flex>
  );
}
