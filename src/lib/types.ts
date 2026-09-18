/* CMS data types used across the application */
export type { CaseStudy } from "@/content/site";

export type Testimonial = {
  id: string;
  clientName: string;
  company: string;
  position: string;
  testimonial: string;
  rating: number;
  imageUrl: string;
  featured: boolean;
  order: number;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  photoUrl: string;
  socials: { platform: string; url: string }[];
  order: number;
};

export type FAQ = {
  id: string;
  question: string;
  answer: string;
  order: number;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  categoryId: string;
  featuredImage: string;
  author: string;
  status: "draft" | "published";
  featured: boolean;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  createdAt: string;
  updatedAt: string;
};

export type BlogCategory = {
  id: string;
  label: string;
};

export type ClientLogo = {
  id: string;
  name: string;
  logoUrl: string;
  caseStudySlug: string;
  enabled: boolean;
  order: number;
};

export type Lead = {
  id: string;
  type: "contact" | "discovery" | "download" | "newsletter";
  name: string;
  email: string;
  company: string;
  phone: string;
  message: string;
  preferredDate: string;
  downloadType: string;
  status: "new" | "contacted" | "closed";
  createdAt: string;
};

export type SiteMetric = {
  id: string;
  label: string;
  value: string;
  order: number;
};

export type MediaItem = {
  id: string;
  type: "image" | "video";
  url: string;
  category: string;
  label: string;
  order: number;
};

export type CaseStudyExtended = {
  id: string;
  slug: string;
  overview: string;
  strategyDetail: string;
  deliverables: string[];
  gallery: string[];
  videos: { url: string; type: "mp4" | "youtube" | "vimeo"; label: string }[];
  resultsDetail: string;
};

export type PageSeo = {
  title: string;
  description: string;
  ogImage: string;
  keywords: string;
  slug: string;
};

export type SiteSettings = {
  whatsapp: {
    enabled: boolean;
    phone: string;
    message: string;
  };
  downloads: {
    companyProfile: { label: string; fileUrl: string; enabled: boolean };
    portfolio: { label: string; fileUrl: string; enabled: boolean };
    serviceGuide: { label: string; fileUrl: string; enabled: boolean };
  };
  floatingWhatsApp: {
    enabled: boolean;
    phone: string;
    message: string;
  };
};

export type PageView = {
  path: string;
  referrer: string;
  timestamp: string;
};

export type AnalyticsEvent = {
  name: string;
  path: string;
  timestamp: string;
  meta?: string;
};

export type AnalyticsData = {
  pageViews: PageView[];
  events: AnalyticsEvent[];
};

export type SelectedCut = {
  id: string;
  number: string;
  title: string;
  meta: string;
  client?: string;
  category?: "video" | "branding" | "website";
  type: "video" | "image";
  thumbnailUrl?: string;
  videoUrl?: string;
  videoId?: string;
  embedUrl?: string;
  canonicalUrl?: string;
  linkUrl?: string;
  description?: string;
  order?: number;
  featured?: boolean;
};

export type ServiceItem = {
  id: string;
  title: string;
  short: string;
  description: string;
  capabilities: string[];
  order?: number;
};

