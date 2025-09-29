import { useEffect, useState } from "react";
import CategoryBtn from "../mainCategory/CategoryBtn";
import NoticeEditor from "../editor/NoticeEditor";
import X from "@/assets/icon/x.svg";
import Paperclip from '@/assets/icon/paperclip2.svg';


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
  const [openModal, setOpenModal] = useState(false);
  const [editorValue, setEditorValue] = useState("");

  const [title, setTitle] = useState('');
  const [files, setFiles] = useState<File[]>([]);

  const toggleRow = (id:string) => {
    setOpenId(openId === id ? null : id);
  };

  useEffect(() => {
    if (!openModal) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev };
  }, [openModal]);

  return (
    <section>
      <h3 className="font-semibold pt-12">상품 Q&A</h3>
      <div className="flex items-center justify-between pt-6">
        <CategoryBtn items={qnaCategories} />
        <button 
          className="bg-primary rounded-md px-4 py-2.5 text-white font-semibold border cursor-pointer transition hover:bg-white hover:border-primary hover:text-primary"
          onClick={()=>setOpenModal(true)}
          >
          Q&A 작성
        </button>
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

    {/* Q&A 작성모달창 */}
      {openModal && (
        <div 
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50"
          onClick={()=>setOpenModal(false)}
          >
          <div 
            className="bg-white rounded-lg shadow-xl w-[700px] max-w-full p-6"
            onClick={(e)=>e.stopPropagation()}
            >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Q&A 작성</h2>
              <button className="cursor-pointer" onClick={() => setOpenModal(false)}><X width={16} height={16} /></button>
            </div>
            <hr />

            {/* 카테고리 */}
            <label className="flex items-center my-3 gap-6">
              <span className="shrink-0 whitespace-nowrap text-sm">카테고리</span>
                <select className="rounded border border-[var(--color-gray-200)] py-1 text-sm">
                  <option>입고/재입고</option>
                  <option>배송</option>
                  <option>작가 입점</option>
                  <option>품질/불량</option>
                  <option>취소/환불</option>
                  <option>기타</option>
                </select>
            </label>
            <hr />

            {/* 제목 */}
            <label className="flex items-center py-2 gap-3">
              <span className="shrink-0 whitespace-nowrap text-sm">제목</span>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="flex-1 rounded border border-[var(--color-gray-200)] px-3 py-1 text-sm"
                />
              </label>
            <hr />

            <div className="flex flex-col">
              <span className="text-sm py-2">내용</span>
              <NoticeEditor
              value={editorValue}
              onChange={setEditorValue}
              onUploadImage={async (file) => URL.createObjectURL(file)}
              />
            </div>

            {/* 첨부파일 */}
            <div className="my-[13px] flex items-center gap-3">
              <div className="flex items-center gap-0.5">
                <span className="shrink-0 text-sm">첨부파일</span>
                <Paperclip className="block size-4 overflow-visible text-[var(--color-gray-200)] shrink-0" />
              </div>
              <div className="relative flex-1">
              <input
                id="fileInput"
                type="file"
                multiple
                className="sr-only"
                onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
              />
              <input
                type="text"
                readOnly
                value={
                  files.length === 0
                    ? ''
                    : files.length === 1
                      ? files[0].name
                      : `${files[0].name} 외 ${files.length - 1}개`
                }
                placeholder="파일을 선택하세요"
                className="w-full rounded border border-[var(--color-gray-200)] px-3 py-2 pr-24 leading-none text-sm"
                onClick={() => document.getElementById('fileInput')?.click()}
              />
              {files.length > 0 ? (
                <button
                  type="button"
                  onClick={() => setFiles([])}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded border border-[var(--color-primary)] px-3 py-1 text-sm leading-none transition hover:bg-primary-20"
                >
                  파일 삭제
                </button>
              ) : (
                <label
                  htmlFor="fileInput"
                  className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded border border-[var(--color-primary)] px-3 py-1 text-sm leading-none transition hover:bg-primary-20"
                >
                  파일 선택
                </label>
              )}
            </div>
          </div>

            {/* 작성버튼 */}
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setOpenModal(false)}
                className="px-3 py-2 rounded-md border border-primary text-primary font-semibold text-sm cursor-pointer"
              >
                작성취소
              </button>
              <button
                onClick={() => {
                  console.log("저장:", editorValue);
                  setOpenModal(false);
                }}
                className="px-3 py-2 rounded-md border border-primary bg-primary text-white font-semibold text-sm cursor-pointer"
              >
                작성하기
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}