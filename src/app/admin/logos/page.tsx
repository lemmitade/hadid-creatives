"use client";
import { AdminCrudPage } from "@/components/AdminCrudPage";

export default function AdminLogosPage() {
  return (
    <AdminCrudPage
      title="Client Logos"
      collection="client-logos"
      fields={[
        { key: "name", label: "Client Name", required: true },
        { key: "logoUrl", label: "Logo URL", placeholder: "/uploads/logos/..." },
        { key: "caseStudySlug", label: "Case Study Slug", placeholder: "gm-furniture" },
        { key: "enabled", label: "Enabled", type: "checkbox" },
        { key: "order", label: "Order", type: "number" },
      ]}
      defaultItem={{ enabled: true, order: 0 }}
    />
  );
}
