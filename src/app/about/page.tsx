import type { Metadata } from "next";
import Image from "next/image";
import { PageEntry, Reveal } from "@/components/Motion";
import { TeamSection } from "@/components/TeamSection";
import { DownloadSection } from "@/components/DownloadSection";
import { WhatsAppCTA } from "@/components/WhatsAppCTA";
import { mediaConfig } from "@/content/site";
import { getText } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description: "Hadid Creatives is one scalable creative collective founded in 2024 around strategy, storytelling, production, design, and growth.",
};

export default async function AboutPage() {
  const heroEyebrow = await getText("about.hero.eyebrow", "ABOUT / HADID");
  const heroBadge = await getText("about.hero.badge", "ONE IDENTITY / MANY DISCIPLINES");
  const heroHeadline = await getText("about.hero.headline", "Not a collection of personalities. A creative force.");

  const storyMicroLabel = await getText("about.story.microLabel", "THE BEGINNING / 2024");
  const storyLead = await getText("about.story.lead", "Five friends found that their talents made more sense together.");
  const storyP1 = await getText(
    "about.story.p1",
    "Hadid Creatives began in 2024 when five friends working across digital marketing discovered that their individual talents formed something far stronger together."
  );
  const storyP2 = await getText(
    "about.story.p2",
    "Strategy, storytelling, production, design, and growth came together naturally—first through shared projects, then as a unified creative force."
  );
  const storyP3 = await getText(
    "about.story.p3",
    "What started as a collaboration became Hadid: a collective built to help established brands earn attention, strengthen their digital presence, and turn creativity into measurable business results."
  );

  const principle1Title = await getText("about.principle1.title", "The brand comes first.");
  const principle1Text = await getText("about.principle1.text", "Clients engage with Hadid as one identity, not a rotating cast of individual personalities.");
  const principle2Title = await getText("about.principle2.title", "The right talent joins the brief.");
  const principle2Text = await getText("about.principle2.text", "A collective model stays adaptable as projects, production demands, and categories change.");
  const principle3Title = await getText("about.principle3.title", "The standard stays consistent.");
  const principle3Text = await getText("about.principle3.text", "Different disciplines move through one strategy, one review system, and one expectation of finish.");

  const statementMicro = await getText("about.statement.micro", "HADID / TODAY");
  const statementTitle = await getText("about.statement.title", "Adaptable. Scalable. Always larger than any one individual.");

  return (
    <PageEntry>
      <section className="about-hero">
        <div className="page-hero-meta"><span>{heroEyebrow}</span><span>{heroBadge}</span></div>
        <h1>
          {heroHeadline.includes("personalities") ? (
            <>Not a collection<br />of personalities.<br /><em>A creative force.</em></>
          ) : (
            heroHeadline
          )}
        </h1>
        <div className="about-hero-mark" aria-hidden="true"><Image src={mediaConfig.brandMark} alt="" fill sizes="45vw" priority /></div>
      </section>

      <section className="section about-story">
        <Reveal className="about-story-lead">
          <span className="micro-label">{storyMicroLabel}</span>
          <h2>{storyLead}</h2>
        </Reveal>
        <Reveal className="about-story-body" delay={0.08}>
          <p>{storyP1}</p>
          <p>{storyP2}</p>
          <p>{storyP3}</p>
        </Reveal>
      </section>

      <section className="section collective-principles">
        <article><span>01</span><h3>{principle1Title}</h3><p>{principle1Text}</p></article>
        <article><span>02</span><h3>{principle2Title}</h3><p>{principle2Text}</p></article>
        <article><span>03</span><h3>{principle3Title}</h3><p>{principle3Text}</p></article>
      </section>

      <TeamSection />

      <section className="section about-statement">
        <span>{statementMicro}</span>
        <h2>{statementTitle}</h2>
      </section>

      <DownloadSection />

      <WhatsAppCTA />
    </PageEntry>
  );
}
