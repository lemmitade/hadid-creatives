import type { Metadata } from "next";
import { Hanken_Grotesk, IBM_Plex_Mono, Inter } from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import { siteConfig } from "@/content/site";
import "./globals.css";

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hadidcreatives.com"),
  title: {
    default: "Hadid Creatives | Content, Social Media and Digital Growth",
    template: "%s | Hadid Creatives",
  },
  description: siteConfig.description,
  keywords: [
    "Hadid Creatives",
    "content creation",
    "social media management",
    "paid social",
    "website design",
    "digital marketing consultancy",
  ],
  openGraph: {
    title: "Hadid Creatives | Built to be seen. Made to perform.",
    description: siteConfig.description,
    type: "website",
    images: ["/media/hero/hero-production-placeholder.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

const themeScript = `
  try {
    const saved = localStorage.getItem('hadid-theme');
    document.documentElement.dataset.theme = saved === 'light' ? 'light' : 'dark';
  } catch (_) {
    document.documentElement.dataset.theme = 'dark';
  }
`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${hanken.variable} ${inter.variable} ${mono.variable}`} id="top">
        <a className="skip-link" href="#main-content">Skip to content</a>
        <div className="site-grid" aria-hidden="true" />
        <SiteHeader />
        <div id="main-content">{children}</div>
        <SiteFooter />
        <FloatingWhatsApp />
        <AnalyticsTracker />
      </body>
    </html>
  );
}
