import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <section className="min-h-dvh grid place-items-center px-4">
      <div
        className="
                    w-full max-w-[720px] rounded-2xl border
                    border-[color-mix(in-srgb, green 25%, white)] 
                    bg-white p-8 md:p-10
                    shadow-[8px_8px_0_0_color_mix(in_srgb, green 20%, transparent)]
                "
        style={{
          boxShadow: `8px 8px 0 0 color-mix(in srgb, green 25%, transparent)`,
        }}
      >
        {children}
      </div>
    </section>
  );
}
