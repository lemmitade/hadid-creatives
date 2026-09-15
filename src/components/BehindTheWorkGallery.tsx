"use client";

import { useState } from "react";
import Link from "next/link";
import { Play, X, ExternalLink, ArrowUpRight } from "lucide-react";
import { MediaFrame } from "@/components/MediaFrame";
import { Reveal } from "@/components/Motion";
import type { BehindTheWorkItem } from "@/lib/content";

export function BehindTheWorkGallery({ items }: { items: BehindTheWorkItem[] }) {
  const [activeVideo, setActiveVideo] = useState<BehindTheWorkItem | null>(null);

  if (!items || items.length === 0) return null;

  return (
    <>
      <section className="section bts-feature-grid">
        {items.map((item, idx) => (
          <Reveal key={item.id || idx} delay={idx * 0.05}>
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
                index={idx < 9 ? `0${idx + 1}` : `${idx + 1}`}
                priority={idx === 0}
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
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      backgroundColor: "rgba(0,0,0,0.7)",
                      backdropFilter: "blur(8px)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px solid rgba(255,255,255,0.25)",
                    }}
                  >
                    <Play fill="currentColor" size={26} style={{ marginLeft: "4px" }} />
                  </div>
                </div>
              )}
            </div>
            {(item.caption || item.linkUrl) && (
              <div style={{ marginTop: "0.75rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
                <p style={{ margin: 0, fontSize: "0.85rem", opacity: 0.8 }}>{item.caption || item.title}</p>
                {item.linkUrl && (
                  <Link href={item.linkUrl} className="text-link" style={{ fontSize: "0.8rem", whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                    Project <ArrowUpRight size={12} />
                  </Link>
                )}
              </div>
            )}
          </Reveal>
        ))}
      </section>

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
    </>
  );
}
