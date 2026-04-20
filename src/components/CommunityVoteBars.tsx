'use client';

import { t } from '@/lib/i18n';

interface CommunityVoteBarsProps {
  guilty: number;
  notGuilty: number;
  /** When true, show muted hint under bars (e.g. no rows in DB yet). */
  showEmptyHint?: boolean;
}

export default function CommunityVoteBars({
  guilty,
  notGuilty,
  showEmptyHint,
}: CommunityVoteBarsProps) {
  const total = guilty + notGuilty;
  const guiltyPercent = total > 0 ? (guilty / total) * 100 : 0;
  const notGuiltyPercent = total > 0 ? (notGuilty / total) * 100 : 0;

  return (
    <div className="space-y-2">
      <div className="text-xs text-gray-500 mb-1">{t('results.communityVotesTitle')}</div>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-red-400">{t('results.guilty')}</span>
            <span className="text-gray-400 font-mono">{guiltyPercent.toFixed(1)}%</span>
          </div>
          <div className="h-2 bg-bg-border">
            <div className="h-full bg-red-500 transition-all" style={{ width: `${guiltyPercent}%` }} />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-green-400">{t('results.notGuilty')}</span>
            <span className="text-gray-400 font-mono">{notGuiltyPercent.toFixed(1)}%</span>
          </div>
          <div className="h-2 bg-bg-border">
            <div
              className="h-full bg-green-500 transition-all"
              style={{ width: `${notGuiltyPercent}%` }}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-between text-[10px] text-gray-600 font-mono">
        <span>{t('results.voteCount', { n: total })}</span>
      </div>
      {showEmptyHint && total === 0 && (
        <p className="text-xs text-gray-500 pt-1">{t('results.noCommunityData')}</p>
      )}
    </div>
  );
}
