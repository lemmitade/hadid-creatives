"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FAQ } from "@/lib/types";

export function FAQSection({ items }: { items: FAQ[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  if (items.length === 0) return null;

  return (
    <section className="section faq-section" id="faq">
      <div className="section-kicker">
        <span>?</span>
        <span>FREQUENTLY ASKED QUESTIONS</span>
      </div>
      <h2 className="faq-headline">Common questions, clear answers.</h2>
      <div className="faq-list">
        {items.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div className={`faq-item ${isOpen ? "is-open" : ""}`} key={faq.id}>
              <button
                className="faq-trigger"
                type="button"
                onClick={() => setOpenId(isOpen ? null : faq.id)}
                aria-expanded={isOpen}
              >
                <span>{faq.question}</span>
                <ChevronDown className="faq-chevron" size={20} />
              </button>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
