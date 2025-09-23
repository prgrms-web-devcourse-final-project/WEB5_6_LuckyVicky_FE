import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Header from '@/components/Header';

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
    <html lang="ko-KR">
      <body className={suit.variable}>
        <div className="flex flex-col h-screen">
          <Header />
          <main className="flex-1">
              {children}
          </main>
        </div>
      </body>
    </html>
  );
}

