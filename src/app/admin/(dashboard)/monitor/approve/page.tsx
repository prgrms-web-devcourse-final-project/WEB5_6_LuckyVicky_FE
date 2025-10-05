'use client';

import { useCallback, useMemo, useState, type Key, type ReactNode } from 'react';
import Link from 'next/link';
import AdminDataTable, {
  AdminTableColumn,
  SortDirection,
} from '@/components/admin/AdminDataTable';
import Button from '@/components/Button';
import SearchIcon from '@/assets/icon/search.svg';
import Modal from '@/components/Modal';
import DefaultProfile from '@/assets/icon/default_profile.svg';

type FundingApplicant = {
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

const applicants: FundingApplicant[] = [
  {
    id: 'abc136',
    name: '작가명입니다',
    fundingTitle: '펀딩 제목입니다',
    fundingSummary: '펀딩 제목입니다 펀딩 제목입니다',
    email: 'abc123@abc.com',
    phone: '010-1234-5678',
    businessNumber: '123-45-67890',
    businessDocument: '/documents/business-license.pdf',
    commerceNumber: '2025-서울강남-1234',
    commerceDocument: '/documents/commerce-license.pdf',
    appliedAt: '2025-09-18',
  },
  {
    id: 'abc135',
    name: '작가명입니다',
    fundingTitle: '감성 엽서 펀딩',
    fundingSummary: '감성을 담은 엽서 세트를 소개합니다.',
    email: 'creator135@example.com',
    phone: '010-4567-8910',
    businessNumber: '321-54-09876',
    businessDocument: '/documents/business-license-135.pdf',
    commerceNumber: '2025-서울성동-0456',
    commerceDocument: '/documents/commerce-license-135.pdf',
    appliedAt: '2025-09-18',
  },
  {
    id: 'abc134',
    name: '작가명입니다',
    fundingTitle: '환경을 위한 다이어리',
    fundingSummary: '친환경 소재를 사용한 다이어리 기획안입니다.',
    email: 'artist134@example.com',
    phone: '010-9876-5432',
    appliedAt: '2025-09-17',
  },
  {
    id: 'abc133',
    name: '작가명입니다',
    fundingTitle: '감성 라이트 제작',
    fundingSummary: '따뜻한 분위기를 연출하는 조명 프로젝트입니다.',
    email: 'maker133@example.com',
    phone: '010-2222-3333',
    businessNumber: '444-55-66666',
    appliedAt: '2025-09-16',
  },
  {
    id: 'abc132',
    name: '작가명입니다',
    fundingTitle: '아티스트 굿즈 제작',
    fundingSummary: '일러스트 굿즈 제작을 위한 펀딩입니다.',
    email: 'designer132@example.com',
    phone: '010-3333-4444',
    appliedAt: '2025-09-15',
  },
  {
    id: 'abc131',
    name: '작가명입니다',
    fundingTitle: '제작자의 생활용품',
    fundingSummary: '생활을 편리하게 해주는 아이템을 소개합니다.',
    email: 'crafter131@example.com',
    phone: '010-1111-9999',
    appliedAt: '2025-09-14',
  },
];

export default function ApproveFundingPage() {
  const [sortKey, setSortKey] = useState<keyof TableRow | undefined>(undefined);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplicant, setSelectedApplicant] = useState<FundingApplicant | null>(
    null,
  );

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

  const tableRows = useMemo<TableRow[]>(
    () =>
      applicants.map((applicant) => ({
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
    [openModal],
  );

  return (
    <>
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-2xl font-bold">신규 펀딩 승인</h3>
        <div className="flex gap-2">
          <Button variant="outline">펀딩 거절</Button>
          <Button variant="primary">펀딩 승인</Button>
        </div>
      </div>

      <AdminDataTable
        columns={columns}
        rows={tableRows}
        rowKey={(row) => row.id}
        sortKey={sortKey as string | undefined}
        sortDirection={sortDirection}
        onSortChange={(key, direction) => handleSortChange(key, direction)}
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

      {selectedApplicant ? (
        <Modal
          title="펀딩 신청 상세보기"
          onClose={closeModal}
          maxWidthClassName="max-w-[640px]"
          footer={
            <div className="flex items-center justify-center gap-3">
              <Button variant="outline" className="w-[140px]">
                펀딩 거절
              </Button>
              <Button variant="primary" className="w-[140px]">
                펀딩 승인
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
