'use client';

import { t } from '@/lib/i18n';

interface AIAnalysisVizProps {
  factors: Array<{ name: string; weight: number }>;
  impact: { min: number; max: number };
  severity: number;
}

export default function AIAnalysisViz({ factors, impact, severity }: AIAnalysisVizProps) {
  return (
    <div className="bg-surface border border-bg-border p-2 sm:p-2.5 h-full min-h-0 flex flex-col overflow-hidden gap-1">
      <h2 className="text-[11px] sm:text-xs font-mono cyan-text leading-none flex-shrink-0">
        {t('cases.aiAnalysis')}
      </h2>

      <div className="min-h-0 flex flex-col flex-1 gap-0.5 overflow-hidden">
        <div className="text-[10px] text-gray-500 leading-none flex-shrink-0">
          {t('cases.factorContribution')}
        </div>
        <div className="min-h-0 flex flex-col gap-0.5 sm:gap-1 overflow-hidden">
          {factors.map((factor, i) => (
            <div key={i} className="min-w-0 shrink-0">
              <div className="flex justify-between items-baseline gap-1 mb-px">
                <span
                  className="text-[10px] sm:text-[11px] text-gray-400 truncate leading-tight min-w-0"
                  title={factor.name}
                >
                  {factor.name}
                </span>
                <span className="text-[10px] sm:text-[11px] cyan-text shrink-0 tabular-nums">
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
          ))}
        </div>
      </div>

      <div className="flex-shrink-0 grid grid-cols-2 gap-x-2 gap-y-1 pt-1.5 border-t border-bg-border">
        <div className="min-w-0">
          <div className="text-[10px] text-gray-500 leading-none mb-0.5">{t('cases.impact')}</div>
          <div className="text-[10px] sm:text-[11px] font-mono cyan-text leading-tight truncate">
            {impact.min.toLocaleString()}–{impact.max.toLocaleString()}{' '}
            <span className="text-gray-500 font-sans font-normal">{t('cases.impactPeople')}</span>
          </div>
        </div>
        <div className="min-w-0">
          <div className="text-[10px] text-gray-500 leading-none mb-0.5">{t('cases.severity')}</div>
          <div className="flex items-center gap-1.5">
            <div className="flex-1 min-w-0 h-1 sm:h-1.5 bg-bg-border rounded-sm">
              <div
                className="h-full bg-cyan rounded-sm"
                style={{ width: `${(severity / 10) * 100}%` }}
              />
            </div>
            <span className="font-mono cyan-text text-[10px] sm:text-xs tabular-nums shrink-0">
              {severity.toFixed(1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
