# Noggin — Dev Environment

## Project Overview
Noggin is a React + Vite frontend for an adaptive learning platform targeting neurodivergent students. It includes educational games, an adaptive engine, telemetry tracking, and a client-side AI generator.

## Non-obvious Setup Quirks
- **package.json lives in `docs/`, not root.** Vite (`vite.config.js`) and `index.html` are at repo root, but `package.json`, `package-lock.json`, and `postcss.config.js` are in `docs/`. The compose startup copies them to root so Vite can find them.
- **No Supabase at runtime.** The frontend source (`src/`) has zero Supabase imports or env var references. `supabase/.env.example` exists but is unused by the running app. No external credentials are needed to boot.
- **Python backend is optional.** `python/server.py` (Noggimigo AI tutor) runs over WebSockets but the frontend has a `ClientAIGenerator` that works in-browser without it. Not started by compose.

## Running the App
```bash
docker compose -f docker-compose.base44.yml up -d
```
- Vite dev server runs on port 5173 inside the container, mapped to host port 3000.
- `node_modules` is in a named Docker volume (`node_modules`) to persist across restarts.
- Healthcheck: `GET /` on port 5173 inside the container.

## Verification
- `curl http://localhost:3000/` returns the Vite-served HTML with `/src/main.jsx`.
- Container shows `healthy` status after ~30s startup.
