import type { Metadata } from "next";
import { readData } from "@/lib/db";
import { PageEntry } from "@/components/Motion";
import { InsightsFilterView } from "@/components/InsightsFilterView";
import type { BlogPost, BlogCategory } from "@/lib/types";

export const metadata: Metadata = {
  title: "Insights",
  description: "Articles, guides, and case breakdowns from Hadid Creatives on content, social media, and digital growth.",
};

export default async function InsightsPage() {
  const allPosts = await readData<BlogPost[]>("blog-posts", []);
  const categories = await readData<BlogCategory[]>("blog-categories", []);

  const publishedPosts = allPosts
    .filter((p) => p.status === "published")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <PageEntry>
      <section className="page-hero insights-page-hero">
        <div className="page-hero-meta">
          <span>INSIGHTS / BLOG</span>
          <span>{publishedPosts.length} ARTICLES</span>
        </div>
        <h1>
          Ideas that <em>move things.</em>
        </h1>
        <div className="page-hero-bottom">
          <p>
            Strategy breakdowns, creative thinking, and lessons from real
            campaigns.
          </p>
        </div>
      </section>

      <InsightsFilterView initialPosts={publishedPosts} categories={categories} />
    </PageEntry>
  );
}
