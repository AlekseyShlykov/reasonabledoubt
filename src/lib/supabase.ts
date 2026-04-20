import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Only create client if we have valid credentials
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface VerdictSession {
  id: string;
  created_at: string;
  locale: string;
  case1_verdict?: boolean;
  case2_verdict?: boolean;
  case3_verdict?: boolean;
  case4_verdict?: boolean;
  case5_verdict?: boolean;
  case6_verdict?: boolean;
  case7_verdict?: boolean;
  case8_verdict?: boolean;
  case9_verdict?: boolean;
  case10_verdict?: boolean;
  case1_time_ms?: number;
  case2_time_ms?: number;
  case3_time_ms?: number;
  case4_time_ms?: number;
  case5_time_ms?: number;
  case6_time_ms?: number;
  case7_time_ms?: number;
  case8_time_ms?: number;
  case9_time_ms?: number;
  case10_time_ms?: number;
  completed: boolean;
  completed_at?: string;
  user_agent?: string;
}

export async function createOrUpdateSession(
  sessionId: string,
  locale: string,
  userAgent?: string
): Promise<void> {
  if (!supabase) {
    console.warn('Supabase not configured, skipping session creation');
    return;
  }
  
  try {
    const { data: existing } = await supabase
      .from('verdict_sessions')
      .select('id')
      .eq('id', sessionId)
      .single();

    if (!existing) {
      await supabase.from('verdict_sessions').insert({
        id: sessionId,
        locale,
        user_agent: userAgent,
        completed: false,
      });
    }
  } catch (error) {
    console.error('Error creating/updating session:', error);
  }
}

/** Round position in the current playthrough (1–5), maps to case1_* … case5_* columns. */
export async function updateVerdict(
  sessionId: string,
  roundNumber: number,
  verdict: boolean,
  timeMs: number
): Promise<void> {
  if (!supabase) {
    console.warn('Supabase not configured, skipping verdict update');
    return;
  }

  if (roundNumber < 1 || roundNumber > 5) {
    console.warn('updateVerdict: roundNumber must be 1–5');
    return;
  }

  try {
    const caseKey = `case${roundNumber}_verdict` as keyof VerdictSession;
    const timeKey = `case${roundNumber}_time_ms` as keyof VerdictSession;

    await supabase
      .from('verdict_sessions')
      .update({
        [caseKey]: verdict,
        [timeKey]: timeMs,
      })
      .eq('id', sessionId);
  } catch (error) {
    console.error('Error updating verdict:', error);
  }
}

export async function recordCaseVote(
  caseId: number,
  verdict: boolean,
  sessionId: string
): Promise<void> {
  if (!supabase) {
    console.warn('Supabase not configured, skipping case vote');
    return;
  }

  try {
    await supabase.from('case_votes').insert({
      case_id: caseId,
      verdict,
      session_id: sessionId,
    });
  } catch (error) {
    console.error('Error recording case vote:', error);
  }
}

export async function getCaseVoteStats(
  caseId: number
): Promise<{ guilty: number; notGuilty: number }> {
  if (!supabase) {
    return { guilty: 0, notGuilty: 0 };
  }

  try {
    const { data, error } = await supabase
      .from('case_votes')
      .select('verdict')
      .eq('case_id', caseId);

    if (error || !data) {
      return { guilty: 0, notGuilty: 0 };
    }

    let guilty = 0;
    let notGuilty = 0;
    data.forEach((row: { verdict: boolean }) => {
      if (row.verdict) guilty += 1;
      else notGuilty += 1;
    });
    return { guilty, notGuilty };
  } catch (error) {
    console.error('Error fetching case vote stats:', error);
    return { guilty: 0, notGuilty: 0 };
  }
}

export async function markCompleted(sessionId: string): Promise<void> {
  if (!supabase) {
    console.warn('Supabase not configured, skipping completion mark');
    return;
  }
  
  try {
    await supabase
      .from('verdict_sessions')
      .update({
        completed: true,
        completed_at: new Date().toISOString(),
      })
      .eq('id', sessionId);
  } catch (error) {
    console.error('Error marking completed:', error);
  }
}

export async function getAllSessions(): Promise<VerdictSession[]> {
  if (!supabase) {
    console.warn('Supabase not configured, returning empty sessions');
    return [];
  }
  
  try {
    const { data, error } = await supabase
      .from('verdict_sessions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching sessions:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return [];
  }
}

export async function getCompletedSessions(): Promise<VerdictSession[]> {
  if (!supabase) {
    console.warn('Supabase not configured, returning empty sessions');
    return [];
  }
  
  try {
    const { data, error } = await supabase
      .from('verdict_sessions')
      .select('*')
      .eq('completed', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching completed sessions:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching completed sessions:', error);
    return [];
  }
}

function emptyCaseStats(): Record<number, { guilty: number; notGuilty: number }> {
  const stats: Record<number, { guilty: number; notGuilty: number }> = {};
  for (let i = 1; i <= 10; i++) {
    stats[i] = { guilty: 0, notGuilty: 0 };
  }
  return stats;
}

const CASE_VOTES_PAGE = 1000;

/** Fetches all rows from case_votes (paginated; PostgREST caps single responses). */
export async function getCaseStatisticsDetailed(): Promise<{
  stats: Record<number, { guilty: number; notGuilty: number }>;
  loadError: string | null;
}> {
  const stats = emptyCaseStats();

  if (!supabase) {
    return { stats, loadError: null };
  }

  try {
    const rows: { case_id: number; verdict: boolean }[] = [];
    let from = 0;

    for (;;) {
      const { data, error } = await supabase
        .from('case_votes')
        .select('case_id, verdict')
        .range(from, from + CASE_VOTES_PAGE - 1);

      if (error) {
        console.error('Error fetching case_votes:', error);
        return { stats, loadError: error.message };
      }

      if (!data?.length) break;

      rows.push(...(data as { case_id: number; verdict: boolean }[]));

      if (data.length < CASE_VOTES_PAGE) break;
      from += CASE_VOTES_PAGE;
    }

    rows.forEach((row) => {
      const id = row.case_id;
      if (id < 1 || id > 10) return;
      if (row.verdict) stats[id].guilty += 1;
      else stats[id].notGuilty += 1;
    });

    return { stats, loadError: null };
  } catch (error) {
    console.error('Error aggregating case statistics:', error);
    return {
      stats,
      loadError: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/** Community stats per canonical case id (1–10) from aggregate votes. */
export async function getCaseStatistics(): Promise<Record<number, { guilty: number; notGuilty: number }>> {
  const { stats } = await getCaseStatisticsDetailed();
  return stats;
}

