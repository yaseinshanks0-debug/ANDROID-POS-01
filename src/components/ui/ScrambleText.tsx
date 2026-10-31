/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';

const CIPHER_CHARS = '!<>-_\\/[]{}—=+*^?#________';

export interface ScrambleTextProps {
  text: string;
  speed?: number; // ms per tick
  scrambleLoops?: number;
  className?: string;
  trigger?: boolean | string | number; // triggers re-scramble on change
}

export const ScrambleText: React.FC<ScrambleTextProps> = ({
  text,
  speed = 30,
  scrambleLoops = 2,
  className = '',
  trigger,
}) => {
  const [displayText, setDisplayText] = useState(text);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    let iteration = 0;
    const maxIterations = text.length + scrambleLoops;
    let timer: NodeJS.Timeout | null = null;

    timer = setInterval(() => {
      setDisplayText(() => {
        return text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration - scrambleLoops) {
              return text[index];
            }
            return CIPHER_CHARS[Math.floor(Math.random() * CIPHER_CHARS.length)];
          })
          .join('');
      });

      iteration += 1;
      if (iteration > maxIterations) {
        setDisplayText(text);
        if (timer) clearInterval(timer);
      }
    }, speed);

    return () => {
      if (timer) clearInterval(timer);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [text, speed, scrambleLoops, trigger]);

  return <span className={`inline-block font-mono tracking-tight ${className}`}>{displayText}</span>;
};
