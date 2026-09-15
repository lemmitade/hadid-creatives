"use client";
import { AdminCrudPage } from "@/components/AdminCrudPage";

export default function AdminCaseStudiesPage() {
  return (
    <AdminCrudPage
      title="Work & Case Studies"
      collection="case-studies"
      fields={[
        { key: "client", label: "Client Name", required: true, placeholder: "e.g. GM Furniture" },
        { key: "slug", label: "URL Slug", required: true, placeholder: "e.g. gm-furniture" },
        { key: "number", label: "Number (01, 02...)", required: true, placeholder: "01" },
        { key: "industry", label: "Industry / Category", required: true, placeholder: "e.g. Furniture, Real estate" },
        {
          key: "palette",
          label: "Card Color Accent",
          type: "select",
          options: [
            { value: "blue", label: "Blue Accent" },
            { value: "lime", label: "Lime Green Accent" },
            { value: "orange", label: "Orange Accent" },
            { value: "aqua", label: "Aqua Blue Accent" },
          ],
        },
        {
          key: "coverImage",
          label: "Cover Image",
          type: "image",
          placeholder: "Upload image file or paste URL (e.g. /media/work/...)",
        },
        { key: "headlineMetric", label: "Headline Metric", required: true, placeholder: "e.g. 10.2x, +89K" },
        { key: "headlineLabel", label: "Headline Label", required: true, placeholder: "e.g. audience growth" },
        { key: "summary", label: "Card & Hero Summary", type: "textarea", required: true },
        { key: "challenge", label: "The Assignment / Challenge", type: "textarea" },
        { key: "approach", label: "Strategy & Approach", type: "textarea" },
        { key: "outcome", label: "Outcome / Revenue / Impact", type: "textarea" },
        { key: "services", label: "Disciplines (comma separated)", placeholder: "Content creation, Social management, Paid social" },
        { key: "order", label: "Sort Order", type: "number" },
      ]}
      defaultItem={{
        palette: "blue",
        number: "01",
        order: 1,
      }}
    />
  );
}
