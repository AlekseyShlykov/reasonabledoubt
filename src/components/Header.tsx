'use client';

import { t } from '@/lib/i18n';
import ProgressDots from './ProgressDots';

interface HeaderProps {
  currentRound: number;
  totalRounds: number;
  compact?: boolean;
}

export default function Header({ currentRound, totalRounds, compact }: HeaderProps) {
  return (
    <header
      className={`flex-shrink-0 border-b border-bg-border bg-surface ${
        compact ? 'px-3 py-2 sm:px-4' : 'px-6 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        <h1 className={`font-mono cyan-text ${compact ? 'text-base sm:text-lg' : 'text-xl'}`}>
          {t('header.title')}
        </h1>
        <ProgressDots currentRound={currentRound} totalRounds={totalRounds} />
      </div>
    </header>
  );
}
