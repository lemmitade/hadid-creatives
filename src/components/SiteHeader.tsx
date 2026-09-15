"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, MessageCircle, Moon, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { siteConfig } from "@/content/site";

type Theme = "dark" | "light";

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [compressed, setCompressed] = useState(false);
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const saved = window.localStorage.getItem("hadid-theme") as Theme | null;
    const nextTheme = saved === "light" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    const themeFrame = window.requestAnimationFrame(() => setTheme(nextTheme));

    const onScroll = () => setCompressed(window.scrollY > 36);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.cancelAnimationFrame(themeFrame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem("hadid-theme", nextTheme);
  }

  return (
    <header className={`site-header ${compressed ? "is-compressed" : ""}`}>
      <div className="header-inner">
        <Logo />

        <nav className="desktop-nav" aria-label="Primary navigation">
          {siteConfig.navigation.map((item) => (
            <Link
              className={pathname === item.href ? "is-active" : ""}
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <button
            className="theme-toggle"
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          >
            <Sun aria-hidden="true" size={16} />
            <span>{theme === "dark" ? "Day" : "Night"}</span>
            <Moon aria-hidden="true" size={16} />
          </button>
          <a
            className="button button-small header-cta"
            href={siteConfig.whatsappHref}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={17} aria-hidden="true" />
            WhatsApp
          </a>
          <button
            className="menu-toggle"
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>

      <div className={`mobile-menu ${menuOpen ? "is-open" : ""}`} id="mobile-menu">
        <nav aria-label="Mobile navigation">
          {siteConfig.navigation.map((item, index) => (
            <Link href={item.href} key={item.href} onClick={() => setMenuOpen(false)}>
              <span>0{index + 1}</span>
              {item.label}
            </Link>
          ))}
          <Link href="/contact" onClick={() => setMenuOpen(false)}>
            <span>05</span>
            Contact
          </Link>
        </nav>
        <a
          className="button button-lime"
          href={siteConfig.whatsappHref}
          target="_blank"
          rel="noreferrer"
          onClick={() => setMenuOpen(false)}
        >
          Start on WhatsApp
        </a>
      </div>
    </header>
  );
}
