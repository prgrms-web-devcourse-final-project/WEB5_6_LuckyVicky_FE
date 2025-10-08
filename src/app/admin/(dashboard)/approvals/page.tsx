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
import { approveFundingApplication, rejectFundingApplication } from '@/services/adminFundingApproval';
import {
  fetchArtistApplications,
  normalizeArtistApplication,
  type ArtistApplication,
} from '@/services/adminArtistApplications';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { useAuthStore } from '@/stores/authStore';

type TableRow = {
  id: string;
  name: string;
  createdAt: string;
  detail: ReactNode;
};

const columns: AdminTableColumn<TableRow>[] = [
  { key: 'id', header: '신청 ID', align: 'center', sortable: true },
  { key: 'name', header: '작가명', width: 'w-[320px]', sortable: true },
  { key: 'createdAt', header: '신청일자', align: 'center', sortable: true },
  { key: 'detail', header: '상세보기', align: 'center' },
];

export default function ApprovalsPage() {
  useAuthGuard({ allowedRoles: ['ADMIN'], redirectTo: '/admin/login' });

  const [sortKey, setSortKey] = useState<keyof TableRow | undefined>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [applications, setApplications] = useState<ArtistApplication[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<ArtistApplication | null>(null);
  const [rejectionModal, setRejectionModal] = useState<{ open: boolean; applicationId: number | null }>({ open: false, applicationId: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (!accessToken) return;

    let active = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const summaries = await fetchArtistApplications(
          { status: 'PENDING', page: 0, size: 50 },
          { accessToken },
        );
        if (!active) return;
        setApplications(summaries.map(normalizeArtistApplication));
      } catch (err) {
        if (!active) return;
        const message = err instanceof Error ? err.message : '입점 신청 목록을 불러오지 못했습니다.';
        setError(message);
        setApplications([]);
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
  }, [accessToken]);

  const filteredApplications = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return applications;
    return applications.filter((application) => {
      return (
        application.applicantId.toLowerCase().includes(keyword) ||
        application.artistName.toLowerCase().includes(keyword)
      );
    });
  }, [applications, searchTerm]);

  const sortedApplications = useMemo(() => {
    const list = [...filteredApplications];
    if (!sortKey) return list;

    const compare = (a: ArtistApplication, b: ArtistApplication) => {
      switch (sortKey) {
        case 'id':
          return Number(a.applicationId) - Number(b.applicationId);
        case 'name':
          return a.artistName.localeCompare(b.artistName);
        case 'createdAt':
        default:
          return new Date(a.appliedAt).getTime() - new Date(b.appliedAt).getTime();
      }
    };

    list.sort(compare);
    if (sortDirection === 'desc') list.reverse();
    return list;
  }, [filteredApplications, sortDirection, sortKey]);

  const tableRows = useMemo<TableRow[]>(
    () =>
      sortedApplications.map((application) => ({
        id: String(application.applicationId),
        name: application.artistName,
        createdAt: application.appliedAt,
        detail: (
          <button
            type="button"
            className="text-primary underline"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setSelectedApplication(application);
            }}
          >
            상세보기
          </button>
        ),
      })),
    [sortedApplications],
  );

  const handleSelectionChange = (keys: Key[]) => {
    setSelectedIds(keys.map((key) => String(key)));
  };

  const handleSortChange = (key: string, direction: SortDirection) => {
    setSortKey(key as keyof TableRow);
    setSortDirection(direction);
  };

  useEffect(() => {
    setSelectedIds((prev) => prev.filter((id) => sortedApplications.some((application) => String(application.applicationId) === id)));
  }, [sortedApplications]);

  const approveSelected = useCallback(async () => {
    if (!selectedIds.length) {
      toast.error('승인할 신청을 선택해 주세요.');
      return;
    }
    if (!accessToken) {
      toast.error('인증 정보가 없습니다. 다시 로그인해 주세요.');
      return;
    }
    try {
      await Promise.all(
        selectedIds.map((id) => approveFundingApplication(Number(id), { accessToken })),
      );
      toast.success('승인이 완료되었습니다.');
      setApplications((prev) => prev.filter((application) => !selectedIds.includes(String(application.applicationId))));
      setSelectedIds([]);
      setSelectedApplication((current) =>
        current && selectedIds.includes(String(current.applicationId)) ? null : current,
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : '입점 승인에 실패했습니다.';
      toast.error(message);
    }
  }, [accessToken, selectedIds, toast]);

  const rejectSelected = useCallback(async (reason: string) => {
    if (!selectedIds.length) {
      toast.error('거절할 신청을 선택해 주세요.');
      return;
    }
    if (!accessToken) {
      toast.error('인증 정보가 없습니다. 다시 로그인해 주세요.');
      return;
    }
    try {
      await Promise.all(
        selectedIds.map((id) => rejectFundingApplication(Number(id), reason, { accessToken })),
      );
      toast.success('거절이 완료되었습니다.');
      setApplications((prev) => prev.filter((application) => !selectedIds.includes(String(application.applicationId))));
      setSelectedIds([]);
      setSelectedApplication((current) =>
        current && selectedIds.includes(String(current.applicationId)) ? null : current,
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : '입점 거절에 실패했습니다.';
      toast.error(message);
    }
  }, [accessToken, selectedIds, toast]);

  const rejectSingle = useCallback(async (applicationId: number, reason: string) => {
    if (!accessToken) {
      toast.error('인증 정보가 없습니다. 다시 로그인해 주세요.');
      return;
    }
    try {
      await rejectFundingApplication(applicationId, reason, { accessToken });
      toast.success('거절이 완료되었습니다.');
      setApplications((prev) => prev.filter((application) => application.applicationId !== applicationId));
      setSelectedIds((prev) => prev.filter((id) => Number(id) !== applicationId));
      setSelectedApplication((current) => (current && current.applicationId === applicationId ? null : current));
    } catch (err) {
      const message = err instanceof Error ? err.message : '입점 거절에 실패했습니다.';
      toast.error(message);
    }
  }, [accessToken, toast]);

  const approveSingle = useCallback(
    async (applicationId: number) => {
      if (!accessToken) {
        toast.error('인증 정보가 없습니다. 다시 로그인해 주세요.');
        return;
      }
      try {
        await approveFundingApplication(applicationId, { accessToken });
        toast.success('승인이 완료되었습니다.');
        setApplications((prev) => prev.filter((application) => application.applicationId !== applicationId));
        setSelectedIds((prev) => prev.filter((id) => Number(id) !== applicationId));
        setSelectedApplication((current) => (current && current.applicationId === applicationId ? null : current));
      } catch (err) {
        const message = err instanceof Error ? err.message : '입점 승인에 실패했습니다.';
        toast.error(message);
      }
    },
    [accessToken, toast],
  );

  return (
    <>
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-2xl font-bold">입점 승인</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              if (!selectedIds.length) {
                toast.error('거절할 신청을 선택해 주세요.');
                return;
              }
              setRejectionModal({ open: true, applicationId: null });
            }}
            disabled={selectedIds.length === 0}
          >
            입점 거절
          </Button>
          <Button variant="primary" onClick={approveSelected} disabled={selectedIds.length === 0}>
            입점 승인
          </Button>
        </div>
      </div>

      {error ? (
        <div className="mb-4 rounded-lg border border-rose-300 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <AdminDataTable
        columns={columns}
        rows={tableRows}
        rowKey={(row) => row.id}
        sortKey={sortKey as string | undefined}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
        selectedRowKeys={selectedIds}
        onSelectionChange={handleSelectionChange}
        emptyText={loading ? '입점 신청을 불러오는 중입니다…' : '대기 중인 입점 신청이 없습니다.'}
      />

      <div className="relative mt-6 flex items-center justify-center">
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
          <SearchIcon className="absolute right-4 h-4 w-4 text-primary" aria-hidden />
        </form>
      </div>


      {rejectionModal.open ? (
        <Modal
          title="거절 사유 입력"
          onClose={() => setRejectionModal({ open: false, applicationId: null })}
          maxWidthClassName="max-w-[480px]"
          footer={null}
        >
          <RejectForm
            onSubmit={async (reason) => {
              try {
                if (rejectionModal.applicationId !== null) {
                  await rejectSingle(rejectionModal.applicationId, reason);
                } else {
                  await rejectSelected(reason);
                }
                setRejectionModal({ open: false, applicationId: null });
              } catch (err) {
                toast.error(err instanceof Error ? err.message : '거절 처리 중 오류가 발생했습니다.');
              }
            }}
            onCancel={() => setRejectionModal({ open: false, applicationId: null })}
          />
        </Modal>
      ) : null}
      {selectedApplication ? (
        <Modal
          title="입점 신청 상세보기"
          onClose={() => setSelectedApplication(null)}
          maxWidthClassName="max-w-[640px]"
          footer={
            <div className="flex items-center justify-center gap-3">
              <Button
                variant="outline"
                className="w-[140px]"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setRejectionModal({ open: true, applicationId: selectedApplication.applicationId });
                }}
              >
                입점 거절
              </Button>
              <Button
                variant="primary"
                className="w-[140px]"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  approveSingle(selectedApplication.applicationId);
                }}
              >
                입점 승인
              </Button>
            </div>
          }
        >
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-6">
              <DefaultProfile className="h-24 w-24" aria-hidden />
              <div>
                <p className="text-xl font-semibold text-[var(--color-gray-900)]">
                  {selectedApplication.artistName}
                </p>
                <p className="mt-2 text-sm text-[var(--color-gray-600)]">
                  신청 ID : {selectedApplication.applicationId}
                </p>
              </div>
            </div>

            <dl className="divide-y divide-[var(--color-gray-100)] border-y border-[var(--color-gray-100)]">
              {[
                { label: '이메일', value: selectedApplication.email },
                { label: '전화번호', value: selectedApplication.phone },
                { label: '사업자등록번호', value: selectedApplication.businessNumber },
                { label: '통신판매업 신고번호', value: selectedApplication.commerceNumber },
                { label: '펀딩 제목', value: selectedApplication.fundingTitle },
                { label: '펀딩 내용', value: selectedApplication.fundingSummary },
              ].map((item) => (
                <div
                  key={item.label}
                  className="grid grid-cols-[140px_1fr] items-center gap-4 py-4 text-sm"
                >
                  <dt className="font-semibold text-[var(--color-gray-800)]">
                    {item.label}
                  </dt>
                  <dd className="flex flex-wrap items-center gap-3 text-[var(--color-gray-700)]">
                    {item.value ?? '-'}
                  </dd>
                </div>
              ))}

              {[
                { label: '사업자등록증 사본', url: selectedApplication.businessDocument },
                { label: '통신판매업 신고증 사본', url: selectedApplication.commerceDocument },
              ].map(({ label, url }) =>
                url ? (
                  <div
                    key={label}
                    className="grid grid-cols-[140px_1fr] items-center gap-4 py-4 text-sm"
                  >
                    <dt className="font-semibold text-[var(--color-gray-800)]">{label}</dt>
                    <dd>
                      <Link
                        href={url}
                        className="text-primary underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        다운로드
                      </Link>
                    </dd>
                  </div>
                ) : null,
              )}
            </dl>
          </div>
        </Modal>
      ) : null}
    </>
  );
}


function RejectForm({ onSubmit, onCancel }: { onSubmit: (reason: string) => Promise<void> | void; onCancel: () => void }) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = reason.trim();
    if (!trimmed) {
      setError('거절 사유를 입력해 주세요.');
      return;
    }
    setError(null);
    try {
      setSubmitting(true);
      await onSubmit(trimmed);
    } catch (err) {
      setError(err instanceof Error ? err.message : '거절 처리에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <label className="flex flex-col gap-2 text-sm text-[var(--color-gray-700)]">
        <span className="font-medium text-[var(--color-gray-900)]">거절 사유</span>
        <textarea
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          rows={4}
          className="w-full rounded-lg border border-[var(--color-gray-200)] px-3 py-2 outline-none focus:border-[var(--color-primary)]"
          placeholder="거절 사유를 입력해 주세요"
          required
        />
      </label>

      {error ? <p className="text-sm text-rose-600">{error}</p> : null}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
          취소
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? '처리 중…' : '거절하기'}
        </Button>
      </div>
    </form>
  );
}
