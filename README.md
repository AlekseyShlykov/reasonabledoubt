# Reasonable Doubt

A narrative game exploring AI predictions and human judgment. Players get **five random cases** (from ten) where an AI system has predicted harmful behavior with >99% probability. The player must decide: Guilty, or Not Guilty?

## GitHub Pages

GitHub shows **README** at the repo root until you deploy a **built site**. This app uses **Next.js static export** (`out/`). Do this once:

1. **Settings → Pages → Build and deployment → Source:** choose **GitHub Actions** (not “Deploy from a branch” on `main` alone).
2. Push the workflow **`.github/workflows/deploy-pages.yml`** (included in this repo). It runs on every push to `main`.
3. **Settings → Secrets and variables → Actions** — add repository secrets used at build time:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Optional: `NEXT_PUBLIC_ADMIN_PASSWORD` (client-visible; only for the toy admin screen on static hosting)
4. Wait for the green **Deploy to GitHub Pages** workflow, then open the **environment URL** (e.g. `https://<user>.github.io/<repo>/`).

The workflow **fails the build** if `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` is missing, so you do not publish a site where community percentages are stuck at zero because the client was built without Supabase.

**Project site** (`…github.io/<repo>/`): the workflow sets `NEXT_PUBLIC_BASE_PATH=/<repo>` automatically.

**User site** (repo named `<user>.github.io`): the workflow leaves the base path empty (site at domain root).

Local static build: `npm run build` → open `out/index.html` via a static server, or use `NEXT_PUBLIC_BASE_PATH=/YourRepo npm run build` to match GitHub.

## Tech Stack

- **Next.js 14** (App Router) + TypeScript
- **TailwindCSS** for styling
- **Supabase** (PostgreSQL) for data storage
- Custom lightweight i18n system
- LocalStorage for session management

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
# Static export / GitHub Pages: admin check runs in the browser (build-time env)
NEXT_PUBLIC_ADMIN_PASSWORD=your_admin_password
```

For **local `next dev`**, you can keep using `NEXT_PUBLIC_ADMIN_PASSWORD` for `/admin`, or leave it unset (admin shows “not configured”).

### 3. Database Setup

Run the following SQL in your Supabase SQL editor to create the required table:

```sql
-- See schema.sql file for the complete schema
```

Or use the schema provided in `schema.sql`.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
/src
  /app
    /page.tsx                # Screen 1: Title + Start
    /intro/page.tsx          # Screen 2: Typewriter intro
    /cases/page.tsx          # Main gameplay (5 random cases)
    /results/page.tsx        # Final results screen
    /admin/page.tsx          # Admin panel (password from NEXT_PUBLIC_ADMIN_PASSWORD on static builds)
  /components
    Header.tsx               # Persistent header with progress
    Footer.tsx                # Footer with creator info
    Typewriter.tsx           # Character-by-character typing effect
    CaseGrid.tsx             # 2x2 grid layout for case display
    MetricCard.tsx           # Coefficient visualization
    CoefTrend.tsx            # Trend indicators
    AIPrediction.tsx         # AI prediction display
    AIAnalysisViz.tsx        # Factor contribution visualization
    VerdictButtons.tsx       # Guilty/Not Guilty buttons
    ProgressDots.tsx         # Case progress indicators
    LanguageSwitch.tsx       # EN/RU language toggle
  /lib
    i18n.ts                  # JSON loader + t() helper
    storage.ts               # localStorage helpers
    supabase.ts              # Supabase client & functions
    data.ts                  # Case content & logic loaders
  /styles
    globals.css              # Global styles & Tailwind
/public
  /data
    /locales
      en/common.json         # UI text (English)
      ru/common.json         # UI text (Russian)
    /cases
      en/cases.json          # Case narratives (English)
      ru/cases.json          # Case narratives (Russian)
    /logic
      cases_logic.json       # Numbers, coefficients, graphs
```

## Features

### User Flow

1. **Title Screen** (`/`) - Start game, language selection
2. **Intro Screen** (`/intro`) - Typewriter effect with game introduction
3. **Cases Screen** (`/cases`) - Main gameplay with 5 random cases per run
4. **Results Screen** (`/results`) - Community statistics and personal decisions
5. **Admin Panel** (`/admin`) - Password-protected analytics and CSV export

### Data Storage

- **LocalStorage**: Session data, progress, verdicts
- **Supabase**: All player sessions, verdicts, completion status
- **Database Schema**: One row per player session with columns for each case verdict

### Localization

All user-visible text is stored in JSON files:
- `common.json` - UI labels, buttons, headers
- `cases.json` - Case narratives (per language)
- `cases_logic.json` - Numbers and coefficients (language-independent)

## Admin Panel

Access at `/admin`. On **static hosting**, set **`NEXT_PUBLIC_ADMIN_PASSWORD`** at build time (same value as in GitHub Actions secrets if you use the deploy workflow). This is exposed in the client bundle — use only for a simple personal admin, not production secrets.

Features:
- View all sessions
- Case-by-case statistics (% Guilty vs % Not Guilty)
- CSV export of all session data
- Filter by completion status

## Visual Style

- Dark background (#0b0f14)
- Cold cyan/blue accents (#00b8d4, #00d9ff)
- Monospace fonts for data and intro
- Minimal, sterile, system-like interface
- Thin borders and grid layouts

## Development

```bash
# Development server
npm run dev

# Production build (static files in ./out — for GitHub Pages, etc.)
npm run build

# Clean broken .next cache then dev (fixes 404 on main.js / fallback chunks)
npm run dev:clean

# Start Node production server (optional; GitHub Pages serves ./out as static files instead)
npm start

# Lint
npm run lint
```

## License

Created by Alex Shlykov

