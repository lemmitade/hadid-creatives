"use client";

import { useState } from "react";
import { CaseStudyCard } from "@/components/CaseStudyCard";
import { Reveal } from "@/components/Motion";
import type { CaseStudy } from "@/content/site";

export function WorkFilterSection({ caseStudies }: { caseStudies: CaseStudy[] }) {
  const [selectedTab, setSelectedTab] = useState<string>("all");

  const categories = [
    { id: "all", label: "All Work" },
    { id: "content", label: "Content & Production" },
    { id: "social", label: "Social Media" },
    { id: "paid", label: "Paid Social" },
    { id: "brand", label: "Brand Strategy" },
  ];

  const filtered = selectedTab === "all"
    ? caseStudies
    : caseStudies.filter((study) => {
        const servicesText = study.services.join(" ").toLowerCase();
        const industryText = study.industry.toLowerCase();
        if (selectedTab === "content") return servicesText.includes("content") || servicesText.includes("video") || servicesText.includes("production");
        if (selectedTab === "social") return servicesText.includes("social") || servicesText.includes("management") || servicesText.includes("calendar");
        if (selectedTab === "paid") return servicesText.includes("paid") || servicesText.includes("boosting") || servicesText.includes("lead");
        if (selectedTab === "brand") return servicesText.includes("brand") || servicesText.includes("strategy") || industryText.includes("brand");
        return true;
      });

  return (
    <section className="section work-index-section">
      <div className="work-filter-tabs" role="tablist" aria-label="Filter case studies by service">
        {categories.map((cat) => {
          const isActive = selectedTab === cat.id;
          return (
            <button
              key={cat.id}
              role="tab"
              aria-selected={isActive}
              className={`work-filter-tab ${isActive ? "is-active" : ""}`}
              onClick={() => setSelectedTab(cat.id)}
            >
              {cat.label}
              <span className="work-filter-count">
                {cat.id === "all"
                  ? caseStudies.length
                  : caseStudies.filter((s) => {
                      const st = s.services.join(" ").toLowerCase();
                      const it = s.industry.toLowerCase();
                      if (cat.id === "content") return st.includes("content") || st.includes("video") || st.includes("production");
                      if (cat.id === "social") return st.includes("social") || st.includes("management") || st.includes("calendar");
                      if (cat.id === "paid") return st.includes("paid") || st.includes("boosting") || st.includes("lead");
                      if (cat.id === "brand") return st.includes("brand") || st.includes("strategy") || it.includes("brand");
                      return true;
                    }).length}
              </span>
            </button>
          );
        })}
      </div>

      <div className="case-grid">
        {filtered.map((study, index) => (
          <Reveal key={`${selectedTab}-${study.slug}`} delay={(index % 2) * 0.08}>
            <CaseStudyCard study={study} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
