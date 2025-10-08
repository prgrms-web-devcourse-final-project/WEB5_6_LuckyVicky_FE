'use client';

import { useCallback, useEffect, useMemo, useState, type Key, type ReactNode } from 'react';
import Link from 'next/link';
import AdminDataTable, {
  AdminTableColumn,
  SortDirection,
} from '@/components/admin/AdminDataTable';
import Button from '@/components/Button';
import SearchIcon from '@/assets/icon/search.svg';
import Modal from '@/components/Modal';
import DefaultProfile from '@/assets/icon/default_profile.svg';
import { useToast } from '@/components/ToastProvider';
import { approveFundingApplication } from '@/services/adminFundingApproval';
import { fetchArtistApplications } from '@/services/adminArtistApplications';
import { useAuthStore } from '@/stores/authStore';
import { useAuthGuard } from '@/hooks/useAuthGuard';

type FundingApplicant = {
  applicationId: number;
  id: string;
  name: string;
  fundingTitle: string;
  fundingSummary: string;
  email: string;
  phone: string;
  businessNumber?: string;
  businessDocument?: string;
  commerceNumber?: string;
  commerceDocument?: string;
  appliedAt: string;
};

type TableRow = {
  id: string;
  name: string;
  fundingname: string;
  createdAt: string;
  detail: ReactNode;
};

const columns: AdminTableColumn<TableRow>[] = [
  { key: 'id', header: '작가 ID', align: 'center', sortable: true },
  { key: 'name', header: '작가명', width: 'w-[220px]', sortable: true, align: 'center' },
  { key: 'fundingname', header: '펀딩 제목', sortable: true, align: 'center' },
  { key: 'createdAt', header: '신청일자', align: 'center', sortable: true },
  { key: 'detail', header: '상세보기', align: 'center' },
];

function mapSummaryToApplicant(summary: unknown): FundingApplicant | null {
  if (!summary || typeof summary !== 'object') {
    return null;
  }

  const record = summary as Record<string, unknown>;
  const rawApplicationId = record.applicationId;
  const applicationId = typeof rawApplicationId === 'number'
    ? rawApplicationId
    : Number(rawApplicationId);

  if (!Number.isFinite(applicationId)) {
    return null;
  }

  const resolveString = (value: unknown): string | undefined =>
    typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined;

  const id = resolveString(record.applicantId) ?? `application-${applicationId}`;
  const name = resolveString(record.artistName) ?? id;
  const fundingTitle = resolveString(record.fundingTitle) ?? '제목 미상';

  return {
    applicationId,
    id,
    name,
    fundingTitle,
    fundingSummary: resolveString(record.fundingSummary) ?? '-',
    email: resolveString(record.email) ?? '-',
    phone: resolveString(record.phone) ?? '-',
    businessNumber: resolveString(record.businessNumber),
    businessDocument: resolveString(record.businessDocument),
    commerceNumber: resolveString(record.commerceNumber),
    commerceDocument: resolveString(record.commerceDocument),
    appliedAt: resolveString(record.appliedAt) ?? new Date().toISOString().slice(0, 10),
  };
}

export default function ApproveFundingPage() {
  useAuthGuard({ allowedRoles: ['ADMIN'], redirectTo: '/admin/login' });
  const [sortKey, setSortKey] = useState<keyof TableRow | undefined>(undefined);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplicant, setSelectedApplicant] = useState<FundingApplicant | null>(null);
  const [applicantList, setApplicantList] = useState<FundingApplicant[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [listError, setListError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();
  const accessToken = useAuthStore((state) => state.accessToken);
  const hydrate = useAuthStore((state) => state.hydrate);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  const handleSelectionChange = (keys: Key[]) => {
    setSelectedIds(keys.map((key) => String(key)));
  };

  const handleSortChange = (key: string, direction: SortDirection) => {
    setSortKey(key as keyof TableRow);
    setSortDirection(direction);
  };

  const openModal = useCallback((applicant: FundingApplicant) => {
    setSelectedApplicant(applicant);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedApplicant(null);
  }, []);

  useEffect(() => {
    setSelectedIds((prev) => prev.filter((id) => applicantList.some((applicant) => applicant.id === id)));
  }, [applicantList]);

  useEffect(() => {
    if (!isHydrated) {
      void hydrate();
    }
  }, [hydrate, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;

    let active = true;
    const load = async () => {
      try {
        setLoadingList(true);
        setListError(null);
        const summaries = await fetchArtistApplications(
          { status: 'PENDING', page: 0, size: 20 },
          accessToken ? { accessToken } : undefined,
        );

        if (!active) return;
        const normalized = summaries
          .map((summary) => mapSummaryToApplicant(summary))
          .filter((value): value is FundingApplicant => Boolean(value));
        setApplicantList(normalized);
      } catch (error) {
        if (!active) return;
        const message = error instanceof Error ? error.message : '펀딩 신청 목록을 불러오지 못했습니다.';
        setListError(message);
        setApplicantList([]);
      } finally {
        if (active) {
          setLoadingList(false);
        }
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [accessToken, isHydrated]);

  useEffect(() => {
    if (selectedApplicant && !applicantList.some((applicant) => applicant.id === selectedApplicant.id)) {
      setSelectedApplicant(null);
    }
  }, [applicantList, selectedApplicant]);

  const filteredApplicants = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return applicantList;
    return applicantList.filter((applicant) => {
      const name = applicant.name ?? '';
      const id = applicant.id ?? '';
      const title = applicant.fundingTitle ?? '';
      return (
        name.toLowerCase().includes(keyword) ||
        id.toLowerCase().includes(keyword) ||
        title.toLowerCase().includes(keyword)
      );
    });
  }, [applicantList, searchTerm]);

  const performApproval = useCallback(
    async (ids: string[]) => {
      if (!ids.length || submitting) return;

      try {
        setSubmitting(true);
        const targets = applicantList.filter((applicant) => ids.includes(applicant.id));
        if (!targets.length) {
          toast.error('승인할 대상을 찾을 수 없습니다.');
          return;
        }

        await Promise.all(
          targets.map((applicant) =>
            approveFundingApplication(
              applicant.applicationId,
              accessToken ? { accessToken } : undefined,
            ),
          ),
        );
        toast.success('펀딩 승인이 완료되었습니다.', { duration: 2000 });
        const confirmed = new Set(targets.map((applicant) => applicant.id));
        setApplicantList((prev) => prev.filter((applicant) => !confirmed.has(applicant.id)));
        setSelectedIds([]);
        setSelectedApplicant((current) => (current && confirmed.has(current.id) ? null : current));
      } catch (error) {
        const message = error instanceof Error ? error.message : '펀딩 승인에 실패했습니다.';
        toast.error(message);
      } finally {
        setSubmitting(false);
      }
    },
    [accessToken, applicantList, submitting, toast],
  );

  const tableRows = useMemo<TableRow[]>(
    () =>
      filteredApplicants.map((applicant) => ({
        id: applicant.id,
        name: applicant.name,
        fundingname: applicant.fundingTitle,
        createdAt: applicant.appliedAt,
        detail: (
          <button
            type="button"
            className="text-primary underline"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              openModal(applicant);
            }}
          >
            상세보기
          </button>
        ),
      })),
    [filteredApplicants, openModal],
  );

  const handleBulkApprove = () => {
    if (!selectedIds.length) {
      toast.error('승인할 펀딩을 선택해 주세요.');
      return;
    }
    void performApproval(selectedIds);
  };

  const handleModalApprove = () => {
    if (!selectedApplicant) return;
    void performApproval([selectedApplicant.id]);
  };

  return (
    <>
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-2xl font-bold">신규 펀딩 승인</h3>
        <div className="flex gap-2">
          <Button variant="outline">펀딩 거절</Button>
          <Button
            variant="primary"
            onClick={handleBulkApprove}
            disabled={submitting || selectedIds.length === 0}
          >
            {submitting ? '승인 중…' : '펀딩 승인'}
          </Button>
        </div>
      </div>

      {listError ? (
        <div className="mb-4 rounded-lg border border-rose-300 bg-rose-50 p-4 text-sm text-rose-700">
          {listError}
        </div>
      ) : null}

      <AdminDataTable
        columns={columns}
        rows={tableRows}
        rowKey={(row) => row.id}
        sortKey={sortKey as string | undefined}
        sortDirection={sortDirection}
        onSortChange={(key, direction) => handleSortChange(key, direction)}
        selectedRowKeys={selectedIds}
        onSelectionChange={handleSelectionChange}
        emptyText={loadingList ? '펀딩 신청 목록을 불러오는 중입니다…' : '대기 중인 펀딩 신청이 없습니다.'}
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

        <form
          className="absolute right-0 flex h-10 w-[240px] items-center rounded-[12px] border border-primary px-4 text-sm text-[var(--color-gray-700)]"
          onSubmit={(event) => event.preventDefault()}
        >
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

      {selectedApplicant ? (
        <Modal
          title="펀딩 신청 상세보기"
          onClose={closeModal}
          maxWidthClassName="max-w-[640px]"
          footer={
            <div className="flex items-center justify-center gap-3">
              <Button variant="outline" className="w-[140px]" disabled={submitting}>
                펀딩 거절
              </Button>
              <Button
                variant="primary"
                className="w-[140px]"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  handleModalApprove();
                }}
                disabled={submitting}
              >
                {submitting ? '승인 중…' : '펀딩 승인'}
              </Button>
            </div>
          }
        >
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-6">
              <DefaultProfile className="h-24 w-24" aria-hidden />
              <div>
                <p className="text-xl font-semibold text-[var(--color-gray-900)]">
                  {selectedApplicant.name}
                </p>
                <p className="mt-2 text-sm text-[var(--color-gray-600)]">
                  ID : {selectedApplicant.id}
                </p>
              </div>
            </div>

            <dl className="divide-y divide-[var(--color-gray-100)] border-y border-[var(--color-gray-100)]">
              {[
                { label: '이메일', value: selectedApplicant.email },
                { label: '전화번호', value: selectedApplicant.phone },
                {
                  label: '사업자등록번호',
                  value: selectedApplicant.businessNumber,
                  link: selectedApplicant.businessDocument
                    ? {
                        label: '사업자등록증 사본',
                        href: selectedApplicant.businessDocument,
                      }
                    : undefined,
                },
                {
                  label: '통신판매업 신고번호',
                  value: selectedApplicant.commerceNumber,
                  link: selectedApplicant.commerceDocument
                    ? {
                        label: '신고증 사본',
                        href: selectedApplicant.commerceDocument,
                      }
                    : undefined,
                },
                {
                  label: '펀딩 내용',
                  value: selectedApplicant.fundingSummary,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="grid grid-cols-[140px_1fr] items-center gap-4 py-4 text-sm"
                >
                  <dt className="font-semibold text-[var(--color-gray-800)]">
                    {item.label}
                  </dt>
                  <dd className="flex flex-wrap items-center gap-3 text-[var(--color-gray-700)]">
                    {item.value ? <span>{item.value}</span> : <span>-</span>}
                    {item.link ? (
                      <Link
                        href={item.link.href}
                        className="text-primary underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {item.link.label}
                      </Link>
                    ) : null}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Modal>
      ) : null}
    </>
  );
}
