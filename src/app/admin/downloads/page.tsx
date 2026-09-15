"use client";

import { useState, useEffect, useCallback } from "react";
import { Save } from "lucide-react";
import type { SiteSettings } from "@/lib/types";

export default function AdminDownloadsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const fetchData = useCallback(async () => {
    const res = await fetch("/api/admin/settings");
    if (res.ok) setSettings(await res.json());
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function save() {
    if (!settings) return;
    setSaving(true);
    await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (!settings) return <div className="admin-page"><p className="admin-loading">Loading…</p></div>;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Downloads Manager</h1>
        <button className="admin-btn admin-btn-primary" onClick={save} disabled={saving}>
          <Save size={16} /> {saving ? "Saving…" : saved ? "Saved ✓" : "Save"}
        </button>
      </div>
      <p className="admin-description">Manage downloadable PDF files. Upload files to /public/uploads/documents/ and set the URL here.</p>
      {(["companyProfile", "portfolio", "serviceGuide"] as const).map((key) => (
        <div key={key} className="admin-card" style={{ marginBottom: "1.5rem" }}>
          <h2>{settings.downloads[key].label}</h2>
          <label className="admin-field">
            <span>Enabled</span>
            <input type="checkbox" checked={settings.downloads[key].enabled} onChange={(e) => setSettings({ ...settings, downloads: { ...settings.downloads, [key]: { ...settings.downloads[key], enabled: e.target.checked } } })} />
          </label>
          <label className="admin-field">
            <span>Display Label</span>
            <input value={settings.downloads[key].label} onChange={(e) => setSettings({ ...settings, downloads: { ...settings.downloads, [key]: { ...settings.downloads[key], label: e.target.value } } })} />
          </label>
          <label className="admin-field">
            <span>File URL</span>
            <input value={settings.downloads[key].fileUrl} onChange={(e) => setSettings({ ...settings, downloads: { ...settings.downloads, [key]: { ...settings.downloads[key], fileUrl: e.target.value } } })} placeholder="/uploads/documents/company-profile.pdf" />
          </label>
        </div>
      ))}
    </div>
  );
}
