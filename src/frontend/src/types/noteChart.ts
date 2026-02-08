export interface Note {
  pitch: number; // MIDI note number (0-127)
  lane: number; // Mapped lane for display (0-based)
  startTime: number; // Start time in seconds
  duration: number; // Duration in seconds
  velocity?: number; // Optional velocity (0-127)
}

export interface NoteChart {
  notes: Note[];
  duration: number; // Total duration in seconds
  laneCount: number; // Number of lanes/keys
}
