"use client";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

const helpLinks = [
  { href: "/help/notice", label: "공지사항" },
  { href: "/help/faq", label: "자주 묻는 질문(FAQ)" },
  { href: "/help/contact", label: "문의하기" },
];

type HelpSidebarProps = {
  className?: string;
};

export default function HelpSidebar({ className }: HelpSidebarProps = {}) {
  const pathname = usePathname();

  return (
    <aside
      className={clsx(
        "flex w-[241px] shrink-0 flex-col bg-[var(--color-primary-20)] p-6 text-[var(--color-gray-800)]",
        className,
      )}
    >
      <h2 className="mb-6 text-2xl font-bold">고객센터</h2>
      <nav>
        <ul className="space-y-3">
          {helpLinks.map((l) => {
            const active = pathname === l.href || pathname.startsWith(l.href + "/");
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`block rounded-md px-2 py-1 ${
                    active
                      ? "text-primary font-extrabold"
                      : "text-[var(--color-gray-700)] hover:text-primary"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
