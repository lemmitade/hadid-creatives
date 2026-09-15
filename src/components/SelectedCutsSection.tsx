"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, ArrowUpRight, X, ExternalLink, Video, Palette, Globe, Sparkles } from "lucide-react";
import { Reveal } from "@/components/Motion";
import { SectionIntro } from "@/components/SectionIntro";
import type { SelectedCut } from "@/lib/types";

export function SelectedCutsSection({ cuts }: { cuts: SelectedCut[] }) {
  const [activeSegment, setActiveSegment] = useState<"video" | "branding" | "website" | "all">("video");
  const [selectedClient, setSelectedClient] = useState<string>("all");
  const [activeModalItem, setActiveModalItem] = useState<SelectedCut | null>(null);

  // Available unique clients across video cuts
  const videoClients = useMemo(() => {
    const clients = new Set<string>();
    cuts.filter((c) => (c.category || "video") === "video" && c.client).forEach((c) => clients.add(c.client!));
    return ["all", ...Array.from(clients)];
  }, [cuts]);

  // Filtered cuts based on active segment and selected client
  const filteredCuts = useMemo(() => {
    return cuts.filter((cut) => {
      const category = cut.category || "video";
      if (activeSegment !== "all" && category !== activeSegment) return false;
      if (activeSegment === "video" && selectedClient !== "all" && cut.client !== selectedClient) return false;
      return true;
    });
  }, [cuts, activeSegment, selectedClient]);

  // Counts for each segment
  const counts = useMemo(() => {
    return {
      video: cuts.filter((c) => (c.category || "video") === "video").length,
      branding: cuts.filter((c) => c.category === "branding").length,
      website: cuts.filter((c) => c.category === "website").length,
      all: cuts.length,
    };
  }, [cuts]);

  const isTikTok = (url?: string) => url?.includes("tiktok.com");

  return (
    <section className="section selected-content" id="portfolio-showcase">
      <Reveal>
        <SectionIntro
          number="03"
          eyebrow="Portfolio & Selected Cuts"
          title="Work crafted for attention and performance."
          copy="Explore our multi-disciplinary showcase across commercial video reels, comprehensive brand identities, and bespoke website designs."
        />
      </Reveal>

      {/* Segment Switcher */}
      <div className="portfolio-segment-bar" style={{ marginTop: "2rem", marginBottom: "1.5rem" }}>
        <div className="work-filter-tabs" role="tablist" style={{ justifyContent: "flex-start", flexWrap: "wrap", gap: "0.5rem" }}>
          <button
            type="button"
            className={`work-filter-tab ${activeSegment === "video" ? "is-active" : ""}`}
            onClick={() => { setActiveSegment("video"); setSelectedClient("all"); }}
          >
            <Video size={15} style={{ marginRight: "0.4rem", verticalAlign: "middle" }} />
            Video Portfolio
            <span className="work-filter-count">{counts.video}</span>
          </button>

          <button
            type="button"
            className={`work-filter-tab ${activeSegment === "branding" ? "is-active" : ""}`}
            onClick={() => { setActiveSegment("branding"); setSelectedClient("all"); }}
          >
            <Palette size={15} style={{ marginRight: "0.4rem", verticalAlign: "middle" }} />
            Branding
            <span className="work-filter-count">{counts.branding}</span>
          </button>

          <button
            type="button"
            className={`work-filter-tab ${activeSegment === "website" ? "is-active" : ""}`}
            onClick={() => { setActiveSegment("website"); setSelectedClient("all"); }}
          >
            <Globe size={15} style={{ marginRight: "0.4rem", verticalAlign: "middle" }} />
            Website Design
            <span className="work-filter-count">{counts.website}</span>
          </button>

          <button
            type="button"
            className={`work-filter-tab ${activeSegment === "all" ? "is-active" : ""}`}
            onClick={() => { setActiveSegment("all"); setSelectedClient("all"); }}
          >
            <Sparkles size={15} style={{ marginRight: "0.4rem", verticalAlign: "middle" }} />
            All Work
            <span className="work-filter-count">{counts.all}</span>
          </button>
        </div>
      </div>

      {/* Brand / Client Sub-Filter (Visible on Video Portfolio) */}
      {activeSegment === "video" && videoClients.length > 2 && (
        <div
          className="brand-pill-strip"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.4rem",
            marginBottom: "2rem",
            padding: "0.75rem 1rem",
            backgroundColor: "var(--bg-card, rgba(255,255,255,0.03))",
            border: "1px solid var(--line, rgba(255,255,255,0.08))",
            borderRadius: "12px",
          }}
        >
          <span style={{ fontSize: "0.75rem", textTransform: "uppercase", opacity: 0.6, alignSelf: "center", marginRight: "0.5rem", letterSpacing: "0.08em" }}>
            Filter by Client:
          </span>
          {videoClients.map((client) => {
            const isSelected = selectedClient === client;
            return (
              <button
                key={client}
                type="button"
                onClick={() => setSelectedClient(client)}
                style={{
                  fontSize: "0.78rem",
                  padding: "0.3rem 0.75rem",
                  borderRadius: "999px",
                  border: isSelected ? "1px solid var(--lime, #A3E635)" : "1px solid var(--line, rgba(255,255,255,0.12))",
                  backgroundColor: isSelected ? "var(--lime, #A3E635)" : "transparent",
                  color: isSelected ? "#000" : "inherit",
                  fontWeight: isSelected ? 600 : 400,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                {client === "all" ? "All Brands" : client}
              </button>
            );
          })}
        </div>
      )}

      {/* Grid of Portfolio Cuts */}
      <div className="content-reel" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
        {filteredCuts.map((cut, index) => {
          const isVideoCategory = (cut.category || "video") === "video";
          const hasThumbnail = cut.thumbnailUrl && cut.thumbnailUrl.trim().length > 0;

          return (
            <div
              className={`content-cut cut-${(index % 4) + 1}`}
              key={cut.id || index}
              onClick={() => setActiveModalItem(cut)}
              style={{
                cursor: "pointer",
                minHeight: "260px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
                borderRadius: "14px",
                overflow: "hidden",
                border: "1px solid var(--line, rgba(255,255,255,0.1))",
                padding: "1.25rem",
                transition: "transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease",
              }}
            >
              {/* Thumbnail backdrop if available */}
              {hasThumbnail ? (
                <div className="content-cut-bg" style={{ position: "absolute", inset: 0, opacity: 0.3, zIndex: 0, overflow: "hidden" }}>
                  <Image src={cut.thumbnailUrl!} alt={cut.title} fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, 33vw" />
                </div>
              ) : (
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(0,174,240,0.06), rgba(163,230,53,0.04))", zIndex: 0 }} />
              )}

              {/* Card Top: Number & Category Badge */}
              <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="content-no" style={{ fontWeight: 700, fontSize: "0.85rem", opacity: 0.8 }}>
                  {cut.number || `0${index + 1}`}
                </span>
                <span
                  style={{
                    fontSize: "0.7rem",
                    padding: "0.2rem 0.5rem",
                    borderRadius: "4px",
                    backgroundColor: "rgba(0,0,0,0.4)",
                    border: "1px solid var(--line, rgba(255,255,255,0.15))",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  {cut.meta || (isVideoCategory ? "REEL" : cut.category)}
                </span>
              </div>

              {/* Card Center: Play indicator or Category icon */}
              <div
                style={{
                  position: "relative",
                  zIndex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "1.5rem 0",
                }}
              >
                <div
                  className="content-motion"
                  aria-hidden="true"
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(0,0,0,0.6)",
                    border: "1px solid var(--line, rgba(255,255,255,0.2))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                  }}
                >
                  {isVideoCategory ? (
                    <Play fill="currentColor" size={20} style={{ marginLeft: "3px" }} />
                  ) : cut.category === "branding" ? (
                    <Palette size={20} />
                  ) : (
                    <Globe size={20} />
                  )}
                </div>
              </div>

              {/* Card Bottom: Client, Title & Action */}
              <div style={{ position: "relative", zIndex: 1 }}>
                {cut.client && (
                  <div
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      color: "var(--cyan, #00AEF0)",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      marginBottom: "0.25rem",
                    }}
                  >
                    {cut.client}
                  </div>
                )}
                <h3 style={{ fontSize: "1.05rem", fontWeight: 600, lineHeight: 1.3, margin: "0 0 0.5rem" }}>
                  {cut.title}
                </h3>
                <p style={{ fontSize: "0.82rem", opacity: 0.75, margin: "0 0 0.75rem", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {cut.description || (isVideoCategory ? "Watch commercial cut on TikTok" : "View showcase details")}
                </p>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.75rem" }}>
                  <span style={{ color: "var(--lime, #A3E635)", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                    {isVideoCategory ? (isTikTok(cut.videoUrl) ? "TikTok Video" : "Watch Video") : "Explore Work"} <ArrowUpRight size={12} />
                  </span>

                  {cut.linkUrl && cut.linkUrl.startsWith("/work/") && (
                    <Link
                      href={cut.linkUrl}
                      className="text-link"
                      style={{ fontSize: "0.75rem" }}
                      onClick={(e: React.MouseEvent) => e.stopPropagation()}
                    >
                      Case Study →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCuts.length === 0 && (
        <div style={{ padding: "4rem 2rem", textAlign: "center", border: "1px dashed var(--line)", borderRadius: "12px", opacity: 0.7 }}>
          <p>No portfolio cuts found in this category.</p>
        </div>
      )}

      {/* Lightbox / Video Modal */}
      {activeModalItem && (
        <div
          className="admin-modal-overlay"
          onClick={() => setActiveModalItem(null)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(8px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          <div
            style={{
              position: "relative",
              maxWidth: "680px",
              width: "100%",
              backgroundColor: "var(--bg-card, #0f1620)",
              border: "1px solid var(--line, rgba(255,255,255,0.15))",
              borderRadius: "18px",
              overflow: "hidden",
              boxShadow: "0 30px 80px rgba(0,0,0,0.9)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                padding: "1.25rem 1.5rem",
                borderBottom: "1px solid var(--line, rgba(255,255,255,0.1))",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                  <span style={{ fontSize: "0.72rem", color: "var(--cyan, #00AEF0)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    {activeModalItem.client || "Hadid Portfolio"}
                  </span>
                  <span style={{ fontSize: "0.68rem", opacity: 0.6, letterSpacing: "0.05em", padding: "0.15rem 0.4rem", borderRadius: "3px", border: "1px solid var(--line)" }}>
                    {activeModalItem.meta}
                  </span>
                </div>
                <h3 style={{ fontSize: "1.25rem", margin: 0, fontWeight: 600 }}>{activeModalItem.title}</h3>
              </div>

              <button
                onClick={() => setActiveModalItem(null)}
                type="button"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid var(--line)",
                  borderRadius: "50%",
                  color: "inherit",
                  cursor: "pointer",
                  padding: "0.4rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Media Body */}
            <div style={{ backgroundColor: "#000", position: "relative", width: "100%", minHeight: "320px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
              {isTikTok(activeModalItem.videoUrl) ? (
                <div style={{ width: "100%", textAlign: "center", padding: "2rem 1rem" }}>
                  <div
                    style={{
                      width: "64px",
                      height: "64px",
                      margin: "0 auto 1.25rem",
                      borderRadius: "50%",
                      backgroundColor: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--cyan, #00AEF0)",
                    }}
                  >
                    <Play size={28} fill="currentColor" />
                  </div>
                  <h4 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>TikTok Commercial Video Cut</h4>
                  <p style={{ fontSize: "0.88rem", opacity: 0.75, maxWidth: "420px", margin: "0 auto 1.5rem", lineHeight: 1.4 }}>
                    {activeModalItem.description || "Crafted by Hadid Creatives for high social retention and organic discovery."}
                  </p>

                  <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                    <a
                      href={activeModalItem.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="button button-lime"
                      style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem", padding: "0.7rem 1.4rem" }}
                    >
                      Watch Cut on TikTok <ExternalLink size={16} />
                    </a>

                    {activeModalItem.linkUrl && activeModalItem.linkUrl.startsWith("/work/") && (
                      <Link
                        href={activeModalItem.linkUrl}
                        className="button"
                        style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem", padding: "0.7rem 1.4rem", backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid var(--line)" }}
                      >
                        Explore Case Study <ArrowUpRight size={16} />
                      </Link>
                    )}
                  </div>
                </div>
              ) : activeModalItem.videoUrl && (activeModalItem.videoUrl.includes("youtube.com") || activeModalItem.videoUrl.includes("youtu.be")) ? (
                <iframe
                  src={activeModalItem.videoUrl.replace("watch?v=", "embed/")}
                  style={{ width: "100%", height: "400px", border: 0, borderRadius: "8px" }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : activeModalItem.videoUrl && activeModalItem.videoUrl.endsWith(".mp4") ? (
                <video
                  src={activeModalItem.videoUrl}
                  controls
                  autoPlay
                  style={{ width: "100%", maxHeight: "480px", objectFit: "contain", borderRadius: "8px" }}
                />
              ) : (
                /* Branding or Website Design Preview */
                <div style={{ width: "100%", textAlign: "center", padding: "2rem 1rem" }}>
                  {activeModalItem.thumbnailUrl && (
                    <div style={{ position: "relative", width: "100%", height: "240px", marginBottom: "1.25rem", borderRadius: "10px", overflow: "hidden" }}>
                      <Image src={activeModalItem.thumbnailUrl} alt={activeModalItem.title} fill style={{ objectFit: "cover" }} />
                    </div>
                  )}
                  <p style={{ fontSize: "0.92rem", opacity: 0.85, maxWidth: "500px", margin: "0 auto 1.5rem", lineHeight: 1.5 }}>
                    {activeModalItem.description}
                  </p>
                  {activeModalItem.linkUrl && activeModalItem.linkUrl !== "#" && (
                    <Link
                      href={activeModalItem.linkUrl}
                      className="button button-lime"
                      style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
                    >
                      Open Full Project <ArrowUpRight size={16} />
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{ padding: "1rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--line, rgba(255,255,255,0.1))" }}>
              <span style={{ fontSize: "0.78rem", opacity: 0.7 }}>
                Category: <strong style={{ color: "var(--lime, #A3E635)", textTransform: "capitalize" }}>{activeModalItem.category || "Video"}</strong>
              </span>
              <button
                type="button"
                onClick={() => setActiveModalItem(null)}
                style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", fontSize: "0.82rem", opacity: 0.8 }}
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
