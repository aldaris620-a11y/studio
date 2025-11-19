
'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface TypewriterProps {
  text: string;
  speed?: number;
  className?: string;
  cursorClassName?: string;
}

export function Typewriter({
  text,
  speed = 50,
  className,
  cursorClassName,
}: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    setDisplayedText('');
    setShowCursor(true);
    
    const intervalId = setInterval(() => {
      setDisplayedText((prev) => {
        if (prev.length < text.length) {
          return text.slice(0, prev.length + 1);
        } else {
          clearInterval(intervalId);
          setTimeout(() => setShowCursor(false), 800);
          return prev;
        }
      });
    }, speed);

    return () => {
      clearInterval(intervalId);
    };
  }, [text, speed]);

  return (
    <span className={cn(className)}>
      {displayedText}
      {showCursor && displayedText.length === text.length && (
        <span className={cn('animate-pulse', cursorClassName)}>_</span>
      )}
    </span>
  );
}
