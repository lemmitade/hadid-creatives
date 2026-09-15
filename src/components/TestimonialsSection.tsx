import Image from "next/image";
import { Star } from "lucide-react";
import { readData } from "@/lib/db";
import type { Testimonial } from "@/lib/types";

export async function TestimonialsSection({ featuredOnly = true }: { featuredOnly?: boolean }) {
  const all = await readData<Testimonial[]>("testimonials", []);
  const items = (featuredOnly ? all.filter((t) => t.featured) : all)
    .sort((a, b) => a.order - b.order);

  if (items.length === 0) return null;

  return (
    <section className="section testimonials-section" id="testimonials">
      <div className="section-kicker">
        <span>★</span>
        <span>CLIENT TESTIMONIALS</span>
      </div>
      <h2 className="testimonials-headline">
        What our clients say.
      </h2>
      <div className="testimonials-grid">
        {items.map((t) => (
          <article className="testimonial-card" key={t.id}>
            <div className="testimonial-stars" aria-label={`${t.rating} out of 5 stars`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  fill={i < t.rating ? "currentColor" : "none"}
                  className={i < t.rating ? "star-filled" : "star-empty"}
                />
              ))}
            </div>
            <blockquote>{t.testimonial}</blockquote>
            <div className="testimonial-author">
              {t.imageUrl && (
                <div className="testimonial-avatar">
                  <Image src={t.imageUrl} alt={t.clientName} width={44} height={44} />
                </div>
              )}
              <div>
                <strong>{t.clientName}</strong>
                <span>{t.position}{t.company ? ` · ${t.company}` : ""}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
