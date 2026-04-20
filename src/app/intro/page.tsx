'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loadTranslations, getStoredLocale, t } from '@/lib/i18n';
import Typewriter from '@/components/Typewriter';

export default function IntroPage() {
  const router = useRouter();
  const [showButton, setShowButton] = useState(false);
  const [skipAll, setSkipAll] = useState(false);
  const [introText, setIntroText] = useState<string[]>([]);

  useEffect(() => {
    const loadIntro = async () => {
      const locale = getStoredLocale();
      await loadTranslations(locale);
      try {
        const response = await fetch(`/data/locales/${locale}/common.json`);
        const data = await response.json();
        if (Array.isArray(data.intro)) {
          setIntroText(data.intro);
        }
      } catch (error) {
        console.error('Error loading intro:', error);
      }
    };
    loadIntro();
  }, []);

  const handleComplete = useCallback(() => {
    setShowButton(true);
  }, []);

  const handleStart = () => {
    router.push('/cases');
  };

  return (
    <div className="relative min-h-dvh bg-dark-bg flex flex-col items-center justify-center p-4 sm:p-8">
      {introText.length > 0 && !showButton && (
        <button
          type="button"
          onClick={() => setSkipAll(true)}
          className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 text-xs font-mono text-gray-600/80 hover:text-gray-400 transition-colors"
        >
          {t('skipIntro')}
        </button>
      )}
      <div className="max-w-3xl w-full flex flex-col flex-1 min-h-0 justify-center">
        <div className="min-h-[min(400px,60dvh)] flex flex-1 items-center justify-center">
          {introText.length > 0 ? (
            <Typewriter
              text={introText}
              onComplete={handleComplete}
              skipAll={skipAll}
              tapToRevealAria={t('tapToRevealAria')}
            />
          ) : (
            <div className="text-cyan font-mono">Loading...</div>
          )}
        </div>
        {introText.length > 0 && !showButton && (
          <p className="text-center text-[11px] sm:text-xs text-gray-600 pb-2">{t('tapToRevealIntro')}</p>
        )}
        {showButton && (
          <div className="mt-6 sm:mt-8 text-center">
            <button
              type="button"
              onClick={handleStart}
              className="px-8 py-4 border-2 border-cyan cyan-text font-mono text-lg hover:bg-cyan hover:text-dark-bg transition-colors"
            >
              {t('start')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
