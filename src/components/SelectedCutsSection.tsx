"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Play,
  ArrowUpRight,
  X,
  ExternalLink,
  Video,
  Palette,
  Globe,
  Sparkles,
  Loader2,
  Share2,
  Check,
} from "lucide-react";
import { Reveal } from "@/components/Motion";
import { SectionIntro } from "@/components/SectionIntro";
import type { SelectedCut } from "@/lib/types";
import { getVideoEmbedInfo } from "@/lib/video";

export function SelectedCutsSection({ cuts }: { cuts: SelectedCut[] }) {
  const [activeSegment, setActiveSegment] = useState<"video" | "branding" | "website" | "all">("video");
  const [selectedClient, setSelectedClient] = useState<string>("all");
  const [activeModalItem, setActiveModalItem] = useState<SelectedCut | null>(null);
  const [resolvedVideoId, setResolvedVideoId] = useState<string | null>(null);
  const [resolving, setResolving] = useState(false);
  const [copied, setCopied] = useState(false);

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

  // Handle active video ID resolution when opening a modal
  useEffect(() => {
    if (!activeModalItem) {
      setResolvedVideoId(null);
      setResolving(false);
      return;
    }

    if (activeModalItem.videoId) {
      setResolvedVideoId(activeModalItem.videoId);
      setResolving(false);
      return;
    }

    const info = getVideoEmbedInfo(activeModalItem.videoUrl);
    if (info.videoId) {
      setResolvedVideoId(info.videoId);
      setResolving(false);
      return;
    }

    // If it's a short URL without cached videoId, resolve via server API
    if (activeModalItem.videoUrl && activeModalItem.videoUrl.includes("tiktok.com")) {
      setResolving(true);
      fetch(`/api/public/resolve-video?url=${encodeURIComponent(activeModalItem.videoUrl)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.videoId) {
            setResolvedVideoId(data.videoId);
          }
        })
        .catch(() => {
          /* fallback to direct link */
        })
        .finally(() => setResolving(false));
    }
  }, [activeModalItem]);

  const copyShareLink = (url?: string) => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="section selected-content" id="portfolio-showcase">
      <Reveal>
        <SectionIntro
          number="03"
          eyebrow="Portfolio & Live Video Cuts"
          title="Work crafted for attention and performance."
          copy="Click any commercial reel to preview and play it directly on this website, or explore our branding and digital platforms."
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
            Video Reels & Cuts
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

      {/* Brand / Client Sub-Filter */}
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
                minHeight: "270px",
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
                    backgroundColor: isVideoCategory ? "rgba(0, 174, 240, 0.2)" : "rgba(0,0,0,0.4)",
                    color: isVideoCategory ? "var(--cyan, #00AEF0)" : "inherit",
                    border: "1px solid var(--line, rgba(255,255,255,0.15))",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                  }}
                >
                  {isVideoCategory ? "▶ PLAY REEL" : cut.category}
                </span>
              </div>

              {/* Card Center: Play indicator */}
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
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    backgroundColor: isVideoCategory ? "rgba(0, 174, 240, 0.85)" : "rgba(0,0,0,0.6)",
                    color: isVideoCategory ? "#000" : "inherit",
                    border: "1px solid rgba(255,255,255,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                    transition: "transform 0.2s ease",
                  }}
                >
                  {isVideoCategory ? (
                    <Play fill="currentColor" size={22} style={{ marginLeft: "3px" }} />
                  ) : cut.category === "branding" ? (
                    <Palette size={22} />
                  ) : (
                    <Globe size={22} />
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
                  {cut.description || "Click to play live commercial cut on website."}
                </p>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.75rem" }}>
                  <span style={{ color: "var(--lime, #A3E635)", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                    {isVideoCategory ? "Preview & Play" : "Explore Showcase"} <ArrowUpRight size={12} />
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

      {/* Interactive Video Player & Showcase Lightbox Modal */}
      {activeModalItem && (
        <div
          className="admin-modal-overlay"
          onClick={() => setActiveModalItem(null)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.9)",
            backdropFilter: "blur(12px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              position: "relative",
              maxWidth: (activeModalItem.category || "video") === "video" ? "420px" : "700px",
              width: "100%",
              backgroundColor: "var(--bg-card, #0f1620)",
              border: "1px solid var(--line, rgba(255,255,255,0.2))",
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0 30px 90px rgba(0,0,0,0.95)",
              margin: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                padding: "1.1rem 1.4rem",
                borderBottom: "1px solid var(--line, rgba(255,255,255,0.1))",
                backgroundColor: "rgba(0,0,0,0.2)",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.2rem" }}>
                  <span style={{ fontSize: "0.72rem", color: "var(--cyan, #00AEF0)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    {activeModalItem.client || "Hadid Creatives"}
                  </span>
                  <span style={{ fontSize: "0.68rem", opacity: 0.6, letterSpacing: "0.05em", padding: "0.15rem 0.4rem", borderRadius: "3px", border: "1px solid var(--line)" }}>
                    {activeModalItem.meta}
                  </span>
                </div>
                <h3 style={{ fontSize: "1.15rem", margin: 0, fontWeight: 600, lineHeight: 1.3 }}>{activeModalItem.title}</h3>
              </div>

              <button
                onClick={() => setActiveModalItem(null)}
                type="button"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid var(--line)",
                  borderRadius: "50%",
                  color: "inherit",
                  cursor: "pointer",
                  padding: "0.4rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: "0.75rem",
                }}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Media Body: LIVE VIDEO EMBED PLAYER */}
            <div style={{ backgroundColor: "#000", position: "relative", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "360px" }}>
              {/* 1. TikTok Live Player */}
              {(activeModalItem.category || "video") === "video" && (activeModalItem.videoUrl?.includes("tiktok.com") || resolvedVideoId) ? (
                resolving ? (
                  <div style={{ padding: "4rem 2rem", textAlign: "center", color: "var(--cyan, #00AEF0)" }}>
                    <Loader2 size={36} className="animate-spin" style={{ margin: "0 auto 1rem" }} />
                    <p style={{ fontSize: "0.9rem", color: "#fff", opacity: 0.8 }}>Loading video stream player…</p>
                  </div>
                ) : resolvedVideoId ? (
                  <div style={{ width: "100%", display: "flex", justifyContent: "center", padding: "0.75rem 0", background: "#000" }}>
                    <iframe
                      src={`https://www.tiktok.com/player/v1/${resolvedVideoId}?autoplay=1&description=0`}
                      style={{
                        width: "100%",
                        maxWidth: "340px",
                        height: "580px",
                        border: 0,
                        borderRadius: "14px",
                        boxShadow: "0 10px 40px rgba(0,0,0,0.8)",
                      }}
                      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={activeModalItem.title}
                    />
                  </div>
                ) : (
                  <div style={{ width: "100%", textAlign: "center", padding: "2.5rem 1.5rem" }}>
                    <div style={{ width: "54px", height: "54px", borderRadius: "50%", backgroundColor: "rgba(0,174,240,0.15)", color: "var(--cyan, #00AEF0)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
                      <Play size={24} fill="currentColor" />
                    </div>
                    <h4 style={{ fontSize: "1.05rem", marginBottom: "0.5rem" }}>TikTok Commercial Video Cut</h4>
                    <p style={{ fontSize: "0.85rem", opacity: 0.75, maxWidth: "340px", margin: "0 auto 1.5rem" }}>
                      {activeModalItem.description}
                    </p>
                    <a
                      href={activeModalItem.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="button button-lime"
                      style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.88rem" }}
                    >
                      Watch on TikTok <ExternalLink size={15} />
                    </a>
                  </div>
                )
              ) : activeModalItem.videoUrl && (activeModalItem.videoUrl.includes("youtube.com") || activeModalItem.videoUrl.includes("youtu.be")) ? (
                /* 2. YouTube Live Player */
                <div style={{ width: "100%", aspectRatio: "16/9" }}>
                  <iframe
                    src={activeModalItem.videoUrl.replace("watch?v=", "embed/") + "?autoplay=1"}
                    style={{ width: "100%", height: "100%", border: 0 }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={activeModalItem.title}
                  />
                </div>
              ) : activeModalItem.videoUrl && activeModalItem.videoUrl.includes("vimeo.com") ? (
                /* 3. Vimeo Live Player */
                <div style={{ width: "100%", aspectRatio: "16/9" }}>
                  <iframe
                    src={`https://player.vimeo.com/video/${activeModalItem.videoUrl.split("/").pop()}?autoplay=1`}
                    style={{ width: "100%", height: "100%", border: 0 }}
                    allow="accelerometer; autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    title={activeModalItem.title}
                  />
                </div>
              ) : activeModalItem.videoUrl && activeModalItem.videoUrl.endsWith(".mp4") ? (
                /* 4. Native HTML5 MP4 Player */
                <video
                  src={activeModalItem.videoUrl}
                  controls
                  autoPlay
                  playsInline
                  style={{ width: "100%", maxHeight: "560px", objectFit: "contain" }}
                />
              ) : (
                /* 5. Branding / Website Showcase */
                <div style={{ width: "100%", textAlign: "center", padding: "2rem 1.5rem" }}>
                  {activeModalItem.thumbnailUrl && (
                    <div style={{ position: "relative", width: "100%", height: "260px", marginBottom: "1.25rem", borderRadius: "10px", overflow: "hidden" }}>
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

            {/* Modal Actions & Footer */}
            <div style={{ padding: "0.9rem 1.4rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--line, rgba(255,255,255,0.1))", flexWrap: "wrap", gap: "0.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                {activeModalItem.videoUrl && (
                  <a
                    href={activeModalItem.canonicalUrl || activeModalItem.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: "0.78rem", color: "var(--cyan, #00AEF0)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
                  >
                    Watch on TikTok <ExternalLink size={12} />
                  </a>
                )}
                {activeModalItem.videoUrl && (
                  <button
                    type="button"
                    onClick={() => copyShareLink(activeModalItem.canonicalUrl || activeModalItem.videoUrl)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "inherit",
                      cursor: "pointer",
                      fontSize: "0.78rem",
                      opacity: 0.75,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.3rem",
                    }}
                  >
                    {copied ? <Check size={12} color="var(--lime, #A3E635)" /> : <Share2 size={12} />}
                    {copied ? "Link Copied!" : "Share Link"}
                  </button>
                )}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                {activeModalItem.linkUrl && activeModalItem.linkUrl.startsWith("/work/") && (
                  <Link
                    href={activeModalItem.linkUrl}
                    style={{ fontSize: "0.78rem", color: "var(--lime, #A3E635)", textDecoration: "none", fontWeight: 600 }}
                  >
                    Case Study →
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => setActiveModalItem(null)}
                  style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", fontSize: "0.78rem", opacity: 0.6 }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
