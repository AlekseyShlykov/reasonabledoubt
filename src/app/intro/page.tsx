'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loadTranslations, getStoredLocale, t } from '@/lib/i18n';
import Typewriter from '@/components/Typewriter';
import { withPublicPath } from '@/lib/basePath';

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
        const response = await fetch(withPublicPath(`/data/locales/${locale}/common.json`));
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

  const handleSkipIntro = () => {
    router.push('/cases');
  };

  return (
    <div className="flex min-h-dvh flex-col bg-dark-bg px-4 pt-4 sm:p-8">
      <div className="mx-auto flex w-full max-w-3xl min-h-0 flex-1 flex-col">
        <div className="flex min-h-0 flex-1 items-center justify-center py-2 sm:py-4">
          {introText.length > 0 ? (
            <Typewriter
              text={introText}
              onComplete={handleComplete}
              skipAll={skipAll}
              tapToRevealAria={t('tapToRevealAria')}
            />
          ) : (
            <div className="font-mono text-cyan">Loading...</div>
          )}
        </div>

        {introText.length > 0 && !showButton && (
          <footer className="flex shrink-0 flex-col items-center gap-3 pb-[max(1rem,env(safe-area-inset-bottom,0px))] pt-4 text-center">
            <p className="max-w-md text-pretty text-[11px] leading-snug text-gray-600 sm:text-xs">
              {t('tapToRevealIntro')}
            </p>
            <button
              type="button"
              onClick={handleSkipIntro}
              className="font-mono text-xs text-gray-600/90 transition-colors hover:text-gray-400"
            >
              {t('skipIntro')}
            </button>
          </footer>
        )}

        {showButton && (
          <div className="mt-6 shrink-0 pb-[max(1rem,env(safe-area-inset-bottom,0px))] text-center sm:mt-8">
            <button
              type="button"
              onClick={handleStart}
              className="border-2 border-cyan px-8 py-4 font-mono text-lg cyan-text transition-colors hover:bg-cyan hover:text-dark-bg"
            >
              {t('start')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
