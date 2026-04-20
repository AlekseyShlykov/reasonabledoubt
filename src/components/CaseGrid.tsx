'use client';

import type { ReactNode } from 'react';
import { t } from '@/lib/i18n';
import MetricCard from './MetricCard';
import AIPrediction from './AIPrediction';
import AIAnalysisViz from './AIAnalysisViz';
import CaseTutorialPanel from './CaseTutorialPanel';
import type { CaseContent, CaseLogic } from '@/lib/data';

export interface CaseGridEmbeddedTutorial {
  step: number;
  onNext: () => void;
  onSkip: () => void;
}

interface CaseGridProps {
  content: CaseContent;
  logic: CaseLogic;
  /** Индекс подсвеченной ячейки 0–3 или null — без обучения */
  tutorialHighlight?: number | null;
  /** На узких экранах панель «Далее / Пропустить» рендерится под активной ячейкой */
  embeddedTutorial?: CaseGridEmbeddedTutorial | null;
}

function TutorialCell({
  index,
  highlight,
  embeddedTutorial,
  children,
}: {
  index: number;
  highlight: number | null;
  embeddedTutorial?: CaseGridEmbeddedTutorial | null;
  children: ReactNode;
}) {
  const dim = highlight !== null && highlight !== index;
  const active = highlight === index;
  const showMobilePanel =
    embeddedTutorial !== null &&
    embeddedTutorial !== undefined &&
    highlight === index &&
    highlight === embeddedTutorial.step;

  return (
    <div
      id={`case-tutorial-cell-${index}`}
      className={[
        'flex min-h-0 min-w-0 flex-col transition-[filter,opacity,transform] duration-300',
        active ? 'scroll-mt-20 relative z-[24] rounded-sm ring-2 ring-cyan/90 shadow-[0_0_24px_rgba(0,184,212,0.22)] ring-offset-2 ring-offset-dark-bg' : '',
        dim ? 'pointer-events-none scale-[0.998] blur-[2.5px] opacity-[0.38]' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
      {showMobilePanel && (
        <div className="mt-2 w-full min-w-0 max-lg:block lg:hidden">
          <CaseTutorialPanel
            step={embeddedTutorial.step}
            onNext={embeddedTutorial.onNext}
            onSkip={embeddedTutorial.onSkip}
          />
        </div>
      )}
    </div>
  );
}

export default function CaseGrid({
  content,
  logic,
  tutorialHighlight = null,
  embeddedTutorial = null,
}: CaseGridProps) {
  return (
    <div className="relative w-full grid grid-cols-1 gap-2 sm:gap-3 lg:flex-1 lg:min-h-0 lg:grid-cols-2 lg:grid-rows-2">
      <TutorialCell index={0} highlight={tutorialHighlight} embeddedTutorial={embeddedTutorial}>
        <section className="min-h-0 flex max-lg:flex-none flex-1 flex-col bg-surface border border-bg-border p-3 sm:p-4 max-lg:overflow-visible lg:overflow-y-auto">
          <h2 className="text-sm sm:text-base font-mono cyan-text mb-2 flex-shrink-0">
            {t('cases.humanProfile')}
          </h2>
          <div className="text-xs text-gray-400 mb-1 flex-shrink-0">{t('cases.lifeHistory')}</div>
          <p className="text-sm leading-[1.65] text-gray-300 whitespace-pre-line">
            {content.humanHistory}
          </p>
        </section>
      </TutorialCell>

      <TutorialCell index={1} highlight={tutorialHighlight} embeddedTutorial={embeddedTutorial}>
        <section className="min-h-0 flex max-lg:flex-none flex-1 flex-col max-lg:overflow-visible lg:overflow-hidden">
          <div className="bg-surface border border-bg-border p-2 flex max-lg:flex-none flex-1 min-h-0 flex-col max-lg:overflow-visible lg:overflow-hidden">
            <h3 className="text-[11px] sm:text-xs font-mono cyan-text mb-1.5 flex-shrink-0 leading-none">
              {t('cases.coefficients')}
            </h3>
            <div className="grid min-h-0 max-lg:flex-none flex-1 grid-cols-3 grid-rows-1 gap-1 sm:gap-1.5 max-lg:auto-rows-auto lg:auto-rows-fr">
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

      <TutorialCell index={2} highlight={tutorialHighlight} embeddedTutorial={embeddedTutorial}>
        <section className="min-h-0 flex max-lg:flex-none flex-1 flex-col max-lg:overflow-visible lg:overflow-hidden">
          <AIPrediction
            prediction={content.aiPrediction}
            probability={logic.predictionProbability}
            explanation={content.explanation}
          />
        </section>
      </TutorialCell>

      <TutorialCell index={3} highlight={tutorialHighlight} embeddedTutorial={embeddedTutorial}>
        <section className="min-h-0 flex max-lg:flex-none flex-1 flex-col max-lg:overflow-visible lg:overflow-hidden">
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
