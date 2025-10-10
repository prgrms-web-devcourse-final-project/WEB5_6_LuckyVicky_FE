'use client';

import { useEffect, useMemo, useState, type Key } from 'react';
import AdminDataTable, {
  AdminTableColumn,
  SortDirection,
} from '@/components/admin/AdminDataTable';
import Button from '@/components/Button';
import SearchIcon from '@/assets/icon/search.svg';
import { useAuthStore } from '@/stores/authStore';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import {
  fetchAdminFundingList,
  type AdminFundingListPayload,
  type AdminFundingListQuery,
} from '@/services/adminFundingMonitoring';

type FundingRow = {
  id: string;
  name: string;
  fundingname: string;
  rate: string;
  status: string;
  deadline: string;
};

const columns: AdminTableColumn<FundingRow>[] = [
  { key: 'id', header: '펀딩 ID', align: 'center', sortable: true },
  { key: 'name', header: '카테고리', width: 'w-[220px]', sortable: true, align: 'center' },
  { key: 'fundingname', header: '펀딩 제목', sortable: true, align: 'center' },
  { key: 'rate', header: '달성률', align: 'center', sortable: true },
  { key: 'status', header: '상태', align: 'center', sortable: true },
  { key: 'deadline', header: '마감기한', align: 'center', sortable: true },
];

const SORT_FIELD_MAP: Record<string, AdminFundingListQuery['sort']> = {
  id: 'registeredAt',
  name: 'participantCount',
  fundingname: 'registeredAt',
  rate: 'achievementRate',
  status: 'remainingDays',
  deadline: 'endDate',
};

function formatPercent(value?: number | null) {
  if (typeof value !== 'number' || Number.isNaN(value)) return '-';
  return `${Math.round(value * 100)}%`;
}

function formatDate(value?: string | null) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toISOString().slice(0, 10);
}

function mapFundingToRow(funding: AdminFundingListPayload['content'][number]): FundingRow {
  return {
    id: String(funding.fundingId ?? ''),
    name: funding.category?.name ?? '-',
    fundingname: funding.title ?? '-',
    rate: formatPercent(funding.achievementRate),
    status: funding.statusText ?? funding.status ?? '-',
    deadline: formatDate(funding.endDate),
  };
}

export default function MonitorFundingPage() {
  useAuthGuard({ allowedRoles: ['ADMIN'], redirectTo: '/admin/login' });

  const [sortKey, setSortKey] = useState<keyof FundingRow | undefined>('deadline');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [query, setQuery] = useState<AdminFundingListQuery>({
    page: 0,
    size: 10,
    sort: 'endDate',
    order: 'ASC',
  });
  const [rows, setRows] = useState<FundingRow[]>([]);
  const [payload, setPayload] = useState<AdminFundingListPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (!accessToken) return;

    let active = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchAdminFundingList(query, { accessToken });
        if (!active) return;
        setPayload(data);
        setRows(data.content.map(mapFundingToRow));
      } catch (err) {
        if (!active) return;
        const message = err instanceof Error ? err.message : '펀딩 목록을 불러오지 못했습니다.';
        setError(message);
        setRows([]);
        setPayload(null);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [accessToken, query]);

  const handleSelectionChange = (keys: Key[]) => {
    setSelectedIds(keys.map((key) => String(key)));
  };

  const updateSort = (key: string, direction: SortDirection) => {
    setSortKey(key as keyof FundingRow);
    setSortDirection(direction);
    setQuery((prev) => ({
      ...prev,
      sort: SORT_FIELD_MAP[key] ?? prev.sort,
      order: direction.toUpperCase() as AdminFundingListQuery['order'],
      page: 0,
    }));
  };

  const handlePageChange = (page: number) => {
    setQuery((prev) => ({
      ...prev,
      page,
    }));
    setSelectedIds([]);
  };

  const totalPages = payload?.totalPages ?? 0;
  const currentPage = query.page;

  const pageNumbers = useMemo(() => {
    const count = totalPages || (rows.length > 0 ? 1 : 0);
    const maxVisible = 5;
    const start = Math.max(0, Math.min(currentPage - Math.floor(maxVisible / 2), count - maxVisible));
    return Array.from({ length: Math.min(maxVisible, count) }, (_, index) => start + index);
  }, [currentPage, rows.length, totalPages]);

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
        <h3 className="text-2xl font-bold mb-[20px]">기존 펀딩 관리</h3>
        <Button variant="outline" disabled>펀딩 중지</Button>
      </div>

      {error ? (
        <div className="mb-4 rounded-lg border border-rose-300 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <AdminDataTable
        columns={columns}
        rows={rows}
        rowKey={(row) => row.id}
        sortKey={sortKey as string | undefined}
        sortDirection={sortDirection}
        onSortChange={(key, direction) => updateSort(key, direction)}
        selectedRowKeys={selectedIds}
        onSelectionChange={handleSelectionChange}
        emptyText={loading ? '펀딩 목록을 불러오는 중입니다…' : '등록된 펀딩이 없습니다.'}
      />

      <div className="relative mt-6 flex items-center justify-center">
        <nav className="flex items-center gap-4 text-sm text-[var(--color-gray-700)]">
          <button
            className="px-2 py-1 hover:text-primary disabled:text-[var(--color-gray-300)] disabled:cursor-not-allowed"
            aria-label="Prev"
            onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
          >
            ‹
          </button>
          {pageNumbers.map((page) => (
            <button
              key={page}
              className={`h-8 w-8 rounded-full text-center leading-8 ${
                page === currentPage ? 'text-primary font-semibold' : 'hover:text-primary'
              }`}
              onClick={() => handlePageChange(page)}
            >
              {page + 1}
            </button>
          ))}
          <button
            className="px-2 py-1 hover:text-primary disabled:text-[var(--color-gray-300)] disabled:cursor-not-allowed"
            aria-label="Next"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={totalPages ? currentPage >= totalPages - 1 : rows.length === 0}
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
        {payload && !loading ? `총 ${payload.totalElements}건` : null}
      </div>
    </>
  );
}
