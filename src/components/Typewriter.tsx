'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface TypewriterProps {
  text: string[];
  onComplete: () => void;
  speed?: number;
  /** Parent sets true (e.g. «Пропустить интро») — показать весь текст сразу. */
  skipAll?: boolean;
  tapToRevealAria?: string;
}

export default function Typewriter({
  text,
  onComplete,
  speed = 30,
  skipAll = false,
  tapToRevealAria,
}: TypewriterProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [skippedAll, setSkippedAll] = useState(false);

  const typingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pauseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const charIndexRef = useRef(0);
  const finishedRef = useRef(false);
  const currentIndexRef = useRef(0);
  /** True while waiting between finished phrase and next (same pause as auto-play). */
  const betweenPhrasesRef = useRef(false);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  const clearTyping = () => {
    if (typingIntervalRef.current !== null) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }
  };

  const clearPause = () => {
    if (pauseTimeoutRef.current !== null) {
      clearTimeout(pauseTimeoutRef.current);
      pauseTimeoutRef.current = null;
    }
  };

  const schedulePauseThenNext = useCallback(() => {
    clearPause();
    betweenPhrasesRef.current = true;
    pauseTimeoutRef.current = setTimeout(() => {
      pauseTimeoutRef.current = null;
      betweenPhrasesRef.current = false;
      setCurrentText('');
      setCurrentIndex((prev) => prev + 1);
    }, 1000);
  }, []);

  const skipToEnd = useCallback(() => {
    if (finishedRef.current || text.length === 0) return;
    finishedRef.current = true;
    clearTyping();
    clearPause();
    betweenPhrasesRef.current = false;
    setSkippedAll(true);
    setIsComplete(true);
    onComplete();
  }, [onComplete, text.length]);

  useEffect(() => {
    if (skipAll && text.length > 0) {
      skipToEnd();
    }
  }, [skipAll, skipToEnd, text.length]);

  useEffect(() => {
    if (skippedAll) {
      return;
    }

    if (text.length === 0) {
      return;
    }

    if (currentIndex >= text.length) {
      if (!finishedRef.current) {
        finishedRef.current = true;
        setIsComplete(true);
        onComplete();
      }
      return;
    }

    const currentParagraph = text[currentIndex];
    betweenPhrasesRef.current = false;
    charIndexRef.current = 0;
    setCurrentText('');

    typingIntervalRef.current = setInterval(() => {
      charIndexRef.current += 1;
      const idx = charIndexRef.current;
      setCurrentText(currentParagraph.slice(0, idx));
      if (idx >= currentParagraph.length) {
        clearTyping();
        setCurrentText(currentParagraph);
        schedulePauseThenNext();
      }
    }, speed);

    return () => {
      clearTyping();
      clearPause();
    };
  }, [currentIndex, text, speed, onComplete, skippedAll, schedulePauseThenNext]);

  const completeCurrentPhrase = useCallback(() => {
    if (finishedRef.current || skippedAll || text.length === 0) return;

    const idx = currentIndexRef.current;
    if (idx >= text.length) return;

    clearTyping();

    if (betweenPhrasesRef.current) {
      clearPause();
      betweenPhrasesRef.current = false;
      setCurrentText('');
      setCurrentIndex((prev) => prev + 1);
      return;
    }

    const currentParagraph = text[idx];
    if (!currentParagraph) return;

    charIndexRef.current = currentParagraph.length;
    setCurrentText(currentParagraph);
    schedulePauseThenNext();
  }, [skippedAll, text, schedulePauseThenNext]);

  const handlePointerDown = () => {
    completeCurrentPhrase();
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={skippedAll || isComplete ? undefined : tapToRevealAria}
      onPointerDown={handlePointerDown}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          completeCurrentPhrase();
        }
      }}
      className="flex min-h-[min(400px,65dvh)] w-full max-w-3xl cursor-pointer touch-manipulation select-none items-center justify-center [-webkit-tap-highlight-color:transparent] outline-none focus-visible:ring-1 focus-visible:ring-cyan/50"
    >
      <div className="w-full font-mono text-lg leading-relaxed cyan-light-text">
        {skippedAll ? (
          <div className="space-y-4 text-left">
            {text.map((paragraph, i) => (
              <p key={i} className="whitespace-pre-line">
                {paragraph}
              </p>
            ))}
          </div>
        ) : (
          <>
            {currentText}
            {!isComplete && <span className="animate-pulse">|</span>}
          </>
        )}
      </div>
    </div>
  );
}
