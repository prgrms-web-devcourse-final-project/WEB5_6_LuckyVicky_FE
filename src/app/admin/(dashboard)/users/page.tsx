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
  grade: string;
  fee: string;
  status: string;
  signedAt: string;
};

const columns: AdminTableColumn<ProductRow>[] = [
  { key: 'id', header: '회원ID', align: 'center', sortable: true },
  { key: 'name', header: '닉네임 / 작가명', width: 'w-[220px]', sortable: true, align: 'center' },
  { key: 'grade', header: '회원등급', sortable: true, align: 'center' },
  { key: 'fee', header: '수수료율', align: 'center', sortable: true },
  { key: 'status', header: '계정상태', align: 'center', sortable: true },
  { key: 'signedAt', header: '등록일자', align: 'center', sortable: true },
];

const productRows: ProductRow[] = [
  {
    id: 'abc136',
    name: '닉네임입니다',
    grade: '새싹',
    fee: '-',
    status: '정상',
    signedAt: '2025-09-18',
  },
  {
    id: 'abc135',
    name: '닉네임입니다',
    grade: '새싹',
    fee: '-',
    status: '정상',
    signedAt: '2025-09-18',
  },
  {
    id: 'abc134',
    name: '닉네임입니다',
    grade: '새싹',
    fee: '-',
    status: '정상',
    signedAt: '2025-09-18',
  },
  {
    id: 'abc133',
    name: '닉네임입니다',
    grade: '새싹',
    fee: '-',
    status: '정상',
    signedAt: '2025-09-18',
  },
  {
    id: 'abc132',
    name: '닉네임입니다',
    grade: '새싹',
    fee: '-',
    status: '활동정지',
    signedAt: '2025-09-18',
  },
  {
    id: 'abc131',
    name: '닉네임입니다',
    grade: '새싹',
    fee: '-',
    status: '활동정지',
    signedAt: '2025-09-18',
  },
  {
    id: 'abc130',
    name: '작가명입니다',
    grade: '나무지기(작가)',
    fee: '10%',
    status: '활동정지',
    signedAt: '2025-09-18',
  },
  {
    id: 'abc129',
    name: '작가명입니다',
    grade: '나무지기(작가)',
    fee: '10%',
    status: '활동정지',
    signedAt: '2025-09-18',
  },
  {
    id: 'abc128',
    name: '작가명입니다',
    grade: '나무지기(작가)',
    fee: '10%',
    status: '정상',
    signedAt: '2025-09-18',
  },
  {
    id: 'abc127',
    name: '작가명입니다',
    grade: '나무지기(작가)',
    fee: '10%',
    status: '정상',
    signedAt: '2025-09-18',
  },
  {
    id: 'abc126',
    name: '작가명입니다',
    grade: '나무지기(작가)',
    fee: '10%',
    status: '정상',
    signedAt: '2025-09-18',
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
        <h3 className="text-2xl font-bold mb-[20px]">사용자 관리</h3>
        <div className="flex gap-2">
          <Button variant="tertiary">수수료율 변경</Button>
          <Button variant="outline">블랙리스트 해제</Button>
          <Button variant="primary">블랙리스트 등록</Button>
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
