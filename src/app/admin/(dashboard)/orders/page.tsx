"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import AdminDataTable, { AdminTableColumn } from "@/components/admin/AdminDataTable";
import RevenueBarChart from "@/components/admin/RevenueBarChart";
import {
  fetchAdminSettlements,
  type AdminSettlementsPayload,
  type SettlementSummary,
} from "@/services/adminSettlements";
import { useAuthStore } from "@/stores/authStore";

type RevenueRow = {
  month: string;
  totalSales: number;
  artistPayout: number;
  profit: number;
};

type ChartDatum = {
  month: string;
  total: number;
};

const currencyFormatter = new Intl.NumberFormat("ko-KR");

const columns: AdminTableColumn<RevenueRow>[] = [
  { key: "month", header: "월", width: "w-28", align: "center" },
  {
    key: "totalSales",
    header: "총 매출금액",
    align: "right",
    render: (row) => `${currencyFormatter.format(row.totalSales)}원`,
  },
  {
    key: "artistPayout",
    header: "작가 지급 금액",
    align: "right",
    render: (row) => `${currencyFormatter.format(row.artistPayout)}원`,
  },
  {
    key: "profit",
    header: "순이익",
    align: "right",
    render: (row) => `${currencyFormatter.format(row.profit)}원`,
  },
];

function formatBucketLabel(bucketStart: unknown) {
  if (typeof bucketStart === "string") {
    const date = new Date(bucketStart);
    if (!Number.isNaN(date.getTime())) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      return `${year}.${month}`;
    }
    if (/^\d{4}-\d{2}$/.test(bucketStart)) {
      const [y, m] = bucketStart.split("-");
      return `${y}.${m}`;
    }
    if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(bucketStart)) {
      const [y, m] = bucketStart.split("-");
      return `${y}.${m.padStart(2, "0")}`;
    }
  }
  return String(bucketStart ?? "-");
}

function toNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function mapPayloadToChart(payload: AdminSettlementsPayload | null): ChartDatum[] {
  const series = payload?.chart?.series?.sales ?? [];
  if (!Array.isArray(series)) return [];
  return series.map((point) => ({
    month: formatBucketLabel(point?.bucketStart),
    total: toNumber(point?.value),
  }));
}

function mapPayloadToRows(payload: AdminSettlementsPayload | null): RevenueRow[] {
  const entries = Array.isArray(payload?.table) ? payload?.table : [];
  return entries.map((entry) => ({
    month: formatBucketLabel(entry?.bucketStart),
    totalSales: toNumber(entry?.grossSales),
    artistPayout: toNumber(entry?.artistPayout),
    profit: toNumber(entry?.netIncome),
  }));
}

function formatServerTime(value: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleString("ko-KR");
}

export default function OrdersPage() {
  const currentYear = new Date().getFullYear();
  const defaultYear = String(currentYear);
  const [year, setYear] = useState(defaultYear);
  const [chartData, setChartData] = useState<ChartDatum[]>([]);
  const [rows, setRows] = useState<RevenueRow[]>([]);
  const [summary, setSummary] = useState<SettlementSummary | null>(null);
  const [serverTime, setServerTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const accessToken = useAuthStore((state) => state.accessToken);

  const yearOptions = useMemo(() => {
    const base = Array.from({ length: 5 }, (_, index) => String(currentYear - index));
    if (!base.includes(year)) {
      base.unshift(year);
    }
    return Array.from(new Set(base));
  }, [currentYear, year]);

  useEffect(() => {
    if (!accessToken) return;

    let mounted = true;
    const yearNumber = Number(year) || currentYear;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const payload = await fetchAdminSettlements(
          {
            year: yearNumber,
            month: 1,
            granularity: 'MONTH',
          },
          { accessToken },
        );

        if (!mounted) return;

        setChartData(mapPayloadToChart(payload));
        setRows(mapPayloadToRows(payload));
        setSummary(payload?.summary ?? null);
        setServerTime(payload?.serverTime ?? null);
      } catch (err) {
        if (mounted) {
          const message = err instanceof Error ? err.message : '정산 데이터를 불러오지 못했습니다.';
          setError(message);
          setChartData([]);
          setRows([]);
          setSummary(null);
          setServerTime(null);
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
  }, [accessToken, currentYear, year]);

  const lastUpdated = useMemo(() => formatServerTime(serverTime), [serverTime]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h3 className="text-2xl font-bold">매출 / 정산</h3>
        {lastUpdated ? (
          <p className="text-xs text-[var(--color-gray-500)]">기준 시각: {lastUpdated}</p>
        ) : null}
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-300 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {summary ? (
        <section className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm">
          <h4 className="text-lg font-semibold text-[var(--color-gray-900)]">최근 정산 요약</h4>
          <div className="flex flex-wrap items-start gap-6">
            <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-[var(--color-gray-50)]">
              {summary.thumbnailUrl ? (
                <Image
                  src={summary.thumbnailUrl}
                  alt={summary.title ?? '상품 이미지'}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-xs text-[var(--color-gray-400)]">
                  이미지 없음
                </span>
              )}
            </div>
            <dl className="grid flex-1 grid-cols-1 gap-1 text-sm text-[var(--color-gray-700)] md:grid-cols-2">
              <div>
                <dt className="font-medium text-[var(--color-gray-600)]">주문번호</dt>
                <dd>{summary.orderNo ?? '-'}</dd>
              </div>
              <div>
                <dt className="font-medium text-[var(--color-gray-600)]">브랜드</dt>
                <dd>{summary.brandName ?? '-'}</dd>
              </div>
              <div className="md:col-span-2">
                <dt className="font-medium text-[var(--color-gray-600)]">상품명</dt>
                <dd>{summary.title ?? '-'}</dd>
              </div>
              <div>
                <dt className="font-medium text-[var(--color-gray-600)]">판매가격</dt>
                <dd>{currencyFormatter.format(summary.price ?? 0)}원</dd>
              </div>
              <div>
                <dt className="font-medium text-[var(--color-gray-600)]">판매수량</dt>
                <dd>{summary.quantity ?? 0}개</dd>
              </div>
            </dl>
          </div>
        </section>
      ) : null}

      <RevenueBarChart
        title="월별 매출 추이"
        data={chartData}
        year={year}
        yearOptions={yearOptions}
        onYearChange={setYear}
      />

      <AdminDataTable
        columns={columns}
        rows={rows}
        selectable={false}
        rowKey={(row) => row.month}
        emptyText={loading ? '정산 데이터를 불러오는 중입니다…' : '데이터가 없습니다.'}
      />
    </div>
  );
}
