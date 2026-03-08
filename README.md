# PortfolioWriter

PortfolioWriter is a macOS-focused desktop app scaffold for generating polished case-study portfolio drafts from design sources (Figma first, Adobe XD planned) and preparing a Squarespace-ready draft you can paste manually.

## What this scaffold includes

- **Electron desktop shell** (main process + renderer + preload bridge)
- **Project import pipeline**
  - Figma import from either API URL (optional token) or local/pasted JSON (key-free)
  - Board/frame selection workflow
  - Adobe XD JSON importer scaffold
- **Style profiling**
  - Optional portfolio URL ingestion to infer tone, structure, and vocabulary patterns
- **Portfolio draft generation**
  - Structured case-study sections
  - Image slots mapped to selected frames
- **Squarespace-ready export**
  - Produces a complete copy/paste draft block with title and suggested slug

## Important note on writing quality

This project is designed to help users create authentic, high-quality drafts in their own style. It intentionally avoids deceptive behavior and encourages final human editing/review before publishing.

## Quick start

```bash
npm install
npm run dev
```

## Environment variables

Create `.env` (all optional):

```bash
# Optional: only needed if you import from a live Figma URL.
FIGMA_ACCESS_TOKEN=your_figma_token
```

No paid API keys are required for draft generation or Squarespace export in this scaffold.

## Initial architecture

- `src/main` Electron app lifecycle + IPC routing
- `src/renderer` minimal UI and app state
- `src/services` business logic (style profile, writing, export)
- `src/integrations` design file ingestion
- `src/shared` shared contracts and validation

## Next implementation milestones

1. Build interactive artboard picker with thumbnails
2. Improve generated section variety and stronger editing cues
3. Add one-click clipboard export + markdown/html formatting options
4. Add local project storage and versioning
