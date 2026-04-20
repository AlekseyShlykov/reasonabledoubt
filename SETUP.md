# Quick Setup Guide

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to initialize
3. Go to SQL Editor
4. Copy and paste the contents of `schema.sql`
5. Run the SQL to create the table

### 3. Get Supabase Credentials

1. In Supabase dashboard, go to Settings → API
2. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4. Create Environment File

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
ADMIN_PASSWORD=choose-a-secure-password
```

### 5. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Testing

1. **Home Page** (`/`) - Should show title and start button
2. **Intro** (`/intro`) - Typewriter effect should play
3. **Cases** (`/cases`) - Should load case 1 with 2x2 grid
4. **Results** (`/results`) - Should show after completing 10 cases
5. **Admin** (`/admin`) - Login with `ADMIN_PASSWORD` to view analytics

## Troubleshooting

### "Cannot find module" errors
- Run `npm install` first
- Make sure you're in the project root directory

### Supabase connection errors
- Verify your `.env.local` file has correct values
- Check that the table was created (go to Table Editor in Supabase)
- Ensure RLS policies allow inserts/selects (see schema.sql)

### TypeScript errors
- These should resolve after `npm install`
- If they persist, try deleting `node_modules` and `.next`, then reinstall

## Production Build

```bash
npm run build
npm start
```

## Notes

- All user-visible text is in JSON files under `/public/data`
- Session data is stored in both localStorage and Supabase
- Admin panel requires the password from `ADMIN_PASSWORD` env variable
- The game supports English and Russian languages

