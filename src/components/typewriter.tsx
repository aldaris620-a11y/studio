
'use client';

import { useState, useEffect, useRef } from 'react';
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
  const index = useRef(0);

  useEffect(() => {
    // Reset state when text changes
    setDisplayedText('');
    index.current = 0;
    setShowCursor(true);

    const intervalId = setInterval(() => {
      if (index.current < text.length) {
        setDisplayedText((prev) => prev + text.charAt(index.current));
        index.current += 1;
      } else {
        clearInterval(intervalId);
        // Hide cursor after a delay when typing is done
        setTimeout(() => setShowCursor(false), 800);
      }
    }, speed);

    return () => {
      clearInterval(intervalId);
    };
  }, [text, speed]);

  return (
    <span className={cn(className)}>
      {displayedText}
      {showCursor && (
        <span className={cn('animate-pulse', cursorClassName)}>_</span>
      )}
    </span>
  );
}
