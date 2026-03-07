# PortfolioWriter

PortfolioWriter is a macOS-focused desktop app scaffold for generating polished case-study portfolio drafts from design sources (Figma first, Adobe XD planned) and optionally publishing to Squarespace.

## What this scaffold includes

- **Electron desktop shell** (main process + renderer + preload bridge)
- **Project import pipeline**
  - Figma file link ingestion (API-backed)
  - Board/frame selection workflow
  - Adobe XD importer placeholder with implementation plan
- **Style profiling**
  - Optional portfolio URL ingestion to infer tone, structure, and vocabulary patterns
- **Portfolio draft generation**
  - Structured case-study sections
  - Image slots mapped to selected frames
- **Squarespace publishing client**
  - API client scaffold for posting generated content

## Important note on writing quality

This project is designed to help users create authentic, high-quality drafts in their own style. It intentionally avoids deceptive behavior and encourages final human editing/review before publishing.

## Quick start

```bash
npm install
npm run dev
```

## Environment variables

Create `.env`:

```bash
FIGMA_ACCESS_TOKEN=your_figma_token
OPENAI_API_KEY=your_model_provider_key
SQUARESPACE_API_KEY=your_squarespace_api_key
SQUARESPACE_SITE_ID=your_site_id
```

## Initial architecture

- `src/main` Electron app lifecycle + IPC routing
- `src/renderer` minimal UI and app state
- `src/services` business logic (style profile, writing, publishing)
- `src/integrations` design file ingestion
- `src/shared` shared contracts and validation

## Next implementation milestones

1. Implement robust Adobe XD parser/import (or cloud API bridge)
2. Build interactive artboard picker with thumbnails
3. Add real LLM-backed generation with review controls
4. Add authenticated Squarespace page insertion flow
5. Add local project storage and versioning
