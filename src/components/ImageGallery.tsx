"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useState } from "react";

export function ImageGallery({ images }: { images: string[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (images.length === 0) return null;

  return (
    <>
      <div className="image-gallery">
        {images.map((src, i) => (
          <button
            key={src}
            className="gallery-thumb"
            type="button"
            onClick={() => setLightboxIndex(i)}
          >
            <Image src={src} alt={`Gallery image ${i + 1}`} fill sizes="(max-width:768px) 50vw, 25vw" style={{ objectFit: "cover" }} />
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <div className="lightbox-overlay" onClick={() => setLightboxIndex(null)}>
          <button className="lightbox-close" type="button" onClick={() => setLightboxIndex(null)}>
            <X size={28} />
          </button>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[lightboxIndex]}
              alt={`Gallery image ${lightboxIndex + 1}`}
              width={1200}
              height={800}
              style={{ objectFit: "contain", maxHeight: "90vh", width: "auto" }}
            />
            <div className="lightbox-nav">
              <button
                type="button"
                disabled={lightboxIndex === 0}
                onClick={() => setLightboxIndex(lightboxIndex - 1)}
              >
                ← Prev
              </button>
              <span>{lightboxIndex + 1} / {images.length}</span>
              <button
                type="button"
                disabled={lightboxIndex === images.length - 1}
                onClick={() => setLightboxIndex(lightboxIndex + 1)}
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
