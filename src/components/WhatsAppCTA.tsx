import { ArrowUpRight, MessageCircle } from "lucide-react";
import { siteConfig } from "@/content/site";

export function WhatsAppCTA({ compact = false }: { compact?: boolean }) {
  return (
    <section className={`whatsapp-cta ${compact ? "is-compact" : ""}`}>
      <div className="cta-index">LET&apos;S BUILD / 2026</div>
      <h2>Make the next thing impossible to ignore.</h2>
      <a href={siteConfig.whatsappHref} target="_blank" rel="noreferrer">
        <span>
          <MessageCircle aria-hidden="true" />
          Start on WhatsApp
        </span>
        <ArrowUpRight aria-hidden="true" />
      </a>
    </section>
  );
}
