# Reasonable Doubt

A narrative game exploring AI predictions and human judgment. Players are presented with ten cases where an AI system has predicted harmful behavior with >99% probability. The player must decide: Guilty, or Not Guilty?

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
ADMIN_PASSWORD=your_secure_admin_password
```

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
    /cases/page.tsx          # Main gameplay (10 cases)
    /results/page.tsx        # Final results screen
    /admin/page.tsx          # Admin panel
    /api/admin/check         # Admin authentication API
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
3. **Cases Screen** (`/cases`) - Main gameplay with 10 cases
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

Access at `/admin` with the password set in `ADMIN_PASSWORD` environment variable.

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

# Build for production
npm run build

# Start production server
npm start

# Lint
npm run lint
```

## License

Created by Alex Shlykov

