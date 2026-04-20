'use client';

interface CoefTrendProps {
  trends: {
    social: { direction: number; delta: number };
    financial: { direction: number; delta: number };
    psychological: { direction: number; delta: number };
  };
}

export default function CoefTrend({ trends }: CoefTrendProps) {
  return (
    <div className="space-y-1 text-xs text-gray-400">
      {Object.entries(trends).map(([key, trend]) => {
        const symbol = trend.direction > 0 ? '↑' : trend.direction < 0 ? '↓' : '→';
        const color = trend.direction > 0 ? 'text-red-400' : trend.direction < 0 ? 'text-green-400' : 'text-gray-400';
        return (
          <div key={key} className="flex justify-between">
            <span className="capitalize">{key}:</span>
            <span className={color}>
              {symbol} {Math.abs(trend.delta)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

