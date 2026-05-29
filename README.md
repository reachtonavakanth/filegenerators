# Test File Generator

A local browser-based tool for generating UK electricity market D-flow files (`.usr`) and CSS JSON messages for QA testing.

## Features

- **CoS Registration** — generates 14 D-flow files + 4 CSS messages
- **Energisation / De-energisation** — generates 4 D-flow files + 2 CSS messages
- Files written directly to a folder you choose (no ZIP, no Windows security warnings)
- Fully offline — no server, no backend, no internet required

## Supported Flows

| Flow | Description |
|------|-------------|
| D0260 | Market Domain Data request |
| D0217 | Supplier Nomination Notification (×3: MOB, DC, DA) |
| D0011 | Standing Data Amendment (MOP, DC, DA variants) |
| D0149 | Meter Readings |
| D0150 | Estimated Annual Consumption |
| D0052 | Meter Technical Details |
| D0010 | Market Domain Data |
| D0086 | Profile Class Amendment |
| D0012 | Meter Reading Instruction |
| D0019 | Validated Meter Reading |
| D0142 | Energisation / De-energisation Request |
| CSS02300_01 | CoS Initiation Request |
| CSS02380_01 | Registration Notification |
| CSS02370_01 | CSS Query |
| CSS02370_03 | CSS Query Response |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+

### Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

### Build for offline use

```bash
npm run build
```

Open `dist/index.html` directly in Chrome or Edge — no server needed.

## Usage

1. Select **Electricity** from the left panel
2. Select a **Business Process** (CoS Registration or Energisation)
3. Fill in the form fields
4. Click **Generate Files**
5. Click **Save Files** — a folder picker opens, files are written directly (no download prompt)

## Project Structure

```
src/
├── shared/
│   ├── domain/          # Core TypeScript types
│   ├── rendering/       # D-flow pipe-delimited renderer
│   └── downloads/       # File System Access API writer
├── utilities/
│   └── electricity/
│       ├── dflows/      # Typed builders per D-flow (D0010, D0011 …)
│       ├── css/         # CSS message builders
│       └── processes/   # Process orchestrators + form configs
└── ui/                  # Form renderer and app controller
```

## Tech Stack

- TypeScript + Vite
- JSZip (fallback ZIP download for non-Chrome browsers)
