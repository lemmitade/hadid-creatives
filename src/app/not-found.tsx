import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="not-found">
      <span>404 / FRAME NOT FOUND</span>
      <h1>Out of<br /><em>frame.</em></h1>
      <p>The page moved, the link changed, or this shot never made the final cut.</p>
      <Link className="button button-lime" href="/"><ArrowLeft aria-hidden="true" /> Return home</Link>
    </main>
  );
}
