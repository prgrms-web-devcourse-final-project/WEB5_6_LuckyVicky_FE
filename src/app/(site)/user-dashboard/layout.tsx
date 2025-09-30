'use client';

import Link from 'next/link';
import { navItems } from './navigation';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const toggleMenu = (href: string) => {
    if (openMenus.includes(href)) {
      setOpenMenus(openMenus.filter((menu) => menu !== href));
    } else {
      setOpenMenus([...openMenus, href]);
    }
  };

  return (
    <div className="flex">
      <div className="h-100vh w-[241px] bg-primary-20 pl-[21px]">
        <h2 className="text-[32px] font-bold pt-7 mb-[34px]">마이 페이지</h2>
        <div className="flex flex-col gap-[26px]">
          {navItems.map((elem) => {
            const isActive = pathname === elem.href;
            const hasSubItems = elem.subItems && elem.subItems.length > 0;
            const isOpen = openMenus.includes(elem.href);
            const isParentActive =
              hasSubItems && elem.subItems.some((sub) => pathname === sub.href);

            return (
              <div key={elem.href}>
                {/* 상위 메뉴 */}
                <div className="flex items-center justify-between pr-8">
                  {hasSubItems ? (
                    // 하위 메뉴가 있으면 버튼으로 토글만
                    <button
                      onClick={() => toggleMenu(elem.href)}
                      className={`font-bold text-[18px] text-left ${
                        isActive || isParentActive
                          ? 'text-primary font-extrabold'
                          : ''
                      }`}
                    >
                      {elem.label}
                    </button>
                  ) : (
                    // 하위 메뉴가 없으면 링크로 이동
                    <div
                      className={`font-bold text-[18px] ${
                        isActive || isParentActive
                          ? 'text-primary font-extrabold'
                          : ''
                      }`}
                    >
                      <Link href={elem.href}>{elem.label}</Link>
                    </div>
                  )}

                  {/* 화살표 아이콘 (하위 메뉴가 있을 때만) */}
                  {hasSubItems && (
                    <svg
                      className={`w-3 h-3 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                      fill="currentColor"
                      viewBox="0 0 12 8"
                    >
                      <path d="M6 8L0 0h12L6 8z" />
                    </svg>
                  )}
                </div>

                {/* 하위 메뉴 (열려있을 때만) */}
                {hasSubItems && isOpen && (
                  <div className="ml-4 mt-3 flex flex-col gap-3">
                    {elem.subItems.map((subItem) => {
                      const isSubActive = pathname === subItem.href;
                      return (
                        <div
                          key={subItem.href}
                          className={`text-[16px] ${
                            isSubActive
                              ? 'text-primary font-extrabold'
                              : 'text-gray-700 font-bold'
                          }`}
                        >
                          <Link href={subItem.href}>{subItem.label}</Link>
                        </div>
                      );
                    })}
                  </div>
                )}
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
