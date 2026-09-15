import type { MetadataRoute } from "next";
import { caseStudies } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://hadidcreatives.com";
  const pages = ["", "/work", "/services", "/behind-the-work", "/about", "/contact"];
  return [
    ...pages.map((path) => ({ url: `${base}${path}`, lastModified: new Date() })),
    ...caseStudies.map((study) => ({ url: `${base}/work/${study.slug}`, lastModified: new Date() })),
  ];
}
