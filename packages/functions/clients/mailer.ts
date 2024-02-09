import { Transporter, createTransport } from 'nodemailer';
import { useSESMailTransport } from './ses';

// eslint-disable-next-line import/no-self-import
export * as mailer from './mailer';

type TMessage = {
  text: string;
  html?: string;
};

type Attachment = {
  content: Buffer;
  filename: string;
  contentType?: string;
};

type TSendEmail = {
  from: string; // format: email or "Name <email>"
  to: string[];
  subject: string;
  message: TMessage;
  attachments?: Attachment[];
};

let _transporter: Transporter | null = null;
const useTransporter = () => {
  if (!_transporter) _transporter = createTransport(useSESMailTransport());
  return _transporter;
};

export const sendEmailViaSES = async ({
  from,
  to,
  subject,
  message,
  attachments,
}: TSendEmail) => {
  return await useTransporter().sendMail({
    from,
    to,
    subject,
    text: message.text,
    html: message.html,
    attachments,
  });
};
