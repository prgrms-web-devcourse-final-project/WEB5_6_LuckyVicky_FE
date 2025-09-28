"use client";

import { Column, DataTable } from "@/components/table/DataTable";

type Faq = {
  no: string;
  category: string;
  title: string;
};

const faqCols: Column<Faq>[] = [
  { key: "no", header: "글번호", width: "w-24" },
  {
    key: "category",
    header: "카테고리",
    width: "w-28",
    render: (r) => r.category
  },
  {
    key: "title",
    header: "제목",
    render: (r) => <a className="hover:underline" href={`/help/faq/${r.no}`}>{r.title}</a>,
  },
];

export default function Page() {
  const rows: Faq[] = [
    { no: "024", category: "회원/가입", title: "회원 탈퇴는 어떻게 하나요?" },
    { no: "020", category: "교환/환불", title: "주문한 제품을 교환하고 싶어요." },
  ];
  return (
    <>
         <div className="mt-[94px] mb-4 flex items-center justify-between">
           <h3 className="text-2xl font-bold">자주 묻는 질문(FAQ)</h3>
         </div>
   
         <DataTable
           columns={faqCols}
           rows={rows}
           rowKey={(r) => r.no}
           onRowClick={(r) => location.assign(`/help/faq/${r.no}`)}
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
  )
  
}
