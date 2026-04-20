'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { loadTranslations, getStoredLocale } from '@/lib/i18n';
import { loadCaseContent, loadCaseLogic, type CaseContent, type CaseLogic } from '@/lib/data';
import {
  getSession,
  createSession,
  setVerdict,
  advanceRound,
  TOTAL_ROUNDS,
} from '@/lib/storage';
import {
  createOrUpdateSession,
  updateVerdict as updateVerdictDB,
  markCompleted,
  recordCaseVote,
  getCaseVoteStats,
} from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CaseGrid from '@/components/CaseGrid';
import VerdictButtons from '@/components/VerdictButtons';
import CommunityStatsPanel from '@/components/CommunityStatsPanel';
import CaseTutorialPanel from '@/components/CaseTutorialPanel';
import { t } from '@/lib/i18n';

type Phase = 'case' | 'stats';

const TUTORIAL_STORAGE_KEY = 'verdict_case_tutorial_seen_v1';

export default function CasesPage() {
  const router = useRouter();
  const [canonicalId, setCanonicalId] = useState<number | null>(null);
  const [roundIndex, setRoundIndex] = useState(0);
  const [content, setContent] = useState<CaseContent | null>(null);
  const [logic, setLogic] = useState<CaseLogic | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [caseStartTime, setCaseStartTime] = useState(Date.now());
  const [phase, setPhase] = useState<Phase>('case');
  const [statsGuilty, setStatsGuilty] = useState(0);
  const [statsNotGuilty, setStatsNotGuilty] = useState(0);
  const [lastUserVerdict, setLastUserVerdict] = useState(true);
  /** 0–3 шаг обучения, null — выключено */
  const [tutorialStep, setTutorialStep] = useState<number | null>(null);

  const loadCaseById = useCallback(async (caseId: number) => {
    setLoading(true);
    setCaseStartTime(Date.now());

    const locale = getStoredLocale();
    const [caseContent, caseLogic] = await Promise.all([
      loadCaseContent(locale, caseId),
      loadCaseLogic(caseId),
    ]);

    if (caseContent && caseLogic) {
      setContent(caseContent);
      setLogic(caseLogic);
    } else {
      setContent(null);
      setLogic(null);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    const initialize = async () => {
      const locale = getStoredLocale();
      await loadTranslations(locale);

      let session = getSession();
      if (!session) {
        session = createSession(locale);
      }
      await createOrUpdateSession(
        session.sessionId,
        locale,
        typeof window !== 'undefined' ? window.navigator.userAgent : undefined
      );

      if (session.roundIndex >= TOTAL_ROUNDS) {
        await markCompleted(session.sessionId);
        router.push('/results');
        return;
      }

      const cid = session.caseOrder[session.roundIndex];
      if (cid === undefined) {
        router.push('/results');
        return;
      }

      setRoundIndex(session.roundIndex);
      setCanonicalId(cid);
      setPhase('case');
      await loadCaseById(cid);
    };

    initialize();
  }, [router, loadCaseById]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (loading || !content || !logic) return;

    const session = getSession();
    const showTutorial =
      session !== null &&
      session.roundIndex === 0 &&
      localStorage.getItem(TUTORIAL_STORAGE_KEY) !== '1';

    if (!showTutorial) {
      setTutorialStep(null);
      return;
    }

    setTutorialStep((prev) => (prev === null ? 0 : prev));
  }, [loading, content, logic, roundIndex]);

  const finishTutorial = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TUTORIAL_STORAGE_KEY, '1');
    }
    setTutorialStep(null);
  }, []);

  const handleTutorialNext = useCallback(() => {
    setTutorialStep((s) => {
      if (s === null) return null;
      if (s >= 3) {
        if (typeof window !== 'undefined') {
          localStorage.setItem(TUTORIAL_STORAGE_KEY, '1');
        }
        return null;
      }
      return s + 1;
    });
  }, []);

  const handleTutorialSkip = useCallback(() => {
    finishTutorial();
  }, [finishTutorial]);

  const handleVerdict = async (verdict: boolean) => {
    if (processing || canonicalId === null || tutorialStep !== null) return;

    setProcessing(true);
    const timeMs = Date.now() - caseStartTime;

    const session = getSession();
    if (!session) {
      setProcessing(false);
      return;
    }

    setVerdict(canonicalId, verdict, timeMs);
    setLastUserVerdict(verdict);

    const roundNumber = session.roundIndex + 1;
    await Promise.all([
      recordCaseVote(canonicalId, verdict, session.sessionId),
      updateVerdictDB(session.sessionId, roundNumber, verdict, timeMs),
    ]);

    const stats = await getCaseVoteStats(canonicalId);
    setStatsGuilty(stats.guilty);
    setStatsNotGuilty(stats.notGuilty);
    setPhase('stats');
    setProcessing(false);
  };

  const handleContinueAfterStats = async () => {
    const session = advanceRound();
    if (!session) return;

    if (session.roundIndex >= TOTAL_ROUNDS) {
      await markCompleted(session.sessionId);
      router.push('/results');
      return;
    }

    const cid = session.caseOrder[session.roundIndex];
    if (cid === undefined) {
      router.push('/results');
      return;
    }

    setRoundIndex(session.roundIndex);
    setCanonicalId(cid);
    setPhase('case');
    await loadCaseById(cid);
  };

  const currentRoundDisplay = roundIndex + 1;

  if (loading || canonicalId === null || !content || !logic) {
    return (
      <div className="h-dvh flex flex-col overflow-hidden bg-dark-bg">
        <Header currentRound={currentRoundDisplay} totalRounds={TOTAL_ROUNDS} compact />
        <div className="flex-1 min-h-0 flex items-center justify-center px-4">
          <div className="text-cyan font-mono text-sm">
            {t('cases.loadingCase')} {canonicalId ?? '…'}
          </div>
        </div>
        <Footer compact />
      </div>
    );
  }

  return (
    <div className="h-dvh flex flex-col overflow-hidden bg-dark-bg">
      <Header currentRound={currentRoundDisplay} totalRounds={TOTAL_ROUNDS} compact />

      <main className="flex-1 min-h-0 flex flex-col px-2 py-2 sm:px-4 sm:py-3">
        <div className="max-w-7xl mx-auto w-full flex-1 min-h-0 flex flex-col gap-2 relative">
          <CaseGrid content={content} logic={logic} tutorialHighlight={tutorialStep} />

          {tutorialStep !== null && (
            <CaseTutorialPanel
              step={tutorialStep}
              onNext={handleTutorialNext}
              onSkip={handleTutorialSkip}
            />
          )}

          {phase === 'case' && (
            <div
              className={`flex-shrink-0 flex justify-center pt-1 pb-[max(0.25rem,env(safe-area-inset-bottom))] ${
                tutorialStep !== null ? 'pointer-events-none blur-[1px] opacity-40' : ''
              }`}
            >
              <VerdictButtons
                onVerdict={handleVerdict}
                disabled={processing || tutorialStep !== null}
              />
            </div>
          )}

          {processing && phase === 'case' && (
            <div className="text-center text-cyan font-mono text-xs flex-shrink-0">
              {t('cases.processing')}
            </div>
          )}
        </div>
      </main>

      <Footer compact />

      {phase === 'stats' && (
        <CommunityStatsPanel
          guilty={statsGuilty}
          notGuilty={statsNotGuilty}
          userVerdict={lastUserVerdict}
          onContinue={handleContinueAfterStats}
        />
      )}
    </div>
  );
}
