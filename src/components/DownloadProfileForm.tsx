"use client";

import { Download } from "lucide-react";
import { FormEvent, useState } from "react";

export function DownloadProfileForm({
  fileUrl,
  fileLabel,
  downloadType,
}: {
  fileUrl: string;
  fileLabel: string;
  downloadType: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/public/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "download", name, email, company, downloadType }),
      });
      setSubmitted(true);
      /* Trigger the download */
      if (fileUrl) {
        const a = document.createElement("a");
        a.href = fileUrl;
        a.download = "";
        a.click();
      }
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="download-form download-form-success">
        <div className="form-success-icon">↓</div>
        <h3>Download started!</h3>
        <p>If it didn&apos;t start, <a href={fileUrl} download>click here</a>.</p>
      </div>
    );
  }

  return (
    <form className="download-form" onSubmit={submit}>
      <h3>{fileLabel}</h3>
      <label>
        <span>Name</span>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required />
      </label>
      <label>
        <span>Email</span>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required />
      </label>
      <label>
        <span>Company</span>
        <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company name" />
      </label>
      <button className="button button-lime" type="submit" disabled={loading}>
        {loading ? "Preparing…" : <>Download <Download size={16} aria-hidden="true" /></>}
      </button>
    </form>
  );
}
