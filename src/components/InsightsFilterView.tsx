"use client";

import { useState, useMemo } from "react";
import { BlogCard } from "@/components/BlogCard";
import { Reveal } from "@/components/Motion";
import { SectionIntro } from "@/components/SectionIntro";
import type { BlogPost, BlogCategory } from "@/lib/types";

interface InsightsFilterViewProps {
  initialPosts: BlogPost[];
  categories: BlogCategory[];
}

export function InsightsFilterView({ initialPosts, categories }: InsightsFilterViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredPosts = useMemo(() => {
    let list = initialPosts;
    if (selectedCategory) {
      list = list.filter((p) => p.categoryId === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q)
      );
    }
    return list;
  }, [initialPosts, selectedCategory, searchQuery]);

  const featured = initialPosts.find((p) => p.featured);

  return (
    <>
      <section className="section insights-filter-bar">
        <div className="insights-categories">
          <button
            type="button"
            className={!selectedCategory ? "is-active" : ""}
            onClick={() => setSelectedCategory("")}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={selectedCategory === cat.id ? "is-active" : ""}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <div className="insights-search">
          <input
            type="search"
            placeholder="Search articles…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </section>

      {featured && !selectedCategory && !searchQuery && (
        <section className="section insights-featured">
          <Reveal>
            <BlogCard post={featured} />
          </Reveal>
        </section>
      )}

      <section className="section insights-grid-section">
        <Reveal>
          <SectionIntro
            number="01"
            eyebrow="All articles"
            title="From the Hadid desk."
          />
        </Reveal>
        {filteredPosts.length === 0 ? (
          <p className="insights-empty">
            No articles found matching your selection.
          </p>
        ) : (
          <div className="blog-grid">
            {filteredPosts.map((post) => (
              <Reveal key={post.id}>
                <BlogCard post={post} />
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
