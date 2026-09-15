import { readData } from "@/lib/db";
import { DownloadProfileForm } from "@/components/DownloadProfileForm";
import type { SiteSettings } from "@/lib/types";

export async function DownloadSection() {
  const settings = await readData<SiteSettings>("settings", {
    whatsapp: { enabled: true, phone: "", message: "" },
    downloads: {
      companyProfile: { label: "Company Profile", fileUrl: "", enabled: false },
      portfolio: { label: "Portfolio", fileUrl: "", enabled: false },
      serviceGuide: { label: "Service Guide", fileUrl: "", enabled: false },
    },
    floatingWhatsApp: { enabled: true, phone: "", message: "" },
  });

  const downloads = Object.entries(settings.downloads).filter(
    ([, d]) => d.enabled && d.fileUrl,
  );

  if (downloads.length === 0) return null;

  return (
    <section className="section downloads-section" id="downloads">
      <div className="section-kicker">
        <span>↓</span>
        <span>DOWNLOAD</span>
      </div>
      <h2 className="downloads-headline">Get to know us better.</h2>
      <div className="downloads-grid">
        {downloads.map(([key, d]) => (
          <DownloadProfileForm
            key={key}
            fileUrl={d.fileUrl}
            fileLabel={d.label}
            downloadType={key}
          />
        ))}
      </div>
    </section>
  );
}
