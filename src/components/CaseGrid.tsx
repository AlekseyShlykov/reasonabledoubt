'use client';

import type { ReactNode } from 'react';
import { t } from '@/lib/i18n';
import MetricCard from './MetricCard';
import AIPrediction from './AIPrediction';
import AIAnalysisViz from './AIAnalysisViz';
import type { CaseContent, CaseLogic } from '@/lib/data';

interface CaseGridProps {
  content: CaseContent;
  logic: CaseLogic;
  /** Индекс подсвеченной ячейки 0–3 или null — без обучения */
  tutorialHighlight?: number | null;
}

function TutorialCell({
  index,
  highlight,
  children,
}: {
  index: number;
  highlight: number | null;
  children: ReactNode;
}) {
  const dim = highlight !== null && highlight !== index;
  const active = highlight === index;

  return (
    <div
      className={[
        'min-h-0 min-w-0 flex flex-col transition-[filter,opacity,transform] duration-300',
        dim ? 'pointer-events-none blur-[2.5px] opacity-[0.38] scale-[0.998]' : '',
        active ? 'relative z-[24] rounded-sm ring-2 ring-cyan/90 shadow-[0_0_24px_rgba(0,184,212,0.22)] ring-offset-2 ring-offset-dark-bg' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}

export default function CaseGrid({ content, logic, tutorialHighlight = null }: CaseGridProps) {
  return (
    <div className="relative flex-1 min-h-0 grid grid-cols-1 grid-rows-4 lg:grid-cols-2 lg:grid-rows-2 gap-2 sm:gap-3">
      <TutorialCell index={0} highlight={tutorialHighlight}>
        <section className="min-h-0 flex flex-1 flex-col bg-surface border border-bg-border p-3 sm:p-4 overflow-y-auto">
          <h2 className="text-sm sm:text-base font-mono cyan-text mb-2 flex-shrink-0">
            {t('cases.humanProfile')}
          </h2>
          <div className="text-xs text-gray-400 mb-1 flex-shrink-0">{t('cases.lifeHistory')}</div>
          <p className="text-xs sm:text-sm leading-relaxed text-gray-300 whitespace-pre-line">
            {content.humanHistory}
          </p>
        </section>
      </TutorialCell>

      <TutorialCell index={1} highlight={tutorialHighlight}>
        <section className="min-h-0 flex flex-1 flex-col overflow-hidden">
          <div className="bg-surface border border-bg-border p-2 flex-1 min-h-0 flex flex-col overflow-hidden">
            <h3 className="text-[11px] sm:text-xs font-mono cyan-text mb-1.5 flex-shrink-0 leading-none">
              {t('cases.coefficients')}
            </h3>
            <div className="grid min-h-0 flex-1 grid-cols-3 grid-rows-1 gap-1 sm:gap-1.5 auto-rows-fr">
              <MetricCard
                compact
                label={t('cases.social')}
                value={logic.socialCoef}
                trend={logic.trends.social}
                sparkline={logic.sparklines.social}
              />
              <MetricCard
                compact
                label={t('cases.financial')}
                value={logic.financialCoef}
                trend={logic.trends.financial}
                sparkline={logic.sparklines.financial}
              />
              <MetricCard
                compact
                label={t('cases.psychological')}
                value={logic.psychologicalCoef}
                trend={logic.trends.psychological}
                sparkline={logic.sparklines.psychological}
              />
            </div>
          </div>
        </section>
      </TutorialCell>

      <TutorialCell index={2} highlight={tutorialHighlight}>
        <section className="min-h-0 flex flex-1 flex-col overflow-hidden">
          <AIPrediction
            prediction={content.aiPrediction}
            probability={logic.predictionProbability}
            explanation={content.explanation}
          />
        </section>
      </TutorialCell>

      <TutorialCell index={3} highlight={tutorialHighlight}>
        <section className="min-h-0 flex flex-1 flex-col overflow-hidden">
          <AIAnalysisViz
            factors={logic.aiFactors}
            impact={logic.expectedImpact.harmedPeople}
            severity={logic.expectedImpact.severityScore}
          />
        </section>
      </TutorialCell>
    </div>
  );
}
