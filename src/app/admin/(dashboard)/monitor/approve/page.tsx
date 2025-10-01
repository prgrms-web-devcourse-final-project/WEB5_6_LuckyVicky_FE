'use client';

import { useState, type Key } from 'react';
import AdminDataTable, {
  AdminTableColumn,
  SortDirection,
} from '@/components/admin/AdminDataTable';
import Button from '@/components/Button';
import SearchIcon from '@/assets/icon/search.svg';

type ProductRow = {
  id: string;
  name: string;
  fundingname: string;
  createdAt: string;
  detail: React.ReactNode;
};

const columns: AdminTableColumn<ProductRow>[] = [
  { key: 'id', header: '작가 ID', align: 'center', sortable: true },
  { key: 'name', header: '작가명', width: 'w-[220px]', sortable: true, align: 'center' },
  { key: 'fundingname', header: '펀딩 제목', sortable: true, align: 'center' },
  { key: 'createdAt', header: '신청일자', align: 'center', sortable: true },
  { key: 'detail', header: '상세보기', align: 'center' },
]

const productRows: ProductRow[] = [
  {
    id: 'abc136',
    name: '작가명입니다',
    fundingname: '펀딩 제목입니다',
    createdAt: '2025-09-18',
    detail: <button className="text-primary underline cursor-pointer">상세보기</button>,
  },
  {
    id: 'abc136',
    name: '작가명입니다',
    fundingname: '펀딩 제목입니다',
    createdAt: '2025-09-18',
    detail: <button className="text-primary underline cursor-pointer">상세보기</button>,
  },
  {
    id: 'abc136',
    name: '작가명입니다',
    fundingname: '펀딩 제목입니다',
    createdAt: '2025-09-18',
    detail: <button className="text-primary underline cursor-pointer">상세보기</button>,
  },
  {
    id: 'abc136',
    name: '작가명입니다',
    fundingname: '펀딩 제목입니다',
    createdAt: '2025-09-18',
    detail: <button className="text-primary underline cursor-pointer">상세보기</button>,
  },
  {
    id: 'abc136',
    name: '작가명입니다',
    fundingname: '펀딩 제목입니다',
    createdAt: '2025-09-18',
    detail: <button className="text-primary underline cursor-pointer">상세보기</button>,
  },
  {
    id: 'abc136',
    name: '작가명입니다',
    fundingname: '펀딩 제목입니다',
    createdAt: '2025-09-18',
    detail: <button className="text-primary underline cursor-pointer">상세보기</button>,
  },

 

];

export default function ProductsPage() {
  const [sortKey, setSortKey] = useState<keyof ProductRow | undefined>(
    undefined,
  );
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

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
        <h3 className="text-2xl font-bold mb-[20px]">신규 펀딩 승인</h3>
        <div className="flex gap-2">
          <Button variant="outline">펀딩 거절</Button>
          <Button variant="primary">펀딩 승인</Button>
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
          <SearchIcon
            className="absolute right-4 h-4 w-4 text-primary"
            aria-hidden
          />
        </form>
      </div>
    </>
  );
}
