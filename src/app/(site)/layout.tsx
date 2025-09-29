import type { Metadata } from 'next';
import localFont from 'next/font/local';
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
  description: '당신의 일상에 숲이 되어 줄 수 있는 문구 큐레이션 플랫폼',
  icons: {
    icon: '/favicon.svg',
  },

  openGraph: {
    title: '모리모리',
    description:
      '펀딩, 스티커, 메모지, 노트, 작가숲까지 다양한 문구류를 만나보세요',
    url: 'https://kindtiger.com',
    type: 'website',
    siteName: '모리모리',
    images: [
      {
        url: 'https://img.com/og-image.png',
        width: 1200,
        height: 600,
        alt: '모리모리 사이트 이미지',
      },
    ],
    locale: 'ko_KR',
  },
  twitter: {
    title: '모리모리',
    description: '당신의 일상에 숲이 되어 줄 수 있는 문구 큐레이션 플랫폼',
    images: ['https://img.com/og-image.png'],
  },
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
return (
<>
<Header />
<main className="min-h-screen">{children}</main>
</>
);
}