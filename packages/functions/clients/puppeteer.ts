import puppeteer, { PaperFormat, Browser } from 'puppeteer';
import puppeteerCore from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import { PDF_MARGINS_DEFAULT } from '@utils/constants';

// eslint-disable-next-line import/no-self-import
export * as puppeteer from './puppeteer';

type Layout = {
  header: string;
  footer: string;
};

type TGeneratePDF = {
  layout: Layout;
  content: string;
  format?: PaperFormat;
};

let _browser: Browser | null = null;
const useBrowser = async (): Promise<Browser> => {
  if (!_browser) {
    _browser = process.env.IS_LOCAL
      ? await puppeteer.launch({
          args: ['--no-sandbox'],
          headless: chromium.headless,
        })
      : ((await puppeteerCore.launch({
          args: chromium.args,
          defaultViewport: chromium.defaultViewport,
          executablePath: await chromium.executablePath(),
          headless: chromium.headless,
        })) as unknown as Browser);
  }

  return _browser;
};

export const generatePDF = async ({
  layout,
  content,
  format = 'letter',
}: TGeneratePDF) => {
  const page = await (await useBrowser()).newPage();

  await page.setContent(content, {
    waitUntil: 'networkidle0',
  });

  await page.emulateMediaType('print');

  const buffer = await page.pdf({
    format,
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: layout.header,
    footerTemplate: layout.footer,
    scale: 2,
    width: '8.5in',
    margin: PDF_MARGINS_DEFAULT,
  });

  await page.close();

  return buffer;
};
