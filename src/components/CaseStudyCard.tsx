import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { CaseStudy } from "@/content/site";

export function CaseStudyCard({ study }: { study: CaseStudy }) {
  return (
    <Link className={`case-card case-${study.palette}`} href={`/work/${study.slug}`}>
      <div className="case-card-topline">
        <span>{study.number}</span>
        <span>{study.industry}</span>
        <ArrowUpRight aria-hidden="true" size={22} />
      </div>
      <div className="case-card-visual" aria-hidden="true">
        {study.coverImage ? (
          <>
            <div className="case-card-image-wrap">
              <Image
                src={study.coverImage}
                alt={study.client}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="case-card-image"
              />
              <div className="case-card-image-overlay" />
            </div>
            <span className="case-orbit" />
            <span className="case-scanline" />
            <span className="case-monogram case-monogram-subtle">
              {study.client.slice(0, 2).toUpperCase()}
            </span>
          </>
        ) : (
          <>
            <span className="case-orbit" />
            <span className="case-scanline" />
            <span className="case-monogram">
              {study.client.slice(0, 2).toUpperCase()}
            </span>
          </>
        )}
        <span className="case-play">EXPLORE CASE</span>
      </div>
      <div className="case-card-copy">
        <div>
          <h3>{study.client}</h3>
          <p>{study.summary}</p>
        </div>
        <div className="case-card-metric">
          <strong>{study.headlineMetric}</strong>
          <span>{study.headlineLabel}</span>
        </div>
      </div>
    </Link>
  );
}
