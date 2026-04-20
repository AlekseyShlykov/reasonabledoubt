'use client';

interface MetricCardProps {
  label: string;
  value: number;
  trend: { direction: number; delta: number };
  sparkline: number[];
  /** Компактный вид для сетки кейсов (ниже графики, меньше отступы). */
  compact?: boolean;
}

export default function MetricCard({ label, value, trend, sparkline, compact }: MetricCardProps) {
  const trendSymbol = trend.direction > 0 ? '↑' : trend.direction < 0 ? '↓' : '→';
  const trendColor =
    trend.direction > 0 ? 'text-red-400' : trend.direction < 0 ? 'text-green-400' : 'text-gray-400';

  const maxValue = Math.max(...sparkline, value);
  const minValue = Math.min(...sparkline, value);
  const range = maxValue - minValue || 1;

  if (compact) {
    return (
      <div className="min-h-0 min-w-0 flex flex-col bg-dark-bg/50 border border-bg-border p-1 sm:p-1.5">
        <div className="flex justify-between items-center gap-0.5 mb-0.5">
          <span className="text-[10px] sm:text-[11px] text-gray-400 truncate leading-tight" title={label}>
            {label}
          </span>
          <span className={`text-[10px] shrink-0 tabular-nums ${trendColor}`}>
            {trendSymbol}
            {Math.abs(trend.delta)}
          </span>
        </div>
        <div className="text-sm sm:text-base font-mono cyan-text leading-none mb-1 tabular-nums">{value}</div>
        <div className="mt-auto h-3 sm:h-3.5 flex items-end gap-px">
          {sparkline.map((val, i) => {
            const height = ((val - minValue) / range) * 100;
            return (
              <div
                key={i}
                className="flex-1 min-w-0 bg-cyan-dark rounded-[1px]"
                style={{ height: `${Math.max(height, 8)}%` }}
              />
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-dark-bg/50 border border-bg-border p-2 sm:p-3">
      <div className="flex justify-between items-start mb-1">
        <span className="text-xs text-gray-400">{label}</span>
        <span className={`text-xs ${trendColor}`}>
          {trendSymbol} {Math.abs(trend.delta)}
        </span>
      </div>
      <div className="text-lg sm:text-xl font-mono cyan-text mb-2">{value}</div>
      <div className="h-6 sm:h-8 flex items-end gap-0.5">
        {sparkline.map((val, i) => {
          const height = ((val - minValue) / range) * 100;
          return (
            <div
              key={i}
              className="flex-1 bg-cyan-dark"
              style={{ height: `${Math.max(height, 5)}%` }}
            />
          );
        })}
      </div>
    </div>
  );
}
