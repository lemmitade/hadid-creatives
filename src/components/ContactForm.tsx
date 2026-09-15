"use client";

import { ArrowUpRight } from "lucide-react";
import { FormEvent, useState } from "react";

export function ContactForm() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [brief, setBrief] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = [
      "Hello Hadid Creatives, I'd like to discuss a project.",
      name ? `Name: ${name}` : "",
      company ? `Company: ${company}` : "",
      brief ? `Project: ${brief}` : "",
    ].filter(Boolean).join("\n");
    window.open(`https://wa.me/251948027407?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      <label>
        <span>01 / Your name</span>
        <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Name" required />
      </label>
      <label>
        <span>02 / Company</span>
        <input value={company} onChange={(event) => setCompany(event.target.value)} placeholder="Company name" required />
      </label>
      <label>
        <span>03 / What are we building?</span>
        <textarea value={brief} onChange={(event) => setBrief(event.target.value)} placeholder="A short project brief" rows={4} required />
      </label>
      <button className="button button-lime" type="submit">
        Continue on WhatsApp <ArrowUpRight aria-hidden="true" />
      </button>
      <p>Nothing is sent from this website. Your message opens in WhatsApp for review.</p>
    </form>
  );
}
