import React, { useEffect, useMemo, useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { getAnalyticsSummary } from '../services/api';
import { AnalyticsSummary } from '../types';

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
      setLastUpdated(new Date());
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

  const maxPathCount = useMemo(() => {
    if (!summary || summary.topPaths.length === 0) {
      return 1;
    }
    return Math.max(...summary.topPaths.map((path) => path.count));
  }, [summary]);

  const uniqueCategories = useMemo(() => {
    if (!summary) {
      return 0;
    }
    return new Set(summary.actions.map((action) => action.category)).size;
  }, [summary]);

  return (
    <div className="bg-jungle-surface/70 border border-wood-brown/40 rounded-2xl shadow-xl p-6 text-white space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-display mb-1">לוח אנליטיקס</h2>
          <p className="text-sm text-jungle-text/70">
            חלון נתונים אחרון: {summary ? `${summary.windowDays} ימים` : '—'} · {formatRelativeTime(lastUpdated)}
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
              <p className="text-sm text-jungle-text/60">סה"כ אירועים שנמדדו</p>
              <p className="text-3xl font-semibold mt-2">{summary.totalEvents.toLocaleString()}</p>
              <p className="text-xs text-jungle-text/50 mt-1">ב-{summary.windowDays} הימים האחרונים</p>
            </div>
            <div className="bg-black/20 border border-white/5 rounded-xl p-4">
              <p className="text-sm text-jungle-text/60">אירועים עדכניים</p>
              <p className="text-3xl font-semibold mt-2">{summary.recentEvents.toLocaleString()}</p>
              <p className="text-xs text-jungle-text/50 mt-1">זיהוי במקטע הפעילות האחרון</p>
            </div>
            <div className="bg-black/20 border border-white/5 rounded-xl p-4">
              <p className="text-sm text-jungle-text/60">קטגוריות פעילות</p>
              <p className="text-3xl font-semibold mt-2">{uniqueCategories}</p>
              <p className="text-xs text-jungle-text/50 mt-1">מתוך {summary.actions.length} פעולות ייחודיות</p>
            </div>
            <div className="bg-black/20 border border-white/5 rounded-xl p-4">
              <p className="text-sm text-jungle-text/60">נתיבי ניווט מובילים</p>
              <p className="text-3xl font-semibold mt-2">{summary.topPaths.length}</p>
              <p className="text-xs text-jungle-text/50 mt-1">נתיבים מובילים לחוויית משתמש</p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="bg-black/20 border border-white/5 rounded-xl p-5">
              <h3 className="text-xl font-display mb-4">פילוח פעולות לפי קטגוריה</h3>
              {summary.actions.length === 0 ? (
                <p className="text-sm text-jungle-text/60">לא נמצאו נתונים להצגה.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left">
                    <thead className="text-xs uppercase text-jungle-text/60">
                      <tr>
                        <th className="pb-2 pr-2">קטגוריה</th>
                        <th className="pb-2 pr-2">פעולה</th>
                        <th className="pb-2 pr-2 text-right">ספירה</th>
                        <th className="pb-2 pl-2 text-right">אחוז</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-jungle-text/80">
                      {summary.actions.map((action) => {
                        const percentage = Math.round((action.count / summary.totalEvents) * 1000) / 10;
                        return (
                          <tr key={`${action.category}-${action.action}`} className="border-t border-white/5">
                            <td className="py-2 pr-2 font-semibold text-white">{action.category}</td>
                            <td className="py-2 pr-2">{action.action}</td>
                            <td className="py-2 pr-2 text-right font-mono">{action.count.toLocaleString()}</td>
                            <td className="py-2 pl-2 text-right">{isFinite(percentage) ? `${percentage}%` : '—'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="bg-black/20 border border-white/5 rounded-xl p-5">
              <h3 className="text-xl font-display mb-4">מסלולי גלישה מובילים</h3>
              {summary.topPaths.length === 0 ? (
                <p className="text-sm text-jungle-text/60">לא נמצאו נתיבים מובילים.</p>
              ) : (
                <div className="space-y-3">
                  {summary.topPaths.map((path) => {
                    const width = `${Math.max(6, Math.round((path.count / maxPathCount) * 100))}%`;
                    return (
                      <div key={path.path}>
                        <div className="flex justify-between text-xs text-jungle-text/60">
                          <span className="truncate" title={path.path}>{path.path}</span>
                          <span className="font-mono text-white">{path.count.toLocaleString()}</span>
                        </div>
                        <div className="mt-1 h-2 rounded-full bg-jungle-deep/60 overflow-hidden">
                          <div className="h-full bg-jungle-accent" style={{ width }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="bg-black/20 border border-white/5 rounded-xl p-5">
            <h3 className="text-xl font-display mb-4">מסיבות עם הכי הרבה הקלקות</h3>
            {summary.topPartyEntries.length === 0 ? (
              <p className="text-sm text-jungle-text/60">אין עדיין הקלקות על מסיבות להצגה.</p>
            ) : (
              <div className="space-y-4">
                {summary.topPartyEntries.map((entry, index) => {
                  const displayLabel = entry.label || entry.partySlug || entry.partyId || 'לא ידוע';
                  const targetPath = entry.path || (entry.partySlug ? `/event/${entry.partySlug}` : undefined);
                  const key = entry.partyId || entry.partySlug || entry.path || entry.label || `party-${index}`;
                  return (
                    <div key={key} className="border border-white/5 rounded-lg p-3 bg-white/5">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-base font-semibold text-white">{displayLabel}</p>
                          <div className="text-xs text-jungle-text/60 space-x-reverse space-x-2">
                            {entry.partySlug && <span>slug: {entry.partySlug}</span>}
                            {entry.partyId && <span>ID: {entry.partyId}</span>}
                            {entry.path && <span>נתיב: {entry.path}</span>}
                          </div>
                        </div>
                        <div className="flex flex-col items-start sm:items-end gap-2">
                          <span className="font-mono text-jungle-accent text-lg">{entry.count.toLocaleString()}</span>
                          <span className="text-xs text-jungle-text/60">הפניות</span>
                          {targetPath && (
                            <a
                              href={targetPath}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-jungle-accent hover:underline"
                            >
                              מעבר למסיבה
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-black/20 border border-white/5 rounded-xl p-5">
            <h3 className="text-xl font-display mb-4">תוויות מובילות</h3>
            {summary.topLabels.length === 0 ? (
              <p className="text-sm text-jungle-text/60">לא נמצאו תוויות מובילות.</p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {summary.topLabels.map((label) => {
                  const relativeSize = Math.min(1.6, Math.max(1, label.count / (summary.topLabels[0]?.count || 1)));
                  return (
                    <span
                      key={label.label}
                      className="bg-jungle-accent/20 border border-jungle-accent/40 text-jungle-accent px-3 py-1 rounded-full flex items-center gap-2"
                      style={{ fontSize: `${relativeSize}rem` }}
                    >
                      <span className="font-semibold">{label.label}</span>
                      <span className="text-xs text-jungle-text/70">{label.count.toLocaleString()}</span>
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAnalytics;
