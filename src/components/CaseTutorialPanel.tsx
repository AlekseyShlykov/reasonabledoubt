'use client';

import { t } from '@/lib/i18n';

interface CaseTutorialPanelProps {
  step: number;
  onNext: () => void;
  onSkip: () => void;
}

export default function CaseTutorialPanel({ step, onNext, onSkip }: CaseTutorialPanelProps) {
  const isLast = step >= 3;
  const description = t(`tutorial.caseStep${step}`);

  return (
    <div className="flex-shrink-0 z-30 border border-cyan/40 bg-dark-bg/95 backdrop-blur-sm px-3 py-2.5 sm:px-4 sm:py-3 shadow-lg min-w-0">
      <p className="max-h-[min(28vh,200px)] overflow-y-auto overscroll-contain text-sm sm:text-base leading-snug text-gray-100 pr-0.5">
        {description}
      </p>
      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
        <span className="text-[10px] font-mono text-gray-600">
          {step + 1} / 4
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onSkip}
            className="px-3 py-1.5 text-xs font-mono text-gray-500 border border-bg-border hover:text-gray-300 hover:border-gray-500 transition-colors"
          >
            {t('tutorial.skip')}
          </button>
          <button
            type="button"
            onClick={onNext}
            className="px-4 py-1.5 text-xs font-mono border-2 border-cyan text-cyan hover:bg-cyan hover:text-dark-bg transition-colors"
          >
            {isLast ? t('tutorial.done') : t('tutorial.next')}
          </button>
        </div>
      </div>
    </div>
  );
}
