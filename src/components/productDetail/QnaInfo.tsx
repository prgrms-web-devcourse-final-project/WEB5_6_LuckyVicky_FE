import { useState } from "react";
import CategoryBtn from "../mainCategory/CategoryBtn";


export const qnaCategories = [
  { id: "all", label: "전체" },
  { id: "delivery", label: "배송" },
  { id: "stock", label: "입고/재입고" },
  { id: "exchange", label: "교환/환불" },
  { id: "etc", label: "품질/불량" },
];

export const dummyQnaList = [
  {
    id: "1",
    category: "입고/재입고",
    title: "재입고 언제 되나요?",
    user: "작성자1",
    date: "25.09.16",
    views: 1,
    answer: "안녕하세요 고객님, 해당 상품은 2주 후 재입고 예정입니다. 감사합니다.",
  },
  {
    id: "2",
    category: "배송",
    title: "택배가 도착을 안해요",
    user: "작성자2",
    date: "25.09.16",
    views: 1,
    answer: "택배사 물량 증가로 배송이 지연되고 있습니다. 양해 부탁드립니다.",
  },
  {
    id: "3",
    category: "작가입점",
    title: "작가회원 승인 언제되나요?",
    user: "작성자3",
    date: "25.09.16",
    views: 1,
  },
];

export default function QnaInfo() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleRow = (id:string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section>
      <h3 className="font-semibold pt-12">상품 Q&A</h3>
      <div className="flex items-center justify-between pt-6">
        <CategoryBtn items={qnaCategories} />
        <div className="bg-primary rounded-md px-4 py-2.5 text-white font-semibold border cursor-pointer transition hover:bg-white hover:border-primary hover:text-primary">Q&A 작성</div>
      </div>

      <div className="mt-11 px-3 py-2">
        <table className="w-full text-black font-medium text-left">
          <thead className="border-y border-gray-200 bg-gray-50">
            <tr>
              <th className="px-4 py-4 text-center">글번호</th>
              <th className="px-4 py-4 text-center">카테고리</th>
              <th className="px-4 py-4 text-center">제목</th>
              <th className="px-4 py-4 text-center">작성자</th>
              <th className="px-4 py-4 text-center">작성일</th>
              <th className="px-4 py-4 text-center">조회수</th>
            </tr>
          </thead>
          <tbody>
            {dummyQnaList.map((item) => (
              <>
              <tr
                key={item.id}
                onClick={() => {
                  if(!item.answer) return;
                  toggleRow(item.id)
                }}
                className="cursor-pointer hover:bg-gray-50 text-sm"
              >
                <td className="px-8 py-4 text-center">{item.id}</td>
                <td className="px-8 py-4 text-center">{item.category}</td>
                <td className="px-8 py-4 text-center">{item.title}</td>
                <td className="px-8 py-4 text-center">{item.user}</td>
                <td className="px-8 py-4 text-center">{item.answer ? (
                  <div className="flex flex-col items-center">
                    <span>{item.date}</span>
                    <span className="bg-tertiary-20 w-[70px] font-bold text-tertiary text-center">답변완료</span>
                  </div>
                ) : (item.date)}</td>
                <td className="px-8 py-4 text-center">{item.views}</td>
              </tr>

              {openId === item.id && (
                <tr className="bg-primary-20 w-full">
                  <td colSpan={6}>
                    <div className="px-8 py-4 text-sm">
                      <div className="bg-tertiary-20 w-[50px] font-bold text-tertiary text-center mb-2">답변</div>
                      <p>{item.answer}</p>
                      <div className="pt-4 text-sm">모리모리</div>
                    </div>
                  </td>
                </tr>
              )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}