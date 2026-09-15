"use client";
import { AdminCrudPage } from "@/components/AdminCrudPage";

export default function AdminFAQsPage() {
  return (
    <AdminCrudPage
      title="FAQs"
      collection="faqs"
      fields={[
        { key: "question", label: "Question", required: true },
        { key: "answer", label: "Answer", type: "textarea", required: true },
        { key: "order", label: "Order", type: "number" },
      ]}
      defaultItem={{ order: 0 }}
    />
  );
}
