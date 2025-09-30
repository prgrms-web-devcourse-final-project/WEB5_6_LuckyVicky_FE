'use client';

import AdminHeader from '@/components/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';
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
            <div className="flex items-center gap-2">
              <Login className="block h-5 w-5 " />
              <span className="leading-none translate-y-0.5">로그아웃</span>
            </div>
            
          </Link>
        }
      />
      <div className="flex flex-1 gap-6">
        <AdminSidebar />

        <main className="flex-1 bg-white p-20">{children}</main>
      </div>
    </div>
  );
}
