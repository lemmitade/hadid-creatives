"use client";

import { MessageCircle } from "lucide-react";

export function FloatingWhatsAppClient({ href }: { href: string }) {
  return (
    <a
      className="floating-whatsapp"
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={26} />
      <span className="floating-whatsapp-tooltip">Chat with us</span>
    </a>
  );
}
