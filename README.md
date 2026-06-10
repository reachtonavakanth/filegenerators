# Industry File Generator

A local browser-based tool for generating UK electricity market D-flow (`.usr`) files and CSS JSON messages for QA testing. Runs fully offline — no server, no backend, no internet required.

## Tech Stack

- TypeScript + Vite
- JSZip

## Run Locally

```bash
npm install
npm run build
npm run dev
```

Open `http://localhost:5173` in your browser.

## Build for Offline Use

```bash
npm run build
```

Open `dist/index.html` directly in Chrome or Edge — no server needed.
