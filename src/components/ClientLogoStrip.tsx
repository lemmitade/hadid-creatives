import Link from "next/link";
import Image from "next/image";
import { readData } from "@/lib/db";
import type { ClientLogo } from "@/lib/types";

export async function ClientLogoStrip() {
  const logos = await readData<ClientLogo[]>("client-logos", []);
  const enabled = logos.filter((l) => l.enabled).sort((a, b) => a.order - b.order);

  if (enabled.length === 0) return null;

  /* Double the logos so the marquee loops seamlessly */
  const doubled = [...enabled, ...enabled];

  return (
    <section className="logo-strip" aria-label="Our clients">
      <div className="logo-strip-label">TRUSTED BY</div>
      <div className="logo-strip-track">
        <div className="logo-strip-scroll">
          {doubled.map((logo, i) => (
            <Link
              key={`${logo.id}-${i}`}
              href={logo.caseStudySlug ? `/work/${logo.caseStudySlug}` : "#"}
              className="logo-strip-item"
              title={logo.name}
            >
              <Image
                src={logo.logoUrl}
                alt={logo.name}
                width={120}
                height={48}
                style={{ objectFit: "contain" }}
              />
              <span>{logo.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
