import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageEntry, Reveal } from "@/components/Motion";
import { SectionIntro } from "@/components/SectionIntro";
import { WorkFilterSection } from "@/components/WorkFilterSection";
import { SelectedCutsSection } from "@/components/SelectedCutsSection";
import { WhatsAppCTA } from "@/components/WhatsAppCTA";
import { getAllCaseStudies, getSelectedCuts, getText } from "@/lib/content";

export const metadata: Metadata = {
  title: "Selected Work",
  description: "Verified social media, video reels, brand systems, and website design case studies from Hadid Creatives.",
};

export default async function WorkPage() {
  const caseStudies = await getAllCaseStudies();
  const selectedCuts = await getSelectedCuts();

  const heroEyebrow = await getText("work.hero.eyebrow", "WORK / INDEX");
  const heroBadge = await getText("work.hero.badge", "2024—ONGOING");
  const heroHeadline = await getText("work.hero.headline", "Work that moves with purpose.");
  const heroSubline = await getText(
    "work.hero.subline",
    "Content, social systems, and measurable outcomes across furniture, real estate, food and beverage, and brand launches."
  );

  const indexEyebrow = await getText("work.index.eyebrow", "Case-study index");
  const indexTitle = await getText("work.index.title", "Every number has a name behind it.");

  const manifestoMicro = await getText("work.manifesto.micro", "THE HADID STANDARD");
  const manifestoTitle = await getText("work.manifesto.title", "Strong finish. Clear system. A result the business can point to.");

  return (
    <PageEntry>
      <section className="page-hero work-page-hero">
        <div className="page-hero-meta"><span>{heroEyebrow}</span><span>{heroBadge}</span></div>
        <h1>
          {heroHeadline.includes("with purpose") ? (
            <>Work that moves<br /><em>with purpose.</em></>
          ) : (
            heroHeadline
          )}
        </h1>
        <div className="page-hero-bottom">
          <p>{heroSubline}</p>
          <span>{caseStudies.length < 10 ? `0${caseStudies.length}` : caseStudies.length} / PUBLIC CASES</span>
        </div>
      </section>

      <section className="section" style={{ paddingBottom: 0 }}>
        <Reveal>
          <SectionIntro number="01" eyebrow={indexEyebrow} title={indexTitle} />
        </Reveal>
      </section>

      <WorkFilterSection caseStudies={caseStudies} />

      {/* Showcase featuring Video Portfolio, Branding, and Website Design */}
      <SelectedCutsSection cuts={selectedCuts} />

      <section className="section compact-manifesto">
        <span>{manifestoMicro}</span>
        <h2>{manifestoTitle}</h2>
        <Link className="text-link" href="/services">See how we work <ArrowUpRight aria-hidden="true" /></Link>
      </section>
      <WhatsAppCTA compact />
    </PageEntry>
  );
}
