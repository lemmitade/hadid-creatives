"use client";

import type { Service } from "@/content/site";

export function ServicesNav({ services }: { services: Service[] }) {
  function scrollToService(id: string) {
    const el = document.getElementById(`service-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <div className="services-tab-nav" role="tablist" aria-label="Jump to a specific service">
      {services.map((s) => (
        <button
          key={s.id}
          className="services-tab-btn"
          onClick={() => scrollToService(s.id)}
          type="button"
        >
          <span className="services-tab-num">{s.id}</span>
          <span className="services-tab-title">{s.title}</span>
        </button>
      ))}
    </div>
  );
}
