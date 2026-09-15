"use client";
import { AdminCrudPage } from "@/components/AdminCrudPage";

export default function AdminImagesPage() {
  return (
    <AdminCrudPage
      title="Images"
      collection="media"
      fields={[
        { key: "label", label: "Label", required: true },
        { key: "url", label: "Image URL", required: true, placeholder: "/uploads/images/..." },
        { key: "category", label: "Category", type: "select", options: [
          { value: "homepage", label: "Homepage" },
          { value: "case-study", label: "Case Study" },
          { value: "team", label: "Team Photos" },
          { value: "client-logo", label: "Client Logos" },
          { value: "blog", label: "Blog" },
          { value: "other", label: "Other" },
        ]},
        { key: "order", label: "Order", type: "number" },
      ]}
      defaultItem={{ type: "image", category: "homepage", order: 0 }}
    />
  );
}
