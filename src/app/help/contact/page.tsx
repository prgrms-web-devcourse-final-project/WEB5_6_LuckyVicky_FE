"use client";
import type { Column } from "@/components/table/DataTable";
import { DataTable } from "@/components/table/DataTable";
import Button from "@/components/Button";

type Question = {
  no: string;
  category: string;
  title: string;
  author: string;
  date: string;
  views: number;
};

const noticeCols: Column<Question>[] = [
  { key: "no", header: "글번호", width: "w-24" },
  {
    key: "title",
    header: "제목",
    render: (r) => (
      <div className="flex items-center gap-2">
        <span className="truncate font-medium">{r.title}</span>
      </div>
    ),
  },
  { key: "author", header: "작성자", width: "w-28" },
  { key: "date", header: "작성일", width: "w-28" },
  { key: "views", header: "조회수", width: "w-20", align: "right" },
];

export default function QuestionListPage() {
  const rows: Question[] = [
    { no: "76012", category: "입고/재입고", title: "재입고 언제 되나요?", author: "ㅇㅇㅇ", date: "25.09.16", views: 1 },
    { no: "76011", category: "배송", title: "택배가 도착을 안해요", author: "ㅇㅇㅇ", date: "25.09.16", views: 1 },
    { no: "76010", category: "작가 입점", title: "작가회원 승인 언제 되나요?", author: "ㅇㅇㅇ", date: "25.09.16", views: 1 },
    { no: "76009", category: "배송", title: "상품이 누락됐어요", author: "ㅇㅇㅇ", date: "25.09.16", views: 1 },
    { no: "76008", category: "품질/불량", title: "키링 고리가 떨어져서 왔어요", author: "ㅇㅇㅇ", date: "25.09.16", views: 1 },
    
  ];

  return (
    <>
      <div className="mt-[94px] mb-4 flex items-center justify-between">
        <h3 className="text-2xl font-bold">문의하기</h3>
        <Button variant="primary" size="sm">
          문의글 작성
        </Button>
      </div>

      <DataTable
        columns={noticeCols}
        rows={rows}
        rowKey={(r) => r.no}
        onRowClick={(r) => location.assign(`/help/notices/${r.no}`)}
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
