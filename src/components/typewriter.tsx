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
    setDisplayedText(''); // Reset on text change
    let i = 0;
    const intervalId = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(prev => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(intervalId);
        // Hide cursor after a delay when typing is done
        setTimeout(() => setShowCursor(false), 800);
      }
    }, speed);

    // Show cursor immediately when new text comes in
    setShowCursor(true);

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
