import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BehindTheWorkGallery } from "@/components/BehindTheWorkGallery";
import { PageEntry, Reveal } from "@/components/Motion";
import { WhatsAppCTA } from "@/components/WhatsAppCTA";
import { mediaConfig, process } from "@/content/site";
import { getBehindTheWork } from "@/lib/content";

export const metadata: Metadata = {
  title: "Behind the Work",
  description: "See how Hadid Creatives connects strategy, professional production, post-production, and performance review.",
};

const productionPhases = [
  ["01", "Pre-production", "Research, creative direction, concepts, scripts, shot planning, and production logistics."],
  ["02", "Production", "Professional camera systems, lighting, direction, sound, and on-set attention to every frame."],
  ["03", "Post-production", "Editing, pacing, color, motion, captions, sound design, and platform-ready delivery."],
  ["04", "Performance", "Publishing, amplification, reporting, audience response, and the next creative decision."],
];

export default async function BehindTheWorkPage() {
  const behindTheWork = await getBehindTheWork();

  return (
    <PageEntry>
      <section className="bts-page-hero">
        <div className="bts-page-image">
          <Image src={mediaConfig.cameraRig} alt="Hands operating a professional cinema camera" fill sizes="100vw" priority />
          <span />
        </div>
        <div className="page-hero-meta"><span>BEHIND THE WORK</span><span>PROCESS / PRODUCTION / PERFORMANCE</span></div>
        <h1>The work behind<br /><em>the attention.</em></h1>
        <p>Strategy is only useful when it survives the set, the edit, the deadline, and the performance report.</p>
      </section>

      <section className="section production-phases">
        {productionPhases.map(([id, title, text]) => (
          <Reveal className="production-phase" key={id}>
            <span>{id}</span><h2>{title}</h2><p>{text}</p>
          </Reveal>
        ))}
      </section>

      <BehindTheWorkGallery items={behindTheWork} />

      <section className="section production-console">
        <div className="console-screen">
          <span>PROJECT SYSTEM / LIVE</span>
          <div className="console-timeline">{Array.from({ length: 14 }).map((_, index) => <i key={index} />)}</div>
          <strong>One collective.<br />One standard of finish.</strong>
          <div className="console-status"><span>CAM A / READY</span><span>EDIT / ACTIVE</span><span>REPORT / QUEUED</span></div>
        </div>
        <div className="console-copy">
          <span className="micro-label">REPLACEMENT-READY MEDIA</span>
          <h2>Built for the real archive when it arrives.</h2>
          <p>Every image and motion slot is centrally configured. Final BTS footage can replace these neutral placeholders without rebuilding the page.</p>
          <Link className="text-link" href="/work">See the result <ArrowUpRight aria-hidden="true" /></Link>
        </div>
      </section>

      <section className="section process-section process-page-version">
        <div className="process-grid">
          {process.map((step) => <article key={step.id}><span>{step.id}</span><h3>{step.title}</h3><p>{step.text}</p></article>)}
        </div>
      </section>
      <WhatsAppCTA />
    </PageEntry>
  );
}
