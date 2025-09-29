'use client';

import Link from 'next/link';
import { navItems } from './navigation';
import { usePathname } from 'next/navigation';

function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex">
      <div className="h-screen w-[241px] bg-primary-20  pl-[21px]">
        <h2 className="text-[32px] font-bold pt-7 mb-[34px]">마이 페이지</h2>
        <div className="flex flex-col gap-[26px]">
          {navItems.map((elem) => {
            const isActive = pathname === elem.href;
            return (
              <div
                key={elem.href}
                className={`font-bold text-[18px] ${isActive ? 'text-primary font-extrabold' : ''}`}
              >
                <Link href={elem.href}>{elem.label}</Link>
              </div>
            );
          })}
        </div>
      </div>
      {children}
    </div>
  );
}
export default Layout;
