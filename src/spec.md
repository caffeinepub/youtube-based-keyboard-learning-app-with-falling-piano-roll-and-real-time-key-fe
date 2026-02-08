# Specification

## Summary
**Goal:** Create a free music-learning practice app where a user enters their name once, selects a YouTube song, imports a matching note chart (MIDI/JSON), and practices with a synced falling piano-roll plus real-time computer keyboard feedback.

**Planned changes:**
- Add minimal onboarding with a single required name field; persist and auto-load the saved name with an option to change it.
- Add a YouTube selection screen with a paste-URL input, in-app embedded playback, and clear validation/error messaging.
- Add note-chart import (MIDI and/or JSON) to supply the piano-roll sequence without extracting notes from YouTube audio.
- Implement a top-to-bottom falling piano-roll visualization synced to the imported chart timeline, including a hit line and start/pause/stop controls.
- Implement computer keyboard keydown detection mapped to piano lanes, showing an immediate tick/check for correct hits within a timing window and consistent handling for incorrect keys.
- Store/load the user profile (at least name; optionally last YouTube URL and last imported chart filename) in a single Motoko backend actor.
- Apply a consistent music-learning visual theme across screens (not blue/purple-dominant).

**User-visible outcome:** The user enters (or auto-loads) their name, pastes a YouTube link to play a song in-app, imports a corresponding MIDI/JSON chart, watches notes fall toward a hit line, and gets instant tick/check feedback when pressing the correct computer keyboard keys—all without any payments or extra questionnaires.
