'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loadTranslations, getStoredLocale, t } from '@/lib/i18n';
import { getSession, clearSession, TOTAL_ROUNDS } from '@/lib/storage';
import { getCaseStatisticsDetailed, isSupabaseConfigured } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CommunityVoteBars from '@/components/CommunityVoteBars';
import LanguageSwitch from '@/components/LanguageSwitch';
import { navigateTo } from '@/lib/navigation';

export default function ResultsPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Record<number, { guilty: number; notGuilty: number }>>({});
  const [userVerdicts, setUserVerdicts] = useState<Record<number, boolean | null>>({});
  const [caseOrder, setCaseOrder] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [statsLoadError, setStatsLoadError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const locale = getStoredLocale();
      await loadTranslations(locale);

      const session = getSession();
      if (session) {
        setUserVerdicts(session.verdicts);
        setCaseOrder(session.caseOrder);
      }

      const { stats: caseStats, loadError } = await getCaseStatisticsDetailed();
      setStats(caseStats);
      setStatsLoadError(loadError);
      setLoading(false);
    };

    loadData();
  }, []);

  const handlePlayAgain = () => {
    clearSession();
    navigateTo(router, '/intro');
  };

  if (loading) {
    return (
      <div className="min-h-dvh flex flex-col overflow-hidden bg-dark-bg">
        <Header currentRound={TOTAL_ROUNDS} totalRounds={TOTAL_ROUNDS} compact />
        <div className="flex-1 min-h-0 flex items-center justify-center">
          <div className="text-cyan font-mono text-sm">{t('results.loading')}</div>
        </div>
        <Footer compact />
      </div>
    );
  }

  const order =
    caseOrder.length === TOTAL_ROUNDS ? caseOrder : Array.from({ length: TOTAL_ROUNDS }, (_, i) => i + 1);

  return (
    <div className="min-h-dvh flex flex-col overflow-hidden bg-dark-bg">
      <Header currentRound={TOTAL_ROUNDS} totalRounds={TOTAL_ROUNDS} compact />
      <div className="px-3 pt-3 sm:px-6 sm:pt-4">
        <div className="max-w-4xl mx-auto flex justify-end">
          <LanguageSwitch />
        </div>
      </div>
      <main className="flex-1 min-h-0 overflow-y-auto px-3 py-3 sm:p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-2xl sm:text-4xl font-mono cyan-light-text mb-2 sm:mb-4">
              {t('results.title')}
            </h1>
            <p className="text-sm sm:text-lg text-gray-300">{t('results.thankYou')}</p>
            <p className="mt-2 text-xs sm:text-sm text-gray-400 max-w-2xl mx-auto">{t('results.moreCases')}</p>
          </div>

          {!isSupabaseConfigured() && (
            <div className="border border-amber-800/70 bg-amber-950/40 text-amber-100 text-sm px-4 py-3 font-mono">
              {t('results.supabaseNotConfigured')}
            </div>
          )}

          {statsLoadError && (
            <div className="border border-red-900/60 bg-red-950/30 text-red-200 text-sm px-4 py-3 font-mono">
              {t('results.statsFailed', { message: statsLoadError })}
            </div>
          )}

          <div className="bg-surface border border-bg-border p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-mono cyan-text mb-4 sm:mb-6">
              {t('results.caseResults')}
            </h2>
            <div className="space-y-4 sm:space-y-6">
              {order.map((caseNum, idx) => {
                const caseStats = stats[caseNum] || { guilty: 0, notGuilty: 0 };
                const total = caseStats.guilty + caseStats.notGuilty;
                const userVerdict = userVerdicts[caseNum];

                return (
                  <div key={`${caseNum}-${idx}`} className="border-b border-bg-border pb-4 last:border-0">
                    <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                      <span className="font-mono cyan-text text-sm">
                        {t('results.round')} {idx + 1}. {t('results.caseLabel')} {caseNum}.
                      </span>
                      {userVerdict !== null && userVerdict !== undefined && (
                        <span
                          className={`text-xs px-2 py-1 border ${
                            userVerdict ? 'border-red-500 text-red-500' : 'border-green-500 text-green-500'
                          }`}
                        >
                          {t('results.yourDecision')}:{' '}
                          {userVerdict ? t('results.guilty') : t('results.notGuilty')}
                        </span>
                      )}
                    </div>

                    <CommunityVoteBars
                      guilty={caseStats.guilty}
                      notGuilty={caseStats.notGuilty}
                      showEmptyHint={
                        isSupabaseConfigured() && !statsLoadError && total === 0
                      }
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-center space-y-4 pb-4">
            <a
              href={t('footer.website')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-cyan hover:cyan-light-text transition-colors text-sm"
            >
              {t('results.visitWebsite')}
            </a>
            <div>
              <button
                type="button"
                onClick={handlePlayAgain}
                className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-cyan cyan-text font-mono text-base sm:text-lg hover:bg-cyan hover:text-dark-bg transition-colors"
              >
                {t('playAgain')}
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer compact />
    </div>
  );
}
