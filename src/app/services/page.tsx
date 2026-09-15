import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { PageEntry, Reveal } from "@/components/Motion";
import { ServicesNav } from "@/components/ServicesNav";
import { FAQSection } from "@/components/FAQSection";
import { WhatsAppCTA } from "@/components/WhatsAppCTA";
import { siteConfig } from "@/content/site";
import { readData } from "@/lib/db";
import { getAllServices, getText } from "@/lib/content";
import type { FAQ } from "@/lib/types";

export const metadata: Metadata = {
  title: "Services",
  description: "Content creation, social media management, paid social, website design, consultancy, and training from Hadid Creatives.",
};

export default async function ServicesPage() {
  const services = await getAllServices();
  const faqs = await readData<FAQ[]>("faqs", []);
  const sortedFaqs = Array.isArray(faqs) ? [...faqs].sort((a, b) => (a.order || 0) - (b.order || 0)) : [];

  const heroEyebrow = await getText("services.hero.eyebrow", "SERVICES / CAPABILITIES");
  const heroBadge = await getText("services.hero.badge", "05 CONNECTED SYSTEMS");
  const heroHeadline = await getText("services.hero.headline", "Make the brand move as one.");
  const heroSubline = await getText(
    "services.hero.subline",
    "From strategy to production to distribution, Hadid connects the disciplines that shape a serious digital presence."
  );
  const heroNote = await getText("services.hero.note", "NO FIXED PACKAGES / BUILT AROUND THE BRIEF");

  const auditMicroLabel = await getText("services.audit.microLabel", "NOT SURE WHERE THE GAP IS?");
  const auditTitle = await getText("services.audit.title", "Start with the digital presence, not a pre-built package.");
  const auditCopy = await getText(
    "services.audit.copy",
    "We can review the current content, channels, website, workflow, and business objective—then identify what needs to change first."
  );
  const auditCta = await getText("services.audit.cta", "Discuss the brief");

  return (
    <PageEntry>
      <section className="page-hero services-page-hero">
        <div className="page-hero-meta"><span>{heroEyebrow}</span><span>{heroBadge}</span></div>
        <h1>
          {heroHeadline.includes("move as one") ? (
            <>Make the brand<br /><em>move as one.</em></>
          ) : (
            heroHeadline
          )}
        </h1>
        <div className="page-hero-bottom">
          <p>{heroSubline}</p>
          <span>{heroNote}</span>
        </div>
      </section>

      <section className="section" style={{ paddingBottom: 0, paddingTop: 0 }}>
        <ServicesNav services={services} />
      </section>

      <section className="section service-detail-list">
        {services.map((service, index) => (
          <div key={service.id} id={`service-${service.id}`} style={{ scrollMarginTop: "6rem" }}>
            <Reveal className="service-detail">
              <div className="service-detail-index"><span>{service.id}</span><span>SERVICE</span></div>
              <div className="service-detail-copy">
                <h2>{service.title}</h2>
                <strong>{service.short}</strong>
                <p>{service.description}</p>
              </div>
              <ul>
                {service.capabilities.map((capability) => <li key={capability}><span>0{index + 1}</span>{capability}</li>)}
              </ul>
            </Reveal>
          </div>
        ))}
      </section>

      {sortedFaqs.length > 0 && <FAQSection items={sortedFaqs} />}

      <section className="section service-audit">
        <span className="micro-label">{auditMicroLabel}</span>
        <h2>{auditTitle}</h2>
        <p>{auditCopy}</p>
        <a className="button button-lime" href={siteConfig.whatsappHref} target="_blank" rel="noreferrer">
          {auditCta} <ArrowUpRight aria-hidden="true" />
        </a>
      </section>
      <WhatsAppCTA compact />
    </PageEntry>
  );
}
