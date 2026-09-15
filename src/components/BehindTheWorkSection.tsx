"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Play, X, ExternalLink } from "lucide-react";
import { MediaFrame } from "@/components/MediaFrame";
import { Reveal } from "@/components/Motion";
import { SectionIntro } from "@/components/SectionIntro";
import type { BehindTheWorkItem } from "@/lib/content";

export function BehindTheWorkSection({ items }: { items: BehindTheWorkItem[] }) {
  const [activeVideo, setActiveVideo] = useState<BehindTheWorkItem | null>(null);

  const displayItems = items.length > 0 ? items.slice(0, 2) : [];

  return (
    <section className="section bts-section">
      <Reveal>
        <SectionIntro
          number="04"
          eyebrow="Behind the work"
          title="Strategy on the page. Craft on the set. Precision in the edit."
          copy="The brand stays at the center. The collective works behind it—from the first concept through the final performance review."
        />
      </Reveal>

      <div className="bts-media-grid">
        {displayItems.map((item, idx) => (
          <Reveal key={item.id || idx} delay={idx * 0.08}>
            <div
              style={{ position: "relative", cursor: item.videoUrl ? "pointer" : "default" }}
              onClick={() => {
                if (item.videoUrl) setActiveVideo(item);
              }}
            >
              <MediaFrame
                src={item.mediaUrl || "/media/bts/camera-rig-placeholder.png"}
                alt={item.caption || item.title}
                label={item.equipment || item.phase || "Production / camera"}
                index={`0${idx + 1}`}
              />
              {item.videoUrl && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 2,
                    pointerEvents: "none",
                  }}
                >
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "50%",
                      backgroundColor: "rgba(0,0,0,0.65)",
                      backdropFilter: "blur(8px)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px solid rgba(255,255,255,0.2)",
                    }}
                  >
                    <Play fill="currentColor" size={24} style={{ marginLeft: "3px" }} />
                  </div>
                </div>
              )}
            </div>
          </Reveal>
        ))}
      </div>

      <Link className="wide-link" href="/behind-the-work">
        Go behind the work <ArrowUpRight aria-hidden="true" />
      </Link>

      {/* Video Lightbox Modal */}
      {activeVideo && (
        <div
          className="admin-modal-overlay"
          onClick={() => setActiveVideo(null)}
          style={{ zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}
        >
          <div
            style={{
              position: "relative",
              maxWidth: "800px",
              width: "100%",
              backgroundColor: "var(--bg-card, #0f1620)",
              border: "1px solid var(--line)",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 25px 60px rgba(0,0,0,0.8)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 1.25rem", borderBottom: "1px solid var(--line)" }}>
              <div>
                <span style={{ fontSize: "0.75rem", letterSpacing: "0.08em", opacity: 0.7, textTransform: "uppercase" }}>{activeVideo.phase}</span>
                <h3 style={{ fontSize: "1.1rem", margin: 0 }}>{activeVideo.title}</h3>
              </div>
              <button
                onClick={() => setActiveVideo(null)}
                type="button"
                style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", padding: "0.5rem" }}
                aria-label="Close"
              >
                <X size={22} />
              </button>
            </div>

            <div style={{ backgroundColor: "#000", position: "relative", width: "100%", display: "flex", justifyContent: "center" }}>
              {activeVideo.videoUrl?.includes("youtube.com") || activeVideo.videoUrl?.includes("youtu.be") ? (
                <iframe
                  src={activeVideo.videoUrl.replace("watch?v=", "embed/")}
                  style={{ width: "100%", height: "450px", border: 0 }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={activeVideo.videoUrl}
                  controls
                  autoPlay
                  style={{ width: "100%", maxHeight: "500px", objectFit: "contain" }}
                />
              )}
            </div>

            {(activeVideo.caption || activeVideo.equipment) && (
              <div style={{ padding: "1rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ margin: 0, fontSize: "0.9rem", opacity: 0.85 }}>{activeVideo.caption}</p>
                  {activeVideo.equipment && (
                    <span style={{ fontSize: "0.75rem", opacity: 0.6, display: "block", marginTop: "0.25rem" }}>
                      Equipment: {activeVideo.equipment}
                    </span>
                  )}
                </div>
                {activeVideo.linkUrl && (
                  <Link
                    href={activeVideo.linkUrl}
                    className="admin-btn admin-btn-primary"
                    style={{ fontSize: "0.8rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
                  >
                    View Project <ExternalLink size={14} />
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
