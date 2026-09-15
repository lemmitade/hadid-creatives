"use client";
import { AdminCrudPage } from "@/components/AdminCrudPage";

export default function AdminUsersPage() {
  return (
    <AdminCrudPage
      title="Users"
      collection="users"
      fields={[
        { key: "name", label: "Name", required: true },
        { key: "email", label: "Email", type: "email", required: true },
        { key: "password", label: "Password", required: true },
        { key: "role", label: "Role", type: "select", options: [
          { value: "super_admin", label: "Super Admin" },
          { value: "admin", label: "Admin" },
          { value: "content_editor", label: "Content Editor" },
        ]},
        { key: "active", label: "Active", type: "checkbox" },
      ]}
      defaultItem={{ role: "content_editor", active: true, createdAt: new Date().toISOString() }}
    />
  );
}
