'use client';

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  type PieLabelRenderProps,
} from 'recharts';

type CategoryDatum = {
  name: string;
  value: number;
  color: string;
};

type CategoryPieChartProps = {
  data: CategoryDatum[];
  title?: string;
};

const RADIAN = Math.PI / 180;

function renderSliceLabel({
  cx = 0,
  cy = 0,
  midAngle = 0,
  innerRadius = 0,
  outerRadius = 0,
  percent = 0,
}: PieLabelRenderProps) {
  const radius = innerRadius + (outerRadius - innerRadius) / 2;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  const isEmphasized = percent >= 0.25;
  const fontSize = isEmphasized ? '1.5rem' : '1rem';
  const fontWeight = isEmphasized ? 700 : 600;

  return (
    <text
      x={x}
      y={y}
      fill="#1f2933"
      textAnchor="middle"
      dominantBaseline="central"
      fontWeight={fontWeight}
      fontSize={fontSize}
    >
      {`${Math.round(percent * 100)}%`}
    </text>
  );
}

export default function CategoryPieChart({
  data,
  title,
}: CategoryPieChartProps) {
  const total = data.reduce((acc, { value }) => acc + value, 0);
  const topSlice = data.reduce<CategoryDatum | undefined>((acc, item) => {
    if (!acc || item.value > acc.value) {
      return item;
    }
    return acc;
  }, undefined);
  const centerValue =
    total === 0 || !topSlice ? 0 : Math.round((topSlice.value / total) * 100);

  return (
    <div className="flex flex-col justify-between gap-6 rounded-3xl bg-white p-6 md:flex-row">
      <div className="relative h-64 w-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              stroke="none"
              cx="50%"
              cy="50%"
              innerRadius={0}
              outerRadius={120}
              labelLine={false}
              label={renderSliceLabel}
              paddingAngle={0}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-1 flex-col justify-center gap-4">
        {title && <h4 className="text-xl font-bold">{title}</h4>}
        <ul className="flex flex-col gap-3 text-base font-medium">
          {data.map((item) => (
            <li key={item.name} className="flex items-center gap-3">
              <span
                className="inline-block h-4 w-4 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span>{item.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
