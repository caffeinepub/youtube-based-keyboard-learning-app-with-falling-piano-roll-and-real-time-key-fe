import type { NoteChart, Note } from '../types/noteChart';

// Simple JSON chart format parser
export function parseJSONChart(jsonText: string): NoteChart {
  try {
    const data = JSON.parse(jsonText);

    if (!data.notes || !Array.isArray(data.notes)) {
      throw new Error('Invalid JSON format: missing notes array');
    }

    const notes: Note[] = data.notes.map((note: any, index: number) => {
      if (typeof note.pitch !== 'number' || typeof note.startTime !== 'number' || typeof note.duration !== 'number') {
        throw new Error(`Invalid note at index ${index}: missing required fields`);
      }

      return {
        pitch: note.pitch,
        lane: note.lane ?? (note.pitch % 12), // Default lane mapping
        startTime: note.startTime,
        duration: note.duration,
        velocity: note.velocity ?? 100,
      };
    });

    const duration = Math.max(...notes.map((n) => n.startTime + n.duration), 0);
    const laneCount = Math.max(...notes.map((n) => n.lane), 0) + 1;

    return {
      notes,
      duration,
      laneCount: Math.max(laneCount, 8), // Minimum 8 lanes
    };
  } catch (err) {
    throw new Error(`Failed to parse JSON chart: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }
}

// MIDI chart parser (simplified - requires @tonejs/midi or similar)
export function parseMIDIChart(arrayBuffer: ArrayBuffer): NoteChart {
  try {
    // For now, throw an error with instructions
    // In a real implementation, you would use @tonejs/midi here
    throw new Error(
      'MIDI parsing requires the @tonejs/midi library. Please use JSON format or add MIDI support via package.json.'
    );
  } catch (err) {
    throw new Error(`Failed to parse MIDI chart: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }
}
