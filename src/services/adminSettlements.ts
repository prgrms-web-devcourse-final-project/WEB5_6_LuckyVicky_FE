import { getTimezone } from '@/utils/timezone';

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? '').replace(/\/+$/, '');

export type SettlementGranularity = 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';

export type AdminSettlementsQuery = {
  year: number;
  month: number;
  granularity: SettlementGranularity;
  timezone?: string;
};

export type SettlementSummary = {
  orderNo?: string;
  brandName?: string;
  title?: string;
  price?: number;
  quantity?: number;
  thumbnailUrl?: string;
};

export type SettlementChartPoint = {
  bucketStart: string;
  value: number;
};

export type SettlementTableEntry = {
  bucketStart: string;
  grossSales: number;
  artistPayout: number;
  netIncome: number;
};

export type AdminSettlementsPayload = {
  scope: {
    year: number;
    month: number;
  };
  granularity: string;
  timezone: string;
  summary?: SettlementSummary;
  chart?: {
    series?: {
      sales?: SettlementChartPoint[];
      [key: string]: SettlementChartPoint[] | undefined;
    };
    yDomain?: {
      min: number;
      max: number;
    };
  };
  table?: SettlementTableEntry[];
  serverTime?: string;
};

export type AdminSettlementsResponse = {
  resultCode?: string;
  msg?: string;
  data?: AdminSettlementsPayload;
};

export async function fetchAdminSettlements(
  params: AdminSettlementsQuery,
  options?: { accessToken?: string },
): Promise<AdminSettlementsPayload | null> {
  const timezone = params.timezone ?? getTimezone();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (options?.accessToken) {
    headers.Authorization = `Bearer ${options.accessToken}`;
  }

  const response = await fetch(`${API_BASE}/api/dashboard/admin/settlements`, {
    method: 'POST',
    credentials: 'include',
    headers,
    body: JSON.stringify({ ...params, timezone }),
    cache: 'no-store',
  });

  if (response.status === 204) {
    return null;
  }

  const payload: AdminSettlementsResponse & { message?: string } = await response
    .json()
    .catch(() => ({} as AdminSettlementsResponse & { message?: string }));

  if (!response.ok) {
    const message = payload.msg || payload.message || '정산 데이터를 불러오지 못했습니다.';
    throw new Error(message);
  }

  return payload.data ?? null;
}

