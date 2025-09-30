"use client";

import { useId, useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

type RevenueDatum = {
  month: string; 
  total: number;
};

type RevenueBarChartProps = {
  title?: string;
  data: RevenueDatum[];
  year: string;
  yearOptions?: string[];
  onYearChange?: (year: string) => void;
  barColor?: string;
  maxYAxis?: number;
};

const numberFormatter = new Intl.NumberFormat("ko-KR");

export default function RevenueBarChart({
  title,
  data,
  year,
  yearOptions,
  onYearChange,
  barColor = "var(--color-primary)",
  maxYAxis,
}: RevenueBarChartProps) {
  const chartId = useId().replace(/:/g, "");
  const options = yearOptions?.length ? yearOptions : [year];

  const chartData = data.length
    ? data
    : Array.from({ length: 12 }, (_, index) => ({
        month: `${index + 1}월`,
        total: 0,
      }));

  const computedMax = useMemo(() => {
    if (typeof maxYAxis === "number") return maxYAxis;
    const values = chartData.map((d) => d.total);
    const max = Math.max(...values, 0);
    if (max === 0) return 100_000;
    const magnitude = Math.pow(10, Math.floor(Math.log10(max)));
    const step = magnitude / 2;
    return Math.ceil((max + step) / step) * step;
  }, [chartData, maxYAxis]);

  const tickFormatter = (value: number) => numberFormatter.format(value);

  return (
    <section className="flex w-full flex-col gap-6 rounded-3xl bg-white p-8 ">
      <header className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[var(--color-gray-900)]">{title}</h2>
        <div className="relative">
          <select
            value={year}
            onChange={(event) => onYearChange?.(event.target.value)}
            className="h-10 appearance-none px-5 pr-10 text-lg font-bold text-[var(--color-gray-800)] outline-none"
          >
            {options.map((option) => (
              <option key={option} value={option} className="text-[var(--color-gray-900)]">
                {option}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[var(--color-primary)]">
            ▾
          </span>
        </div>
      </header>

      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barSize={10} barCategoryGap={24} id={`revenue-chart-${chartId}`}>
            <CartesianGrid vertical={false} stroke="#E5E7EB" strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              axisLine={{ stroke: "#CBD5F5" }}
              tickLine={false}
              tick={{ fill: "var(--color-gray-600)", fontSize: 12 }}
            />
            <YAxis
              domain={[0, computedMax]}
              tickFormatter={tickFormatter}
              tick={{ fill: "var(--color-gray-500)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={80}
            />
            <Tooltip
              cursor={{ fill: "rgba(47, 107, 46, 0.08)" }}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid var(--color-primary-30, #d5e8d5)",
                boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
              }}
              formatter={(value: number) => [
                `${numberFormatter.format(value)}원`,
                "총 매출금액",
              ]}
              labelFormatter={(label) => label}
            />
            <Bar dataKey="total" fill={barColor} radius={0} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
