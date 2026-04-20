'use client';

import { t } from '@/lib/i18n';

interface CommunityStatsPanelProps {
  guilty: number;
  notGuilty: number;
  userVerdict: boolean;
  onContinue: () => void;
}

export default function CommunityStatsPanel({
  guilty,
  notGuilty,
  userVerdict,
  onContinue,
}: CommunityStatsPanelProps) {
  const total = guilty + notGuilty;
  const guiltyPct = total > 0 ? (guilty / total) * 100 : 0;
  const notGuiltyPct = total > 0 ? (notGuilty / total) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div
        className="w-full max-w-md max-h-[min(90dvh,640px)] overflow-y-auto overscroll-contain border border-bg-border bg-surface p-4 sm:p-6 shadow-xl"
        role="dialog"
        aria-labelledby="community-stats-title"
      >
        <h2 id="community-stats-title" className="text-lg font-mono cyan-text mb-1">
          {t('cases.communityTitle')}
        </h2>
        <p className="text-xs text-gray-500 mb-4">{t('cases.communitySubtitle')}</p>

        <div className="mb-4 text-sm">
          <span className="text-gray-400">{t('cases.yourVote')}: </span>
          <span
            className={`font-mono ${
              userVerdict ? 'text-red-400' : 'text-green-400'
            }`}
          >
            {userVerdict ? t('cases.guilty') : t('cases.notGuilty')}
          </span>
        </div>

        {total === 0 ? (
          <p className="text-sm text-gray-500 mb-6">{t('cases.noCommunityData')}</p>
        ) : (
          <div className="space-y-4 mb-6">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-red-400">{t('cases.guilty')}</span>
                <span className="text-gray-400 font-mono">{guiltyPct.toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-bg-border">
                <div className="h-full bg-red-500 transition-all" style={{ width: `${guiltyPct}%` }} />
              </div>
              <div className="text-[10px] text-gray-600 mt-0.5">
                {guilty} / {total}
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-green-400">{t('cases.notGuilty')}</span>
                <span className="text-gray-400 font-mono">{notGuiltyPct.toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-bg-border">
                <div
                  className="h-full bg-green-500 transition-all"
                  style={{ width: `${notGuiltyPct}%` }}
                />
              </div>
              <div className="text-[10px] text-gray-600 mt-0.5">
                {notGuilty} / {total}
              </div>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={onContinue}
          className="w-full px-4 py-3 border-2 border-cyan cyan-text font-mono text-sm hover:bg-cyan hover:text-dark-bg transition-colors"
        >
          {t('cases.continueNext')}
        </button>
      </div>
    </div>
  );
}
