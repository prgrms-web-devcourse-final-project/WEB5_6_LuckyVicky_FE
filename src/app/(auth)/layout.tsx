import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <section className="min-h-dvh grid place-items-center px-4">
      <div className="relative w-full max-w-[866px]">{children}</div>
    </section>
  );
}
