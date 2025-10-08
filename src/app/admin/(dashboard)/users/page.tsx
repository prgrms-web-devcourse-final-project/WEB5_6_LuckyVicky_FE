'use client';

import { useEffect, useMemo, useState, type Key } from 'react';
import AdminDataTable, {
  AdminTableColumn,
  SortDirection,
} from '@/components/admin/AdminDataTable';
import Button from '@/components/Button';
import SearchIcon from '@/assets/icon/search.svg';
import { fetchAdminUsers, type AdminUsersQuery } from '@/services/adminUsers';
import { useAuthStore } from '@/stores/authStore';

type UserRow = {
  id: string;
  name: string;
  grade: string;
  fee: string;
  status: string;
  signedAt: string;
};

const columns: AdminTableColumn<UserRow>[] = [
  { key: 'id', header: '회원ID', align: 'center', sortable: true },
  { key: 'name', header: '닉네임 / 작가명', width: 'w-[220px]', sortable: true, align: 'center' },
  { key: 'grade', header: '회원등급', sortable: true, align: 'center' },
  { key: 'fee', header: '수수료율', align: 'center', sortable: true },
  { key: 'status', header: '계정상태', align: 'center', sortable: true },
  { key: 'signedAt', header: '등록일자', align: 'center', sortable: true },
];

const SORT_FIELD_MAP: Record<string, AdminUsersQuery['sort']> = {
  id: 'userId',
  name: 'nickname',
  grade: 'grade',
  fee: 'commissionRate',
  status: 'accountStatus',
  signedAt: 'joinedAt',
};

function formatCommissionRate(value: unknown) {
  if (typeof value === 'number') {
    return `${value}%`;
  }
  if (typeof value === 'string' && value.trim().length > 0) {
    return value.includes('%') ? value : `${value}%`;
  }
  return '-';
}

function normalizeUserRow(item: unknown): UserRow {
  const source = (item && typeof item === 'object' ? item : {}) as Record<string, unknown>;

  const asString = (value: unknown, fallback = '-') => {
    if (typeof value === 'string' && value.trim().length > 0) {
      return value;
    }
    if (typeof value === 'number') {
      return String(value);
    }
    return fallback;
  };

  const nickname = asString(source.nickname, '미등록');
  const artistName = asString(source.artistName, '');
  const nameLabel = artistName ? `${nickname} / ${artistName}` : nickname;

  return {
    id: asString(source.memberId ?? source.userId),
    name: nameLabel,
    grade: asString(source.grade),
    fee: formatCommissionRate(source.commissionRate),
    status: asString(source.accountStatus),
    signedAt: asString(source.joinedAt),
  };
}

export default function UsersPage() {
  const [sortKey, setSortKey] = useState<keyof UserRow | undefined>('signedAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [query, setQuery] = useState<AdminUsersQuery>({
    page: 0,
    size: 10,
    sort: 'joinedAt',
    order: 'DESC',
  });
  const [rows, setRows] = useState<UserRow[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const accessToken = useAuthStore((state) => state.accessToken);

  const updateSort = (key: string, direction: SortDirection) => {
    setSortKey(key as keyof UserRow);
    setSortDirection(direction);
    setQuery((prev) => ({
      ...prev,
      sort: SORT_FIELD_MAP[key] ?? prev.sort,
      order: direction.toUpperCase() as AdminUsersQuery['order'],
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
        const response = await fetchAdminUsers(query, { accessToken });
        if (!mounted) return;

        const payload = response.data ?? response;
        const content = Array.isArray(payload.content) ? payload.content : [];

        setRows(content.map((item) => normalizeUserRow(item)));
        const total = typeof payload.totalElements === 'number' ? payload.totalElements : content.length;
        setTotalElements(total);
        const pages = typeof payload.totalPages === 'number' ? payload.totalPages : Math.ceil(total / query.size) || 0;
        setTotalPages(pages);
      } catch (err) {
        if (mounted) {
          const message = err instanceof Error ? err.message : '사용자 목록을 불러오지 못했습니다.';
          setError(message);
          setRows([]);
          setTotalElements(0);
          setTotalPages(0);
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
        <h3 className="text-2xl font-bold mb-[20px]">사용자 관리</h3>
        <div className="flex gap-2">
          <Button variant="tertiary">수수료율 변경</Button>
          <Button variant="outline">블랙리스트 해제</Button>
          <Button variant="primary">블랙리스트 등록</Button>
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
        emptyText={loading ? '사용자 목록을 불러오는 중입니다…' : '사용자 데이터가 없습니다.'}
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
            <SearchIcon
              className="h-4 w-4 text-primary"
              aria-hidden
            />
          </button>
        </form>
      </div>

      <div className="mt-3 text-right text-xs text-[var(--color-gray-500)]">
        {totalElements > 0 && !loading ? `총 ${totalElements}명` : null}
      </div>
    </>
  );
}
