import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { readData } from "@/lib/db";
import { PageEntry, Reveal } from "@/components/Motion";
import { WhatsAppCTA } from "@/components/WhatsAppCTA";
import type { BlogPost } from "@/lib/types";

export async function generateStaticParams() {
  const posts = await readData<BlogPost[]>("blog-posts", []);
  return posts.filter((p) => p.status === "published").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const posts = await readData<BlogPost[]>("blog-posts", []);
  const post = posts.find((p) => p.slug === slug && p.status === "published");
  if (!post) return {};
  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    keywords: post.seoKeywords || undefined,
  };
}

export default async function InsightArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const posts = await readData<BlogPost[]>("blog-posts", []);
  const post = posts.find((p) => p.slug === slug && p.status === "published");
  if (!post) notFound();

  /* Simple markdown-to-HTML: paragraphs, headings, bold, italic, links */
  const htmlContent = post.content
    .split("\n\n")
    .map((block) => {
      if (block.startsWith("### ")) return `<h3>${block.slice(4)}</h3>`;
      if (block.startsWith("## ")) return `<h2>${block.slice(3)}</h2>`;
      if (block.startsWith("# ")) return `<h2>${block.slice(2)}</h2>`;
      return `<p>${block}</p>`;
    })
    .join("");

  const related = posts
    .filter(
      (p) =>
        p.id !== post.id &&
        p.status === "published" &&
        p.categoryId === post.categoryId,
    )
    .slice(0, 3);

  return (
    <PageEntry>
      <article className="article-page">
        <div className="article-nav">
          <Link href="/insights">
            <ArrowLeft aria-hidden="true" /> All articles
          </Link>
          <span>{post.categoryId}</span>
        </div>
        <header className="article-header">
          <span className="micro-label">
            {new Date(post.createdAt).toLocaleDateString()} · {post.author || "Hadid Creatives"}
          </span>
          <h1>{post.title}</h1>
          <p className="article-excerpt">{post.excerpt}</p>
        </header>
        {post.featuredImage && (
          <div className="article-hero-image">
            <Image
              src={post.featuredImage}
              alt={post.title}
              width={1200}
              height={600}
              style={{ objectFit: "cover", width: "100%", height: "auto" }}
              priority
            />
          </div>
        )}
        <Reveal>
          <div
            className="article-content"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </Reveal>
      </article>

      {related.length > 0 && (
        <section className="section related-articles">
          <h2>Related articles</h2>
          <div className="blog-grid">
            {related.map((r) => (
              <Link key={r.id} href={`/insights/${r.slug}`} className="blog-card">
                <div className="blog-card-body">
                  <span className="blog-card-meta">
                    {r.categoryId} · {new Date(r.createdAt).toLocaleDateString()}
                  </span>
                  <h3>{r.title}</h3>
                  <p>{r.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <WhatsAppCTA compact />
    </PageEntry>
  );
}
