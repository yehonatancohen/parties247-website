"use client";
import React, { useEffect, useMemo, useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { getAnalyticsSummary, getDetailedAnalytics } from '../services/api';
import { AnalyticsSummary, DetailedAnalyticsResponse } from '../data/types';
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
  const [detailedData, setDetailedData] = useState<DetailedAnalyticsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingChart, setIsLoadingChart] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<'daily' | 'hourly'>('daily');

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

  const fetchDetailedAnalytics = async () => {
    setIsLoadingChart(true);
    try {
      const range = timeFilter === 'daily' ? '7d' : '24h';
      const interval = 'hour'; // Always fetch hourly to show peaks
      const data = await getDetailedAnalytics(range, interval);
      setDetailedData(data);
    } catch (err) {
      console.error('Failed to load detailed analytics', err);
      // If detailed analytics fail, keep showing the rest of the dashboard
    } finally {
      setIsLoadingChart(false);
    }
  };

  useEffect(() => {
    fetchSummary().catch(() => { });
  }, []);

  useEffect(() => {
    fetchDetailedAnalytics().catch(() => { });
  }, [timeFilter]);

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

  // Process chart data from API
  const chartData = useMemo(() => {
    if (!detailedData || !detailedData.data.length) return [];

    return detailedData.data.map(item => {
      // Format timestamp based on interval
      let label = item.timestamp;

      const date = new Date(item.timestamp);
      if (detailedData.range === '24h') {
        // For 24h, show just the hour (e.g., "14:00")
        label = `${date.getHours()}:00`;
      } else {
        // For 7d (hourly), show Day + Hour (e.g. "Mon 14:00") but logic handled in render for density
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        label = `${days[date.getDay()]} ${date.getHours()}:00`;
      }

      return {
        label,
        views: item.partyViews,
        clicks: item.purchases,
        visits: item.visits
      };
    });
  }, [detailedData]);

  if (isLoading && !summary) return <div className="p-12 flex justify-center"><LoadingSpinner /></div>;
  if (error) return <div className="p-6 bg-red-900/20 text-red-200 rounded-xl border border-red-500/30">{error}</div>;
  if (!summary || !stats) return null;

  const maxChartValue = Math.max(...chartData.map(d => Math.max(d.views, d.visits || 0)), 1);

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

      {/* Time-Based Analytics (Coming Soon / Mock) */}
      <div className="bg-gray-900/40 border border-white/5 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl text-white font-bold flex items-center gap-2">
            📊 מגמות
          </h3>
          <div className="flex bg-white/5 rounded-lg p-1">
            <button
              onClick={() => setTimeFilter('daily')}
              disabled={isLoadingChart}
              className={`px-3 py-1 text-sm rounded-md transition-all ${timeFilter === 'daily' ? 'bg-white/10 text-white font-medium shadow-sm' : 'text-gray-400 hover:text-white'} disabled:opacity-50`}
            >
              7 ימים (לפי שעה)
            </button>
            <button
              onClick={() => setTimeFilter('hourly')}
              disabled={isLoadingChart}
              className={`px-3 py-1 text-sm rounded-md transition-all ${timeFilter === 'hourly' ? 'bg-white/10 text-white font-medium shadow-sm' : 'text-gray-400 hover:text-white'} disabled:opacity-50`}
            >
              שעתי (24 שעות)
            </button>
          </div>
        </div>


        {isLoadingChart ? (
          <div className="h-64 flex items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-gray-500">
            אין נתונים זמינים
          </div>
        ) : (
          <div className="relative h-64 w-full" dir="ltr">
            {/* SVG Layer */}
            <div className="absolute inset-0 bottom-6 left-0 right-0">
              <svg className="w-full h-full" viewBox={`0 0 ${chartData.length - 1} 100`} preserveAspectRatio="none">
                <defs>
                  <linearGradient id="grad-visits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="grad-views" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="grad-clicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#84cc16" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#84cc16" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Visits (Purple) */}
                <path
                  d={`M ${chartData.map((d, i) => `${i},${maxChartValue > 0 ? 100 - (d.visits / maxChartValue * 100) : 100}`).join(' L ')} L ${chartData.length - 1},100 L 0,100 Z`}
                  fill="url(#grad-visits)"
                />
                <path
                  d={`M ${chartData.map((d, i) => `${i},${maxChartValue > 0 ? 100 - (d.visits / maxChartValue * 100) : 100}`).join(' L ')}`}
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                  opacity="0.6"
                />

                {/* Views (Blue) */}
                <path
                  d={`M ${chartData.map((d, i) => `${i},${maxChartValue > 0 ? 100 - (d.views / maxChartValue * 100) : 100}`).join(' L ')} L ${chartData.length - 1},100 L 0,100 Z`}
                  fill="url(#grad-views)"
                />
                <path
                  d={`M ${chartData.map((d, i) => `${i},${maxChartValue > 0 ? 100 - (d.views / maxChartValue * 100) : 100}`).join(' L ')}`}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                />

                {/* Clicks (Green - Top Layer) */}
                <path
                  d={`M ${chartData.map((d, i) => `${i},${maxChartValue > 0 ? 100 - (d.clicks / maxChartValue * 100) : 100}`).join(' L ')} L ${chartData.length - 1},100 L 0,100 Z`}
                  fill="url(#grad-clicks)"
                />
                <path
                  d={`M ${chartData.map((d, i) => `${i},${maxChartValue > 0 ? 100 - (d.clicks / maxChartValue * 100) : 100}`).join(' L ')}`}
                  fill="none"
                  stroke="#84cc16"
                  strokeWidth="3"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>

            {/* Interaction Layer (Invisible columns for tooltips) */}
            <div className="absolute inset-0 flex items-stretch justify-between z-10 w-full h-full pb-6">
              {chartData.map((d, i) => {
                const heightPercent = maxChartValue > 0 ? (d.visits / maxChartValue) * 100 : 0;
                return (
                  <div key={i} className="relative flex-1 group flex flex-col justify-end items-center cursor-pointer">
                    {/* Hover Line Indicator */}
                    <div className="absolute top-0 bottom-0 w-[1px] bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Point Indicator on Line (Approximate) */}
                    <div
                      className="w-2 h-2 rounded-full bg-white opacity-0 group-hover:opacity-100 absolute transition-opacity shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                      style={{ bottom: `${heightPercent}%` }}
                    />

                    {/* Tooltip */}
                    <div dir="rtl" className="absolute bottom-full mb-2 bg-gray-900/95 backdrop-blur border border-white/10 text-white text-xs p-3 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none transform translate-y-2 group-hover:translate-y-0 whitespace-nowrap z-20 min-w-[120px]">
                      <p className="font-bold text-sm mb-1 border-b border-white/10 pb-1 text-center">{d.label}</p>
                      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-right">
                        <span className="text-purple-400">● ביקורים:</span>
                        <span className="font-mono font-bold text-left">{d.visits}</span>

                        <span className="text-blue-400">● צפיות:</span>
                        <span className="font-mono font-bold text-left">{d.views}</span>

                        <span className="text-jungle-lime">● רכישות:</span>
                        <span className="font-mono font-bold text-left">{d.clicks}</span>
                      </div>
                    </div>

                    {/* X-Axis Label - Only show sparse labels if many data points */}
                    {(!detailedData || detailedData.range !== '7d' || i % 12 === 0) && (
                      <div className="absolute -bottom-6 left-0 right-0 flex justify-center">
                        <span className="text-[10px] text-gray-500 rotate-0 truncate px-1 whitespace-nowrap">
                          {detailedData?.range === '7d' ? d.label.split(' ')[0] : d.label}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
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
