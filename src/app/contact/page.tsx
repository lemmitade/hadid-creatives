import type { Metadata } from "next";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { ContactFormStored } from "@/components/ContactFormStored";
import { DiscoveryCallForm } from "@/components/DiscoveryCallForm";
import { PageEntry } from "@/components/Motion";
import { siteConfig } from "@/content/site";
import { getText } from "@/lib/content";
import { readData } from "@/lib/db";
import type { SiteSettings } from "@/lib/types";

export const metadata: Metadata = {
  title: "Contact",
  description: "Start a project conversation with Hadid Creatives on WhatsApp.",
};

export default async function ContactPage() {
  const settings = await readData<SiteSettings | null>("settings", null);

  const heroEyebrow = await getText("contact.hero.eyebrow", "CONTACT / START A PROJECT");
  const heroBadge = await getText("contact.hero.badge", "WHATSAPP FIRST");
  const heroHeadline = await getText("contact.hero.headline", "Let's build the thing people notice.");
  const heroSubline = await getText(
    "contact.hero.subline",
    "Tell us what the business needs to change. We will start with the objective, then shape the right creative system around it."
  );

  const phone = settings?.whatsapp?.phone || siteConfig.whatsappNumber;
  const defaultMessage = "Hello Hadid Creatives, I'd like to discuss growing our digital presence.";
  const whatsappHref = settings?.whatsapp?.phone
    ? `https://wa.me/${settings.whatsapp.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(settings.whatsapp.message || defaultMessage)}`
    : siteConfig.whatsappHref;

  return (
    <PageEntry>
      <section className="contact-page">
        <div className="contact-intro">
          <div className="page-hero-meta"><span>{heroEyebrow}</span><span>{heroBadge}</span></div>
          <h1>
            {heroHeadline.includes("people notice") ? (
              <>Let&apos;s build the thing<br /><em>people notice.</em></>
            ) : (
              heroHeadline
            )}
          </h1>
          <p>{heroSubline}</p>
          <a className="contact-direct" href={whatsappHref} target="_blank" rel="noreferrer">
            <MessageCircle aria-hidden="true" />
            <span><small>Direct WhatsApp</small>{phone}</span>
            <ArrowUpRight aria-hidden="true" />
          </a>
          <div className="contact-socials">
            {siteConfig.socials.map((social) => (
              <a key={social.label} href={social.href} target="_blank" rel="noreferrer">
                {social.label}<ArrowUpRight aria-hidden="true" size={14} />
              </a>
            ))}
          </div>
        </div>
        <div className="contact-forms">
          <ContactFormStored />
          <DiscoveryCallForm />
        </div>
      </section>
    </PageEntry>
  );
}
