'use client';

import { useEffect, useState, type Key } from 'react';
import AdminDataTable, {
  AdminTableColumn,
  SortDirection,
} from '@/components/admin/AdminDataTable';
import Button from '@/components/Button';
import SearchIcon from '@/assets/icon/search.svg';
import X from "@/assets/icon/x.svg";
import Paperclip from '@/assets/icon/paperclip2.svg';
import NoticeEditor from '@/components/editor/NoticeEditor';

type ProductRow = {
  id: string;
  name: string;
  author: string;
  status: string;
  createdAt: string;
};

const columns: AdminTableColumn<ProductRow>[] = [
  { key: 'id', header: '상품번호', align: 'center', sortable: true },
  { key: 'name', header: '상품명', align: 'center', width: 'w-[220px]', sortable: true },
  { key: 'author', header: '작가명' , align: 'center', sortable: true},
  { key: 'status', header: '판매상태', align: 'center', sortable: true },
  { key: 'createdAt', header: '등록일자', align: 'center', sortable: true },
];

const productRows: ProductRow[] = [
  {
    id: '0123157',
    name: '상품명입니다',
    author: '작가명입니다',
    status: '판매중',
    createdAt: '2025-09-30',
  },
  {
    id: '0123156',
    name: '상품명입니다',
    author: '작가명입니다',
    status: '판매중',
    createdAt: '2025-09-30',
  },
  {
    id: '0123155',
    name: '상품명입니다',
    author: '작가명입니다',
    status: '판매중',
    createdAt: '2025-09-30',
  },
  {
    id: '0123154',
    name: '상품명입니다',
    author: '작가명입니다',
    status: '판매중',
    createdAt: '2025-09-30',
  },
  {
    id: '0123153',
    name: '상품명입니다',
    author: '작가명입니다',
    status: '판매중',
    createdAt: '2025-09-30',
  },
  {
    id: '0123152',
    name: '상품명입니다',
    author: '작가명입니다',
    status: '판매중',
    createdAt: '2025-09-30',
  },
  {
    id: '0123151',
    name: '상품명입니다',
    author: '작가명입니다',
    status: '판매중',
    createdAt: '2025-09-30',
  },
  {
    id: '0123150',
    name: '상품명입니다',
    author: '작가명입니다',
    status: '판매중',
    createdAt: '2025-09-30',
  },
];

export default function ProductsPage() {
  const [sortKey, setSortKey] = useState<keyof ProductRow | undefined>(
    undefined,
  );
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [openModal, setOpenModal] = useState(false);
  const [title, setTitle] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [editorValue, setEditorValue] = useState("");

  useEffect(() => {
      if (!openModal) return;
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev };
    }, [openModal]);

  const updateSort = (key: string, direction: SortDirection) => {
    setSortKey(key as keyof ProductRow);
    setSortDirection(direction);
  };

  const handleSelectionChange = (keys: Key[]) => {
    setSelectedIds(keys.map((key) => String(key)));
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold mb-[20px]">상품 관리</h3>
        <div className="flex gap-2">
          <Button variant="tertiary">상품 삭제</Button>
          <Button variant="outline">상품 수정</Button>
          <Button onClick={()=>setOpenModal(true)} variant="primary">상품 등록</Button>
        </div>
      </div>

      <AdminDataTable
        columns={columns}
        rows={productRows}
        rowKey={(row) => row.id}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSortChange={(key, direction) => updateSort(key, direction)}
        selectedRowKeys={selectedIds}
        onSelectionChange={handleSelectionChange}
      />

      <div className="relative mt-6 flex items-center justify-center">
        <nav className="flex items-center gap-4 text-sm text-[var(--color-gray-700)]">
          <button className="px-2 py-1 hover:text-primary" aria-label="Prev">
            ‹
          </button>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              className={`h-8 w-8 rounded-full text-center leading-8 ${
                n === 1 ? 'text-primary font-semibold' : 'hover:text-primary'
              }`}
            >
              {n}
            </button>
          ))}
          <button className="px-2 py-1 hover:text-primary" aria-label="Next">
            ›
          </button>
        </nav>

        <form className="absolute right-0 flex h-10 w-[240px] items-center rounded-[12px] border border-primary px-4 text-sm text-[var(--color-gray-700)]">
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="검색어를 입력하세요"
            className="h-full flex-1 bg-transparent pr-8 outline-none placeholder:text-[var(--color-gray-400)]"
          />
          <SearchIcon className="absolute right-4 h-4 w-4 text-primary" aria-hidden />
        </form>
      </div>

      {/* 상품등록 작성모달창 */}
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
                    <h2 className="text-lg font-bold">상품 등록</h2>
                    <button className="cursor-pointer rounded transition hover:bg-black/5 p-2" onClick={() => setOpenModal(false)}><X width={16} height={16} /></button>
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
                    <span className="shrink-0 whitespace-nowrap text-sm">상품명</span>
                      <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="flex-1 rounded border border-[var(--color-gray-200)] px-3 py-1 text-sm"
                      />
                    </label>
                  <hr />

                  <label className="flex items-center py-2 gap-3">
                    <span className="shrink-0 whitespace-nowrap text-sm">판매가</span>
                      <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="flex-1 rounded border border-[var(--color-gray-200)] px-3 py-1 text-sm"
                      />
                    </label>
                  <hr />

                  <label className="flex items-center py-2 gap-3">
                    <span className="shrink-0 whitespace-nowrap text-sm">모델명</span>
                      <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="flex-1 rounded border border-[var(--color-gray-200)] px-3 py-1 text-sm"
                      />
                    </label>
                  <hr />

                  <label className="flex items-center py-2 gap-3">
                    <span className="shrink-0 whitespace-nowrap text-sm">사이즈</span>
                      <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="flex-1 rounded border border-[var(--color-gray-200)] px-3 py-1 text-sm"
                      />
                    </label>
                  <hr />

                  <label className="flex items-center py-2 gap-3">
                    <span className="shrink-0 whitespace-nowrap text-sm">재질</span>
                      <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="flex-1 rounded border border-[var(--color-gray-200)] px-3 py-1 text-sm"
                      />
                    </label>
                  <hr />

                  <label className="flex items-center py-2 gap-3">
                    <span className="shrink-0 whitespace-nowrap text-sm">원산지</span>
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
    </>
  );
}
