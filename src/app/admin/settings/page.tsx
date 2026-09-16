"use client";

import { useState, useEffect, useCallback } from "react";
import { Save, Database, RefreshCw, CheckCircle2, AlertCircle, Zap, ExternalLink, Link2 } from "lucide-react";
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
  isNeon?: boolean;
  endpoint?: string;
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

  // Neon connection state
  const [neonUrl, setNeonUrl] = useState("");
  const [connectingNeon, setConnectingNeon] = useState(false);
  const [neonStatusMsg, setNeonStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showNeonConfig, setShowNeonConfig] = useState(false);

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

  async function handleConnectNeon(e: React.FormEvent) {
    e.preventDefault();
    if (!neonUrl.trim()) {
      setNeonStatusMsg({ type: "error", text: "Please enter your Neon PostgreSQL connection string." });
      return;
    }
    setConnectingNeon(true);
    setNeonStatusMsg(null);
    try {
      const res = await fetch("/api/admin/database", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "connect_neon", connectionString: neonUrl.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setNeonStatusMsg({ type: "success", text: data.message });
        setDbInfo(data);
        setNeonUrl("");
        setShowNeonConfig(false);
      } else {
        setNeonStatusMsg({ type: "error", text: data.error || "Failed to connect to Neon database." });
      }
    } catch (err) {
      setNeonStatusMsg({ type: "error", text: (err as Error).message });
    } finally {
      setConnectingNeon(false);
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

      {/* Neon / Cloud Database Connection Card */}
      <div className="admin-card" style={{ marginBottom: "1.5rem", border: dbInfo?.isNeon ? "1px solid rgba(0, 174, 240, 0.4)" : "1px solid var(--line)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{
              width: "42px",
              height: "42px",
              borderRadius: "10px",
              backgroundColor: dbInfo?.isNeon ? "rgba(0, 230, 150, 0.15)" : "rgba(0, 174, 240, 0.15)",
              color: dbInfo?.isNeon ? "#00E696" : "var(--cyan, #00AEF0)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              {dbInfo?.isNeon ? <Zap size={22} /> : <Database size={22} />}
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <h2 style={{ margin: 0, fontSize: "1.1rem" }}>Neon Database & Storage</h2>
                {dbInfo?.isNeon && (
                  <span style={{
                    fontSize: "0.65rem",
                    padding: "0.15rem 0.5rem",
                    borderRadius: "999px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    backgroundColor: "rgba(0, 230, 150, 0.2)",
                    color: "#00E696"
                  }}>
                    Active
                  </span>
                )}
              </div>
              <span style={{ fontSize: "0.8rem", opacity: 0.75 }}>
                Engine: <strong style={{ color: dbInfo?.isNeon ? "#00E696" : "var(--cyan, #00AEF0)" }}>{dbInfo?.engine || "Checking..."}</strong>
                {dbInfo?.endpoint && (
                  <span style={{ marginLeft: "0.6rem", opacity: 0.8, fontFamily: "monospace", fontSize: "0.75rem" }}>
                    ({dbInfo.endpoint})
                  </span>
                )}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              padding: "0.35rem 0.85rem",
              borderRadius: "999px",
              fontSize: "0.75rem",
              fontWeight: 600,
              backgroundColor: dbInfo?.connected ? "rgba(163, 230, 53, 0.15)" : "rgba(239, 68, 68, 0.15)",
              color: dbInfo?.connected ? "var(--lime, #A3E635)" : "#EF4444"
            }}>
              {dbInfo?.connected ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
              {dbInfo?.connected ? (dbInfo.isNeon ? "Neon Serverless Connected" : dbInfo.isServerless ? "Cloud Postgres Connected" : "Local SQLite Connected") : "Disconnected"}
            </span>

            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={syncDatabase}
              disabled={syncing}
              style={{ fontSize: "0.8rem", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
            >
              <RefreshCw size={13} className={syncing ? "animate-spin" : ""} />
              {syncing ? "Syncing..." : "Sync / Reseed"}
            </button>

            <button
              type="button"
              className="admin-btn"
              onClick={() => setShowNeonConfig(!showNeonConfig)}
              style={{
                fontSize: "0.8rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                backgroundColor: showNeonConfig ? "var(--surface-2)" : "rgba(0, 174, 240, 0.15)",
                color: showNeonConfig ? "var(--text)" : "var(--cyan, #00AEF0)",
                border: "1px solid rgba(0, 174, 240, 0.3)"
              }}
            >
              <Link2 size={13} />
              {showNeonConfig ? "Hide Config" : dbInfo?.isNeon ? "Reconfigure Neon" : "Connect to Neon"}
            </button>
          </div>
        </div>

        {/* Sync message banner */}
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

        {/* Neon status message banner */}
        {neonStatusMsg && (
          <div style={{
            padding: "0.6rem 0.85rem",
            borderRadius: "6px",
            fontSize: "0.8rem",
            marginBottom: "1rem",
            backgroundColor: neonStatusMsg.type === "error" ? "rgba(239, 68, 68, 0.1)" : "rgba(0, 230, 150, 0.1)",
            border: `1px solid ${neonStatusMsg.type === "error" ? "rgba(239, 68, 68, 0.3)" : "rgba(0, 230, 150, 0.3)"}`,
            color: neonStatusMsg.type === "error" ? "#F87171" : "#00E696"
          }}>
            {neonStatusMsg.text}
          </div>
        )}

        {/* Interactive Neon Connection Form */}
        {showNeonConfig && (
          <form onSubmit={handleConnectNeon} style={{
            padding: "1.25rem",
            marginBottom: "1.25rem",
            borderRadius: "8px",
            backgroundColor: "rgba(0, 0, 0, 0.25)",
            border: "1px solid rgba(0, 174, 240, 0.25)"
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <strong style={{ fontSize: "0.9rem", color: "var(--cyan, #00AEF0)", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                <Zap size={16} /> Enter Neon PostgreSQL Connection String
              </strong>
              <a
                href="https://console.neon.tech"
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: "0.75rem", color: "var(--cyan, #00AEF0)", display: "inline-flex", alignItems: "center", gap: "0.25rem", opacity: 0.9 }}
              >
                Open Neon Console <ExternalLink size={12} />
              </a>
            </div>

            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
              <input
                type="password"
                placeholder="postgresql://user:password@ep-sample-project.us-east-2.aws.neon.tech/neondb?sslmode=require"
                value={neonUrl}
                onChange={(e) => setNeonUrl(e.target.value)}
                style={{
                  flex: 1,
                  minWidth: "280px",
                  padding: "0.6rem 0.85rem",
                  borderRadius: "6px",
                  border: "1px solid var(--line)",
                  backgroundColor: "var(--bg)",
                  color: "var(--text)",
                  fontSize: "0.85rem",
                  fontFamily: "monospace"
                }}
              />
              <button
                type="submit"
                className="admin-btn admin-btn-primary"
                disabled={connectingNeon || !neonUrl.trim()}
                style={{
                  fontSize: "0.85rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  backgroundColor: "#00E696",
                  color: "#000",
                  fontWeight: 600,
                  whiteSpace: "nowrap"
                }}
              >
                {connectingNeon ? <RefreshCw size={14} className="animate-spin" /> : <Zap size={14} />}
                {connectingNeon ? "Testing & Connecting..." : "Connect & Migrate to Neon"}
              </button>
            </div>
            <p style={{ margin: "0.75rem 0 0 0", fontSize: "0.75rem", opacity: 0.7, lineHeight: 1.4 }}>
              💡 Connecting will automatically test the credentials, verify/create table schemas, synchronize all existing content, and update <code>.env.local</code>.
            </p>
          </form>
        )}

        {/* Status info & deployment guide */}
        <div style={{ fontSize: "0.85rem", opacity: 0.85, lineHeight: 1.5 }}>
          {dbInfo?.isNeon ? (
            <p style={{ margin: 0 }}>
              🚀 <strong>Connected to Neon Serverless Postgres.</strong> All content overrides, case studies, selected cuts, testimonials, and contact inquiries are safely persisted across serverless instances and production builds.
            </p>
          ) : (
            <div>
              <p style={{ margin: "0 0 0.5rem 0" }}>
                {dbInfo?.isServerless ? (
                  <>Connected to cloud Postgres. Click <strong>Connect to Neon</strong> above to switch to Neon.</>
                ) : (
                  <>💻 <strong>Running on Local SQLite 3.</strong> Connect to Neon for cloud persistence:</>
                )}
              </p>
              <ol style={{ margin: 0, paddingLeft: "1.2rem", fontSize: "0.8rem", opacity: 0.85 }}>
                <li>Log in to <a href="https://console.neon.tech" target="_blank" rel="noreferrer" style={{ color: "var(--cyan, #00AEF0)" }}>neon.tech</a> and create or select your project.</li>
                <li>Copy the <strong>Connection String</strong> (Pooled or Direct).</li>
                <li>Click <strong>Connect to Neon</strong> above and paste your URL, or add <code>POSTGRES_URL</code> to your Vercel Project Environment Variables.</li>
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
