import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, MoveRight, Play } from "lucide-react";
import { AnalyticsPanel } from "@/components/AnalyticsPanel";
import { CaseStudyCard } from "@/components/CaseStudyCard";
import { ClientLogoStrip } from "@/components/ClientLogoStrip";
import { PageEntry, Reveal } from "@/components/Motion";
import { SectionIntro } from "@/components/SectionIntro";
import { BehindTheWorkSection } from "@/components/BehindTheWorkSection";
import { SelectedCutsSection } from "@/components/SelectedCutsSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { WhatsAppCTA } from "@/components/WhatsAppCTA";
import { mediaConfig, siteConfig } from "@/content/site";
import { getAllCaseStudies, getSelectedCuts, getBehindTheWork, getText, getAllServices, getProcessSteps } from "@/lib/content";

export default async function HomePage() {
  const caseStudies = await getAllCaseStudies();
  const selectedCuts = await getSelectedCuts();
  const behindTheWork = await getBehindTheWork();
  const services = await getAllServices();
  const processSteps = await getProcessSteps();

  // Dynamic content overrides from CMS database
  const heroKickerLeft = await getText("home.hero.kickerLeft", "Digital presence / built with intent");
  const heroKickerRight = await getText("home.hero.kickerRight", "EST. 2024");
  const heroHeadline = await getText("home.hero.headline", "Built to be seen. Made to perform.");
  const heroSubline = await getText(
    "home.hero.subline",
    "Hadid Creatives helps established brands strengthen their digital presence through cinematic content, social strategy, paid amplification, web design, and practical consultancy."
  );
  const heroCtaWhatsApp = await getText("home.hero.ctaWhatsApp", "Start on WhatsApp");
  const heroCtaWork = await getText("home.hero.ctaWork", "Explore the work");
  const proofLabel = await getText("home.proof.label", "SELECTED CLIENTS / VERIFIED OUTCOMES");

  const workEyebrow = await getText("home.work.eyebrow", "Selected work");
  const workTitle = await getText("home.work.title", "Proof, not promises.");
  const workCopy = await getText("home.work.copy", "Four engagements. Four different categories. Every number below comes from verified client work.");

  const analyticsEyebrow = await getText("home.analytics.eyebrow", "Results & analytics");
  const analyticsTitle = await getText("home.analytics.title", "Creativity earns attention. Systems turn it into growth.");
  const analyticsCopy = await getText("home.analytics.copy", "We connect the work to a measurable digital objective, then learn from what the audience does next.");
  const analyticsMicroLabel = await getText("home.analytics.microLabel", "MEASURE / READ / IMPROVE");
  const analyticsSubhead = await getText("home.analytics.subhead", "Make the numbers part of the creative process.");
  const analyticsSubtext = await getText("home.analytics.subtext", "Reporting is not a final slide. It is the feedback loop that makes the next concept, campaign, and publishing cycle sharper.");

  const servicesEyebrow = await getText("home.services.eyebrow", "What we do");
  const servicesTitle = await getText("home.services.title", "One creative partner. Five connected capabilities.");

  const processEyebrow = await getText("home.process.eyebrow", "The process");
  const processTitle = await getText("home.process.title", "Simple enough to move. Structured enough to scale.");

  const storyMicroLabel = await getText("home.story.microLabel", "ONE IDENTITY / MANY DISCIPLINES");
  const storyHeadline = await getText("home.story.headline", "Five friends combined their talents. Hadid became the force that held them together.");
  const storyCopy = await getText("home.story.copy", "Founded in 2024, Hadid operates as one identity—adaptable, scalable, and always larger than any one individual.");

  return (
    <PageEntry>
      <section className="home-hero">
        <div className="hero-media">
          <Image
            src={mediaConfig.hero}
            alt="Abstract cinema lens and analytics-inspired production composition"
            fill
            sizes="100vw"
            priority
          />
          <span className="hero-media-shade" />
          <div className="hero-timecode">
            <span>REC</span>
            <span>00:00:14:08</span>
          </div>
          <button className="hero-play" type="button" aria-label="Showreel placeholder">
            <Play fill="currentColor" aria-hidden="true" />
            <span>Showreel<br />coming soon</span>
          </button>
        </div>

        <div className="hero-copy">
          <div className="hero-kicker">
            <span>{heroKickerLeft}</span>
            <span>{heroKickerRight}</span>
          </div>
          <h1>
            {heroHeadline.includes("Built to be") ? (
              <>
                Built to be <span>seen.</span><br />
                Made to <em>perform.</em>
              </>
            ) : (
              heroHeadline
            )}
          </h1>
          <div className="hero-bottom">
            <p>{heroSubline}</p>
            <div className="hero-actions">
              <a className="button button-lime" href={siteConfig.whatsappHref} target="_blank" rel="noreferrer">
                {heroCtaWhatsApp} <ArrowUpRight aria-hidden="true" />
              </a>
              <Link className="text-link" href="/work">
                {heroCtaWork} <MoveRight aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>

        <a className="scroll-cue" href="#proof">
          <ArrowDown aria-hidden="true" /> Scroll for proof
        </a>
      </section>

      <ClientLogoStrip />

      <section className="proof-strip" id="proof" aria-label="Selected client proof">
        <div className="proof-label">{proofLabel}</div>
        <div className="proof-track">
          {["GM FURNITURE", "WORTHY HOMES", "HABESHA BROTHERS", "DAILY WATER", "URBAN FINDS", "TOUCH YOUR VISION"].map((name) => (
            <span key={name}>{name}</span>
          ))}
        </div>
        <div className="proof-stat"><strong>{caseStudies.length}</strong><span>public case studies</span></div>
      </section>

      <section className="section work-section">
        <Reveal>
          <SectionIntro
            number="01"
            eyebrow={workEyebrow}
            title={workTitle}
            copy={workCopy}
          />
        </Reveal>
        <div className="case-grid">
          {caseStudies.map((study, index) => (
            <Reveal key={study.slug} delay={(index % 2) * 0.08}>
              <CaseStudyCard study={study} />
            </Reveal>
          ))}
        </div>
        <Link className="wide-link" href="/work">
          View every case study <ArrowUpRight aria-hidden="true" />
        </Link>
      </section>

      <section className="section analytics-section">
        <Reveal>
          <SectionIntro
            number="02"
            eyebrow={analyticsEyebrow}
            title={analyticsTitle}
            copy={analyticsCopy}
          />
        </Reveal>
        <Reveal className="analytics-layout">
          <div className="analytics-copy">
            <span className="micro-label">{analyticsMicroLabel}</span>
            <h3>{analyticsSubhead}</h3>
            <p>{analyticsSubtext}</p>
            <Link className="text-link" href="/services">See the full service system <MoveRight aria-hidden="true" /></Link>
          </div>
          <AnalyticsPanel />
        </Reveal>
      </section>

      <TestimonialsSection />

      {/* Selected Cuts & Multi-Segment Portfolio Showcase */}
      <SelectedCutsSection cuts={selectedCuts} />

      <BehindTheWorkSection items={behindTheWork} />

      <section className="section services-section">
        <Reveal>
          <SectionIntro
            number="05"
            eyebrow={servicesEyebrow}
            title={servicesTitle}
          />
        </Reveal>
        <div className="service-list">
          {services.map((service) => (
            <Link href={`/services#service-${service.id}`} className="service-row" key={service.id}>
              <span>{service.id}</span>
              <div><h3>{service.title}</h3><p>{service.short}</p></div>
              <ArrowUpRight aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <section className="section process-section">
        <Reveal>
          <SectionIntro
            number="06"
            eyebrow={processEyebrow}
            title={processTitle}
          />
        </Reveal>
        <div className="process-grid">
          {processSteps.map((step) => (
            <article key={step.id}>
              <span>{step.id}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section story-section">
        <div className="story-mark" aria-hidden="true">
          <Image src={mediaConfig.brandMark} alt="" fill sizes="45vw" />
        </div>
        <Reveal className="story-copy">
          <span className="micro-label">{storyMicroLabel}</span>
          <h2>{storyHeadline}</h2>
          <p>{storyCopy}</p>
          <Link className="text-link" href="/about">Read the Hadid story <MoveRight aria-hidden="true" /></Link>
        </Reveal>
      </section>

      <WhatsAppCTA />
    </PageEntry>
  );
}
