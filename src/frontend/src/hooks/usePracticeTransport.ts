import { useState, useEffect, useRef, useCallback } from 'react';

export interface PracticeTransport {
  currentTime: number;
  isPlaying: boolean;
  start: () => void;
  pause: () => void;
  stop: () => void;
  seek: (time: number) => void;
}

export function usePracticeTransport(): PracticeTransport {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number | undefined>(undefined);

  const updateTime = useCallback(() => {
    if (isPlaying) {
      const elapsed = (performance.now() - startTimeRef.current) / 1000;
      setCurrentTime(pausedTimeRef.current + elapsed);
      animationFrameRef.current = requestAnimationFrame(updateTime);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      startTimeRef.current = performance.now();
      animationFrameRef.current = requestAnimationFrame(updateTime);
    } else {
      if (animationFrameRef.current !== undefined) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }

    return () => {
      if (animationFrameRef.current !== undefined) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, updateTime]);

  const start = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    pausedTimeRef.current = currentTime;
    setIsPlaying(false);
  }, [currentTime]);

  const stop = useCallback(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    pausedTimeRef.current = 0;
  }, []);

  const seek = useCallback((time: number) => {
    setCurrentTime(time);
    pausedTimeRef.current = time;
  }, []);

  return {
    currentTime,
    isPlaying,
    start,
    pause,
    stop,
    seek,
  };
}
