"use client";
import type { Column } from "@/components/table/DataTable";
import { DataTable } from "@/components/table/DataTable";
import Button from "@/components/Button";
import Link from "next/link";

type Notice = {
  no: string;
  title: string;
  important?: boolean;
  author: string;
  date: string;
  views: number;
};

const noticeCols: Column<Notice>[] = [
  { key: "no", header: "글번호", width: "w-24" },
  {
    key: "title",
    header: "제목",
    render: (r) => (
      <div className="flex items-center gap-2">
        <span className="truncate font-medium">{r.title}</span>
        {r.important && <span className="text-red-500 font-extrabold">중요</span>}
      </div>
    ),
  },
  { key: "author", header: "작성자", width: "w-28" },
  { key: "date", header: "작성일", width: "w-28" },
  { key: "views", header: "조회수", width: "w-20", align: "center" },
];

export default function NoticeListPage() {
  const rows: Notice[] = [
    { no: "00002", title: "2025 추석연휴 배송공지", important: true, author: "관리자", date: "25.09.16", views: 1 },
    { no: "00001", title: "작가회원 입점 신청 안내", important: true, author: "관리자", date: "25.09.16", views: 1 },
    { no: "00003", title: "배송 누락 시 문의글 작성 가이드 안내", important: true, author: "관리자", date: "25.09.16", views: 1 },
    { no: "76009", title: "2025.09월 신규 입점작가 안내", author: "관리자", date: "25.09.16", views: 1 },
  ];

  return (
    <>
      <div className="mt-[94px] mb-4 flex items-center justify-between">
        <h3 className="text-2xl font-bold">공지사항</h3>
        <Link href="/help/notice/new">
          <Button variant="primary" size="sm">
            공지사항 작성
          </Button>
        </Link>
      </div>

      <DataTable
        columns={noticeCols}
        rows={rows}
        rowKey={(r) => r.no}
        rowClassName={(r) => (r.important ? "bg-[var(--color-danger-10)] hover:bg-[var(--color-danger-20)]" : "")}
        onRowClick={(r) => location.assign(`/help/notice/${r.no}`)}
      />

      <nav className="mt-6 flex items-center justify-center gap-4 text-sm text-[var(--color-gray-700)]">
        <button className="px-2 py-1 hover:text-primary" aria-label="Prev">
          ‹
        </button>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            className={`h-8 w-8 rounded-full text-center leading-8 ${
              n === 1 ? "text-primary font-semibold" : "hover:text-primary"
            }`}
          >
            {n}
          </button>
        ))}
        <button className="px-2 py-1 hover:text-primary" aria-label="Next">
          ›
        </button>
      </nav>
    </>
  );
}
