"use client";
import { AdminCrudPage } from "@/components/AdminCrudPage";

export default function AdminBlogPage() {
  return (
    <AdminCrudPage
      title="Blog Posts"
      collection="blog-posts"
      fields={[
        { key: "title", label: "Title", required: true },
        { key: "slug", label: "Slug", required: true, placeholder: "my-article-slug" },
        { key: "excerpt", label: "Excerpt", type: "textarea" },
        { key: "content", label: "Content (Markdown)", type: "textarea" },
        { key: "categoryId", label: "Category", type: "select", options: [
          { value: "strategy", label: "Strategy" },
          { value: "content-creation", label: "Content Creation" },
          { value: "social-media", label: "Social Media" },
          { value: "paid-social", label: "Paid Social" },
          { value: "case-study", label: "Case Study" },
        ]},
        { key: "featuredImage", label: "Featured Image URL" },
        { key: "author", label: "Author", placeholder: "Hadid Creatives" },
        { key: "status", label: "Status", type: "select", options: [
          { value: "draft", label: "Draft" },
          { value: "published", label: "Published" },
        ]},
        { key: "featured", label: "Featured", type: "checkbox" },
        { key: "seoTitle", label: "SEO Title" },
        { key: "seoDescription", label: "SEO Description", type: "textarea" },
        { key: "seoKeywords", label: "SEO Keywords" },
      ]}
      defaultItem={{ status: "draft", featured: false, author: "Hadid Creatives", categoryId: "strategy", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }}
    />
  );
}
