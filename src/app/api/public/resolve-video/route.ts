import { NextRequest, NextResponse } from "next/server";
import { extractTikTokId, extractYouTubeId, extractVimeoId } from "@/lib/video";

const resolveCache = new Map<string, { videoId: string | null; embedUrl: string | null; canonicalUrl: string | null }>();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  // Check memory cache
  if (resolveCache.has(url)) {
    return NextResponse.json({ success: true, ...resolveCache.get(url) });
  }

  // 1. Direct YouTube
  const ytId = extractYouTubeId(url);
  if (ytId) {
    const result = {
      type: "youtube" as const,
      videoId: ytId,
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0`,
      canonicalUrl: `https://www.youtube.com/watch?v=${ytId}`,
    };
    resolveCache.set(url, result);
    return NextResponse.json({ success: true, ...result });
  }

  // 2. Direct Vimeo
  const vimeoId = extractVimeoId(url);
  if (vimeoId) {
    const result = {
      type: "vimeo" as const,
      videoId: vimeoId,
      embedUrl: `https://player.vimeo.com/video/${vimeoId}?autoplay=1`,
      canonicalUrl: `https://vimeo.com/${vimeoId}`,
    };
    resolveCache.set(url, result);
    return NextResponse.json({ success: true, ...result });
  }

  // 3. Direct TikTok video ID already present
  const directTtId = extractTikTokId(url);
  if (directTtId) {
    const result = {
      type: "tiktok" as const,
      videoId: directTtId,
      embedUrl: `https://www.tiktok.com/player/v1/${directTtId}?autoplay=1`,
      canonicalUrl: url,
    };
    resolveCache.set(url, result);
    return NextResponse.json({ success: true, ...result });
  }

  // 4. Resolve TikTok short URL (vt.tiktok.com / vm.tiktok.com)
  if (url.includes("tiktok.com")) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(url, {
        method: "HEAD",
        redirect: "manual",
        signal: controller.signal,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      });
      clearTimeout(timeout);

      const location = res.headers.get("location") || "";
      const match = location.match(/\/video\/(\d+)/);
      const videoId = match ? match[1] : null;

      if (videoId) {
        const result = {
          type: "tiktok" as const,
          videoId,
          embedUrl: `https://www.tiktok.com/player/v1/${videoId}?autoplay=1`,
          canonicalUrl: location.split("?")[0],
        };
        resolveCache.set(url, result);
        return NextResponse.json({ success: true, ...result });
      }
    } catch (e) {
      console.warn("Could not resolve TikTok redirect:", (e as Error).message);
    }
  }

  // Direct media file (.mp4)
  if (url.match(/\.(mp4|webm|mov)(\?.*)?$/i)) {
    const result = {
      type: "mp4" as const,
      videoId: null,
      embedUrl: url,
      canonicalUrl: url,
    };
    resolveCache.set(url, result);
    return NextResponse.json({ success: true, ...result });
  }

  return NextResponse.json({
    success: false,
    videoId: null,
    embedUrl: null,
    canonicalUrl: url,
  });
}
