import { Fira_Code, Inter as NextInter } from 'next/font/google';

export const Inter = NextInter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const FiraCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-fira-code',
  display: 'swap',
});
