'use client';

import TrendChart from '@/components/admin/TrendChart';
import CategoryPieChart from '@/components/admin/CategoryPieChart';

import Plus from '@/assets/icon/plus.svg';
import Link from 'next/link';

const chartConfigs = [
  {
    title: '가입자 수',
    color: 'var(--color-primary)',
    data: [
      { label: '1M', value: 320 },
      { label: '3M', value: 410 },
      { label: '6M', value: 280 },
      { label: '1Y', value: 500 },
      { label: 'ALL', value: 620 },
    ],
  },
  {
    title: '주문 수',
    color: 'var(--color-tertiary)',
    data: [
      { label: '1M', value: 210 },
      { label: '3M', value: 340 },
      { label: '6M', value: 300 },
      { label: '1Y', value: 420 },
      { label: 'ALL', value: 580 },
    ],
  },
  {
    title: '매출',
    color: 'var(--color-danger)',
    data: [
      { label: '1M', value: 540 },
      { label: '3M', value: 620 },
      { label: '6M', value: 590 },
      { label: '1Y', value: 730 },
      { label: 'ALL', value: 880 },
    ],
  },
];

const categoryDistribution = [
  { name: '스티커', value: 32, color: '#4C825B' },
  { name: '메모지', value: 27, color: '#E3EBE4' },
  { name: '노트', value: 18, color: '#B9CDB9' },
  { name: '액세서리', value: 11, color: '#8DAA8F' },
  { name: '디지털문구', value: 7, color: '#8B5E3C' },
  { name: '기타', value: 5, color: '#B89F90' },
];

function Page() {
  return (
    <>
      <div className="mb-[30px]">
        <h3 className="mb-[30px] text-2xl font-bold">메인 현황</h3>
        <div className="grid w-full gap-[30px] grid-cols-3">
          <div className="flex justify-between items-center px-[23px] py-[14px] rounded-2xl border border-[var(--color-primary)]">
            <h2 className="font-bold text-xl">👥 가입자 수</h2>
            <p className="font-medium text-lg">10,000명</p>
          </div>

          <div className="flex justify-between items-center px-[23px] py-[14px] rounded-2xl border border-[var(--color-primary)]">
            <h2 className="font-bold text-xl">💲 오늘의 매출</h2>
            <p className="font-medium text-lg">1,000,000원</p>
          </div>

          <div className="flex justify-between items-center px-[23px] py-[14px] rounded-2xl border border-[var(--color-primary)]">
            <h2 className="font-bold text-xl">🛒 오늘의 주문</h2>
            <p className="font-medium text-lg">1,000건</p>
          </div>

          <div className="flex justify-between items-center px-[23px] py-[14px] rounded-2xl border border-[var(--color-primary)]">
            <h2 className="font-bold text-xl">🎁 상품 수</h2>
            <p className="font-medium text-lg">9,999개</p>
          </div>

          <div className="flex justify-between items-center px-[23px] py-[14px] rounded-2xl border border-[var(--color-primary)]">
            <h2 className="font-bold text-xl">🌱 펀딩 수</h2>
            <p className="font-medium text-lg">9,999,999개</p>
          </div>

          <div className="flex justify-between items-center px-[23px] py-[14px] rounded-2xl border border-[var(--color-primary)]">
            <h2 className="font-bold text-xl">🌳 작가 수</h2>
            <p className="font-medium text-lg">1,000명</p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-xl font-bold">가입자/주문/매출 추이</h4>
        <div className="mt-6 grid gap-[30px] md:grid-cols-2 xl:grid-cols-3">
          {chartConfigs.map((config) => (
            <TrendChart key={config.title} {...config} />
          ))}
        </div>
      </div>

      <div className="flex w-full gap-[112px]">
        <div className="mt-[60px]">
          <h4 className="mb-6 text-xl font-bold">카테고리별 상품 분포</h4>
          <CategoryPieChart data={categoryDistribution} />
        </div>

        <div className="flex-1 mt-[60px]">
          <h4 className="mb-6 text-xl font-bold">알림</h4>
          <div className="rounded-lg bg-[var(--color-primary-20)] p-5">
            <ul className="list-disc list-inside space-y-2 text-sm">
            <div className="flex flex-col mb-5 gap-3">
                <div className="flex justify-between items-center">
                <h4 className="font-bold text-xl">승인 대기 중인 작가</h4>
                <Link href="/admin/artists" className="flex items-center gap-2">
                    <Plus />
                    <span>더보기</span>
                </Link>
              </div>

              <li>작가 이름입니다</li>
              <li>작가 이름입니다</li>
            </div>
              
            <div className="flex flex-col mb-5 gap-3">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-xl">승인 대기 중인 펀딩</h4>
                <Link href="/admin/fundings" className="flex items-center gap-2">
                    <Plus />
                    <span>더보기</span>
                </Link>
              </div>
              <li>펀딩 이름입니다</li>
              <li>펀딩 이름입니다</li>
              <li>펀딩 이름입니다</li>
            </div>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default Page;
