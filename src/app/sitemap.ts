import type { MetadataRoute } from "next";
import { caseStudies as defaultCaseStudies } from "@/content/site";
import { readData } from "@/lib/db";
import type { CaseStudy, BlogPost } from "@/lib/types";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://hadidcreatives.com";
  const now = new Date();

  // 1. Core Pages
  const corePages: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${base}/work`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${base}/services`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${base}/insights`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${base}/behind-the-work`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  // 2. Dynamic Case Studies (database + static fallback)
  let studies: CaseStudy[] = defaultCaseStudies;
  try {
    const dbStudies = await readData<CaseStudy[]>("case-studies", []);
    if (dbStudies && dbStudies.length > 0) {
      studies = dbStudies;
    }
  } catch {
    /* fallback to default */
  }

  const studyEntries: MetadataRoute.Sitemap = studies.map((study) => ({
    url: `${base}/work/${study.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  // 3. Dynamic Insights / Blog Articles
  let blogEntries: MetadataRoute.Sitemap = [];
  try {
    const posts = await readData<BlogPost[]>("blog-posts", []);
    blogEntries = posts
      .filter((post) => post.status === "published" && post.slug)
      .map((post) => ({
        url: `${base}/insights/${post.slug}`,
        lastModified: post.updatedAt ? new Date(post.updatedAt) : now,
        changeFrequency: "monthly",
        priority: 0.75,
      }));
  } catch {
    /* ignore */
  }

  return [...corePages, ...studyEntries, ...blogEntries];
}

