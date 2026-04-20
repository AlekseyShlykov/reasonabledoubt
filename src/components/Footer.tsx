'use client';

import { t } from '@/lib/i18n';

interface FooterProps {
  compact?: boolean;
}

export default function Footer({ compact }: FooterProps) {
  const website = t('footer.website');

  return (
    <footer
      className={`flex-shrink-0 border-t border-bg-border bg-surface mt-0 ${
        compact ? 'px-3 py-1.5 sm:py-2' : 'px-6 py-4 mt-auto'
      }`}
    >
      <div
        className={`max-w-7xl mx-auto text-center text-gray-400 ${
          compact ? 'text-[10px] sm:text-xs leading-tight' : 'text-sm'
        }`}
      >
        <span>{t('footer.createdBy')}</span>
        {website && (
          <>
            {' • '}
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="cyan-text hover:cyan-light-text transition-colors"
            >
              {website}
            </a>
          </>
        )}
      </div>
    </footer>
  );
}
