import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { MediaFrame } from "@/components/MediaFrame";
import { PageEntry, Reveal } from "@/components/Motion";
import { WhatsAppCTA } from "@/components/WhatsAppCTA";
import { mediaConfig } from "@/content/site";
import { getAllCaseStudies, getDynamicCaseStudy } from "@/lib/content";

export async function generateStaticParams() {
  const all = await getAllCaseStudies();
  return all.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const study = await getDynamicCaseStudy(slug);
  if (!study) return {};
  return {
    title: study.client,
    description: `${study.client} — ${study.summary}`,
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = await getDynamicCaseStudy(slug);
  if (!study) {
    notFound();
    return null;
  }

  const caseStudies = await getAllCaseStudies();
  const currentIndex = caseStudies.findIndex((item) => item.slug === study.slug);
  const nextStudy = caseStudies[(currentIndex + 1) % caseStudies.length] || study;

  return (
    <PageEntry>
      <section className={`case-hero case-${study.palette}`}>
        <div className="case-hero-nav">
          <Link href="/work"><ArrowLeft aria-hidden="true" /> All work</Link>
          <span>{study.number} / 04</span>
        </div>
        <div className="case-hero-copy">
          <div><span>{study.industry}</span><span>Verified case study</span></div>
          <h1>{study.client}</h1>
          <p>{study.summary}</p>
        </div>
        <div className="case-hero-visual" aria-hidden="true">
          {study.coverImage ? (
            <div className="case-hero-image-wrap">
              <Image
                src={study.coverImage}
                alt={study.client}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="case-hero-image"
              />
              <div className="case-hero-image-overlay" />
            </div>
          ) : null}
          <span className="case-hero-orbit" />
          <span className="case-hero-mark">{study.client.slice(0, 2).toUpperCase()}</span>
          <span className="case-hero-code">CASE / {study.number} / OUTCOME</span>
        </div>
        <div className="case-hero-result"><strong>{study.headlineMetric}</strong><span>{study.headlineLabel}</span></div>
      </section>

      <section className="section case-overview">
        <Reveal className="case-overview-lead">
          <span className="micro-label">THE ASSIGNMENT</span>
          <h2>{study.challenge}</h2>
        </Reveal>
        <Reveal className="case-overview-text" delay={0.08}>
          <div><span>Approach</span><p>{study.approach}</p></div>
          <div><span>Outcome</span><p>{study.outcome}</p></div>
          <div className="tag-list">{study.services.map((service) => <span key={service}>{service}</span>)}</div>
        </Reveal>
      </section>

      <section className="section case-results">
        <div className="section-kicker"><span>01</span><span>VERIFIED RESULTS</span></div>
        <div className="case-metric-grid">
          {study.metrics.map((metric, index) => (
            <Reveal key={metric.label} delay={index * 0.06}>
              <article><span>0{index + 1}</span><strong>{metric.value}</strong><p>{metric.label}</p></article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section case-media-section">
        <div className="section-kicker"><span>02</span><span>CONTENT ARCHIVE</span></div>
        <div className="case-archive-grid">
          {study.coverImage ? (
            <div className="archive-media-slot">
              <Image
                src={study.coverImage}
                alt={`${study.client} Campaign Cover`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="archive-media-img"
              />
              <div className="archive-media-badge">
                <span>01 / CAMPAIGN STILL</span>
                <strong>{study.client}</strong>
              </div>
            </div>
          ) : (
            <div className={`archive-placeholder case-${study.palette}`}>
              <span>CLIENT MEDIA / SLOT 01</span>
              <strong>{study.client}</strong>
              <div className="archive-timeline"><i /><i /><i /><i /><i /></div>
              <p>Replace with final campaign footage</p>
            </div>
          )}
          <div className="archive-note">
            <span>ARCHIVE NOTE</span>
            <h3>The final content library is being organized.</h3>
            <p>This page is already structured for client videos, analytics screenshots, production stills, and supporting context without changing the layout.</p>
          </div>
        </div>
      </section>

      <section className="section case-bts-section">
        <div className="section-kicker"><span>03</span><span>BEHIND THE RESULT</span></div>
        <div className="bts-media-grid">
          <MediaFrame src={mediaConfig.cameraRig} alt="Hands adjusting a professional cinema camera rig" label="Production placeholder" index="01" />
          <MediaFrame src={mediaConfig.editingSuite} alt="Hands at a professional post-production workstation" label="Post-production placeholder" index="02" />
        </div>
      </section>

      <section className="next-case">
        <span>NEXT CASE STUDY</span>
        <Link href={`/work/${nextStudy.slug}`}>
          <span>{nextStudy.client}</span>
          <strong>{nextStudy.headlineMetric}</strong>
          <ArrowUpRight aria-hidden="true" />
        </Link>
      </section>

      <WhatsAppCTA compact />
    </PageEntry>
  );
}
