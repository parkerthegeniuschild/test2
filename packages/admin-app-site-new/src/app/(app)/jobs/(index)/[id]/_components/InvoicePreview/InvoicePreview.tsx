import * as Ariakit from '@ariakit/react';

import { useJobId } from '@/app/(app)/jobs/(index)/[id]/_hooks';
import { Icon } from '@/components';
import { css, cx } from '@/styled-system/css';
import { Flex, styled } from '@/styled-system/jsx';

import { InvoicePreviewPdf } from './InvoicePreviewPdf';

const Backdrop = styled('div', {
  base: {
    position: 'fixed',
    zIndex: 'modal',
    inset: 0,
    overflow: 'auto',
    bgColor: 'rgba(23, 32, 38, 0.80)',
    backdropFilter: 'blur(12px)',

    opacity: 0,
    transitionProperty: 'opacity',
    transitionTimingFunction: 'easeInOut',
    transitionDuration: 'fast',

    '&[data-enter]': {
      opacity: 1,
    },
  },
});

const Dialog = styled('div', {
  base: {
    maxW: '55rem',
    m: 'auto',

    opacity: 0,
    transitionProperty: 'opacity',
    transitionTimingFunction: 'easeInOut',
    transitionDuration: 'fast',

    '&[data-enter]': {
      opacity: 1,
    },
  },
});

interface InvoicePreviewProps {
  open: boolean;
  invoiceUrl: string | null;
  onClose: () => void;
}

export function InvoicePreview({
  open,
  invoiceUrl,
  onClose,
}: InvoicePreviewProps) {
  const jobId = useJobId();

  const dialogStore = Ariakit.useDialogStore({
    animated: true,
    open,
    setOpen: _open => !_open && onClose?.(),
  });

  return (
    <Ariakit.Dialog
      backdrop={false}
      store={dialogStore}
      unmountOnHide
      getPersistentElements={() =>
        document.querySelectorAll(
          '.invoice-preview-heading,.invoice-preview-dismiss,#invoice-preview-header-slot'
        )
      }
      render={props => {
        const dataEnter = (props as { 'data-enter': boolean })['data-enter'];
        const dataLeave = (props as { 'data-leave': boolean })['data-leave'];

        return (
          <Backdrop
            hidden={!open}
            data-enter={dataEnter}
            data-leave={dataLeave}
          >
            <Flex
              align="center"
              justify="space-between"
              h="4.25rem"
              pl={6}
              pr={5}
              position="sticky"
              top={0}
            >
              <Flex align="center" gap={6}>
                <Ariakit.DialogDismiss
                  className={cx(
                    css({ cursor: 'pointer', outlineColor: 'white' }),
                    'invoice-preview-dismiss'
                  )}
                  title="Dismiss preview"
                >
                  <Icon.XClose
                    className={css({ color: 'white', fontSize: 'xl' })}
                  />
                </Ariakit.DialogDismiss>
                <Ariakit.DialogHeading
                  className={cx(
                    css({
                      fontSize: 'xl',
                      lineHeight: 1,
                      color: 'white',
                      fontWeight: 'semibold',
                    }),
                    'invoice-preview-heading'
                  )}
                >
                  Invoice for job #{jobId}.pdf
                </Ariakit.DialogHeading>
              </Flex>

              <div id="invoice-preview-header-slot" />
            </Flex>
            <Dialog {...props} data-enter={dataEnter} data-leave={dataLeave} />
          </Backdrop>
        );
      }}
    >
      {!!invoiceUrl && (
        <InvoicePreviewPdf jobId={jobId} invoiceUrl={invoiceUrl} />
      )}
    </Ariakit.Dialog>
  );
}
