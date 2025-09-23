import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const suit = localFont({
  src: [
    {
      path: './fonts/SUIT-Variable.woff2',
      weight: '100 900',
      style: 'normal',
    },
  ],
  variable: '--font-suit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: '모리모리',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={suit.variable}>
      <body>{children}</body>
    </html>
  );
}
