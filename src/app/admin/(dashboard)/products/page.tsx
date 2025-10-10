'use client';

import { useEffect, useMemo, useState, type Key } from 'react';
import AdminDataTable, {
  AdminTableColumn,
  SortDirection,
} from '@/components/admin/AdminDataTable';
import Button from '@/components/Button';
import SearchIcon from '@/assets/icon/search.svg';
import { fetchAdminProducts, type AdminProductsQuery } from '@/services/adminProducts';
import { useAuthStore } from '@/stores/authStore';

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

const SORT_FIELD_MAP: Record<string, AdminProductsQuery['sort']> = {
  id: 'productId',
  name: 'productName',
  author: 'artistName',
  status: 'sellingStatus',
  createdAt: 'registeredAt',
};

function normalizeProductRow(item: unknown): ProductRow {
  const source = (item && typeof item === 'object' ? item : {}) as Record<string, unknown>;

  const getString = (value: unknown, fallback = '-') => {
    if (typeof value === 'string' && value.trim().length > 0) {
      return value;
    }
    if (typeof value === 'number') {
      return String(value);
    }
    return fallback;
  };

  return {
    id: getString(source.productId ?? source.id, '—'),
    name: getString(source.productName ?? source.name),
    author: getString(source.artistName ?? source.author),
    status: getString(source.sellingStatus ?? source.status),
    createdAt: getString(source.registeredAt ?? source.createdAt),
  };
}

export default function ProductsPage() {
  const [sortKey, setSortKey] = useState<keyof ProductRow | undefined>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [query, setQuery] = useState<AdminProductsQuery>({
    page: 0,
    size: 10,
    sort: 'registeredAt',
    order: 'DESC',
  });
  const [rows, setRows] = useState<ProductRow[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const accessToken = useAuthStore((state) => state.accessToken);

  const updateSort = (key: string, direction: SortDirection) => {
    setSortKey(key as keyof ProductRow);
    setSortDirection(direction);
    setQuery((prev) => ({
      ...prev,
      sort: SORT_FIELD_MAP[key] ?? prev.sort,
      order: direction.toUpperCase() as AdminProductsQuery['order'],
      page: 0,
    }));
  };

  const handleSelectionChange = (keys: Key[]) => {
    setSelectedIds(keys.map((key) => String(key)));
  };

  useEffect(() => {
    if (!accessToken) return;

    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchAdminProducts(query, { accessToken });

        if (!mounted) return;

        const payload = response.data ?? response;
        const content = Array.isArray(payload.content)
          ? payload.content
          : Array.isArray((payload as Record<string, unknown>).items)
            ? ((payload as Record<string, unknown>).items as unknown[])
            : [];

        setRows(content.map((item) => normalizeProductRow(item)));
        setTotalPages(
          typeof payload.totalPages === 'number'
            ? payload.totalPages
            : Math.ceil((payload.totalElements as number ?? 0) / query.size) || 0,
        );
        setTotalElements(
          typeof payload.totalElements === 'number'
            ? payload.totalElements
            : Array.isArray(content)
              ? content.length
              : 0,
        );
      } catch (err) {
        if (mounted) {
          const message = err instanceof Error ? err.message : '상품 목록을 불러오지 못했습니다.';
          setError(message);
          setRows([]);
          setTotalPages(0);
          setTotalElements(0);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      mounted = false;
    };
  }, [accessToken, query]);

  const handlePageChange = (nextPage: number) => {
    setQuery((prev) => ({
      ...prev,
      page: nextPage,
    }));
    setSelectedIds([]);
  };

  const pageNumbers = useMemo(() => {
    const pages = totalPages > 0 ? totalPages : rows.length > 0 ? 1 : 0;
    const maxPagesToShow = 5;
    const current = query.page;
    const start = Math.max(0, Math.min(current - Math.floor(maxPagesToShow / 2), pages - maxPagesToShow));
    return Array.from({ length: Math.min(maxPagesToShow, pages) }, (_, index) => start + index);
  }, [query.page, rows.length, totalPages]);

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setQuery((prev) => ({
      ...prev,
      page: 0,
      keyword: searchTerm.trim() ? searchTerm.trim() : undefined,
    }));
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

      {error ? (
        <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <AdminDataTable
        columns={columns}
        rows={rows}
        rowKey={(row) => row.id}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSortChange={(key, direction) => updateSort(key, direction)}
        selectedRowKeys={selectedIds}
        onSelectionChange={handleSelectionChange}
        emptyText={loading ? '상품 목록을 불러오는 중입니다…' : '상품 데이터가 없습니다.'}
      />

      <div className="relative mt-6 flex items-center justify-center">
        <nav className="flex items-center gap-4 text-sm text-[var(--color-gray-700)]">
          <button
            type="button"
            className="px-2 py-1 hover:text-primary disabled:cursor-not-allowed disabled:text-[var(--color-gray-300)]"
            aria-label="Prev"
            onClick={() => handlePageChange(Math.max(0, query.page - 1))}
            disabled={query.page === 0}
          >
            ‹
          </button>
          {pageNumbers.map((pageIndex) => (
            <button
              key={pageIndex}
              className={`h-8 w-8 rounded-full text-center leading-8 ${
                pageIndex === query.page
                  ? 'text-primary font-semibold'
                  : 'hover:text-primary'
              }`}
              type="button"
              onClick={() => handlePageChange(pageIndex)}
            >
              {pageIndex + 1}
            </button>
          ))}
          <button
            type="button"
            className="px-2 py-1 hover:text-primary disabled:cursor-not-allowed disabled:text-[var(--color-gray-300)]"
            aria-label="Next"
            onClick={() => handlePageChange(query.page + 1)}
            disabled={totalPages > 0 ? query.page >= totalPages - 1 : rows.length === 0}
          >
            ›
          </button>
        </nav>

        <form
          className="absolute right-0 flex h-10 w-[240px] items-center rounded-[12px] border border-primary px-4 text-sm text-[var(--color-gray-700)]"
          onSubmit={handleSearchSubmit}
        >
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="검색어를 입력하세요"
            className="h-full flex-1 bg-transparent pr-8 outline-none placeholder:text-[var(--color-gray-400)]"
          />
          <button type="submit" className="absolute right-3 flex h-6 w-6 items-center justify-center">
            <SearchIcon className="h-4 w-4 text-primary" aria-hidden />
          </button>
        </form>
      </div>

      <div className="mt-3 text-right text-xs text-[var(--color-gray-500)]">
        {totalElements > 0 && !loading ? `총 ${totalElements}건` : null}
      </div>
    </>
  );
}
