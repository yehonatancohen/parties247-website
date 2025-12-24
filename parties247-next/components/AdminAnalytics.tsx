import React, { useEffect, useMemo, useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { getAnalyticsSummary } from '../src/services/api';
import { AnalyticsSummary } from '../../types';

const formatRelativeTime = (date: Date | null): string => {
  if (!date) {
    return 'טרם רוענן';
  }

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.round(diffMs / 60000);

  if (diffMinutes < 1) {
    return 'עודכן הרגע';
  }
  if (diffMinutes < 60) {
    return `עודכן לפני ${diffMinutes} דק'`;
  }
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) {
    return `עודכן לפני ${diffHours} שעות`;
  }
  const diffDays = Math.round(diffHours / 24);
  return `עודכן לפני ${diffDays} ימים`;
};

const AdminAnalytics: React.FC = () => {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchSummary = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAnalyticsSummary();
      setSummary(data);
      const generated = new Date(data.generatedAt);
      setLastUpdated(Number.isNaN(generated.getTime()) ? new Date() : generated);
    } catch (err) {
      console.error('Failed to load analytics summary', err);
      setError(err instanceof Error ? err.message : 'אירעה שגיאה בעת טעינת הנתונים');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary().catch(() => {
      // The error is already handled in fetchSummary
    });
  }, []);

  const generatedAtDate = useMemo(() => {
    if (!summary) {
      return null;
    }
    const parsed = new Date(summary.generatedAt);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }, [summary]);

  const totals = useMemo(() => {
    if (!summary) {
      return { views: 0, redirects: 0 };
    }
    return summary.parties.reduce(
      (acc, party) => ({
        views: acc.views + party.views,
        redirects: acc.redirects + party.redirects,
      }),
      { views: 0, redirects: 0 },
    );
  }, [summary]);

  const partiesByViews = useMemo(() => {
    if (!summary) {
      return [] as typeof summary.parties;
    }
    return [...summary.parties].sort((a, b) => b.views - a.views);
  }, [summary]);

  const topRedirects = useMemo(() => {
    if (!summary) {
      return [] as typeof summary.parties;
    }
    return [...summary.parties].sort((a, b) => b.redirects - a.redirects).slice(0, 5);
  }, [summary]);

  const topConversions = useMemo(() => {
    if (!summary) {
      return [] as Array<AnalyticsSummary['parties'][number] & { conversion: number }>;
    }
    return summary.parties
      .filter((party) => party.views > 0)
      .map((party) => ({ ...party, conversion: party.redirects / party.views }))
      .sort((a, b) => b.conversion - a.conversion)
      .slice(0, 5);
  }, [summary]);

  const bestConversion = topConversions.length > 0 ? topConversions[0] : null;

  const formatPartyDate = (isoDate: string): string => {
    if (!isoDate) {
      return '—';
    }
    const parsed = new Date(isoDate);
    if (Number.isNaN(parsed.getTime())) {
      return '—';
    }
    return new Intl.DateTimeFormat('he-IL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(parsed);
  };

  const formatConversion = (views: number, redirects: number): string => {
    if (views === 0) {
      return '—';
    }
    const ratio = Math.round((redirects / views) * 1000) / 10;
    return `${ratio}%`;
  };

  return (
    <div className="bg-jungle-surface/70 border border-wood-brown/40 rounded-2xl shadow-xl p-6 text-white space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-display mb-1">לוח אנליטיקס</h2>
          <p className="text-sm text-jungle-text/70">
            דוח נוצר: {generatedAtDate ? generatedAtDate.toLocaleString('he-IL', { dateStyle: 'short', timeStyle: 'short' }) : '—'} · {formatRelativeTime(lastUpdated)}
          </p>
        </div>
        <button
          type="button"
          onClick={fetchSummary}
          disabled={isLoading}
          className="self-start sm:self-auto inline-flex items-center gap-2 bg-jungle-accent text-jungle-deep font-semibold px-4 py-2 rounded-lg shadow hover:bg-jungle-accent/90 transition disabled:opacity-60"
        >
          {isLoading && <LoadingSpinner />}
          <span>{isLoading ? 'טוען...' : 'רענון נתונים'}</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/40 text-red-200 rounded-lg p-4" role="alert">
          {error}
        </div>
      )}

      {isLoading && !summary ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : null}

      {summary && (
        <div className="space-y-8">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="bg-black/20 border border-white/5 rounded-xl p-4">
              <p className="text-sm text-jungle-text/60">מבקרים ייחודיים (24 שעות)</p>
              <p className="text-3xl font-semibold mt-2">{summary.uniqueVisitors24h.toLocaleString()}</p>
              <p className="text-xs text-jungle-text/50 mt-1">מבוסס על sessionId יחיד</p>
            </div>
            <div className="bg-black/20 border border-white/5 rounded-xl p-4">
              <p className="text-sm text-jungle-text/60">סה"כ צפיות במסיבות</p>
              <p className="text-3xl font-semibold mt-2">{totals.views.toLocaleString()}</p>
              <p className="text-xs text-jungle-text/50 mt-1">{summary.parties.length.toLocaleString()} מסיבות בדוח</p>
            </div>
            <div className="bg-black/20 border border-white/5 rounded-xl p-4">
              <p className="text-sm text-jungle-text/60">סה"כ הפניות לרכישה</p>
              <p className="text-3xl font-semibold mt-2">{totals.redirects.toLocaleString()}</p>
              <p className="text-xs text-jungle-text/50 mt-1">הקלקות על כפתורי "לרכישת כרטיסים"</p>
            </div>
            <div className="bg-black/20 border border-white/5 rounded-xl p-4">
              <p className="text-sm text-jungle-text/60">יחס המרה מוביל</p>
              <p className="text-3xl font-semibold mt-2">
                {bestConversion ? formatConversion(bestConversion.views, bestConversion.redirects) : '—'}
              </p>
              <p className="text-xs text-jungle-text/50 mt-1">
                {bestConversion
                  ? `${bestConversion.name} · ${bestConversion.redirects.toLocaleString()} מתוך ${bestConversion.views.toLocaleString()}`
                  : 'אין מספיק נתונים'}
              </p>
            </div>
          </div>

          <div className="bg-black/20 border border-white/5 rounded-xl p-5">
            <h3 className="text-xl font-display mb-4">דירוג מסיבות לפי צפיות</h3>
            {partiesByViews.length === 0 ? (
              <p className="text-sm text-jungle-text/60">לא נמצאו מסיבות בדוח הנוכחי.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead className="text-xs uppercase text-jungle-text/60">
                    <tr>
                      <th className="pb-2 pr-2 text-right">#</th>
                      <th className="pb-2 pr-2">מסיבה</th>
                      <th className="pb-2 pr-2">תאריך</th>
                      <th className="pb-2 pr-2 text-right">צפיות</th>
                      <th className="pb-2 pr-2 text-right">הפניות</th>
                      <th className="pb-2 pl-2 text-right">יחס המרה</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-jungle-text/80">
                    {partiesByViews.map((party, index) => (
                      <tr key={`${party.partyId}-${party.slug || index}`} className="border-t border-white/5">
                        <td className="py-3 pr-2 text-right text-xs text-jungle-text/60">{index + 1}</td>
                        <td className="py-3 pr-2">
                          <div className="font-semibold text-white">{party.name}</div>
                          <div className="text-xs text-jungle-text/50 truncate">/{party.slug || party.partyId}</div>
                        </td>
                        <td className="py-3 pr-2">{formatPartyDate(party.date)}</td>
                        <td className="py-3 pr-2 text-right font-mono">{party.views.toLocaleString()}</td>
                        <td className="py-3 pr-2 text-right font-mono">{party.redirects.toLocaleString()}</td>
                        <td className="py-3 pl-2 text-right">{formatConversion(party.views, party.redirects)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="bg-black/20 border border-white/5 rounded-xl p-5">
              <h3 className="text-xl font-display mb-4">המפנים הגדולים</h3>
              {topRedirects.length === 0 ? (
                <p className="text-sm text-jungle-text/60">עדיין אין הקלקות לרכישת כרטיסים.</p>
              ) : (
                <ul className="space-y-3">
                  {topRedirects.map((party, index) => (
                    <li key={`${party.partyId}-${party.slug || index}`} className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-white">{party.name}</p>
                        <p className="text-xs text-jungle-text/60 truncate">/{party.slug || party.partyId}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-mono text-jungle-accent">{party.redirects.toLocaleString()}</p>
                        <p className="text-xs text-jungle-text/60">הפניות · {formatConversion(party.views, party.redirects)}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="bg-black/20 border border-white/5 rounded-xl p-5">
              <h3 className="text-xl font-display mb-4">יחסי המרה מובילים</h3>
              {topConversions.length === 0 ? (
                <p className="text-sm text-jungle-text/60">אין מספיק נתונים לחישוב יחס המרה.</p>
              ) : (
                <ul className="space-y-3">
                  {topConversions.map((party, index) => (
                    <li key={`${party.partyId}-${party.slug || index}`} className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-white">{party.name}</p>
                        <p className="text-xs text-jungle-text/60 truncate">/{party.slug || party.partyId}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-mono text-jungle-accent">{formatConversion(party.views, party.redirects)}</p>
                        <p className="text-xs text-jungle-text/60">{party.redirects.toLocaleString()} מתוך {party.views.toLocaleString()}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAnalytics;
