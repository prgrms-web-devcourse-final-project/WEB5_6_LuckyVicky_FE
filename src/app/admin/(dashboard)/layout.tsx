'use client';

import AdminHeader from '@/components/AdminHeader';
import Link from 'next/link';
import Login from '@/assets/icon/login.svg';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <AdminHeader
        right={
          <Link
            href="/admin/login"
            className="flex h-full items-center gap-2 px-2 text-sm font-medium leading-none hover:underline -translate-y-2"
          >
            <Login className="block h-4 w-4 translate-y-[0.5px]" />
            <span className="leading-none">로그인/로그아웃</span>
          </Link>
        }
      />
      <div className="flex flex-1 gap-6">
        <aside className="w-[240px] bg-[var(--color-primary-20)] p-6">
          <div className="mb-6 text-xl font-bold">관리자 페이지</div>
          <nav className="space-y-3 text-[var(--color-gray-800)]">
            <Link href="/admin/main" className="block">
              메인 현황
            </Link>
            <Link href="/admin/products" className="block">
              상품 관리
            </Link>
            <Link href="/admin/users" className="block">
              사용자 관리
            </Link>
            <Link href="/admin/orders" className="block">
              매출/정산
            </Link>
            <Link href="/admin/monitor" className="block">
              펀딩 모니터링
            </Link>
            <Link href="/admin/approvals" className="block">
              입점 승인
            </Link>
          </nav>
        </aside>

        <main className="flex-1 bg-white p-20">{children}</main>
      </div>
    </div>
  );
}
