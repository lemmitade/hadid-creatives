"use client";

import { useState, useEffect, useCallback } from "react";
import { Save } from "lucide-react";

const PAGES = [
  { id: "home", label: "Homepage" },
  { id: "work", label: "Work" },
  { id: "services", label: "Services" },
  { id: "insights", label: "Insights" },
  { id: "behind-the-work", label: "Behind the Work" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

type PageSeo = {
  title: string;
  description: string;
  ogImage: string;
  keywords: string;
};

export default function AdminSeoPage() {
  const [seo, setSeo] = useState<Record<string, PageSeo>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const fetchData = useCallback(async () => {
    const res = await fetch("/api/admin/seo");
    if (res.ok) setSeo(await res.json());
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  function update(pageId: string, field: keyof PageSeo, value: string) {
    setSeo({
      ...seo,
      [pageId]: { ...(seo[pageId] || { title: "", description: "", ogImage: "", keywords: "" }), [field]: value },
    });
  }

  async function save() {
    setSaving(true);
    await fetch("/api/admin/seo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(seo),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>SEO Manager</h1>
        <button className="admin-btn admin-btn-primary" onClick={save} disabled={saving}>
          <Save size={16} /> {saving ? "Saving…" : saved ? "Saved ✓" : "Save all"}
        </button>
      </div>
      <p className="admin-description">Manage meta titles, descriptions, OG images, and keywords per page.</p>

      {/* Sitemap & Robots.txt quick access */}
      <div className="admin-card" style={{ marginBottom: "1.5rem", border: "1px solid rgba(0, 174, 240, 0.3)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "1.05rem", color: "var(--cyan, #00AEF0)" }}>XML Sitemap & Crawlers</h2>
            <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.8rem", opacity: 0.8 }}>
              Automatically indexes all public marketing pages, portfolio case studies, and published insight articles.
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <a href="/sitemap.xml" target="_blank" rel="noreferrer" className="admin-btn admin-btn-secondary" style={{ fontSize: "0.8rem", textDecoration: "none" }}>
              View /sitemap.xml ↗
            </a>
            <a href="/robots.txt" target="_blank" rel="noreferrer" className="admin-btn admin-btn-secondary" style={{ fontSize: "0.8rem", textDecoration: "none" }}>
              View /robots.txt ↗
            </a>
            <a href="/google2515097d3b8099c5.html" target="_blank" rel="noreferrer" className="admin-btn admin-btn-secondary" style={{ fontSize: "0.8rem", textDecoration: "none" }}>
              Google Verification ↗
            </a>
          </div>
        </div>
      </div>
      {PAGES.map((page) => {
        const data = seo[page.id] || { title: "", description: "", ogImage: "", keywords: "" };
        return (
          <div key={page.id} className="admin-card" style={{ marginBottom: "1.5rem" }}>
            <h2>{page.label}</h2>
            <label className="admin-field">
              <span>Meta Title</span>
              <input value={data.title} onChange={(e) => update(page.id, "title", e.target.value)} placeholder="(uses default)" />
            </label>
            <label className="admin-field">
              <span>Meta Description</span>
              <textarea value={data.description} onChange={(e) => update(page.id, "description", e.target.value)} placeholder="(uses default)" rows={2} />
            </label>
            <label className="admin-field">
              <span>OG Image URL</span>
              <input value={data.ogImage} onChange={(e) => update(page.id, "ogImage", e.target.value)} placeholder="/media/..." />
            </label>
            <label className="admin-field">
              <span>Keywords</span>
              <input value={data.keywords} onChange={(e) => update(page.id, "keywords", e.target.value)} placeholder="comma, separated, keywords" />
            </label>
          </div>
        );
      })}
    </div>
  );
}
