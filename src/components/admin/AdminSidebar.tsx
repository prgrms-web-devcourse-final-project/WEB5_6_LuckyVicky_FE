"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

const adminLinks = [
  { href: "/admin/main", label: "메인 현황" },
  { href: "/admin/products", label: "상품 관리" },
  { href: "/admin/users", label: "사용자 관리" },
  { href: "/admin/orders", label: "매출/정산" },
  { href: "/admin/monitor", label: "펀딩 모니터링" },
  { href: "/admin/approvals", label: "입점 승인" },
];

type AdminSidebarProps = {
  className?: string;
};

export default function AdminSidebar({ className }: AdminSidebarProps = {}) {
  const pathname = usePathname();

  return (
    <aside
      className={clsx(
        "w-[240px] bg-[var(--color-primary-20)] p-6 text-[var(--color-gray-800)]",
        className,
      )}
    >
      <div className="mb-6 text-xl font-bold">관리자 페이지</div>
      <nav className="space-y-3">
        {adminLinks.map((link) => {
          const isActive =
            pathname === link.href || pathname.startsWith(`${link.href}/`);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "block rounded-md px-2 py-1 transition-colors hover:text-primary",
                isActive
                  ? "font-extrabold text-primary"
                  : "font-medium text-[var(--color-gray-700)]",
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

