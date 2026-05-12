'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loadTranslations, getStoredLocale, t } from '@/lib/i18n';
import { navigateTo } from '@/lib/navigation';
import LanguageSwitch from '@/components/LanguageSwitch';

export default function HomePage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const locale = getStoredLocale();
    loadTranslations(locale).then(() => setReady(true));
  }, []);

  const handleStart = () => {
    navigateTo(router, '/intro');
  };

  return (
    <div className="min-h-dvh bg-dark-bg flex flex-col items-center justify-center px-4">
      <div className="absolute top-6 right-6">
        <LanguageSwitch />
      </div>
      {!ready ? (
        <div className="text-cyan font-mono">Loading...</div>
      ) : (
        <div className="text-center space-y-8">
          <h1 className="text-6xl font-mono cyan-light-text">{t('title') || 'Reasonable Doubt'}</h1>
          <button
            onClick={handleStart}
            className="px-8 py-4 border-2 border-cyan cyan-text font-mono text-lg hover:bg-cyan hover:text-dark-bg transition-colors"
          >
            {t('start') || 'Start'}
          </button>
        </div>
      )}
    </div>
  );
}

