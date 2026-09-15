"use client";
import { AdminCrudPage } from "@/components/AdminCrudPage";

export default function AdminVideosPage() {
  return (
    <AdminCrudPage
      title="Videos"
      collection="media"
      fields={[
        { key: "label", label: "Label", required: true },
        { key: "url", label: "Video URL", required: true, placeholder: "https://youtube.com/... or /uploads/videos/..." },
        { key: "category", label: "Category", type: "select", options: [
          { value: "hero", label: "Hero" },
          { value: "showreel", label: "Showreel" },
          { value: "case-study", label: "Case Study" },
          { value: "portfolio", label: "Portfolio" },
          { value: "other", label: "Other" },
        ]},
        { key: "order", label: "Order", type: "number" },
      ]}
      defaultItem={{ type: "video", category: "hero", order: 0 }}
    />
  );
}
