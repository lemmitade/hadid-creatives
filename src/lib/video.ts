/**
 * Video helper utilities for extracting video IDs and building embed URLs
 * for TikTok, YouTube, Vimeo, and direct MP4 streams.
 */

export interface VideoEmbedInfo {
  type: "tiktok" | "youtube" | "vimeo" | "mp4" | "external";
  videoId: string | null;
  embedUrl: string | null;
  canonicalUrl?: string;
  isEmbeddable: boolean;
}

export function extractTikTokId(url?: string): string | null {
  if (!url) return null;
  // Direct video URL: tiktok.com/@user/video/1234567890
  const match = url.match(/\/video\/(\d+)/);
  if (match) return match[1];

  // If URL contains only digits or data-video-id
  const digitsMatch = url.match(/^\d{15,22}$/);
  if (digitsMatch) return digitsMatch[0];

  return null;
}

export function extractYouTubeId(url?: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/,
  );
  return match ? match[1] : null;
}

export function extractVimeoId(url?: string): string | null {
  if (!url) return null;
  const match = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/[^/]*\/videos\/|album\/(?:\d+\/)?video\/|video\/|)(\d+)/);
  return match ? match[1] : null;
}

export function getVideoEmbedInfo(url?: string, existingVideoId?: string): VideoEmbedInfo {
  if (!url) {
    return { type: "external", videoId: null, embedUrl: null, isEmbeddable: false };
  }

  // 1. Check TikTok
  const ttId = existingVideoId || extractTikTokId(url);
  if (ttId) {
    return {
      type: "tiktok",
      videoId: ttId,
      embedUrl: `https://www.tiktok.com/player/v1/${ttId}?autoplay=1`,
      isEmbeddable: true,
    };
  }
  if (url.includes("tiktok.com")) {
    return {
      type: "tiktok",
      videoId: null,
      embedUrl: null,
      isEmbeddable: true, // will resolve dynamically or use fallback
    };
  }

  // 2. Check YouTube
  const ytId = extractYouTubeId(url);
  if (ytId) {
    return {
      type: "youtube",
      videoId: ytId,
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0`,
      isEmbeddable: true,
    };
  }

  // 3. Check Vimeo
  const vimeoId = extractVimeoId(url);
  if (vimeoId) {
    return {
      type: "vimeo",
      videoId: vimeoId,
      embedUrl: `https://player.vimeo.com/video/${vimeoId}?autoplay=1`,
      isEmbeddable: true,
    };
  }

  // 4. Direct video file (.mp4, .webm, .mov)
  if (url.match(/\.(mp4|webm|mov)(\?.*)?$/i)) {
    return {
      type: "mp4",
      videoId: null,
      embedUrl: url,
      isEmbeddable: true,
    };
  }

  return {
    type: "external",
    videoId: null,
    embedUrl: url,
    isEmbeddable: false,
  };
}
