"use client";

import { ArrowUpRight } from "lucide-react";
import { FormEvent, useState } from "react";

export function ContactFormStored() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [brief, setBrief] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/public/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "contact", name, email, company, message: brief }),
      });
      setSubmitted(true);
      /* Also open WhatsApp */
      const message = [
        "Hello Hadid Creatives, I'd like to discuss a project.",
        name ? `Name: ${name}` : "",
        company ? `Company: ${company}` : "",
        brief ? `Project: ${brief}` : "",
      ].filter(Boolean).join("\n");
      window.open(`https://wa.me/251948027407?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    } catch {
      /* silently continue to WhatsApp */
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="contact-form contact-form-success">
        <div className="form-success-icon">✓</div>
        <h3>Message received!</h3>
        <p>We will get back to you shortly. WhatsApp has been opened for immediate contact.</p>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      <label>
        <span>01 / Your name</span>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
      </label>
      <label>
        <span>02 / Email</span>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required />
      </label>
      <label>
        <span>03 / Company</span>
        <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company name" required />
      </label>
      <label>
        <span>04 / What are we building?</span>
        <textarea value={brief} onChange={(e) => setBrief(e.target.value)} placeholder="A short project brief" rows={4} required />
      </label>
      <button className="button button-lime" type="submit" disabled={loading}>
        {loading ? "Sending…" : "Send & continue on WhatsApp"} <ArrowUpRight aria-hidden="true" />
      </button>
      <p>Your submission is saved and also opens in WhatsApp for immediate contact.</p>
    </form>
  );
}
