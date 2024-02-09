import { useState } from 'react';

import { useViewInvoiceRequestListener } from '@/app/(app)/jobs/(index)/[id]/_events';

import { InvoicePreview } from './InvoicePreview';

export function InvoicePreviewController() {
  const [invoiceUrl, setInvoiceUrl] = useState<string | null>(null);

  useViewInvoiceRequestListener(({ invoiceUrl: _invoiceUrl }) =>
    setInvoiceUrl(_invoiceUrl)
  );

  return (
    <InvoicePreview
      open={!!invoiceUrl}
      invoiceUrl={invoiceUrl}
      onClose={() => setInvoiceUrl(null)}
    />
  );
}
