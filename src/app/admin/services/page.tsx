"use client";
import { AdminCrudPage } from "@/components/AdminCrudPage";

export default function AdminServicesPage() {
  return (
    <AdminCrudPage
      title="Services"
      collection="services"
      fields={[
        { key: "id", label: "Service ID / Number (e.g. 01)", required: true },
        { key: "title", label: "Title", required: true },
        { key: "short", label: "Short Tagline", required: true },
        { key: "description", label: "Description", type: "textarea", required: true },
        { key: "capabilities", label: "Capabilities (comma separated)", type: "textarea" },
        { key: "order", label: "Order", type: "number" },
      ]}
      defaultItem={{ order: 0 }}
    />
  );
}
