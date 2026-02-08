import { useEffect, useRef } from 'react';
import type { NoteChart } from '../../types/noteChart';

interface PianoRollProps {
  chart: NoteChart;
  currentTime: number;
  isPlaying: boolean;
  hitNotes: Set<number>;
}

const LANE_WIDTH = 80;
const NOTE_HEIGHT = 40;
const SCROLL_SPEED = 200; // pixels per second
const HIT_LINE_POSITION = 0.75; // 75% down the canvas

export function PianoRoll({ chart, currentTime, isPlaying, hitNotes }: PianoRollProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = 'oklch(0.15 0.02 40)';
    ctx.fillRect(0, 0, width, height);

    // Draw lanes
    const laneCount = chart.laneCount;
    const totalLaneWidth = laneCount * LANE_WIDTH;
    const offsetX = (width - totalLaneWidth) / 2;

    for (let i = 0; i < laneCount; i++) {
      const x = offsetX + i * LANE_WIDTH;
      ctx.strokeStyle = 'oklch(0.30 0.03 45 / 0.3)';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, 0, LANE_WIDTH, height);
    }

    // Draw hit line
    const hitLineY = height * HIT_LINE_POSITION;
    ctx.strokeStyle = 'oklch(0.70 0.20 50)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(offsetX, hitLineY);
    ctx.lineTo(offsetX + totalLaneWidth, hitLineY);
    ctx.stroke();

    // Draw notes
    chart.notes.forEach((note, index) => {
      const timeDiff = note.startTime - currentTime;
      const y = hitLineY - timeDiff * SCROLL_SPEED;

      // Only draw notes that are visible
      if (y < -NOTE_HEIGHT || y > height + NOTE_HEIGHT) return;

      const x = offsetX + note.lane * LANE_WIDTH;
      const noteHeight = Math.max(NOTE_HEIGHT, note.duration * SCROLL_SPEED);

      // Determine note color
      const isHit = hitNotes.has(index);
      if (isHit) {
        ctx.fillStyle = 'oklch(0.70 0.15 145 / 0.6)';
      } else {
        ctx.fillStyle = 'oklch(0.65 0.18 50 / 0.9)';
      }

      // Draw note
      ctx.fillRect(x + 4, y, LANE_WIDTH - 8, noteHeight);

      // Draw note border
      ctx.strokeStyle = isHit ? 'oklch(0.70 0.15 145)' : 'oklch(0.70 0.20 50)';
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 4, y, LANE_WIDTH - 8, noteHeight);
    });

    // Draw lane labels at the bottom
    const keyLabels = ['A', 'S', 'D', 'F', 'J', 'K', 'L', ';'];
    ctx.fillStyle = 'oklch(0.95 0.02 60)';
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < Math.min(laneCount, keyLabels.length); i++) {
      const x = offsetX + i * LANE_WIDTH + LANE_WIDTH / 2;
      const y = height - 30;
      ctx.fillText(keyLabels[i], x, y);
    }
  }, [chart, currentTime, hitNotes]);

  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-card">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="mx-auto block"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    </div>
  );
}
