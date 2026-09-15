"use client";

import { useState, useEffect, useCallback } from "react";
import { Download, Search, Trash2 } from "lucide-react";
import type { Lead } from "@/lib/types";

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [query, setQuery] = useState("");

  const fetchLeads = useCallback(async () => {
    const params = new URLSearchParams();
    if (typeFilter) params.set("type", typeFilter);
    if (statusFilter) params.set("status", statusFilter);
    if (query) params.set("q", query);
    const res = await fetch(`/api/admin/leads?${params}`);
    if (res.ok) setLeads(await res.json());
    setLoading(false);
  }, [typeFilter, statusFilter, query]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  async function updateStatus(id: string, status: string) {
    await fetch("/api/admin/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "updateStatus", id, status }),
    });
    fetchLeads();
  }

  async function deleteLead(id: string) {
    if (!confirm("Delete this lead?")) return;
    await fetch("/api/admin/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", id }),
    });
    fetchLeads();
  }

  function exportCsv() {
    const params = new URLSearchParams();
    if (typeFilter) params.set("type", typeFilter);
    if (statusFilter) params.set("status", statusFilter);
    if (query) params.set("q", query);
    params.set("format", "csv");
    window.open(`/api/admin/leads?${params}`, "_blank");
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Leads & Forms</h1>
        <button className="admin-btn admin-btn-primary" onClick={exportCsv}>
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div className="admin-filters">
        <div className="admin-search">
          <Search size={16} />
          <input placeholder="Search name, email, company…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="">All types</option>
          <option value="contact">Contact</option>
          <option value="discovery">Discovery</option>
          <option value="download">Download</option>
          <option value="newsletter">Newsletter</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All statuses</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {loading ? (
        <p className="admin-loading">Loading…</p>
      ) : leads.length === 0 ? (
        <div className="admin-empty-state"><p>No leads found.</p></div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Type</th>
                <th>Company</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td>{lead.name || "—"}</td>
                  <td>{lead.email}</td>
                  <td><span className={`admin-type-badge type-${lead.type}`}>{lead.type}</span></td>
                  <td>{lead.company || "—"}</td>
                  <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
                  <td>
                    <select
                      value={lead.status}
                      onChange={(e) => updateStatus(lead.id, e.target.value)}
                      className="admin-status-select"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="closed">Closed</option>
                    </select>
                  </td>
                  <td>
                    <button onClick={() => deleteLead(lead.id)} title="Delete"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
