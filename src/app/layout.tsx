import ToastProvider from '@/components/ToastProvider';
import SocialRegistrationWatcher from '@/components/auth/SocialRegistrationWatcher';
import '../style/globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <ToastProvider>
          <SocialRegistrationWatcher />
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
