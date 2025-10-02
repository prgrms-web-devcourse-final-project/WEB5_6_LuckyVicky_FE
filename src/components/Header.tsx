'use client';

import Shop from '@/assets/icon/shop.svg';
import Mypage from '@/assets/icon/mypage.svg';
import News from '@/assets/icon/news.svg';
import Login from '@/assets/icon/login.svg';

import { navItems } from '@/utils/navigation';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import CategoryNav from './CategoryNav';
import Notification from './Notification';
import SearchBox from './search/SearchBox';
import { useAuthStore } from '@/stores/authStore';
import { useLogout } from '@/hooks/useLogout';

function MenuIcon({ href }: { href: string }) {
  switch (href) {
    case '/shop':
      return <Shop />;
    case '/mypage':
      return <Mypage />;
    case '/news':
      return <News />;
    default:
      return null;
  }
}

const isNotificationItem = (item: { href: string; label: string }) =>
  item.href === '/news';

export default function Header() {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');
    const role = useAuthStore((state) => state.role);
    const reset = useAuthStore((state) => state.reset);

  const pathname = usePathname();
  const [notifOpen, setNotifOpen] = useState(false);

  const { logout } = useLogout();
  
  // 라우트 바뀔 때마다 검색창 초기화
  useEffect(() => {
    setKeyword('');
  }, [pathname]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = keyword.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  // 알림창 열리면 외부 스크롤 막기
  useEffect(() => {
    if (notifOpen) document.body.classList.add('overflow-hidden');
    else document.body.classList.remove('overflow-hidden');
    return () => document.body.classList.remove('overflow-hidden');
  }, [notifOpen]);

  const authItems = navItems.filter(
    (item) => item.href === '/login' || item.href === '/register',
  );

  const otherItems = navItems.filter(
    (item) => item.href !== '/login' && item.href !== '/register',
  );

  return (
    <>
      <header className="bg-[#F6F4EB] py-[20px] px-[125px] text-gray-600 flex items-center justify-between">
        {/* 로고 */}
        <h1 className="shrink-0">
          <Link href="/">
            <Image
              src="/logo.svg"
              alt="사이트 로고"
              width={200}
              height={100}
              priority
            />
          </Link>
        </h1>

        {/* 검색창 */}
        <SearchBox />

        {/* 우측 내비 */}
        <nav>
          <h2 className="sr-only">메인 메뉴</h2>

          <ul className="flex flex-wrap gap-5">
            <li className="flex items-center gap-1.5">
              <Login />
              {/* 로그인/회원가입 */}
              {role ? (
                <button
                  type="button"
                  onClick={logout}
                  className="hover:text-primary"
                >
                  로그아웃
                </button>
              ) : (
                authItems.map(({ href, label }, index) => (
                  <React.Fragment key={href}>
                    <Link
                      href={href}
                      className={
                        pathname === href
                          ? 'text-primary'
                          : 'hover:text-primary'
                      }
                    >
                      {label}
                    </Link>
                    {index < authItems.length - 1 && (
                      <span className="text-gray-600">/</span>
                    )}
                  </React.Fragment>
                ))
              )}
            </li>
            {/* 나머지 */}
            {otherItems.map((item) => {
              const { href, label } = item;

              // 알림아이콘은 버튼으로
              if (isNotificationItem(item)) {
                return (
                  <li key={href}>
                    <button
                      type="button"
                      onClick={() => setNotifOpen(true)}
                      className="flex items-center gap-1.5 hover:text-primary cursor-pointer"
                    >
                      <MenuIcon href={href} />
                      {label}
                    </button>
                  </li>
                );
              }

              // 알림아이콘 제외 나머지는 라우팅
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`flex items-center gap-1.5 ${
                      pathname === href ? 'text-primary' : 'hover:text-primary'
                    }`}
                  >
                    <MenuIcon href={href} />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>

      <CategoryNav />

      {/* 알림 창 */}
      <Notification open={notifOpen} onClose={() => setNotifOpen(false)} />
    </>
  );
}
