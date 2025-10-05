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

type Applicant = {
  id: string;
  name: string;
  email: string;
  phone: string;
  businessNumber?: string;
  businessDocument?: string;
  commerceNumber?: string;
  commerceDocument?: string;
  address?: string;
  productCategories: string[];
  snsHandle?: string;
  portfolio?: { label: string; url: string };
  appliedAt: string;
};

type TableRow = {
  id: string;
  name: string;
  createdAt: string;
  detail: ReactNode;
};

const columns: AdminTableColumn<TableRow>[] = [
  { key: 'id', header: '작가 ID', align: 'center', sortable: true },
  { key: 'name', header: '작가명', width: 'w-[440px]', sortable: true },
  { key: 'createdAt', header: '신청일자', align: 'center', sortable: true },
  { key: 'detail', header: '상세보기', align: 'center' },
];

const applicants: Applicant[] = [
  {
    id: 'abc136',
    name: '작가명입니다',
    email: 'abc123@abc.com',
    phone: '010-1234-5678',
    businessNumber: '123-45-67890',
    businessDocument: '/documents/business-license.pdf',
    commerceNumber: '2025-서울강남-1234',
    commerceDocument: '/documents/commerce-license.pdf',
    address: '서울특별시 강남구 테헤란로 123 2층',
    productCategories: ['스티커', '메모지'],
    snsHandle: '@morimori_official',
    portfolio: { label: '포트폴리오.pdf', url: '/documents/portfolio.pdf' },
    appliedAt: '2025-09-18',
  },
  {
    id: 'abc135',
    name: '작가명입니다',
    email: 'creator135@example.com',
    phone: '010-4567-8910',
    businessNumber: '321-54-09876',
    businessDocument: '/documents/business-license-135.pdf',
    commerceNumber: '2025-서울성동-0456',
    commerceDocument: '/documents/commerce-license-135.pdf',
    address: '서울특별시 성동구 왕십리로 45 3층',
    productCategories: ['노트', '엽서'],
    snsHandle: '@creator_135',
    portfolio: {
      label: 'creator135_portfolio.pdf',
      url: '/documents/creator135_portfolio.pdf',
    },
    appliedAt: '2025-09-17',
  },
  {
    id: 'abc134',
    name: '작가명입니다',
    email: 'artist134@example.com',
    phone: '010-9876-5432',
    businessNumber: '555-66-77777',
    address: '부산광역시 해운대구 센텀대로 12 5층',
    commerceNumber: '2025-부산해운대-0777',
    productCategories: ['굿즈', '폰케이스'],
    snsHandle: '@artist134',
    appliedAt: '2025-09-16',
  },
  {
    id: 'abc133',
    name: '작가명입니다',
    email: 'maker133@example.com',
    phone: '010-2222-3333',
    businessNumber: '444-55-66666',
    address: '대전광역시 유성구 대학로 123 1층',
    commerceNumber: '2025-대전유성-0123',
    productCategories: ['문구', '키링'],
    snsHandle: '@maker133',
    appliedAt: '2025-09-15',
  },
  {
    id: 'abc132',
    name: '작가명입니다',
    email: 'designer132@example.com',
    phone: '010-3333-4444',
    businessNumber: '222-33-44444',
    address: '인천광역시 연수구 송도과학로 27 7층',
    commerceNumber: '2025-인천연수-0420',
    productCategories: ['패브릭', '디지털굿즈'],
    snsHandle: '@designer132',
    appliedAt: '2025-09-14',
  },
  {
    id: 'abc131',
    name: '작가명입니다',
    email: 'crafter131@example.com',
    phone: '010-1111-9999',
    businessNumber: '111-22-33333',
    address: '서울특별시 마포구 양화로 55 9층',
    commerceNumber: '2025-서울마포-0555',
    productCategories: ['캔들', '향수'],
    snsHandle: '@crafter131',
    appliedAt: '2025-09-13',
  },
  {
    id: 'abc130',
    name: '작가명입니다',
    email: 'illustrator130@example.com',
    phone: '010-7777-8888',
    businessNumber: '999-88-77777',
    address: '경기도 성남시 분당구 불정로 10 20층',
    commerceNumber: '2025-경기성남-0202',
    productCategories: ['일러스트', '프린트'],
    snsHandle: '@illustrator130',
    appliedAt: '2025-09-12',
  },
];

export default function ApprovalsPage() {
  const [sortKey, setSortKey] = useState<keyof TableRow | undefined>(undefined);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(
    null,
  );

  const handleSelectionChange = (keys: Key[]) => {
    setSelectedIds(keys.map((key) => String(key)));
  };

  const handleSortChange = (key: string, direction: SortDirection) => {
    setSortKey(key as keyof TableRow);
    setSortDirection(direction);
  };

  const openModal = useCallback((applicant: Applicant) => {
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
        <h3 className="text-2xl font-bold">입점 승인</h3>
        <div className="flex gap-2">
          <Button variant="outline">입점 거절</Button>
          <Button variant="primary">입점 승인</Button>
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
                n === 1 ? 'font-semibold text-primary' : 'hover:text-primary'
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
          title="입점 신청 작가 상세보기"
          onClose={closeModal}
          maxWidthClassName="max-w-[640px]"
          footer={
            <div className="flex items-center justify-center gap-3">
              <Button variant="outline" className="w-[140px]">
                입점 거절
              </Button>
              <Button variant="primary" className="w-[140px]">
                입점 승인
              </Button>
            </div>
          }
        >
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-6">
              <DefaultProfile className="h-24 w-24 translate-y-2" aria-hidden />
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
                {
                  label: '이메일',
                  value: selectedApplicant.email ?? '-',
                },
                {
                  label: '전화번호',
                  value: selectedApplicant.phone ?? '-',
                },
                {
                  label: '사업자등록번호',
                  value: selectedApplicant.businessNumber ?? '-',
                  link: selectedApplicant.businessDocument
                    ? {
                        label: '사업자등록증 사본',
                        href: selectedApplicant.businessDocument,
                      }
                    : undefined,
                },
                {
                  label: '통신판매업 신고번호',
                  value: selectedApplicant.commerceNumber ?? '-',
                  link: selectedApplicant.commerceDocument
                    ? {
                        label: '신고증 사본',
                        href: selectedApplicant.commerceDocument,
                      }
                    : undefined,
                },
                {
                  label: '사업장소재지',
                  value: selectedApplicant.address ?? '-',
                },
                {
                  label: '주요 판매 품목',
                  value:
                    selectedApplicant.productCategories.length > 0
                      ? selectedApplicant.productCategories.join(', ')
                      : '-',
                },
                {
                  label: 'SNS 아이디',
                  value: selectedApplicant.snsHandle ?? '-',
                },
                {
                  label: '포트폴리오',
                  value: selectedApplicant.portfolio ? undefined : '-',
                  link: selectedApplicant.portfolio
                    ? {
                        label: selectedApplicant.portfolio.label,
                        href: selectedApplicant.portfolio.url,
                      }
                    : undefined,
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
                    {item.value !== undefined && item.value !== '' ? (
                      <span>{item.value}</span>
                    ) : null}
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
                    {item.value === undefined && !item.link ? <span>-</span> : null}
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
