"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

type AdminLink = {
  label: string;
  href?: string;
  children?: AdminLink[];
};

const adminLinks: AdminLink[] = [
  { href: "/artist/main", label: "메인 현황" },
  { href: "/artist/products", label: "상품 관리" },
  {
    label: "주문 관리",
    children: [
      { href: "/artist/monitor/approve", label: "주문 내역" },
      { href: "/artist/monitor/monitor", label: "취소 요청" },
      { href: "/artist/monitor/monitor", label: "교환 요청" },
    ],
  },
  {
    label: "정산 내역",
    children: [
      { href: "/artist/monitor/approve", label: "정산 현황" },
      { href: "/artist/monitor/monitor", label: "환전 요청" },
      { href: "/artist/monitor/monitor", label: "입금/환전 내역" },
    ],
  },
  { href: "/artist/users", label: "펀딩 관리" },
  { href: "/artist/account-setting", label: "판매자 설정" },
];

type AdminSidebarProps = {
  className?: string;
};

export default function ArtistSidebar({ className }: AdminSidebarProps = {}) {
  const pathname = usePathname();

  return (
    <aside
      className={clsx(
        "w-[240px] bg-[var(--color-primary-20)] p-6 text-[var(--color-gray-800)]",
        className,
      )}
    >
      <div className="mb-6 text-xl font-bold">작가 페이지</div>
      <nav className="space-y-4">
        {adminLinks.map((link) => {
          const hasChildren = Array.isArray(link.children) && link.children.length > 0;

          const isActiveDirect = link.href
            ? pathname === link.href || pathname.startsWith(`${link.href}/`)
            : false;

          const isActiveChild = hasChildren
            ? link.children!.some(
                (child) =>
                  child.href &&
                  (pathname === child.href || pathname.startsWith(`${child.href}/`)),
              )
            : false;

          const isActive = isActiveDirect || isActiveChild;

          const baseClass = clsx(
            "block rounded-md px-2 py-1 text-base transition-colors",
            isActive ? "font-extrabold text-primary" : "font-medium text-[var(--color-gray-700)]",
            link.href && "hover:text-primary",
          );

          const parentContent = link.href ? (
            <Link key={link.label} href={link.href} className={baseClass}>
              {link.label}
            </Link>
          ) : (
            <span key={link.label} className={baseClass}>
              {link.label}
            </span>
          );

          return (
            <div key={link.label} className="space-y-2">
              {parentContent}
              {hasChildren && (
                <ul className="space-y-1 pl-4 text-sm">
                  {link.children!.map((child) => {
                    const childActive =
                      child.href &&
                      (pathname === child.href || pathname.startsWith(`${child.href}/`));
                    return child.href ? (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          className={clsx(
                            "block rounded-md px-2 py-1 transition-colors hover:text-primary",
                            childActive
                              ? "font-extrabold text-primary"
                              : "font-medium text-[var(--color-gray-600)]",
                          )}
                        >
                          {child.label}
                        </Link>
                      </li>
                    ) : (
                      <li key={child.label} className="px-2 py-1">
                        {child.label}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
