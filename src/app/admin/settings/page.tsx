"use client";

import { useState, useEffect, useCallback } from "react";
import { Save, Database, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
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

interface DbInfo {
  connected: boolean;
  engine: string;
  isServerless: boolean;
  hasPostgresEnv: boolean;
  tables: { name: string; count: number }[];
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Database info state
  const [dbInfo, setDbInfo] = useState<DbInfo | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    const res = await fetch("/api/admin/settings");
    if (res.ok) {
      const data = await res.json();
      setSettings({ ...defaultSettings, ...data });
    }

    try {
      const dbRes = await fetch("/api/admin/database");
      if (dbRes.ok) {
        const d = await dbRes.json();
        setDbInfo(d);
      }
    } catch {
      /* ignore */
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

  async function syncDatabase() {
    setSyncing(true);
    setSyncMessage(null);
    try {
      const res = await fetch("/api/admin/database", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "sync" }),
      });
      const data = await res.json();
      if (data.success) {
        setSyncMessage(data.message || "Database synchronized successfully!");
        setDbInfo(data);
      } else {
        setSyncMessage(`Sync failed: ${data.error || "Unknown error"}`);
      }
    } catch (e) {
      setSyncMessage(`Error: ${(e as Error).message}`);
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Settings</h1>
        <button className="admin-btn admin-btn-primary" onClick={save} disabled={saving}>
          <Save size={16} /> {saving ? "Saving…" : saved ? "Saved ✓" : "Save"}
        </button>
      </div>

      {/* Database & Vercel Connection Status */}
      <div className="admin-card" style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: "38px", height: "38px", borderRadius: "8px", backgroundColor: "rgba(0, 174, 240, 0.15)", color: "var(--cyan, #00AEF0)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Database size={20} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: "1.05rem" }}>Database & Vercel Connection</h2>
              <span style={{ fontSize: "0.8rem", opacity: 0.7 }}>
                Engine: <strong style={{ color: "var(--cyan, #00AEF0)" }}>{dbInfo?.engine || "Checking..."}</strong>
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.3rem",
              padding: "0.3rem 0.75rem",
              borderRadius: "999px",
              fontSize: "0.75rem",
              fontWeight: 600,
              backgroundColor: dbInfo?.connected ? "rgba(163, 230, 53, 0.15)" : "rgba(239, 68, 68, 0.15)",
              color: dbInfo?.connected ? "var(--lime, #A3E635)" : "#EF4444"
            }}>
              {dbInfo?.connected ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
              {dbInfo?.connected ? (dbInfo.isServerless ? "Vercel Postgres Connected" : "Local SQLite Connected") : "Disconnected"}
            </span>

            <button
              className="admin-btn admin-btn-secondary"
              onClick={syncDatabase}
              disabled={syncing}
              style={{ fontSize: "0.8rem", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
            >
              <RefreshCw size={13} className={syncing ? "animate-spin" : ""} />
              {syncing ? "Syncing..." : "Sync / Reseed"}
            </button>
          </div>
        </div>

        {syncMessage && (
          <div style={{
            padding: "0.6rem 0.85rem",
            borderRadius: "6px",
            fontSize: "0.8rem",
            marginBottom: "1rem",
            backgroundColor: syncMessage.includes("fail") || syncMessage.includes("Error") ? "rgba(239, 68, 68, 0.1)" : "rgba(163, 230, 53, 0.1)",
            border: `1px solid ${syncMessage.includes("fail") || syncMessage.includes("Error") ? "rgba(239, 68, 68, 0.3)" : "rgba(163, 230, 53, 0.3)"}`,
            color: syncMessage.includes("fail") || syncMessage.includes("Error") ? "#F87171" : "var(--lime, #A3E635)"
          }}>
            {syncMessage}
          </div>
        )}

        <div style={{ fontSize: "0.85rem", opacity: 0.8, lineHeight: 1.5 }}>
          {dbInfo?.isServerless ? (
            <p style={{ margin: 0 }}>
              🚀 <strong>Connected to Vercel Postgres / Neon.</strong> All content overrides, cuts, testimonials, and leads are automatically preserved across deployments and serverless lambda instances.
            </p>
          ) : (
            <div>
              <p style={{ margin: "0 0 0.5rem 0" }}>
                💻 <strong>Running on Local SQLite 3.</strong> When deploying to Vercel:
              </p>
              <ol style={{ margin: 0, paddingLeft: "1.2rem", fontSize: "0.8rem", opacity: 0.85 }}>
                <li>Go to your <strong>Vercel Dashboard</strong> &rarr; Select this project.</li>
                <li>Click <strong>Storage</strong> &rarr; <strong>Create Database</strong> &rarr; choose <strong>Postgres</strong> (powered by Neon).</li>
                <li>Click <strong>Connect to Project</strong>. Vercel automatically injects <code>POSTGRES_URL</code> and all data will migrate automatically!</li>
              </ol>
            </div>
          )}
        </div>
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
