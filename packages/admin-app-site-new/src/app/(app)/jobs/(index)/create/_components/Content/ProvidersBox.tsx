import { HelpTooltip } from '@/app/(app)/_components';
import { useShouldBlurSection } from '@/app/(app)/jobs/(index)/_atoms';
import { S } from '@/app/(app)/jobs/(index)/_components';
import { Label, NumberInput } from '@/components';
import { Flex } from '@/styled-system/jsx';

export function ProvidersBox() {
  const shouldBlurSection = useShouldBlurSection();

  return (
    <Flex
      direction="column"
      gap={2}
      css={shouldBlurSection ? S.blurredStyles.raw() : {}}
    >
      <Flex align="center" gap={1.5}>
        <Label htmlFor="providers-number" maxW="max" color="gray.600">
          Providers requested
        </Label>

        <HelpTooltip
          description="Number of providers requested for this job"
          tabIndex={-1}
        />
      </Flex>

      <NumberInput
        id="providers-number"
        placeholder="0"
        defaultValue="1"
        disabled
      />
    </Flex>
  );
}
