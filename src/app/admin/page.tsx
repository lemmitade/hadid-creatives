import Link from "next/link";
import { ArrowUpRight, Database, Film, FileText, CheckCircle2 } from "lucide-react";
import { readData, getDatabaseStatus } from "@/lib/db";
import type { Lead, AnalyticsData, SelectedCut } from "@/lib/types";

export default async function AdminDashboardPage() {
  const leads = await readData<Lead[]>("leads", []);
  const analytics = await readData<AnalyticsData>("analytics", { pageViews: [], events: [] });
  const selectedCuts = await readData<SelectedCut[]>("selected-cuts", []);
  const dbStatus = await getDatabaseStatus();

  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === "new").length;
  const totalPageViews = analytics.pageViews.length;
  const totalEvents = analytics.events.length;

  const videoCutsCount = selectedCuts.filter((c) => (c.category || "video") === "video").length;
  const brandingCount = selectedCuts.filter((c) => c.category === "branding").length;
  const websiteCount = selectedCuts.filter((c) => c.category === "website").length;

  const recentLeads = leads
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  return (
    <div className="admin-page">
      <div className="admin-page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1>Control Center & CMS</h1>
          <span className="admin-badge">Super Admin</span>
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Link href="/admin/content" className="admin-btn admin-btn-secondary" style={{ textDecoration: "none", fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
            <FileText size={15} /> Edit Site Copy
          </Link>
          <Link href="/admin/selected-cuts" className="admin-btn admin-btn-primary" style={{ textDecoration: "none", fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
            <Film size={15} /> Manage Portfolio Cuts
          </Link>
        </div>
      </div>

      {/* Database & Architecture Status Banner */}
      <div
        className="admin-card"
        style={{
          marginBottom: "1.5rem",
          background: "linear-gradient(135deg, rgba(0, 174, 240, 0.08), rgba(163, 230, 53, 0.05))",
          border: "1px solid var(--line, rgba(255,255,255,0.15))",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
          <div style={{ width: "42px", height: "42px", borderRadius: "10px", backgroundColor: "rgba(0, 174, 240, 0.15)", color: "var(--cyan, #00AEF0)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Database size={22} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <strong style={{ fontSize: "1rem" }}>Database Engine: {dbStatus.engine}</strong>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", color: "var(--lime, #A3E635)", fontSize: "0.75rem", fontWeight: 600 }}>
                <CheckCircle2 size={13} /> Active & Connected
              </span>
            </div>
            <p style={{ margin: 0, fontSize: "0.82rem", opacity: 0.75 }}>
              Persistent storage at <code>data/hadid.sqlite</code> with dual-write JSON synchronization. All website content is 100% editable.
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "1rem", fontSize: "0.8rem" }}>
          <div>
            <span style={{ opacity: 0.6, display: "block" }}>Portfolio Cuts</span>
            <strong style={{ color: "var(--cyan, #00AEF0)" }}>{selectedCuts.length} items</strong>
          </div>
          <div>
            <span style={{ opacity: 0.6, display: "block" }}>Collections</span>
            <strong style={{ color: "var(--lime, #A3E635)" }}>{dbStatus.tables.length} tables</strong>
          </div>
        </div>
      </div>

      <div className="admin-stat-grid">
        <div className="admin-stat-card">
          <span>Total Leads</span>
          <strong>{totalLeads}</strong>
        </div>
        <div className="admin-stat-card accent-lime">
          <span>New Inquiries</span>
          <strong>{newLeads}</strong>
        </div>
        <div className="admin-stat-card">
          <span>Portfolio Cuts</span>
          <strong>{selectedCuts.length}</strong>
        </div>
        <div className="admin-stat-card">
          <span>Page Views</span>
          <strong>{totalPageViews}</strong>
          <small style={{ display: "block", fontSize: "0.72rem", opacity: 0.6, marginTop: "0.25rem" }}>
            {totalEvents} CTA events
          </small>
        </div>
      </div>

      <div className="admin-grid-2">
        <div className="admin-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h2>Portfolio Showcase Breakdown</h2>
            <Link href="/admin/selected-cuts" className="text-link" style={{ fontSize: "0.8rem", display: "inline-flex", alignItems: "center", gap: "0.2rem" }}>
              Manage <ArrowUpRight size={13} />
            </Link>
          </div>

          <div className="admin-mini-stat-list">
            <div>
              <span>🎬 Video Portfolio (TikTok Reels / Commercials)</span>
              <strong>{videoCutsCount}</strong>
            </div>
            <div>
              <span>🎨 Branding & Visual Identity Systems</span>
              <strong>{brandingCount}</strong>
            </div>
            <div>
              <span>💻 Bespoke Website Design & Portals</span>
              <strong>{websiteCount}</strong>
            </div>
            <div>
              <span>📊 Total Live Showcase Assets</span>
              <strong>{selectedCuts.length}</strong>
            </div>
          </div>
        </div>

        <div className="admin-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h2>Recent Inquiries & Leads</h2>
            <Link href="/admin/leads" className="text-link" style={{ fontSize: "0.8rem", display: "inline-flex", alignItems: "center", gap: "0.2rem" }}>
              View all <ArrowUpRight size={13} />
            </Link>
          </div>

          {recentLeads.length === 0 ? (
            <p className="admin-empty">No submissions yet.</p>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLeads.map((lead) => (
                    <tr key={lead.id}>
                      <td>{lead.name || lead.email}</td>
                      <td><span className={`admin-type-badge type-${lead.type}`}>{lead.type}</span></td>
                      <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
                      <td><span className={`admin-status-badge status-${lead.status}`}>{lead.status}</span></td>
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
