import { useState } from 'react';
import { Document, type DocumentProps, Page, pdfjs } from 'react-pdf';
import { Portal } from '@ariakit/react';

import { Spinner } from '@/components';
import { env } from '@/env';
import { Center, styled } from '@/styled-system/jsx';

import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

if (
  env.NODE_ENV === 'production' &&
  typeof window !== 'undefined' &&
  'Worker' in window
) {
  pdfjs.GlobalWorkerOptions.workerPort = new Worker(
    new URL('pdfjs-dist/build/pdf.worker.min.js', import.meta.url).toString()
  );
}

if (env.NODE_ENV === 'development') {
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url
  ).toString();
}

const Container = styled('div', {
  base: {
    overflow: 'hidden',
    mb: 8,

    '& .react-pdf__Page + .react-pdf__Page': {
      mt: 4,
    },
  },
});

const DownloadButton = styled('button', {
  base: {
    h: 10,
    px: 3.5,
    rounded: 'lg',
    cursor: 'pointer',
    bgColor: 'rgba(0, 204, 102, 0.24)',
    color: 'primary',
    fontSize: 'md',
    lineHeight: 1,
    fontWeight: 'semibold',
    outlineColor: 'white',
    position: 'relative',
    transitionProperty: 'box-shadow',
    transitionTimingFunction: 'ease-in-out',
    transitionDuration: 'fast',
    outline: 0,

    _focus: {
      shadow: '0px 0px 0px 4px rgba(0, 204, 102, 0.48)',
    },
  },
});

const options: DocumentProps['options'] = {
  cMapUrl: '/cmaps/',
  standardFontDataUrl: '/standard_fonts/',
};

const getPortalElement = () =>
  document.getElementById('invoice-preview-header-slot');

function downloadPdf({
  jobId,
  invoiceUrl,
}: {
  jobId: string;
  invoiceUrl: string;
}) {
  const link = document.createElement('a');
  link.href = invoiceUrl;
  link.download = `Invoice for job #${jobId}.pdf`;
  link.click();
}

interface InvoicePreviewPdfProps {
  jobId: string;
  invoiceUrl: string;
}

export function InvoicePreviewPdf({
  jobId,
  invoiceUrl,
}: InvoicePreviewPdfProps) {
  const [numPages, setNumPages] = useState<number>();

  function handleDownloadPdf() {
    const isBase64Url = invoiceUrl.startsWith('data:application/pdf;base64');

    if (isBase64Url) {
      downloadPdf({ jobId, invoiceUrl });
      return;
    }

    void fetch(invoiceUrl)
      .then(response => response.blob())
      .then(blob =>
        downloadPdf({ jobId, invoiceUrl: URL.createObjectURL(blob) })
      );
  }

  return (
    <Container>
      <Document
        file={invoiceUrl}
        loading={
          <Center transform="scale(2)" height="calc(100vh - 6.25rem)">
            <Spinner borderColor="white!" />
          </Center>
        }
        options={options}
        onLoadSuccess={({ numPages: _numPages }) => setNumPages(_numPages)}
      >
        {Array.from(new Array(numPages), (_, index) => (
          <Page key={`page_${index + 1}`} pageNumber={index + 1} width={880} />
        ))}
      </Document>

      {typeof numPages === 'number' && (
        <Portal portalElement={getPortalElement}>
          <DownloadButton
            type="button"
            className="invoice-preview-download-btn"
            onClick={handleDownloadPdf}
          >
            Download
          </DownloadButton>
        </Portal>
      )}
    </Container>
  );
}
