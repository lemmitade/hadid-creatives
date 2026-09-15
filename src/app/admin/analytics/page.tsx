"use client";

import { useState, useEffect, useCallback } from "react";
import type { AnalyticsData } from "@/lib/types";

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData>({ pageViews: [], events: [] });
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    const res = await fetch("/api/admin/analytics");
    if (res.ok) setData(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return <div className="admin-page"><p className="admin-loading">Loading…</p></div>;

  /* Compute aggregates */
  const totalViews = data.pageViews.length;
  const totalEvents = data.events.length;

  /* Page view counts */
  const pageCounts: Record<string, number> = {};
  data.pageViews.forEach((pv) => {
    pageCounts[pv.path] = (pageCounts[pv.path] || 0) + 1;
  });
  const topPages = Object.entries(pageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  /* Referrer counts */
  const refCounts: Record<string, number> = {};
  data.pageViews.forEach((pv) => {
    const ref = pv.referrer ? new URL(pv.referrer).hostname : "Direct";
    refCounts[ref] = (refCounts[ref] || 0) + 1;
  });
  const topReferrers = Object.entries(refCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  /* Event counts */
  const eventCounts: Record<string, number> = {};
  data.events.forEach((ev) => {
    eventCounts[ev.name] = (eventCounts[ev.name] || 0) + 1;
  });
  const topEvents = Object.entries(eventCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  /* Views per day (last 30 days) */
  const dailyViews: Record<string, number> = {};
  data.pageViews.forEach((pv) => {
    const day = pv.timestamp.slice(0, 10);
    dailyViews[day] = (dailyViews[day] || 0) + 1;
  });
  const days = Object.entries(dailyViews).sort((a, b) => a[0].localeCompare(b[0])).slice(-30);
  const maxDayViews = Math.max(...days.map(([, v]) => v), 1);

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Analytics</h1>
      </div>

      <div className="admin-stat-grid">
        <div className="admin-stat-card">
          <span>Total Page Views</span>
          <strong>{totalViews}</strong>
        </div>
        <div className="admin-stat-card accent-lime">
          <span>Total Events</span>
          <strong>{totalEvents}</strong>
        </div>
        <div className="admin-stat-card">
          <span>Unique Pages</span>
          <strong>{Object.keys(pageCounts).length}</strong>
        </div>
        <div className="admin-stat-card">
          <span>Traffic Sources</span>
          <strong>{Object.keys(refCounts).length}</strong>
        </div>
      </div>

      <div className="admin-card" style={{ marginBottom: "1.5rem" }}>
        <h2>Daily Views (last 30 days)</h2>
        <div className="analytics-chart">
          {days.map(([day, count]) => (
            <div key={day} className="analytics-bar-col">
              <div className="analytics-bar" style={{ height: `${(count / maxDayViews) * 100}%` }}>
                <span className="analytics-bar-value">{count}</span>
              </div>
              <span className="analytics-bar-label">{day.slice(5)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-grid-2">
        <div className="admin-card">
          <h2>Top Pages</h2>
          <div className="admin-mini-stat-list">
            {topPages.map(([page, count]) => (
              <div key={page}><span>{page}</span><strong>{count}</strong></div>
            ))}
          </div>
        </div>
        <div className="admin-card">
          <h2>Traffic Sources</h2>
          <div className="admin-mini-stat-list">
            {topReferrers.map(([ref, count]) => (
              <div key={ref}><span>{ref}</span><strong>{count}</strong></div>
            ))}
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h2>CTA & Events</h2>
        <div className="admin-mini-stat-list">
          {topEvents.map(([name, count]) => (
            <div key={name}><span>{name}</span><strong>{count}</strong></div>
          ))}
          {topEvents.length === 0 && <p className="admin-empty">No events tracked yet.</p>}
        </div>
      </div>
    </div>
  );
}
