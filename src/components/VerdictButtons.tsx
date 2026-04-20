'use client';

import { t } from '@/lib/i18n';

interface VerdictButtonsProps {
  onVerdict: (verdict: boolean) => void;
  disabled?: boolean;
}

export default function VerdictButtons({ onVerdict, disabled }: VerdictButtonsProps) {
  return (
    <div className="flex flex-wrap gap-2 sm:gap-4 justify-center max-w-full">
      <button
        type="button"
        onClick={() => onVerdict(true)}
        disabled={disabled}
        className="min-w-[120px] px-4 sm:px-8 py-2 sm:py-3 border-2 border-red-500 text-red-500 text-sm sm:text-base font-mono hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {t('cases.guilty')}
      </button>
      <button
        type="button"
        onClick={() => onVerdict(false)}
        disabled={disabled}
        className="min-w-[120px] px-4 sm:px-8 py-2 sm:py-3 border-2 border-green-500 text-green-500 text-sm sm:text-base font-mono hover:bg-green-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {t('cases.notGuilty')}
      </button>
    </div>
  );
}

