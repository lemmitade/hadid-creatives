"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Save, Check, Search, Globe, Home, Briefcase, Info, Mail, Layout } from "lucide-react";

interface ContentField {
  key: string;
  label: string;
  page: string;
  defaultVal: string;
  type?: "text" | "textarea";
}

const CONTENT_KEYS: ContentField[] = [
  // Homepage
  { key: "home.hero.kickerLeft", label: "Hero Kicker (Left)", page: "Home", defaultVal: "Digital presence / built with intent" },
  { key: "home.hero.kickerRight", label: "Hero Kicker (Right)", page: "Home", defaultVal: "EST. 2024" },
  { key: "home.hero.headline", label: "Hero Headline", page: "Home", defaultVal: "Built to be seen. Made to perform." },
  { key: "home.hero.subline", label: "Hero Subline / Description", page: "Home", type: "textarea", defaultVal: "Hadid Creatives helps established brands strengthen their digital presence through cinematic content, social strategy, paid amplification, web design, and practical consultancy." },
  { key: "home.hero.ctaWhatsApp", label: "Hero CTA Button (WhatsApp)", page: "Home", defaultVal: "Start on WhatsApp" },
  { key: "home.hero.ctaWork", label: "Hero CTA Link (Work)", page: "Home", defaultVal: "Explore the work" },
  { key: "home.proof.label", label: "Proof Strip Title / Banner", page: "Home", defaultVal: "SELECTED CLIENTS / VERIFIED OUTCOMES" },
  { key: "home.work.eyebrow", label: "Work Section Eyebrow", page: "Home", defaultVal: "Selected work" },
  { key: "home.work.title", label: "Work Section Title", page: "Home", defaultVal: "Proof, not promises." },
  { key: "home.work.copy", label: "Work Section Description", page: "Home", type: "textarea", defaultVal: "Four engagements. Four different categories. Every number below comes from verified client work." },
  { key: "home.analytics.eyebrow", label: "Analytics Section Eyebrow", page: "Home", defaultVal: "Results & analytics" },
  { key: "home.analytics.title", label: "Analytics Section Title", page: "Home", defaultVal: "Creativity earns attention. Systems turn it into growth." },
  { key: "home.analytics.subhead", label: "Analytics Card Heading", page: "Home", defaultVal: "Make the numbers part of the creative process." },
  { key: "home.analytics.subtext", label: "Analytics Card Description", page: "Home", type: "textarea", defaultVal: "Reporting is not a final slide. It is the feedback loop that makes the next concept, campaign, and publishing cycle sharper." },
  { key: "home.services.eyebrow", label: "Services Section Eyebrow", page: "Home", defaultVal: "What we do" },
  { key: "home.services.title", label: "Services Section Title", page: "Home", defaultVal: "One creative partner. Five connected capabilities." },
  { key: "home.process.eyebrow", label: "Process Section Eyebrow", page: "Home", defaultVal: "The process" },
  { key: "home.process.title", label: "Process Section Title", page: "Home", defaultVal: "Simple enough to move. Structured enough to scale." },
  { key: "home.story.headline", label: "Story Section Headline", page: "Home", defaultVal: "Five friends combined their talents. Hadid became the force that held them together." },
  { key: "home.story.copy", label: "Story Section Description", page: "Home", type: "textarea", defaultVal: "Founded in 2024, Hadid operates as one identity—adaptable, scalable, and always larger than any one individual." },

  // Services Page
  { key: "services.hero.eyebrow", label: "Services Hero Eyebrow", page: "Services", defaultVal: "SERVICES / CAPABILITIES" },
  { key: "services.hero.badge", label: "Services Hero Badge", page: "Services", defaultVal: "05 CONNECTED SYSTEMS" },
  { key: "services.hero.headline", label: "Services Hero Headline", page: "Services", defaultVal: "Make the brand move as one." },
  { key: "services.hero.subline", label: "Services Hero Subline", page: "Services", type: "textarea", defaultVal: "From strategy to production to distribution, Hadid connects the disciplines that shape a serious digital presence." },
  { key: "services.hero.note", label: "Services Hero Note", page: "Services", defaultVal: "NO FIXED PACKAGES / BUILT AROUND THE BRIEF" },
  { key: "services.audit.title", label: "Services Audit Section Title", page: "Services", defaultVal: "Start with the digital presence, not a pre-built package." },
  { key: "services.audit.copy", label: "Services Audit Description", page: "Services", type: "textarea", defaultVal: "We can review the current content, channels, website, workflow, and business objective—then identify what needs to change first." },

  // Work Page
  { key: "work.hero.eyebrow", label: "Work Hero Eyebrow", page: "Work", defaultVal: "WORK / INDEX" },
  { key: "work.hero.badge", label: "Work Hero Badge", page: "Work", defaultVal: "2024—ONGOING" },
  { key: "work.hero.headline", label: "Work Hero Headline", page: "Work", defaultVal: "Work that moves with purpose." },
  { key: "work.hero.subline", label: "Work Hero Subline", page: "Work", type: "textarea", defaultVal: "Content, social systems, and measurable outcomes across furniture, real estate, food and beverage, and brand launches." },
  { key: "work.index.eyebrow", label: "Index Section Eyebrow", page: "Work", defaultVal: "Case-study index" },
  { key: "work.index.title", label: "Index Section Title", page: "Work", defaultVal: "Every number has a name behind it." },
  { key: "work.manifesto.title", label: "Manifesto Card Title", page: "Work", defaultVal: "Strong finish. Clear system. A result the business can point to." },

  // About Page
  { key: "about.hero.headline", label: "About Hero Headline", page: "About", defaultVal: "Not a collection of personalities. A creative force." },
  { key: "about.story.lead", label: "About Story Lead Line", page: "About", defaultVal: "Five friends found that their talents made more sense together." },
  { key: "about.story.p1", label: "About Story Paragraph 1", page: "About", type: "textarea", defaultVal: "Hadid Creatives began in 2024 when five friends working across digital marketing discovered that their individual talents formed something far stronger together." },
  { key: "about.story.p2", label: "About Story Paragraph 2", page: "About", type: "textarea", defaultVal: "Strategy, storytelling, production, design, and growth came together naturally—first through shared projects, then as a unified creative force." },
  { key: "about.story.p3", label: "About Story Paragraph 3", page: "About", type: "textarea", defaultVal: "What started as a collaboration became Hadid: a collective built to help established brands earn attention, strengthen their digital presence, and turn creativity into measurable business results." },
  { key: "about.principle1.title", label: "Principle 1 Title", page: "About", defaultVal: "The brand comes first." },
  { key: "about.principle1.text", label: "Principle 1 Text", page: "About", type: "textarea", defaultVal: "Clients engage with Hadid as one identity, not a rotating cast of individual personalities." },
  { key: "about.principle2.title", label: "Principle 2 Title", page: "About", defaultVal: "The right talent joins the brief." },
  { key: "about.principle2.text", label: "Principle 2 Text", page: "About", type: "textarea", defaultVal: "A collective model stays adaptable as projects, production demands, and categories change." },
  { key: "about.principle3.title", label: "Principle 3 Title", page: "About", defaultVal: "The standard stays consistent." },
  { key: "about.principle3.text", label: "Principle 3 Text", page: "About", type: "textarea", defaultVal: "Different disciplines move through one strategy, one review system, and one expectation of finish." },
  { key: "about.statement.title", label: "About Closing Statement", page: "About", defaultVal: "Adaptable. Scalable. Always larger than any one individual." },

  // Contact Page
  { key: "contact.hero.eyebrow", label: "Contact Hero Eyebrow", page: "Contact", defaultVal: "CONTACT / START A PROJECT" },
  { key: "contact.hero.headline", label: "Contact Hero Headline", page: "Contact", defaultVal: "Let's build the thing people notice." },
  { key: "contact.hero.subline", label: "Contact Hero Subline", page: "Contact", type: "textarea", defaultVal: "Tell us what the business needs to change. We will start with the objective, then shape the right creative system around it." },

  // Footer & Brand
  { key: "footer.tagline", label: "Footer Tagline", page: "Footer", type: "textarea", defaultVal: "Professional content, social systems, paid amplification, websites, and practical consultancy for established brands." },
  { key: "footer.bottom", label: "Footer Micro-Label", page: "Footer", defaultVal: "ONE COLLECTIVE / MANY DISCIPLINES" },
];

export default function AdminContentPage() {
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = useCallback(async () => {
    const res = await fetch("/api/admin/content");
    if (res.ok) setOverrides(await res.json());
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function save() {
    setSaving(true);
    await fetch("/api/admin/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(overrides),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const pages = ["All", ...Array.from(new Set(CONTENT_KEYS.map((k) => k.page)))];

  const filteredItems = useMemo(() => {
    return CONTENT_KEYS.filter((item) => {
      if (activeTab !== "All" && item.page !== activeTab) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.label.toLowerCase().includes(q) ||
          item.key.toLowerCase().includes(q) ||
          item.defaultVal.toLowerCase().includes(q) ||
          (overrides[item.key] || "").toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [activeTab, searchQuery, overrides]);

  const getPageIcon = (page: string) => {
    switch (page) {
      case "Home": return <Home size={14} style={{ marginRight: "4px" }} />;
      case "Services": return <Briefcase size={14} style={{ marginRight: "4px" }} />;
      case "Work": return <Globe size={14} style={{ marginRight: "4px" }} />;
      case "About": return <Info size={14} style={{ marginRight: "4px" }} />;
      case "Contact": return <Mail size={14} style={{ marginRight: "4px" }} />;
      default: return <Layout size={14} style={{ marginRight: "4px" }} />;
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1>Content Manager & Live Copy</h1>
          <span className="admin-badge">Direct SQLite & Dual-Persistence</span>
          <p className="admin-description" style={{ marginTop: "0.5rem" }}>
            Edit any headline, copy, description, or CTA text across the entire website. Any change saved here updates the live site instantly.
          </p>
        </div>

        <button
          className="admin-btn admin-btn-primary"
          onClick={save}
          disabled={saving}
          type="button"
          style={{ minWidth: "160px" }}
        >
          {saved ? <Check size={16} /> : <Save size={16} />}
          {saving ? "Saving…" : saved ? "Changes Saved ✓" : "Save All Changes"}
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", margin: "1.5rem 0", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
          {pages.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setActiveTab(p)}
              className={`work-filter-tab ${activeTab === p ? "is-active" : ""}`}
              style={{ padding: "0.4rem 0.85rem", fontSize: "0.82rem", display: "inline-flex", alignItems: "center" }}
            >
              {p !== "All" && getPageIcon(p)}
              {p}
              <span className="work-filter-count">
                {p === "All" ? CONTENT_KEYS.length : CONTENT_KEYS.filter((k) => k.page === p).length}
              </span>
            </button>
          ))}
        </div>

        <div style={{ position: "relative", minWidth: "240px" }}>
          <Search size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", opacity: 0.5 }} />
          <input
            type="text"
            placeholder="Search copy fields…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "0.45rem 0.75rem 0.45rem 2rem",
              borderRadius: "8px",
              border: "1px solid var(--line)",
              backgroundColor: "rgba(255,255,255,0.03)",
              color: "inherit",
              fontSize: "0.82rem",
            }}
          />
        </div>
      </div>

      {/* Form Fields by Page Section */}
      <div className="admin-content-grid" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {pages.filter((p) => p !== "All" && (activeTab === "All" || activeTab === p)).map((page) => {
          const itemsInPage = filteredItems.filter((item) => item.page === page);
          if (itemsInPage.length === 0) return null;

          return (
            <div key={page} className="admin-card">
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem", borderBottom: "1px solid var(--line)", paddingBottom: "0.75rem" }}>
                {getPageIcon(page)}
                <h2 style={{ margin: 0, fontSize: "1.15rem" }}>{page} Page Copy</h2>
                <span style={{ fontSize: "0.75rem", opacity: 0.6, marginLeft: "auto" }}>{itemsInPage.length} fields</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1rem" }}>
                {itemsInPage.map((item) => {
                  const currentValue = overrides[item.key] ?? "";
                  const isModified = currentValue.trim().length > 0;

                  return (
                    <div key={item.key} className="admin-field" style={{ marginBottom: "0.25rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
                        <span style={{ fontWeight: 600, fontSize: "0.85rem" }}>{item.label}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          {isModified && (
                            <span style={{ fontSize: "0.7rem", color: "var(--lime, #A3E635)", fontWeight: 600 }}>
                              Custom Value
                            </span>
                          )}
                          <span style={{ fontSize: "0.7rem", opacity: 0.4, fontFamily: "monospace" }}>{item.key}</span>
                        </div>
                      </div>

                      {item.type === "textarea" ? (
                        <textarea
                          rows={3}
                          value={currentValue}
                          onChange={(e) => setOverrides({ ...overrides, [item.key]: e.target.value })}
                          placeholder={`Default: ${item.defaultVal}`}
                          style={{ width: "100%", lineHeight: 1.4, fontSize: "0.85rem" }}
                        />
                      ) : (
                        <input
                          type="text"
                          value={currentValue}
                          onChange={(e) => setOverrides({ ...overrides, [item.key]: e.target.value })}
                          placeholder={`Default: ${item.defaultVal}`}
                          style={{ width: "100%", fontSize: "0.85rem" }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Save Actions */}
      <div className="admin-bottom-actions" style={{ marginTop: "2rem" }}>
        <button className="admin-btn admin-btn-primary admin-btn-large" onClick={save} disabled={saving} type="button">
          {saved ? <Check size={18} /> : <Save size={18} />}
          {saving ? "Saving changes…" : saved ? "All Content Saved to Database ✓" : "Save All Content Changes"}
        </button>
      </div>
    </div>
  );
}
