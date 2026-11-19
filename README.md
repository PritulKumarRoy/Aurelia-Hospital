# Aurelia Private Hospital

A full-stack private hospital web application built with React, Vite, Tailwind CSS, Framer Motion (`motion/react`), and a single-process Node.js / Express backend.

## Architecture

- `server.js` — Single Express entrypoint serving `/api/*` endpoints and static assets from `client/dist`.
- `client/` — React + TypeScript + Vite frontend application.
- `client/dist/` — Production build output served by `server.js`.

## Local Development

```bash
npm install
cd client && npm install && cd ..
npm run dev
```

## Deploy to Hostinger

1. Install dependencies and build the React client:
   ```bash
   npm install && npm run build
   ```
2. Create a `.env` file in the project root based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Ensure `PORT` (for example `PORT=3000`) and any custom clinic settings are configured in `.env` or your Hostinger Node.js environment variables panel.
3. Start the production server:
   ```bash
   node server.js
   ```
   Verify health at `GET /api/health`, which returns `{ "ok": true }`.
