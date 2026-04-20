'use client';

import { t } from '@/lib/i18n';

interface AIPredictionProps {
  prediction: string;
  probability: number;
  explanation: string;
}

export default function AIPrediction({ prediction, probability, explanation }: AIPredictionProps) {
  return (
    <div className="bg-surface border border-bg-border p-3 sm:p-4 flex flex-col max-lg:h-auto max-lg:overflow-visible lg:h-full lg:min-h-0 lg:overflow-y-auto">
      <h2 className="text-sm sm:text-base font-mono cyan-text mb-2 flex-shrink-0">
        {t('cases.aiPrediction')}
      </h2>
      <div className="mb-2 flex-shrink-0">
        <div className="text-xs text-gray-400 mb-0.5">{t('cases.probability')}</div>
        <div className="text-2xl sm:text-3xl font-mono cyan-light-text">{probability.toFixed(1)}%</div>
      </div>
      <div className="mb-2 max-lg:flex-none lg:flex-1 lg:min-h-0">
        <div className="mb-1 text-xs text-gray-400 sm:text-xs">{t('cases.explanation')}</div>
        <p className="text-sm leading-[1.65] text-gray-300">{prediction}</p>
      </div>
      <div className="mt-auto flex-shrink-0 border-t border-bg-border pt-2">
        <div className="font-mono text-xs leading-relaxed text-gray-500 sm:text-sm">{explanation}</div>
      </div>
    </div>
  );
}

