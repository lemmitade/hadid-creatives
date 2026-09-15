"use client";
import { AdminCrudPage } from "@/components/AdminCrudPage";

export default function AdminTeamPage() {
  return (
    <AdminCrudPage
      title="Team Members"
      collection="team"
      fields={[
        { key: "name", label: "Name", required: true },
        { key: "role", label: "Role", required: true },
        { key: "bio", label: "Bio", type: "textarea" },
        { key: "photoUrl", label: "Photo URL", placeholder: "/uploads/team/..." },
        { key: "order", label: "Order", type: "number" },
      ]}
      defaultItem={{ socials: [], order: 0 }}
    />
  );
}
