import { Button } from '../ui/button';
import { Play, Pause, Square } from 'lucide-react';
import type { PracticeTransport } from '../../hooks/usePracticeTransport';

interface TransportControlsProps {
  transport: PracticeTransport;
}

export function TransportControls({ transport }: TransportControlsProps) {
  const { isPlaying, start, pause, stop, currentTime } = transport;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center justify-center gap-4 rounded-lg border border-border bg-card p-4">
      <div className="flex gap-2">
        {!isPlaying ? (
          <Button onClick={start} size="lg" className="gap-2">
            <Play className="h-5 w-5" />
            Start
          </Button>
        ) : (
          <Button onClick={pause} size="lg" variant="secondary" className="gap-2">
            <Pause className="h-5 w-5" />
            Pause
          </Button>
        )}
        <Button onClick={stop} size="lg" variant="outline" className="gap-2">
          <Square className="h-5 w-5" />
          Stop
        </Button>
      </div>
      <div className="text-lg font-mono font-semibold tabular-nums">{formatTime(currentTime)}</div>
    </div>
  );
}
