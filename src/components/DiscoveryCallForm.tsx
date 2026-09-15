"use client";

import { ArrowUpRight } from "lucide-react";
import { FormEvent, useState } from "react";

export function DiscoveryCallForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/public/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "discovery", name, email, phone, preferredDate: date, message: notes }),
      });
      setSubmitted(true);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="discovery-form discovery-form-success">
        <div className="form-success-icon">✓</div>
        <h3>Call booked!</h3>
        <p>We will confirm your discovery call shortly.</p>
      </div>
    );
  }

  return (
    <form className="discovery-form" onSubmit={submit}>
      <h3>Book a Discovery Call</h3>
      <p>30 minutes. No commitment. Let us understand your goals.</p>
      <label>
        <span>Name</span>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required />
      </label>
      <label>
        <span>Email</span>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required />
      </label>
      <label>
        <span>Phone</span>
        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+251 ..." />
      </label>
      <label>
        <span>Preferred date & time</span>
        <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} required />
      </label>
      <label>
        <span>Notes (optional)</span>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Anything we should know before the call?" rows={3} />
      </label>
      <button className="button button-lime" type="submit" disabled={loading}>
        {loading ? "Booking…" : "Book Discovery Call"} <ArrowUpRight aria-hidden="true" />
      </button>
    </form>
  );
}
