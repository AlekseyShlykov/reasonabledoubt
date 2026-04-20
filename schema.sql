-- Supabase Database Schema for Reasonable Doubt
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS verdict_sessions (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  locale TEXT NOT NULL,
  
  -- Case verdicts (boolean: true = Guilty, false = Not Guilty, NULL = not answered)
  case1_verdict BOOLEAN,
  case2_verdict BOOLEAN,
  case3_verdict BOOLEAN,
  case4_verdict BOOLEAN,
  case5_verdict BOOLEAN,
  case6_verdict BOOLEAN,
  case7_verdict BOOLEAN,
  case8_verdict BOOLEAN,
  case9_verdict BOOLEAN,
  case10_verdict BOOLEAN,
  
  -- Time taken for each case (in milliseconds)
  case1_time_ms INTEGER,
  case2_time_ms INTEGER,
  case3_time_ms INTEGER,
  case4_time_ms INTEGER,
  case5_time_ms INTEGER,
  case6_time_ms INTEGER,
  case7_time_ms INTEGER,
  case8_time_ms INTEGER,
  case9_time_ms INTEGER,
  case10_time_ms INTEGER,
  
  -- Completion status
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  user_agent TEXT
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_verdict_sessions_completed ON verdict_sessions(completed);
CREATE INDEX IF NOT EXISTS idx_verdict_sessions_created_at ON verdict_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_verdict_sessions_locale ON verdict_sessions(locale);

-- Enable Row Level Security (optional, adjust as needed)
ALTER TABLE verdict_sessions ENABLE ROW LEVEL SECURITY;

-- Policy to allow all operations (adjust based on your security needs)
-- For public read/write (adjust in production):
CREATE POLICY "Allow all operations" ON verdict_sessions
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Or for more restricted access:
-- CREATE POLICY "Allow insert" ON verdict_sessions
--   FOR INSERT
--   WITH CHECK (true);
--
-- CREATE POLICY "Allow select" ON verdict_sessions
--   FOR SELECT
--   USING (true);

