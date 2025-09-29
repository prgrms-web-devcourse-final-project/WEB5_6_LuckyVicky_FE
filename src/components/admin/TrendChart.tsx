'use client';

import { useId } from 'react';
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from 'recharts';

const RANGE_OPTIONS = ['1M', '3M', '6M', '1Y', 'ALL'] as const;

type TrendPoint = {
  label: string;
  value: number;
};

type TrendChartProps = {
  title: string;
  color: string;
  data: TrendPoint[];
  activeRange?: string;
};

export default function TrendChart({
  title,
  color,
  data,
  activeRange = 'ALL',
}: TrendChartProps) {
  const gradientId = useId().replace(/:/g, '');
  const gradientRef = `trendGradient-${gradientId}`;
  const chartData = data.length
    ? data
    : RANGE_OPTIONS.map((label) => ({ label, value: 0 }));

  return (
    <div className="flex w-full flex-col items-center gap-6 rounded-3xl bg-white p-6">
      <div className="w-full">
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id={gradientRef} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="label" hide />
            <Tooltip cursor={{ stroke: color, strokeWidth: 1, opacity: 0.15 }} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={3}
              fill={`url(#${gradientRef})`}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0, fill: color }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex w-full flex-col items-center">
        <div className="mb-6 flex gap-3 text-sm">
          {RANGE_OPTIONS.map((label) => (
            <button
              key={label}
              className="rounded-full border px-4 py-1 transition-colors"
              style={{
                borderColor: color,
                backgroundColor: label === activeRange ? color : 'transparent',
                color: label === activeRange ? '#fff' : color,
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <h3 className="text-lg font-bold">{title}</h3>
      </div>
    </div>
  );
}
