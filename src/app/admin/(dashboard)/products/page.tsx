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
          <Button variant="outline">수정 요청</Button>
          <Button variant="primary">삭제 처리</Button>
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
    </>
  );
}
