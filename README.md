# Hagbad V3 — Community Finance Demo

> Simulated demonstration for Cilariti Consulting Services. No real money moves.

## Run locally
    npm install
    npm run dev

Open http://localhost:5173 — sign in with any phone number, any 6-digit OTP.

## Deploy to Netlify
- Git: connect repo, build `npm run build`, publish `dist` (netlify.toml handles the rest).
- CLI: `netlify deploy --prod --dir=dist`
- Drag & drop: build, then drop `dist/` at app.netlify.com/drop.

Reset data: Settings -> Reset demo data.
