import { Check, X } from 'lucide-react';
import type { HitState } from '../../features/practice/useHitDetection';
import type { KeyMapping } from '../../hooks/useKeyboardInput';
import { Alert, AlertDescription } from '../ui/alert';

interface HitFeedbackProps {
  hitState: HitState;
  keyMapping: KeyMapping;
}

export function HitFeedback({ hitState, keyMapping }: HitFeedbackProps) {
  const keys = Object.keys(keyMapping).join(', ').toUpperCase();

  return (
    <div className="space-y-4">
      <Alert>
        <AlertDescription>
          <strong>Keyboard Mapping:</strong> Use keys <span className="font-mono font-semibold">{keys}</span> to play
          notes. Press the correct key when a note reaches the hit line.
        </AlertDescription>
      </Alert>

      {hitState.type !== 'idle' && (
        <div
          className={`flex items-center justify-center gap-3 rounded-lg border-2 p-4 ${
            hitState.type === 'hit'
              ? 'animate-hit-pulse border-success bg-success/10 text-success'
              : 'border-destructive bg-destructive/10 text-destructive'
          }`}
        >
          {hitState.type === 'hit' ? (
            <>
              <Check className="h-8 w-8" />
              <span className="text-xl font-bold">Perfect!</span>
            </>
          ) : (
            <>
              <X className="h-8 w-8" />
              <span className="text-xl font-bold">Missed</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
