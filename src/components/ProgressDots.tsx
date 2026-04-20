'use client';

interface ProgressDotsProps {
  currentRound: number;
  totalRounds: number;
}

export default function ProgressDots({ currentRound, totalRounds }: ProgressDotsProps) {
  return (
    <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-end">
      {Array.from({ length: totalRounds }, (_, i) => i + 1).map((roundNum) => {
        const isActive = roundNum === currentRound;
        const isCompleted = roundNum < currentRound;

        return (
          <div
            key={roundNum}
            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border transition-colors ${
              isActive
                ? 'bg-cyan border-cyan'
                : isCompleted
                  ? 'bg-cyan-dark border-cyan-dark'
                  : 'bg-transparent border-bg-border'
            }`}
            title={`${roundNum}/${totalRounds}`}
          />
        );
      })}
    </div>
  );
}
