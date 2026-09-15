import { readData } from "@/lib/db";
import type { SiteSettings } from "@/lib/types";
import { FloatingWhatsAppClient } from "@/components/FloatingWhatsAppClient";

export async function FloatingWhatsApp() {
  const settings = await readData<SiteSettings>("settings", {
    whatsapp: { enabled: true, phone: "251948027407", message: "" },
    downloads: {
      companyProfile: { label: "", fileUrl: "", enabled: false },
      portfolio: { label: "", fileUrl: "", enabled: false },
      serviceGuide: { label: "", fileUrl: "", enabled: false },
    },
    floatingWhatsApp: { enabled: true, phone: "251948027407", message: "Hello Hadid Creatives, I'd like to discuss growing our digital presence." },
  });

  if (!settings.floatingWhatsApp.enabled) return null;

  const href = `https://wa.me/${settings.floatingWhatsApp.phone}?text=${encodeURIComponent(settings.floatingWhatsApp.message)}`;

  return <FloatingWhatsAppClient href={href} />;
}
