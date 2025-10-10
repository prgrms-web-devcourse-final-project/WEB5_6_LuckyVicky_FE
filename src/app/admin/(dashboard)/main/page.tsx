'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Plus from '@/assets/icon/plus.svg';
import TrendChart from '@/components/admin/TrendChart';
import CategoryPieChart from '@/components/admin/CategoryPieChart';
import {
  fetchAdminOverview,
  type AdminOverviewPayload,
  type OverviewMetric,
  type AlertEntry,
} from '@/services/dashboard';
import { useAuthStore } from '@/stores/authStore';

type TrendConfig = {
  title: string;
  color: string;
  data: Array<{ label: string; value: number }>;
};

type OverviewCard = {
  key: keyof AdminOverviewPayload['overview'];
  label: string;
  emoji: string;
  metric?: OverviewMetric;
};

const PIE_COLORS = ['#4C825B', '#E3EBE4', '#B9CDB9', '#8DAA8F', '#8B5E3C', '#B89F90'];

function formatMetric(metric?: OverviewMetric) {
  if (!metric) return { countLabel: '-', unit: '' };
  const formatter = new Intl.NumberFormat('ko-KR');
  return {
    countLabel: formatter.format(metric.count),
    unit: metric.unit ?? '',
  };
}

function formatAlertItem(item: AlertEntry) {
  const label = item.nickname ?? item.productName ?? '이름 미상';
  const time = new Date(item.requestedAt);
  const timeLabel = Number.isNaN(time.getTime()) ? '' : time.toLocaleString('ko-KR');
  return {
    label,
    time: timeLabel,
  };
}

function buildTrendSeries(payload?: AdminOverviewPayload | null): TrendConfig[] {
  if (!payload) {
    return [];
  }

  const salesSeries = payload.charts.salesTrend?.series ?? {};
  const userSeries = payload.charts.userGrowth?.series ?? {};

  const mapSeries = (series?: Array<{ t: string; v: number }>) =>
    (series ?? []).map((point) => ({ label: point.t, value: point.v }));

  return [
    {
      title: '매출 추이',
      color: 'var(--color-danger)',
      data: mapSeries(salesSeries.sales),
    },
    {
      title: '주문 수 추이',
      color: 'var(--color-tertiary)',
      data: mapSeries(salesSeries.orders),
    },
    {
      title: '가입자 수 추이',
      color: 'var(--color-primary)',
      data: mapSeries(userSeries.users ?? userSeries.artists),
    },
  ];
}

function buildCategoryDistribution(payload?: AdminOverviewPayload | null) {
  if (!payload) return [];
  const buckets = payload.charts.categoryDistribution?.buckets ?? [];
  return buckets.map((bucket, index) => ({
    name: bucket.name,
    value: bucket.count,
    color: PIE_COLORS[index % PIE_COLORS.length],
  }));
}

function Page() {
  const [data, setData] = useState<AdminOverviewPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchAdminOverview({
          range: '1M',
          granularity: 'MONTH',
          period: 'MONTH',
        }, { accessToken });
        if (mounted) {
          setData(response);
        }
      } catch (err) {
        console.error(err);
        if (mounted) {
          setError(
            err instanceof Error ? err.message : '대시보드 정보를 불러오지 못했습니다.',
          );
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
  }, [accessToken]);

  const cards: OverviewCard[] = useMemo(
    () => [
      { key: 'userCount', label: '가입자 수', emoji: '👥', metric: data?.overview.userCount },
      { key: 'salesStats', label: '총 매출', emoji: '💲', metric: data?.overview.salesStats },
      { key: 'orderStats', label: '주문 수', emoji: '🛒', metric: data?.overview.orderStats },
      { key: 'productCount', label: '상품 수', emoji: '🎁', metric: data?.overview.productCount },
      { key: 'fundingCount', label: '펀딩 수', emoji: '🌱', metric: data?.overview.fundingCount },
      { key: 'artistCount', label: '작가 수', emoji: '🌳', metric: data?.overview.artistCount },
    ],
    [data?.overview],
  );

  const trendConfigs = useMemo(() => buildTrendSeries(data), [data]);
  const pieData = useMemo(() => buildCategoryDistribution(data), [data]);
  const artistAlerts = data?.alerts.artistApprovalPending ?? [];
  const fundingAlerts = data?.alerts.fundingApprovalPending ?? [];

  return (
    <>
      <div className="mb-[30px]">
        <h3 className="mb-[30px] text-2xl font-bold">메인 현황</h3>
        {error ? (
          <div className="rounded-2xl border border-rose-300 bg-rose-50 p-6 text-rose-700">
            {error}
          </div>
        ) : (
          <div className="grid w-full gap-[30px] grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {cards.map(({ label, emoji, metric }) => {
              const { countLabel, unit } = formatMetric(metric);
              return (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-2xl border border-[var(--color-primary)] px-[23px] py-[14px] bg-white"
                >
                  <h2 className="text-xl font-bold">
                    <span className="mr-2" aria-hidden>
                      {emoji}
                    </span>
                    {label}
                  </h2>
                  <p className="text-lg font-medium">
                    {loading ? '—' : `${countLabel}${unit}`}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mb-[30px]">
        <h4 className="text-xl font-bold">가입자/주문/매출 추이</h4>
        {trendConfigs.length === 0 ? (
          <div className="mt-6 rounded-2xl bg-white p-6 text-center text-sm">
            {loading ? '차트 데이터를 불러오는 중입니다…' : '표시할 데이터가 없습니다.'}
          </div>
        ) : (
          <div className="mt-6 grid gap-[30px] md:grid-cols-2 xl:grid-cols-3">
            {trendConfigs.map((config) => (
              <TrendChart key={config.title} {...config} />
            ))}
          </div>
        )}
      </div>

      <div className="flex w-full flex-col gap-[60px] lg:flex-row lg:items-start lg:gap-[112px]">
        <div className="lg:w-[420px]">
          <h4 className="mb-6 text-xl font-bold">카테고리별 상품 분포</h4>
          <CategoryPieChart
            data={pieData.length > 0 ? pieData : [{ name: '데이터 없음', value: 1, color: '#E5E5E5' }]}
            title={data?.charts.categoryDistribution?.asOf ? `as of ${data.charts.categoryDistribution.asOf}` : undefined}
          />
        </div>

        <div className="flex-1">
          <h4 className="mb-6 text-xl font-bold">알림</h4>
          <div className="rounded-2xl bg-[var(--color-primary-20)] p-5">
            <AlertSection
              title="승인 대기 중인 작가"
              items={artistAlerts.map(formatAlertItem)}
              emptyLabel="승인 대기 중인 작가가 없습니다."
              href="/admin/monitor/approve"
            />
            <AlertSection
              title="승인 대기 중인 펀딩"
              items={fundingAlerts.map(formatAlertItem)}
              emptyLabel="승인 대기 중인 펀딩이 없습니다."
              href="/admin/monitor/monitor"
            />
          </div>
        </div>
      </div>
    </>
  );
}

function AlertSection({
  title,
  items,
  emptyLabel,
  href,
}: {
  title: string;
  items: Array<{ label: string; time: string }>;
  emptyLabel: string;
  href: string;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3p-4 last:mb-0">
      <div className="flex items-center justify-between">
        <h5 className="text-lg font-semibold text-[var(--color-gray-900)]">{title}</h5>
        <Link href={href} className="flex items-center gap-2 text-sm font-medium text-primary hover:underline">
          <Plus className="h-4 w-4" aria-hidden />
          <span>더보기</span>
        </Link>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-[var(--color-gray-600)]">{emptyLabel}</p>
      ) : (
        <ul className="space-y-2 text-sm text-[var(--color-gray-700)]">
          {items.map((item, index) => (
            <li key={`${item.label}-${index}`} className="flex items-center justify-between">
              <span>{item.label}</span>
              <span className="text-xs text-[var(--color-gray-500)]">{item.time}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Page;
