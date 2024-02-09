import { type EmailedInvoiceEntryParsed } from '@/app/(app)/jobs/(index)/[id]/_api';
import { emitViewInvoiceRequest } from '@/app/(app)/jobs/(index)/[id]/_events';
import { useJobId } from '@/app/(app)/jobs/(index)/[id]/_hooks';
import {
  Button,
  Heading,
  Icon,
  Label,
  StackedInput,
  TextButton,
  TextInput,
} from '@/components';
import { css } from '@/styled-system/css';
import { Flex } from '@/styled-system/jsx';

interface InvoiceDrawerEmailViewProps {
  emailViewData: EmailedInvoiceEntryParsed;
  onBack: () => void;
}

export function InvoiceDrawerEmailView({
  emailViewData,
  onBack,
}: InvoiceDrawerEmailViewProps) {
  const jobId = useJobId();

  return (
    <div>
      <Flex
        direction="column"
        gap={4}
        p={5}
        borderBottomWidth="1px"
        borderColor="gray.100"
      >
        <TextButton
          colorScheme="gray"
          maxW="max"
          leftSlot={
            <Icon.ArrowUp className={css({ transform: 'rotate(-90deg)' })} />
          }
          onClick={onBack}
        >
          Back
        </TextButton>

        <Heading as="h2" fontSize="xl" fontWeight="semibold">
          (Email) {emailViewData.formattedDate} - {emailViewData.formattedTime}
        </Heading>
      </Flex>

      <Flex direction="column" p={5} gap={7}>
        <form className={css({ display: 'flex', flexDir: 'column', gap: 5 })}>
          <Label required text="To" color="gray.600">
            <TextInput
              placeholder="example@email.com"
              type="email"
              disabled
              defaultValue={emailViewData.email_to}
            />
          </Label>

          <Flex direction="column" gap={2}>
            <Label htmlFor="invoice-subject" required color="gray.600">
              Email message
            </Label>

            <StackedInput>
              <StackedInput.TextInput
                id="invoice-subject"
                placeholder="Subject"
                disabled
                defaultValue={emailViewData.subject}
              />
              <StackedInput.Textarea
                rows={4}
                placeholder="Body"
                disabled
                defaultValue={emailViewData.body}
              />
            </StackedInput>
          </Flex>
        </form>

        <Button
          variant="secondary"
          size="sm"
          alignSelf="flex-start"
          leftSlot={<Icon.File />}
          onClick={() =>
            emitViewInvoiceRequest({ invoiceUrl: emailViewData.invoice_url })
          }
        >
          Invoice for job #{jobId}.pdf
        </Button>
      </Flex>
    </div>
  );
}
