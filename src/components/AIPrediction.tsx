'use client';

import { t } from '@/lib/i18n';

interface AIPredictionProps {
  prediction: string;
  probability: number;
  explanation: string;
}

export default function AIPrediction({ prediction, probability, explanation }: AIPredictionProps) {
  return (
    <div className="bg-surface border border-bg-border p-3 sm:p-4 h-full min-h-0 flex flex-col overflow-y-auto">
      <h2 className="text-sm sm:text-base font-mono cyan-text mb-2 flex-shrink-0">
        {t('cases.aiPrediction')}
      </h2>
      <div className="mb-2 flex-shrink-0">
        <div className="text-xs text-gray-400 mb-0.5">{t('cases.probability')}</div>
        <div className="text-2xl sm:text-3xl font-mono cyan-light-text">{probability.toFixed(1)}%</div>
      </div>
      <div className="mb-2 flex-1 min-h-0">
        <div className="text-xs text-gray-400 mb-1">{t('cases.explanation')}</div>
        <p className="text-xs sm:text-sm leading-relaxed text-gray-300">{prediction}</p>
      </div>
      <div className="mt-auto pt-2 border-t border-bg-border flex-shrink-0">
        <div className="text-[10px] sm:text-xs text-gray-500 font-mono leading-relaxed">{explanation}</div>
      </div>
    </div>
  );
}

