import ToastProvider from "@/components/ToastProvider";
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
return (
<html lang="ko">
<body>
  <ToastProvider>{children}</ToastProvider>
</body>
</html>
);
}