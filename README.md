# AV Dashboard v2

Democracy Intelligence — Strategic Analysis Platform (Africa)

Rebuilt as a **Vite + React** app, ready for Vercel deployment.

## Local Development

```bash
npm install
npm run dev
```

## Deploy to Vercel

### Option A — Vercel CLI
```bash
npm install -g vercel
vercel
```

### Option B — GitHub → Vercel (recommended)
1. Push this folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → **Add New Project**
3. Import your GitHub repo
4. Vercel auto-detects Vite — just click **Deploy**

No extra config needed. `vercel.json` handles SPA routing.

## Build

```bash
npm run build   # outputs to /dist
npm run preview # preview the production build locally
```

## Stack
- React 18
- Vite 5
- DM Mono + Syne fonts (Google Fonts)
- Pure inline styles — zero CSS-in-JS dependencies
