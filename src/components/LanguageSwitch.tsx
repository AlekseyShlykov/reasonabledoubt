'use client';

import { getLocale, setLocale, loadTranslations, getStoredLocale, t } from '@/lib/i18n';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LanguageSwitch() {
  const [locale, setLocaleState] = useState<'en' | 'ru'>('en');
  const [ready, setReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const stored = getStoredLocale();
      setLocaleState(stored);
      await loadTranslations(stored);
      setReady(true);
    };
    init();
  }, []);

  const handleChange = async (newLocale: 'en' | 'ru') => {
    setLocale(newLocale);
    setLocaleState(newLocale);
    await loadTranslations(newLocale);
    router.refresh();
  };

  if (!ready) {
    return (
      <div className="flex gap-2 items-center">
        <div className="px-3 py-1 text-sm border border-bg-border text-gray-400">EN</div>
        <div className="px-3 py-1 text-sm border border-bg-border text-gray-400">RU</div>
      </div>
    );
  }

  return (
    <div className="flex gap-2 items-center">
      <button
        onClick={() => handleChange('en')}
        className={`px-3 py-1 text-sm border transition-colors ${
          locale === 'en'
            ? 'border-cyan cyan-text bg-surface'
            : 'border-bg-border text-gray-400 hover:border-cyan-dark'
        }`}
      >
        {t('english') || 'English'}
      </button>
      <button
        onClick={() => handleChange('ru')}
        className={`px-3 py-1 text-sm border transition-colors ${
          locale === 'ru'
            ? 'border-cyan cyan-text bg-surface'
            : 'border-bg-border text-gray-400 hover:border-cyan-dark'
        }`}
      >
        {t('russian') || 'Russian'}
      </button>
    </div>
  );
}

