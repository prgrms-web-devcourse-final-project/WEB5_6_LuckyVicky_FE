'use client';

import { useState, type Key } from 'react';
import AdminDataTable, { AdminTableColumn, SortDirection } from '@/components/admin/AdminDataTable';
import Button from '@/components/Button';
import SearchIcon from '@/assets/icon/search.svg';
import ProductCreateModal from '@/components/artist/ProductCreateModal';
import { ProductCreatePayload } from '@/types/product';

type ProductRow = {
  id: string;
  name: string;
  author: string;
  status: string;
  createdAt: string; // YYYY-MM-DD
};

const columns: AdminTableColumn<ProductRow>[] = [
  { key: 'id', header: '상품번호', align: 'center', sortable: true },
  { key: 'name', header: '상품명', align: 'center', sortable: true },
  { key: 'author', header: '작가명', align: 'center', sortable: true },
  { key: 'status', header: '판매상태', align: 'center', sortable: true },
  { key: 'createdAt', header: '등록일자', align: 'center', sortable: true },
];

const initialRows: ProductRow[] = [
  { id: '0123157', name: '상품명입니다', author: '작가명입니다', status: '판매중', createdAt: '2025-09-30' },
];

// 다음 상품번호(7자리 zero-pad)
function nextId(rows: ProductRow[]) {
  const max = rows.reduce((m, r) => {
    const n = parseInt(r.id, 10);
    return Number.isFinite(n) ? Math.max(m, n) : m;
  }, 0);
  return String(max + 1).padStart(7, '0');
}

// YYYY-MM-DD (로컬)
function todayYYYYMMDD() {
  return new Date().toLocaleDateString('en-CA'); // 2025-10-05
}

// 판매상태
function resolveStatus(payload: ProductCreatePayload): string {
  if (!payload.plannedSale) return '판매중';
  const now = Date.now();
  const start = payload.plannedSale.startAt ? new Date(payload.plannedSale.startAt).getTime() : NaN;
  const end = payload.plannedSale.endAt ? new Date(payload.plannedSale.endAt).getTime() : NaN;

  if (Number.isFinite(start) && now < start) return '판매예정';
  if (Number.isFinite(end) && now > end) return '판매종료';
  return '판매중';
}

export default function ProductsPage() {
  const [rows, setRows] = useState<ProductRow[]>(initialRows);
  const [sortKey, setSortKey] = useState<keyof ProductRow | undefined>(undefined);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [openModal, setOpenModal] = useState(false);


  const updateSort = (key: string, direction: SortDirection) => {
    setSortKey(key as keyof ProductRow);
    setSortDirection(direction);
  };

  const handleSelectionChange = (keys: Key[]) => {
    setSelectedIds(keys.map((key) => String(key)));
  };

  // API 성공 콜백: 행 추가
  const handleCreated = ({ productUuid, payload }: { productUuid: string; payload: ProductCreatePayload }) => {
    const newRow: ProductRow = {
      // 테이블 id는 7자리
      id: nextId(rows),
      name: payload.title,
      author: payload.brand || payload.bizInfo?.companyName || '작가',
      status: resolveStatus(payload),
      createdAt: todayYYYYMMDD(),
    };
    setRows((prev) => [newRow, ...prev]);
  };

  

  // 사업자 정보 불러오기 
  const loadBizFromProfile = async () => {
    return {
      companyName: '모리모리 스튜디오',
      bizNumber: '123-45-67890',
      ceoName: '홍길동',
    };
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold mb-[20px]">상품 관리</h3>
        <div className="flex gap-2">
          <Button variant="tertiary">상품 삭제</Button>
          <Button variant="outline">상품 수정</Button>
          <Button onClick={() => setOpenModal(true)} variant="primary">상품 등록</Button>
        </div>
      </div>

      <AdminDataTable
        columns={columns}
        rows={rows}
        rowKey={(row) => row.id}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSortChange={(key, direction) => updateSort(key, direction)}
        selectedRowKeys={selectedIds}
        onSelectionChange={handleSelectionChange}
      />

      <div className="relative mt-6 flex items-center justify-center">
        <nav className="flex items-center gap-4 text-sm text-[var(--color-gray-700)]">
          <button className="px-2 py-1 hover:text-primary" aria-label="Prev">‹</button>
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
          <button className="px-2 py-1 hover:text-primary" aria-label="Next">›</button>
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


      <ProductCreateModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onCreated={handleCreated}
        initialBrand="내 브랜드"   // 로그인한 작가 브랜드
        onLoadBizFromProfile={loadBizFromProfile}
      />
    </>
  );
}
