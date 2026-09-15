"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, GripVertical, Save, X, Upload, Loader2, Play } from "lucide-react";
import Image from "next/image";

type Field = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "number" | "select" | "checkbox" | "email" | "url" | "image" | "video" | "file";
  options?: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
};

type Props<T extends Record<string, unknown> & { id: string }> = {
  title: string;
  collection: string;
  fields: Field[];
  defaultItem?: Partial<T>;
};

export function AdminCrudPage<T extends Record<string, unknown> & { id: string }>({
  title,
  collection,
  fields,
  defaultItem = {},
}: Props<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [editItem, setEditItem] = useState<Partial<T> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    const res = await fetch(`/api/admin/${collection}`);
    if (res.ok) setItems(await res.json());
    setLoading(false);
  }, [collection]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  async function saveItem() {
    if (!editItem) return;
    const action = isNew ? "add" : "update";
    await fetch(`/api/admin/${collection}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action,
        item: editItem,
        id: editItem.id,
      }),
    });
    setEditItem(null);
    setIsNew(false);
    fetchItems();
  }

  async function deleteItem(id: string) {
    if (!confirm("Delete this item?")) return;
    await fetch(`/api/admin/${collection}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", id }),
    });
    fetchItems();
  }

  function openNew() {
    setEditItem({ ...defaultItem, order: items.length } as Partial<T>);
    setIsNew(true);
  }

  function openEdit(item: T) {
    setEditItem({ ...item });
    setIsNew(false);
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>, fieldKey: string) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingKey(fieldKey);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.ok && data.url) {
        setEditItem((prev) => (prev ? { ...prev, [fieldKey]: data.url } : prev));
      } else {
        alert(data.error || "Upload failed");
      }
    } catch {
      alert("Error uploading file");
    } finally {
      setUploadingKey(null);
      if (e.target) e.target.value = "";
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>{title}</h1>
        <span className="admin-badge">{items.length} {items.length === 1 ? "item" : "items"}</span>
      </div>

      {editItem && (
        <div className="admin-modal-overlay" onClick={() => setEditItem(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{isNew ? "Add New" : "Edit"} {title.replace(/s$/, "")}</h2>
              <button onClick={() => setEditItem(null)} type="button"><X size={20} /></button>
            </div>
            <div className="admin-modal-body">
              {fields.map((field) => {
                const val = editItem[field.key];
                const isMediaField = field.type === "image" || field.type === "video" || field.type === "file";

                return (
                  <div key={field.key} className="admin-field">
                    <span>{field.label}</span>
                    {field.type === "textarea" ? (
                      <textarea
                        value={(val as string) || ""}
                        onChange={(e) =>
                          setEditItem({ ...editItem, [field.key]: e.target.value })
                        }
                        placeholder={field.placeholder}
                        rows={4}
                      />
                    ) : field.type === "select" ? (
                      <select
                        value={(val as string) || ""}
                        onChange={(e) =>
                          setEditItem({ ...editItem, [field.key]: e.target.value })
                        }
                      >
                        <option value="">Select…</option>
                        {field.options?.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    ) : field.type === "checkbox" ? (
                      <input
                        type="checkbox"
                        checked={(val as boolean) || false}
                        onChange={(e) =>
                          setEditItem({ ...editItem, [field.key]: e.target.checked })
                        }
                      />
                    ) : field.type === "number" ? (
                      <input
                        type="number"
                        value={(val as number) ?? 0}
                        onChange={(e) =>
                          setEditItem({ ...editItem, [field.key]: Number(e.target.value) })
                        }
                        placeholder={field.placeholder}
                      />
                    ) : isMediaField ? (
                      <div className="admin-media-input-wrap">
                        <div style={{ display: "flex", gap: "0.5rem", width: "100%" }}>
                          <input
                            type="text"
                            value={(val as string) || ""}
                            onChange={(e) =>
                              setEditItem({ ...editItem, [field.key]: e.target.value })
                            }
                            placeholder={field.placeholder || "Paste image/video URL or upload file"}
                            style={{ flex: 1 }}
                          />
                          <label className="admin-btn" style={{ cursor: "pointer", whiteSpace: "nowrap" }}>
                            {uploadingKey === field.key ? (
                              <><Loader2 size={16} className="spin" /> Uploading…</>
                            ) : (
                              <><Upload size={16} /> Upload</>
                            )}
                            <input
                              type="file"
                              accept={field.type === "video" ? "video/*" : "image/*,video/*"}
                              style={{ display: "none" }}
                              onChange={(e) => handleFileUpload(e, field.key)}
                              disabled={uploadingKey === field.key}
                            />
                          </label>
                        </div>
                        {typeof val === "string" && val.length > 3 && (
                          <div className="admin-field-preview" style={{ marginTop: "0.6rem" }}>
                            {field.type === "video" || val.endsWith(".mp4") || val.endsWith(".webm") ? (
                              <video src={val} controls style={{ maxHeight: "120px", borderRadius: "8px", width: "100%" }} />
                            ) : (
                              <div style={{ position: "relative", height: "90px", width: "160px", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--line)" }}>
                                <Image src={val} alt="Preview" fill style={{ objectFit: "cover" }} />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <input
                        type={field.type || "text"}
                        value={(val as string) || ""}
                        onChange={(e) =>
                          setEditItem({ ...editItem, [field.key]: e.target.value })
                        }
                        placeholder={field.placeholder}
                      />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn" onClick={() => setEditItem(null)} type="button">Cancel</button>
              <button className="admin-btn admin-btn-primary" onClick={saveItem} type="button">
                <Save size={16} /> Save
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <p className="admin-loading">Loading…</p>
      ) : items.length === 0 ? (
        <div className="admin-empty-state">
          <p>No items yet.</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: 40 }} />
                {fields.slice(0, 4).map((f) => (
                  <th key={f.key}>{f.label}</th>
                ))}
                <th style={{ width: 100 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <GripVertical size={14} className="admin-grip" />
                  </td>
                  {fields.slice(0, 4).map((f) => {
                    const val = item[f.key];
                    return (
                      <td key={f.key}>
                        {f.type === "checkbox" ? (
                          val ? "✓" : "—"
                        ) : f.type === "image" && typeof val === "string" && val.length > 2 ? (
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <div style={{ width: 28, height: 28, borderRadius: 4, overflow: "hidden", position: "relative", border: "1px solid var(--soft-line)" }}>
                              <Image src={val} alt="" fill style={{ objectFit: "cover" }} />
                            </div>
                            <span style={{ fontSize: "0.75rem", opacity: 0.8 }}>{val.slice(0, 25)}…</span>
                          </div>
                        ) : f.type === "video" && typeof val === "string" && val.length > 2 ? (
                          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                            <Play size={12} />
                            <span style={{ fontSize: "0.75rem" }}>{val.slice(0, 25)}…</span>
                          </div>
                        ) : (
                          String(val || "—").slice(0, 60)
                        )}
                      </td>
                    );
                  })}
                  <td className="admin-actions">
                    <button onClick={() => openEdit(item)} title="Edit" type="button">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => deleteItem(item.id)} title="Delete" type="button">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Button at the bottom of the page */}
      <div className="admin-bottom-actions">
        <button className="admin-btn admin-btn-primary admin-btn-large" onClick={openNew} type="button">
          <Plus size={18} /> Add New {title.replace(/s$/, "")}
        </button>
      </div>
    </div>
  );
}
