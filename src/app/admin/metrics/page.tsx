"use client";
import { AdminCrudPage } from "@/components/AdminCrudPage";

export default function AdminMetricsPage() {
  return (
    <AdminCrudPage
      title="Metrics"
      collection="metrics"
      fields={[
        { key: "label", label: "Metric Label", required: true, placeholder: "Brands served" },
        { key: "value", label: "Value", required: true, placeholder: "4" },
        { key: "order", label: "Order", type: "number" },
      ]}
      defaultItem={{ order: 0 }}
    />
  );
}
