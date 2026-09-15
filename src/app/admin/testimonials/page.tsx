"use client";
import { AdminCrudPage } from "@/components/AdminCrudPage";

export default function AdminTestimonialsPage() {
  return (
    <AdminCrudPage
      title="Testimonials"
      collection="testimonials"
      fields={[
        { key: "clientName", label: "Client Name", required: true },
        { key: "company", label: "Company" },
        { key: "position", label: "Position" },
        { key: "testimonial", label: "Testimonial", type: "textarea", required: true },
        { key: "rating", label: "Rating (1-5)", type: "number" },
        { key: "imageUrl", label: "Photo URL", placeholder: "/uploads/testimonials/..." },
        { key: "featured", label: "Featured", type: "checkbox" },
        { key: "order", label: "Order", type: "number" },
      ]}
      defaultItem={{ rating: 5, featured: false, order: 0 }}
    />
  );
}
