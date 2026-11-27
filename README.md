# Mixtape — Music Playlist Manager

A responsive React playlist manager built for the Frontend Developer Assignment.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually http://localhost:5173).

## Production build

```bash
npm run build
npm run preview
```

## Features

- Loads the sample song library from `public/songs.json` with Axios.
- Search by title, artist, or genre and filter by genre.
- Create, rename, and delete playlists. Playlist names are required and unique (case-insensitive).
- Add and remove songs; duplicate tracks are prevented within a playlist.
- Reorder playlist tracks using up/down controls.
- Shows playlist song count and total duration.
- Simulated now-playing controls: play/pause, next, and previous. No audio is streamed.
- Persists playlists in browser `localStorage`.
- Responsive layouts for phone, tablet, and desktop widths, including empty, loading, and no-results states.

## Assumptions

- The assignment requests simulated playback, so the player updates track state but does not play audio.
- Playlist names are unique without regard to letter casing and surrounding whitespace is trimmed.
- Deleting a playlist requires the browser's native confirmation dialog.
- Sample songs are provided as local mock data in `public/songs.json`.
- Playlist data is stored per browser in localStorage; the song library itself is read-only.

## Project structure

```text
src/
  components/
    Button.jsx
    Input.jsx
    Modal.jsx
    PlayerBar.jsx
    PlaylistCard.jsx
    SongRow.jsx
  App.jsx
  main.jsx
  styles.css
public/
  songs.json
```

## What I would improve next

- Add drag-and-drop ordering alongside the accessible move buttons.
- Add playlist cover customization and persistence schema versioning.
- Add unit and component tests for validation and playlist operations.
- Add real audio playback if licensed audio sources become available.
- Add deployment automation and a hosted demo.

## Notes

Tailwind CSS is included in the toolchain; custom CSS is used for the bespoke responsive visual system. Axios is used for the required mock JSON request.
