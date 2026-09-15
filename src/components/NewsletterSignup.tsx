"use client";

import { ArrowUpRight } from "lucide-react";
import { FormEvent, useState } from "react";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await fetch("/api/public/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "newsletter", email }),
      });
      setSubmitted(true);
    } catch {
      /* silent */
    }
  }

  if (submitted) {
    return <p className="newsletter-thanks">Thanks for subscribing! ✓</p>;
  }

  return (
    <form className="newsletter-form" onSubmit={submit}>
      <span className="newsletter-label">STAY UPDATED</span>
      <div className="newsletter-row">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
        />
        <button type="submit">
          Subscribe <ArrowUpRight size={14} aria-hidden="true" />
        </button>
      </div>
    </form>
  );
}
