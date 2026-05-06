import { withPublicPath } from './basePath';

export type Locale = 'en' | 'ru' | 'es' | 'ja' | 'it' | 'de' | 'pt';
type Translations = Record<string, any>;

let currentLocale: Locale = 'en';
let translations: Translations = {};

export async function loadTranslations(locale: Locale): Promise<void> {
  currentLocale = locale;
  try {
    const response = await fetch(withPublicPath(`/data/locales/${locale}/common.json`));
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    translations = await response.json();
  } catch (error) {
    console.error(`Failed to load translations for ${locale}:`, error);
    // Fallback to English
    if (locale !== 'en') {
      try {
        const response = await fetch(withPublicPath('/data/locales/en/common.json'));
        if (response.ok) {
          translations = await response.json();
        }
      } catch (fallbackError) {
        console.error('Failed to load fallback translations:', fallbackError);
        // Set empty translations to prevent crashes
        translations = {};
      }
    } else {
      translations = {};
    }
  }
}

export function t(key: string, vars?: Record<string, string | number>): string {
  const keys = key.split('.');
  let value: any = translations;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return key; // Return key if translation not found
    }
  }
  
  if (typeof value !== 'string') {
    return key;
  }
  
  // Simple variable substitution
  if (vars) {
    return value.replace(/\{\{(\w+)\}\}/g, (match, varKey) => {
      return vars[varKey]?.toString() || match;
    });
  }
  
  return value;
}

export function getLocale(): Locale {
  return currentLocale;
}

export function setLocale(locale: Locale): void {
  currentLocale = locale;
  if (typeof window !== 'undefined') {
    localStorage.setItem('locale', locale);
  }
}

export function getStoredLocale(): Locale {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('locale');
    if (
      stored === 'en' ||
      stored === 'ru' ||
      stored === 'es' ||
      stored === 'ja' ||
      stored === 'it' ||
      stored === 'de' ||
      stored === 'pt'
    ) {
      return stored;
    }
  }
  return 'en';
}

