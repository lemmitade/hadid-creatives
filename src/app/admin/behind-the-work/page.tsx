"use client";

import { AdminCrudPage } from "@/components/AdminCrudPage";

export default function AdminBehindTheWorkPage() {
  return (
    <AdminCrudPage
      title="Behind the Work"
      collection="behind-the-work"
      fields={[
        { key: "title", label: "Title / Production Note", required: true, placeholder: "e.g. Cinema Camera Systems on Set" },
        {
          key: "phase",
          label: "Production Phase",
          type: "select",
          options: [
            { value: "01 Pre-production", label: "01 Pre-production (Concept, Scripts, Planning)" },
            { value: "02 Production", label: "02 Production (Camera, Lighting, Direction)" },
            { value: "03 Post-production", label: "03 Post-production (Color, Motion, Sound)" },
            { value: "04 Performance", label: "04 Performance (Distribution, Analytics, Review)" },
          ],
        },
        {
          key: "type",
          label: "Media Type",
          type: "select",
          options: [
            { value: "image", label: "Image / Photo" },
            { value: "video", label: "Video Reel / Clip" },
          ],
        },
        { key: "mediaUrl", label: "Image / Thumbnail URL or Upload", type: "image", placeholder: "Upload image file or paste URL" },
        { key: "videoUrl", label: "Video URL or Upload (MP4, YouTube, Vimeo, Reel)", type: "video", placeholder: "Upload video file or paste video/reel link" },
        { key: "linkUrl", label: "Case Study / Reel Link", type: "url", placeholder: "e.g. /work/gm-furniture or external link" },
        { key: "caption", label: "Caption / Description", type: "textarea", placeholder: "Describe what is happening in this production scene" },
        { key: "equipment", label: "Equipment & Tech Specs", placeholder: "e.g. Sony FX3 / Cooke Anamorphic / Aputure 600d" },
        { key: "featured", label: "Feature on Homepage Behind the Work?", type: "checkbox" },
        { key: "order", label: "Sort Order", type: "number" },
      ]}
      defaultItem={{
        phase: "02 Production",
        type: "image",
        featured: true,
        order: 1,
      }}
    />
  );
}
