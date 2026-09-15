"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const track = async () => {
      try {
        await fetch("/api/public/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "pageview",
            path: pathname,
            referrer: document.referrer,
          }),
        });
      } catch {
        /* silent */
      }
    };
    track();
  }, [pathname]);

  return null;
}

/**
 * Call this function to track a CTA click or other event.
 */
export function trackEvent(name: string, meta?: string) {
  fetch("/api/public/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "event",
      name,
      path: window.location.pathname,
      meta,
    }),
  }).catch(() => {
    /* silent */
  });
}
