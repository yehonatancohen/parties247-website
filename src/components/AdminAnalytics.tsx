"use client";
import React, { useEffect, useMemo, useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { getAnalyticsSummary } from '../services/api';
import { AnalyticsSummary } from '../data/types';
import { FireIcon, TicketIcon, MegaphoneIcon } from './Icons';

// --- Helpers ---
const formatNumber = (num: number) => new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(num);

const calculateCTR = (views: number, clicks: number) => {
  if (views === 0) return 0;
  return (clicks / views) * 100;
};

// --- Components ---

// 1. KPI Card
const KpiCard = ({ title, value, subtext, icon: Icon, colorClass }: { title: string, value: string, subtext?: string, icon: any, colorClass: string }) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-start justify-between relative overflow-hidden group hover:border-white/20 transition-all">
    <div className={`absolute top-0 left-0 w-1 h-full ${colorClass}`} />
    <div>
      <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-3xl font-display text-white font-bold">{value}</h3>
      {subtext && <p className="text-xs text-gray-500 mt-2">{subtext}</p>}
    </div>
    <div className={`p-3 rounded-xl bg-white/5 ${colorClass.replace('bg-', 'text-')} opacity-80 group-hover:scale-110 transition-transform`}>
      <Icon className="w-6 h-6" />
    </div>
  </div>
);

// 2. Bar Chart Row
const PartyPerformanceRow = ({ name, views, clicks, maxViews }: { name: string, views: number, clicks: number, maxViews: number }) => {
  const viewWidth = Math.max((views / maxViews) * 100, 1); // Min 1%
  const ctr = calculateCTR(views, clicks);

  return (
    <div className="mb-4 group">
      <div className="flex justify-between text-sm mb-1">
        <span className="font-bold text-gray-200 truncate max-w-[200px]">{name}</span>
        <div className="flex gap-4 text-xs font-mono">
          <span className="text-gray-400">{views} צפיות</span>
          <span className="text-jungle-lime">{clicks} המרות ({ctr.toFixed(1)}%)</span>
        </div>
      </div>
      <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden relative">
        {/* Views Bar */}
        <div
          className="h-full bg-blue-500/40 absolute right-0 top-0 rounded-full transition-all duration-1000"
          style={{ width: `${viewWidth}%` }}
        />
        {/* Clicks Bar (Overlay) */}
        <div
          className="h-full bg-jungle-lime/80 absolute right-0 top-0 rounded-full transition-all duration-1000 z-10"
          style={{ width: `${(clicks / maxViews) * 100}%` }}
        />
      </div>
    </div>
  );
};

// --- Main Layout ---

const AdminAnalytics: React.FC = () => {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAnalyticsSummary();
      setSummary(data);
    } catch (err) {
      console.error('Failed to load analytics summary', err);
      setError('שגיאה בטעינת נתונים');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary().catch(() => { });
  }, []);

  // Derived State
  const stats = useMemo(() => {
    if (!summary) return null;
    const totalViews = summary.parties.reduce((sum, p) => sum + p.views, 0);
    const totalClicks = summary.parties.reduce((sum, p) => sum + p.redirects, 0);
    const avgCTR = calculateCTR(totalViews, totalClicks);

    const sortedByViews = [...summary.parties].sort((a, b) => b.views - a.views);
    const sortedByCTR = [...summary.parties].filter(p => p.views > 5).sort((a, b) => calculateCTR(b.views, b.redirects) - calculateCTR(a.views, a.redirects));

    return {
      totalViews,
      totalClicks,
      avgCTR,
      sortedByViews,
      sortedByCTR,
      topParty: sortedByViews[0],
      bestConverting: sortedByCTR[0]
    };
  }, [summary]);

  if (isLoading && !summary) return <div className="p-12 flex justify-center"><LoadingSpinner /></div>;
  if (error) return <div className="p-6 bg-red-900/20 text-red-200 rounded-xl border border-red-500/30">{error}</div>;
  if (!summary || !stats) return null;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl text-white font-display">ביצועי המערכת</h2>
          <p className="text-gray-400 text-sm">סקירה בזמן אמת של התעניינות ומכירות</p>
        </div>
        <button
          onClick={fetchSummary}
          className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm rounded-lg border border-white/10 transition flex items-center gap-2"
        >
          {isLoading ? <LoadingSpinner /> : <span className="text-lg">↻</span>}
          רענון נתונים
        </button>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="חשיפות למותג"
          value={formatNumber(stats.totalViews)}
          subtext={`${summary.uniqueVisitors24h} מבקרים ייחודיים ב-24 שעות`}
          icon={MegaphoneIcon}
          colorClass="bg-blue-500"
        />
        <KpiCard
          title="קליקים לרכישה"
          value={formatNumber(stats.totalClicks)}
          subtext={`יחס המרה ממוצע: ${stats.avgCTR.toFixed(1)}%`}
          icon={TicketIcon}
          colorClass="bg-jungle-lime"
        />
        <KpiCard
          title="האירוע החם"
          value={stats.topParty ? stats.topParty.name.substring(0, 15) + (stats.topParty.name.length > 15 ? '...' : '') : '-'}
          subtext={stats.topParty ? `${stats.topParty.views} צפיות` : ''}
          icon={FireIcon}
          colorClass="bg-orange-500"
        />
        <KpiCard
          title="מלך ההמרות"
          value={stats.bestConverting ? stats.bestConverting.name.substring(0, 15) : '-'}
          subtext={stats.bestConverting ? `${calculateCTR(stats.bestConverting.views, stats.bestConverting.redirects).toFixed(1)}% המרה` : ''}
          icon={TicketIcon}
          colorClass="bg-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Graph: Top Parties */}
        <div className="lg:col-span-2 bg-gray-900/40 border border-white/5 rounded-2xl p-6">
          <h3 className="text-xl text-white font-bold mb-6 flex items-center gap-2">
            <FireIcon className="text-orange-400 w-5 h-5" />
            מובילים בביקוש
          </h3>
          <div className="space-y-6">
            {stats.sortedByViews.slice(0, 8).map(party => (
              <PartyPerformanceRow
                key={party.partyId}
                name={party.name}
                views={party.views}
                clicks={party.redirects}
                maxViews={stats.sortedByViews[0].views}
              />
            ))}
          </div>
        </div>

        {/* Side List: Needs Improvement */}
        <div className="bg-gray-900/40 border border-white/5 rounded-2xl p-6">
          <h3 className="text-xl text-white font-bold mb-6">טעוני שיפור ⚠️</h3>
          <p className="text-xs text-gray-500 mb-4">מסיבות עם חשיפה גבוהה אך מעט הקלקות (Low CTR)</p>
          <div className="space-y-4">
            {stats.sortedByViews
              .filter(p => p.views > 10 && calculateCTR(p.views, p.redirects) < 2)
              .slice(0, 5)
              .map(party => (
                <div key={party.partyId} className="flex items-center justify-between p-3 bg-red-500/5 rounded-lg border border-red-500/10">
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold text-gray-200 truncate">{party.name}</p>
                    <p className="text-xs text-red-300">
                      {party.views} צפיות · {party.redirects} קליקים
                    </p>
                  </div>
                  <div className="text-lg font-bold text-red-500 font-mono">
                    {calculateCTR(party.views, party.redirects).toFixed(1)}%
                  </div>
                </div>
              ))
            }
            {stats.sortedByViews.filter(p => p.views > 10 && calculateCTR(p.views, p.redirects) < 2).length === 0 && (
              <p className="text-gray-500 text-sm text-center py-4">אין כרגע מסיבות עם ביצועים נמוכים חריגים 👏</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
