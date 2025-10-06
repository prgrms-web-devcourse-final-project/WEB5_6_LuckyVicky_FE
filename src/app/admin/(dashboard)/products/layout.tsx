'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

function Subnav() {
  const pathname = usePathname();
  const Tab = ({ href, label }: { href: string; label: string }) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        className={`px-3 py-2 rounded-md border text-sm ${
          active ? 'font-semibold border-primary text-primary'
                 : 'text-[var(--color-gray-700)] hover:text-primary'
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <div className="mb-6 flex gap-2">
      <Tab href="/admin/products" label="상품 목록" />
      <Tab href="/admin/products/categories" label="카테고리" />
      <Tab href="/admin/products/tags" label="태그" />
    </div>
  );
}

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-6">
      <Subnav />
      {children}
    </div>
  );
}
