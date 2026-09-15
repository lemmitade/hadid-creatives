"use client";

import { useState, useEffect, useCallback } from "react";
import { Save } from "lucide-react";
import type { SiteSettings } from "@/lib/types";

const defaultSettings: SiteSettings = {
  whatsapp: { enabled: true, phone: "251948027407", message: "Hello Hadid Creatives, I'd like to discuss growing our digital presence." },
  downloads: {
    companyProfile: { label: "Company Profile", fileUrl: "", enabled: false },
    portfolio: { label: "Portfolio", fileUrl: "", enabled: false },
    serviceGuide: { label: "Service Guide", fileUrl: "", enabled: false },
  },
  floatingWhatsApp: { enabled: true, phone: "251948027407", message: "Hello Hadid Creatives, I'd like to discuss growing our digital presence." },
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const fetchData = useCallback(async () => {
    const res = await fetch("/api/admin/settings");
    if (res.ok) {
      const data = await res.json();
      setSettings({ ...defaultSettings, ...data });
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function save() {
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

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Settings</h1>
        <button className="admin-btn admin-btn-primary" onClick={save} disabled={saving}>
          <Save size={16} /> {saving ? "Saving…" : saved ? "Saved ✓" : "Save"}
        </button>
      </div>

      <div className="admin-card" style={{ marginBottom: "1.5rem" }}>
        <h2>Floating WhatsApp Button</h2>
        <label className="admin-field">
          <span>Enabled</span>
          <input type="checkbox" checked={settings.floatingWhatsApp.enabled} onChange={(e) => setSettings({ ...settings, floatingWhatsApp: { ...settings.floatingWhatsApp, enabled: e.target.checked } })} />
        </label>
        <label className="admin-field">
          <span>Phone Number</span>
          <input value={settings.floatingWhatsApp.phone} onChange={(e) => setSettings({ ...settings, floatingWhatsApp: { ...settings.floatingWhatsApp, phone: e.target.value } })} />
        </label>
        <label className="admin-field">
          <span>Pre-filled Message</span>
          <textarea value={settings.floatingWhatsApp.message} onChange={(e) => setSettings({ ...settings, floatingWhatsApp: { ...settings.floatingWhatsApp, message: e.target.value } })} rows={2} />
        </label>
      </div>

      <div className="admin-card" style={{ marginBottom: "1.5rem" }}>
        <h2>Downloadable Files</h2>
        {(["companyProfile", "portfolio", "serviceGuide"] as const).map((key) => (
          <div key={key} style={{ marginBottom: "1rem", padding: "1rem 0", borderBottom: "1px solid var(--line)" }}>
            <label className="admin-field">
              <span>{settings.downloads[key].label} — Enabled</span>
              <input type="checkbox" checked={settings.downloads[key].enabled} onChange={(e) => setSettings({ ...settings, downloads: { ...settings.downloads, [key]: { ...settings.downloads[key], enabled: e.target.checked } } })} />
            </label>
            <label className="admin-field">
              <span>Label</span>
              <input value={settings.downloads[key].label} onChange={(e) => setSettings({ ...settings, downloads: { ...settings.downloads, [key]: { ...settings.downloads[key], label: e.target.value } } })} />
            </label>
            <label className="admin-field">
              <span>File URL</span>
              <input value={settings.downloads[key].fileUrl} onChange={(e) => setSettings({ ...settings, downloads: { ...settings.downloads, [key]: { ...settings.downloads[key], fileUrl: e.target.value } } })} placeholder="/uploads/documents/..." />
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
