"use client";

import { AdminCrudPage } from "@/components/AdminCrudPage";

export default function AdminSelectedCutsPage() {
  return (
    <AdminCrudPage
      title="Portfolio & Selected Cuts"
      collection="selected-cuts"
      fields={[
        {
          key: "category",
          label: "Portfolio Segment",
          type: "select",
          required: true,
          options: [
            { value: "video", label: "🎬 Video Portfolio (TikTok / Reels / Commercials)" },
            { value: "branding", label: "🎨 Branding (Identity / Guidelines / Packaging)" },
            { value: "website", label: "💻 Website Design (Websites / UI/UX / Portals)" },
          ],
        },
        { key: "client", label: "Client / Brand Name", placeholder: "e.g. GM Furniture, Worthy Homes, Urban Finds", required: true },
        { key: "number", label: "Cut Number (01, 02...)", required: true, placeholder: "01" },
        { key: "title", label: "Cut / Showcase Title", required: true, placeholder: "e.g. Urban Finds — Streetwear & Urban Style Drop" },
        { key: "meta", label: "Format Badge", required: true, placeholder: "e.g. REEL / 01, CAM / 02, BRAND / 01, WEB / 01" },
        {
          key: "type",
          label: "Media Format",
          type: "select",
          options: [
            { value: "video", label: "Video Cut (TikTok / MP4 / Stream)" },
            { value: "image", label: "Image / Visual Showcase" },
          ],
        },
        { key: "videoUrl", label: "Video URL (TikTok link, MP4, or YouTube)", type: "url", placeholder: "e.g. https://vt.tiktok.com/ZSqSP3u8g/" },
        { key: "thumbnailUrl", label: "Thumbnail / Cover Image URL", type: "image", placeholder: "Upload thumbnail or paste image URL" },
        { key: "linkUrl", label: "Project Link (Case Study or External)", type: "url", placeholder: "e.g. /work/gm-furniture or external link" },
        { key: "description", label: "Description / Creative Brief", type: "textarea", placeholder: "Explain the visual treatment, objectives, and craft behind this cut" },
        { key: "order", label: "Display Order", type: "number" },
      ]}
      defaultItem={{
        category: "video",
        type: "video",
        number: "01",
        meta: "REEL / 01",
        order: 1,
      }}
    />
  );
}
