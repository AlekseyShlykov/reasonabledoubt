'use client';

import { t } from '@/lib/i18n';

interface AIAnalysisVizProps {
  factors: Array<{ key: string; weight: number }>;
  impact: { min: number; max: number };
  severity: number;
}

export default function AIAnalysisViz({ factors, impact, severity }: AIAnalysisVizProps) {
  return (
    <div className="bg-surface border border-bg-border p-2.5 sm:p-2.5 flex flex-col gap-1 max-lg:h-auto max-lg:min-h-0 max-lg:overflow-visible h-full min-h-0 lg:overflow-hidden">
      <h2 className="cyan-text flex-shrink-0 font-mono text-xs leading-snug">
        {t('cases.aiAnalysis')}
      </h2>

      <div className="min-h-0 flex max-lg:flex-none flex-col flex-1 gap-0.5 overflow-hidden max-lg:overflow-visible">
        <div className="text-[11px] text-gray-500 leading-snug flex-shrink-0 sm:text-xs">
          {t('cases.factorContribution')}
        </div>
        <div className="min-h-0 flex max-lg:flex-none flex-col gap-1 overflow-hidden max-lg:overflow-visible sm:gap-1">
          {factors.map((factor, i) => {
            const label = t(`aiFactorLabels.${factor.key}`);
            return (
              <div key={i} className="min-w-0 shrink-0">
                <div className="mb-0.5 flex flex-col gap-0.5 sm:mb-px sm:flex-row sm:items-baseline sm:justify-between sm:gap-1">
                  <span
                    className="min-w-0 text-[11px] leading-snug text-gray-400 max-lg:break-words max-lg:whitespace-normal lg:truncate lg:leading-tight"
                    title={label}
                  >
                    {label}
                  </span>
                  <span className="cyan-text shrink-0 text-right text-[11px] tabular-nums sm:self-baseline">
                    {(factor.weight * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="h-0.5 sm:h-1 bg-bg-border rounded-sm">
                  <div
                    className="h-full bg-cyan transition-all rounded-sm"
                    style={{ width: `${factor.weight * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid flex-shrink-0 grid-cols-2 gap-x-2 gap-y-2 border-t border-bg-border pt-2 sm:gap-y-1 sm:pt-1.5">
        <div className="min-w-0">
          <div className="mb-0.5 text-[11px] leading-snug text-gray-500 sm:text-xs">{t('cases.impact')}</div>
          <div className="cyan-text font-mono text-[11px] leading-snug max-lg:break-words lg:truncate">
            {impact.min.toLocaleString()}–{impact.max.toLocaleString()}{' '}
            <span className="font-sans font-normal text-gray-500">{t('cases.impactPeople')}</span>
          </div>
        </div>
        <div className="min-w-0">
          <div className="mb-0.5 text-[11px] leading-snug text-gray-500 sm:text-xs">{t('cases.severity')}</div>
          <div className="flex items-center gap-1.5">
            <div className="h-1 min-w-0 flex-1 rounded-sm bg-bg-border sm:h-1.5">
              <div
                className="h-full rounded-sm bg-cyan"
                style={{ width: `${(severity / 10) * 100}%` }}
              />
            </div>
            <span className="cyan-text shrink-0 font-mono text-xs tabular-nums">
              {severity.toFixed(1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
