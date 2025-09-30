"use client";

import { useMemo, useState } from "react";
import AdminDataTable, { AdminTableColumn } from "@/components/admin/AdminDataTable";
import RevenueBarChart from "@/components/admin/RevenueBarChart";

type RevenueRow = {
  month: string; 
  totalSales: number;
  artistPayout: number;
  profit: number;
};

const createChartSeries = (base: number) =>
  Array.from({ length: 12 }, (_, index) => ({
    month: `${index + 1}월`,
    total: Math.round(base + index * base * 0.12),
  }));

const chartSeriesByYear: Record<string, { month: string; total: number }[]> = {
  "2023": createChartSeries(380_000),
  "2024": createChartSeries(520_000),
  "2025": [
    { month: "1월", total: 450_000 },
    { month: "2월", total: 720_000 },
    { month: "3월", total: 680_000 },
    { month: "4월", total: 640_000 },
    { month: "5월", total: 610_000 },
    { month: "6월", total: 570_000 },
    { month: "7월", total: 820_000 },
    { month: "8월", total: 900_000 },
    { month: "9월", total: 480_000 },
    { month: "10월", total: 760_000 },
    { month: "11월", total: 930_000 },
    { month: "12월", total: 1_020_000 },
  ],
};

const buildSummaryRows = (year: string, base: number): RevenueRow[] =>
  Array.from({ length: 12 }, (_, index) => {
    const monthIndex = index + 1;
    const totalSales = base + index * 30_000;
    const artistPayout = Math.round(totalSales * 0.9);
    const profit = totalSales - artistPayout;
    return {
      month: `${year}.${String(monthIndex).padStart(2, "0")}`,
      totalSales,
      artistPayout,
      profit,
    };
  });

const summaryRows: RevenueRow[] = [
  ...buildSummaryRows("2023", 820_000),
  ...buildSummaryRows("2024", 910_000),
  ...buildSummaryRows("2025", 1_000_000),
];

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

export default function OrdersPage() {
  const [year, setYear] = useState("2025");

  const filteredRows = useMemo(
    () => summaryRows.filter((row) => row.month.startsWith(year)),
    [year],
  );

  const chartData = useMemo(() => chartSeriesByYear[year] ?? [], [year]);

  return (
    <div className="flex flex-col gap-8">
      <h3 className="text-2xl font-bold">매출 / 정산</h3>
      <RevenueBarChart
        data={chartData}
        year={year}
        yearOptions={["2023", "2024", "2025"]}
        onYearChange={setYear}
      />

      <AdminDataTable
        columns={columns}
        rows={filteredRows}
        selectable={false}
        rowKey={(row) => row.month}
      />
    </div>
  );
}
