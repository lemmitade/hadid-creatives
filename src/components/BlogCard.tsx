import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { BlogPost } from "@/lib/types";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link className="blog-card" href={`/insights/${post.slug}`}>
      <div className="blog-card-image">
        {post.featuredImage ? (
          <Image src={post.featuredImage} alt={post.title} fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: "cover" }} />
        ) : (
          <div className="blog-card-placeholder">
            <span>{post.title.slice(0, 2).toUpperCase()}</span>
          </div>
        )}
      </div>
      <div className="blog-card-body">
        <span className="blog-card-meta">{post.categoryId} · {new Date(post.createdAt).toLocaleDateString()}</span>
        <h3>{post.title}</h3>
        <p>{post.excerpt}</p>
        <span className="blog-card-link">Read article <ArrowUpRight size={14} aria-hidden="true" /></span>
      </div>
    </Link>
  );
}
