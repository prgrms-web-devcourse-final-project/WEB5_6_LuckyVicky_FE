import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <section className="pt-15 grid place-items-center">
      <div className="relative w-full max-w-[866px] max-h-full">{children}</div>
    </section>
  );
}
