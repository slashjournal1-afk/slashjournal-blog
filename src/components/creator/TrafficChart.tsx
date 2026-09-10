'use client';

import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export interface TrafficChartPoint {
  date: string;
  label: string;
  weekday: string;
  total: number;
  [articleId: string]: number | string;
}

const COMPARE_COLORS = ['#ff5a00', '#10b981', '#8b5cf6', '#f59e0b', '#0ea5e9'];

export function TrafficChart({
  data,
  compareSeries,
  loading,
}: {
  data: TrafficChartPoint[];
  compareSeries: { id: string; title: string }[];
  loading: boolean;
}) {
  if (loading) {
    return <div className="h-[320px] animate-pulse rounded-[20px] bg-[var(--bg-card-muted)]" aria-label="Memuat grafik" />;
  }
  if (data.length === 0) {
    return (
      <div className="flex h-[320px] items-center justify-center rounded-[20px] border border-[var(--border-color)] text-sm text-[var(--text-muted)]">
        Belum ada data pada rentang ini.
      </div>
    );
  }

  const showCompare = compareSeries.length > 0;

  return (
    <div className="h-[320px] w-full" role="img" aria-label="Grafik traffic penonton harian">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
            tickLine={false}
            axisLine={{ stroke: 'var(--border-color)' }}
            minTickGap={28}
          />
          <YAxis
            tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
            width={48}
          />
          <Tooltip
            contentStyle={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 12,
              fontSize: 12,
            }}
            labelFormatter={(_label, payload) => {
              const p = payload?.[0]?.payload as TrafficChartPoint | undefined;
              return p ? `${p.label} • ${p.weekday}` : _label;
            }}
          />
          {showCompare && <Legend wrapperStyle={{ fontSize: 12 }} />}
          {!showCompare && (
            <Area
              type="monotone"
              dataKey="total"
              name="Penonton"
              stroke="#ff5a00"
              strokeWidth={2.5}
              fill="#ff5a00"
              fillOpacity={0.14}
              dot={false}
              activeDot={{ r: 4 }}
            />
          )}
          {showCompare &&
            compareSeries.map((s, i) => (
              <Area
                key={s.id}
                type="monotone"
                dataKey={s.id}
                name={s.title.length > 28 ? `${s.title.slice(0, 28)}…` : s.title}
                stroke={COMPARE_COLORS[i % COMPARE_COLORS.length]}
                strokeWidth={2}
                fill={COMPARE_COLORS[i % COMPARE_COLORS.length]}
                fillOpacity={0.08}
                dot={false}
              />
            ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
