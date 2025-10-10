import { getTimezone } from '@/utils/timezone';

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? '').replace(/\/+$/, '');

export type OverviewRange = '1M' | '3M' | '6M' | '1Y' | 'ALL';
export type OverviewGranularity = 'DAY' | 'WEEK' | 'MONTH';
export type OverviewPeriod = 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';

export type AdminOverviewRequest = {
  range: OverviewRange;
  granularity: OverviewGranularity;
  period: OverviewPeriod;
  timezone?: string;
};

export type AdminOverviewResponse = {
  resultCode?: string;
  msg?: string;
  data?: AdminOverviewPayload;
};

export type AdminOverviewPayload = {
  overview: {
    userCount: OverviewMetric;
    orderStats: OverviewMetric;
    salesStats: OverviewMetric;
    productCount: OverviewMetric;
    fundingCount: OverviewMetric;
    artistCount: OverviewMetric;
  };
  charts: {
    meta: {
      range: string;
      granularity: string;
      timezone: string;
    };
    salesTrend: TrendSeriesPayload;
    userGrowth: TrendSeriesPayload;
    categoryDistribution: {
      asOf: string;
      totalProducts: number;
      buckets: Array<{
        categoryId: number;
        name: string;
        count: number;
        share: number;
      }>;
    };
  };
  alerts: {
    artistApprovalPending: Array<AlertEntry>;
    fundingApprovalPending: Array<AlertEntry>;
  };
  serverTime: string;
  timezone: string;
};

export type OverviewMetric = {
  count: number;
  label: string;
  unit: string;
  delta: number;
  rate: number;
};

export type TrendSeriesPayload = {
  series: Record<string, Array<{ t: string; v: number }>>;
  delta?: Record<string, { delta: number; rate: number }>;
};

export type AlertEntry = {
  artistId?: number;
  fundingId?: number;
  nickname?: string;
  productName?: string;
  requestedAt: string;
};

export async function fetchAdminOverview(
  params: AdminOverviewRequest,
  options?: { accessToken?: string },
): Promise<AdminOverviewPayload | null> {
  const timezone = params.timezone ?? getTimezone();
  const body = {
    range: params.range,
    granularity: params.granularity,
    period: params.period,
    timezone,
  };

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (options?.accessToken) {
    headers.Authorization = `Bearer ${options.accessToken}`;
  }

  const res = await fetch(`${API_BASE}/api/dashboard/admin/overview`, {
    method: 'POST',
    credentials: 'include',
    headers,
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  if (res.status === 204) {
    return null;
  }

  const payload: AdminOverviewResponse & { message?: string } = await res
    .json()
    .catch(() => ({} as AdminOverviewResponse & { message?: string }));

  if (!res.ok) {
    const message = payload.msg || payload.message || '대시보드 데이터를 불러오지 못했습니다.';
    throw new Error(message);
  }

  if (!payload.data) {
    return null;
  }

  return payload.data;
}
