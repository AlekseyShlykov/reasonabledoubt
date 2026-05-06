export const TOTAL_ROUNDS = 5;
export const CASE_POOL_MAX = 9;

export interface SessionData {
  sessionId: string;
  locale: string;
  /** Canonical case ids from JSON (1–CASE_POOL_MAX), length TOTAL_ROUNDS */
  caseOrder: number[];
  /** 0 .. TOTAL_ROUNDS — at TOTAL_ROUNDS the session is finished */
  roundIndex: number;
  verdicts: Record<number, boolean | null>;
  caseTimes: Record<number, number>;
  startedAt: number;
}

const SESSION_KEY = 'verdict_session';

export function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function shuffleInPlace<T>(arr: T[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

export function pickRandomCaseOrder(): number[] {
  const pool = Array.from({ length: CASE_POOL_MAX }, (_, i) => i + 1);
  shuffleInPlace(pool);
  return pool.slice(0, TOTAL_ROUNDS);
}

export function getSession(): SessionData | null {
  if (typeof window === 'undefined') return null;

  const stored = localStorage.getItem(SESSION_KEY);
  if (!stored) return null;

  try {
    const parsed = JSON.parse(stored) as SessionData;
    if (!parsed.caseOrder || parsed.caseOrder.length !== TOTAL_ROUNDS) {
      return null;
    }
    // If session was created on an older build, it may reference case ids
    // outside the current pool. Treat as invalid and start a new session.
    if (
      !parsed.caseOrder.every(
        (id) => typeof id === 'number' && Number.isFinite(id) && id >= 1 && id <= CASE_POOL_MAX
      )
    ) {
      return null;
    }
    if (typeof parsed.roundIndex !== 'number') {
      return null;
    }
    if (parsed.roundIndex < 0 || parsed.roundIndex > TOTAL_ROUNDS) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function createSession(locale: string): SessionData {
  const session: SessionData = {
    sessionId: generateSessionId(),
    locale,
    caseOrder: pickRandomCaseOrder(),
    roundIndex: 0,
    verdicts: {},
    caseTimes: {},
    startedAt: Date.now(),
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  return session;
}

export function updateSession(updates: Partial<SessionData>): SessionData | null {
  const session = getSession();
  if (!session) return null;

  const updated = { ...session, ...updates };

  if (typeof window !== 'undefined') {
    localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
  }

  return updated;
}

export function clearSession(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_KEY);
  }
}

export function setVerdict(caseNumber: number, verdict: boolean, timeMs: number): void {
  const session = getSession();
  if (!session) return;

  session.verdicts[caseNumber] = verdict;
  session.caseTimes[caseNumber] = timeMs;

  updateSession(session);
}

export function advanceRound(): SessionData | null {
  const session = getSession();
  if (!session) return null;

  session.roundIndex += 1;
  updateSession(session);
  return session;
}

export function getVerdicts(): Record<number, boolean | null> {
  const session = getSession();
  return session?.verdicts || {};
}
