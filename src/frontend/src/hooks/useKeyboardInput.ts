import { useState, useEffect } from 'react';

export interface KeyMapping {
  [key: string]: number; // key -> lane
}

export interface KeyboardInput {
  lastPressed: { key: string; lane: number; timestamp: number } | null;
  keyMapping: KeyMapping;
}

const DEFAULT_KEY_MAPPING: KeyMapping = {
  a: 0,
  s: 1,
  d: 2,
  f: 3,
  j: 4,
  k: 5,
  l: 6,
  ';': 7,
};

export function useKeyboardInput(): KeyboardInput {
  const [lastPressed, setLastPressed] = useState<{ key: string; lane: number; timestamp: number } | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const lane = DEFAULT_KEY_MAPPING[key];

      if (lane !== undefined) {
        e.preventDefault();
        setLastPressed({ key, lane, timestamp: performance.now() });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return {
    lastPressed,
    keyMapping: DEFAULT_KEY_MAPPING,
  };
}
