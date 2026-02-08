import { useState, useEffect } from 'react';
import type { NoteChart } from '../../types/noteChart';

export interface HitState {
  type: 'hit' | 'miss' | 'idle';
  timestamp: number;
}

const HIT_WINDOW = 0.15; // 150ms tolerance window

export function useHitDetection(
  chart: NoteChart | null,
  currentTime: number,
  lastPressed: { key: string; lane: number; timestamp: number } | null
) {
  const [hitNotes, setHitNotes] = useState<Set<number>>(new Set());
  const [hitState, setHitState] = useState<HitState>({ type: 'idle', timestamp: 0 });

  useEffect(() => {
    if (!chart || !lastPressed) return;

    const { lane, timestamp } = lastPressed;

    // Find notes in the hit window for this lane
    const activeNotes = chart.notes.filter((note, index) => {
      if (note.lane !== lane) return false;
      if (hitNotes.has(index)) return false;

      const noteTime = note.startTime;
      const timeDiff = Math.abs(currentTime - noteTime);
      return timeDiff <= HIT_WINDOW;
    });

    if (activeNotes.length > 0) {
      // Hit!
      const noteIndex = chart.notes.indexOf(activeNotes[0]);
      setHitNotes((prev) => new Set(prev).add(noteIndex));
      setHitState({ type: 'hit', timestamp });
    } else {
      // Miss
      setHitState({ type: 'miss', timestamp });
    }

    // Reset hit state after animation
    const timeout = setTimeout(() => {
      setHitState({ type: 'idle', timestamp: 0 });
    }, 300);

    return () => clearTimeout(timeout);
  }, [lastPressed, chart, currentTime, hitNotes]);

  return {
    hitNotes,
    hitState,
  };
}
