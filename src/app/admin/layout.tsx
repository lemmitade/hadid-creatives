"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  BarChart3,
  FileText,
  Home,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Settings,
  Star,
  Type,
  Users,
  Video,
  HelpCircle,
  BookOpen,
  Download,
  Search as SearchIcon,
  Target,
  Globe,
  Sun,
  Moon,
  Film,
  Camera,
} from "lucide-react";

const navGroups = [
  {
    label: "Overview",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/content", label: "Content Manager", icon: Type },
      { href: "/admin/services", label: "Services", icon: Target },
      { href: "/admin/case-studies", label: "Work / Case Studies", icon: FileText },
      { href: "/admin/selected-cuts", label: "Selected Cuts", icon: Film },
      { href: "/admin/behind-the-work", label: "Behind the Work", icon: Camera },
      { href: "/admin/logos", label: "Client Logos", icon: Star },
      { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquare },
      { href: "/admin/team", label: "Team", icon: Users },
      { href: "/admin/blog", label: "Blog / Insights", icon: BookOpen },
      { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
    ],
  },
  {
    label: "Media",
    items: [
      { href: "/admin/media/images", label: "Images", icon: ImageIcon },
      { href: "/admin/media/videos", label: "Videos", icon: Video },
    ],
  },
  {
    label: "Marketing",
    items: [
      { href: "/admin/leads", label: "Leads & Forms", icon: Target },
      { href: "/admin/metrics", label: "Metrics", icon: BarChart3 },
      { href: "/admin/downloads", label: "Downloads", icon: Download },
    ],
  },
  {
    label: "Settings",
    items: [
      { href: "/admin/seo", label: "SEO Manager", icon: Globe },
      { href: "/admin/analytics", label: "Analytics", icon: SearchIcon },
      { href: "/admin/users", label: "Users", icon: Users },
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const saved = window.localStorage.getItem("hadid-theme") as "dark" | "light" | null;
    const currentTheme = saved || (document.documentElement.dataset.theme as "dark" | "light") || "dark";
    setTheme(currentTheme);
    document.documentElement.dataset.theme = currentTheme;
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    window.localStorage.setItem("hadid-theme", next);
  }

  const currentPath = (pathname || "").replace(/\/+$/, "");

  if (currentPath === "/admin/login") {
    return <>{children}</>;
  }

  async function handleLogout() {
    await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    router.push("/admin/login/");
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link href="/" className="admin-sidebar-brand">
          <strong>Hadid</strong>
          <span>ADMIN</span>
        </Link>
        <nav>
          {navGroups.map((group) => (
            <div key={group.label} className="admin-nav-group">
              <span className="admin-nav-label">{group.label}</span>
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = currentPath === item.href || (item.href !== "/admin" && currentPath.startsWith(item.href + "/"));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`admin-nav-link ${active ? "is-active" : ""}`}
                  >
                    <Icon size={16} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <button onClick={toggleTheme} className="admin-nav-link" type="button" title="Switch Day/Night mode">
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            <span>{theme === "dark" ? "Day Mode" : "Night Mode"}</span>
          </button>
          <Link href="/" className="admin-nav-link">
            <Home size={16} /> View Site
          </Link>
          <button onClick={handleLogout} className="admin-nav-link" type="button">
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
