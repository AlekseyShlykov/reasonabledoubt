'use client';

import { useEffect, useState } from 'react';
import { loadTranslations, getStoredLocale, t } from '@/lib/i18n';
import { getAllSessions, getCaseStatistics, type VerdictSession } from '@/lib/supabase';

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [sessions, setSessions] = useState<VerdictSession[]>([]);
  const [stats, setStats] = useState<Record<number, { guilty: number; notGuilty: number }>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const locale = getStoredLocale();
    loadTranslations(locale);
  }, []);

  const handleLogin = () => {
    const expected =
      (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_ADMIN_PASSWORD) || '';
    if (!expected) {
      alert(t('admin.notConfigured'));
      return;
    }
    if (password === expected) {
      setAuthenticated(true);
      loadData();
    } else {
      alert(t('admin.invalidPassword'));
    }
  };

  const loadData = async () => {
    setLoading(true);
    const [allSessions, caseStats] = await Promise.all([
      getAllSessions(),
      getCaseStatistics(),
    ]);
    setSessions(allSessions);
    setStats(caseStats);
    setLoading(false);
  };

  const exportCSV = () => {
    const headers = [
      'ID',
      'Created At',
      'Locale',
      'Case 1',
      'Case 2',
      'Case 3',
      'Case 4',
      'Case 5',
      'Case 6',
      'Case 7',
      'Case 8',
      'Case 9',
      'Case 10',
      'Completed',
      'Completed At',
    ];

    const rows = sessions.map((session) => [
      session.id,
      session.created_at,
      session.locale,
      session.case1_verdict !== null && session.case1_verdict !== undefined
        ? session.case1_verdict
          ? 'Guilty'
          : 'Not Guilty'
        : '',
      session.case2_verdict !== null && session.case2_verdict !== undefined
        ? session.case2_verdict
          ? 'Guilty'
          : 'Not Guilty'
        : '',
      session.case3_verdict !== null && session.case3_verdict !== undefined
        ? session.case3_verdict
          ? 'Guilty'
          : 'Not Guilty'
        : '',
      session.case4_verdict !== null && session.case4_verdict !== undefined
        ? session.case4_verdict
          ? 'Guilty'
          : 'Not Guilty'
        : '',
      session.case5_verdict !== null && session.case5_verdict !== undefined
        ? session.case5_verdict
          ? 'Guilty'
          : 'Not Guilty'
        : '',
      session.case6_verdict !== null && session.case6_verdict !== undefined
        ? session.case6_verdict
          ? 'Guilty'
          : 'Not Guilty'
        : '',
      session.case7_verdict !== null && session.case7_verdict !== undefined
        ? session.case7_verdict
          ? 'Guilty'
          : 'Not Guilty'
        : '',
      session.case8_verdict !== null && session.case8_verdict !== undefined
        ? session.case8_verdict
          ? 'Guilty'
          : 'Not Guilty'
        : '',
      session.case9_verdict !== null && session.case9_verdict !== undefined
        ? session.case9_verdict
          ? 'Guilty'
          : 'Not Guilty'
        : '',
      session.case10_verdict !== null && session.case10_verdict !== undefined
        ? session.case10_verdict
          ? 'Guilty'
          : 'Not Guilty'
        : '',
      session.completed ? 'Yes' : 'No',
      session.completed_at || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `verdict_sessions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="bg-surface border border-bg-border p-8 max-w-md w-full">
          <h1 className="text-2xl font-mono cyan-text mb-6">{t('admin.title')}</h1>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">{t('admin.password')}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full px-4 py-2 bg-dark-bg border border-bg-border text-white font-mono focus:outline-none focus:border-cyan"
              />
            </div>
            <button
              onClick={handleLogin}
              className="w-full px-4 py-2 border border-cyan cyan-text font-mono hover:bg-cyan hover:text-dark-bg transition-colors"
            >
              {t('admin.submit')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const completedSessions = sessions.filter((s) => s.completed);

  return (
    <div className="min-h-screen bg-dark-bg p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-mono cyan-light-text">{t('admin.title')}</h1>
          <button
            onClick={exportCSV}
            className="px-4 py-2 border border-cyan cyan-text font-mono hover:bg-cyan hover:text-dark-bg transition-colors"
          >
            {t('admin.exportCSV')}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-surface border border-bg-border p-4">
            <div className="text-sm text-gray-400 mb-1">{t('admin.totalSessions')}</div>
            <div className="text-2xl font-mono cyan-text">{sessions.length}</div>
          </div>
          <div className="bg-surface border border-bg-border p-4">
            <div className="text-sm text-gray-400 mb-1">{t('admin.completedSessions')}</div>
            <div className="text-2xl font-mono cyan-text">{completedSessions.length}</div>
          </div>
        </div>

        <div className="bg-surface border border-bg-border p-6">
          <h2 className="text-xl font-mono cyan-text mb-4">{t('admin.case')} Statistics</h2>
          <div className="grid grid-cols-5 gap-4">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((caseNum) => {
              const caseStats = stats[caseNum] || { guilty: 0, notGuilty: 0 };
              const total = caseStats.guilty + caseStats.notGuilty;
              const guiltyPercent = total > 0 ? (caseStats.guilty / total) * 100 : 0;
              const notGuiltyPercent = total > 0 ? (caseStats.notGuilty / total) * 100 : 0;

              return (
                <div key={caseNum} className="border border-bg-border p-3">
                  <div className="text-sm font-mono cyan-text mb-2">Case {caseNum}</div>
                  {total > 0 ? (
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-red-400">{t('admin.guilty')}</span>
                        <span>{guiltyPercent.toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-400">{t('admin.notGuilty')}</span>
                        <span>{notGuiltyPercent.toFixed(0)}%</span>
                      </div>
                      <div className="text-gray-500">n={total}</div>
                    </div>
                  ) : (
                    <div className="text-xs text-gray-500">No data</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-surface border border-bg-border p-6">
          <h2 className="text-xl font-mono cyan-text mb-4">{t('admin.sessions')}</h2>
          {loading ? (
            <div className="text-cyan font-mono">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-mono">
                <thead>
                  <tr className="border-b border-bg-border">
                    <th className="text-left p-2 text-gray-400">{t('admin.id')}</th>
                    <th className="text-left p-2 text-gray-400">{t('admin.createdAt')}</th>
                    <th className="text-left p-2 text-gray-400">{t('admin.locale')}</th>
                    <th className="text-left p-2 text-gray-400">{t('admin.completed')}</th>
                    <th className="text-left p-2 text-gray-400">{t('admin.completedAt')}</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((session) => (
                    <tr key={session.id} className="border-b border-bg-border">
                      <td className="p-2 text-gray-300">{session.id.substring(0, 8)}...</td>
                      <td className="p-2 text-gray-300">
                        {new Date(session.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-2 text-gray-300">{session.locale}</td>
                      <td className="p-2">
                        {session.completed ? (
                          <span className="text-green-400">Yes</span>
                        ) : (
                          <span className="text-gray-500">No</span>
                        )}
                      </td>
                      <td className="p-2 text-gray-300">
                        {session.completed_at
                          ? new Date(session.completed_at).toLocaleDateString()
                          : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

