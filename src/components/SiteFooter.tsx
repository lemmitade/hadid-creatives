import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/Logo";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { siteConfig } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <Logo />
        <p>
          Professional content, social systems, paid amplification, websites, and practical consultancy for established brands.
        </p>
        <div className="footer-links">
          <div>
            <span>Explore</span>
            {siteConfig.navigation.map((item) => (
              <Link href={item.href} key={item.href}>{item.label}</Link>
            ))}
            <Link href="/insights">Insights</Link>
            <Link href="/contact">Contact</Link>
          </div>
          <div>
            <span>Connect</span>
            {siteConfig.socials.map((item) => (
              <a href={item.href} target="_blank" rel="noreferrer" key={item.label}>
                {item.label}<ArrowUpRight aria-hidden="true" size={14} />
              </a>
            ))}
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
          </div>
        </div>
        <NewsletterSignup />
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Hadid Creatives</span>
        <span>ONE COLLECTIVE / MANY DISCIPLINES</span>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  );
}
