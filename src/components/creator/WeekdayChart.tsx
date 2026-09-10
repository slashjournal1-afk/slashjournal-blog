'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export function WeekdayChart({
  data,
  loading,
}: {
  data: { weekday: string; avg: number; total: number }[];
  loading: boolean;
}) {
  if (loading) {
    return <div className="h-[220px] animate-pulse rounded-[20px] bg-[var(--bg-card-muted)]" aria-label="Memuat grafik hari" />;
  }
  return (
    <div className="h-[220px] w-full" role="img" aria-label="Rata-rata penonton per hari dalam seminggu">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -12 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
          <XAxis
            dataKey="weekday"
            tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
            tickLine={false}
            axisLine={{ stroke: 'var(--border-color)' }}
            interval={0}
            tickFormatter={(v: string) => v.slice(0, 3)}
          />
          <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} allowDecimals={false} width={48} />
          <Tooltip
            contentStyle={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 12,
              fontSize: 12,
            }}
            formatter={(value, name) => [
              Number(value).toLocaleString('id-ID'),
              name === 'avg' ? 'Rata-rata/hari' : String(name),
            ]}
          />
          <Bar dataKey="avg" name="avg" fill="#ff5a00" radius={[8, 8, 0, 0]} maxBarSize={44} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
