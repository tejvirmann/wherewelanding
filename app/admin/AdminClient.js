"use client";

import { useState } from "react";

const TABS = ["applicants", "groups", "kicked"];

export default function AdminClient({ applicants, groups, kicked }) {
  const [tab, setTab] = useState("applicants");
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);

  // Reject flow
  const [rejectMode, setRejectMode] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  // Strike/kick flow
  const [strikeMode, setStrikeMode] = useState(false);
  const [strikeReason, setStrikeReason] = useState("");

  // Group formation
  const [groupMode, setGroupMode] = useState(false);
  const [groupSelected, setGroupSelected] = useState([]); // array of applicant ids
  const [groupName, setGroupName] = useState("");
  const [groupNote, setGroupNote] = useState("");

  function selectItem(item) {
    setSelected(item);
    setRejectMode(false); setRejectReason("");
    setStrikeMode(false); setStrikeReason("");
    setToast("");
  }

  function toggleGroupMember(id) {
    setGroupSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }

  async function callAction(endpoint, body) {
    setLoading(true);
    setToast("");
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    setToast(data.message ?? (res.ok ? "done." : "something went wrong."));
    if (res.ok) {
      setSelected(null);
      setRejectMode(false); setRejectReason("");
      setStrikeMode(false); setStrikeReason("");
    }
    setLoading(false);
  }

  async function createGroup() {
    if (groupSelected.length < 2) return;
    setLoading(true);
    setToast("");
    const res = await fetch("/api/admin/create-group", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: groupName, memberIds: groupSelected, note: groupNote })
    });
    const data = await res.json();
    setToast(data.message ?? (res.ok ? "group created." : "error creating group."));
    if (res.ok) {
      setGroupMode(false);
      setGroupSelected([]);
      setGroupName("");
      setGroupNote("");
    }
    setLoading(false);
  }

  const pending = applicants.filter(a => a.status === "pending");
  const approved = applicants.filter(a => a.status === "approved");
  const rejected = applicants.filter(a => a.status === "rejected");

  return (
    <div className="admin-shell">
      <div className="admin-tabs">
        {TABS.map(t => (
          <button key={t}
            className={`admin-tab ${tab === t ? "admin-tab--active" : ""}`}
            onClick={() => { setTab(t); setSelected(null); setToast(""); setGroupMode(false); setGroupSelected([]); }}>
            {t}
            {t === "applicants" && pending.length > 0 && (
              <span className="admin-badge">{pending.length}</span>
            )}
          </button>
        ))}
      </div>

      {toast && <div className="admin-toast">{toast}</div>}

      <div className="admin-body">

        {/* ── APPLICANTS ── */}
        {tab === "applicants" && (
          <div className="admin-two-col">

            {/* Left: list */}
            <div className="admin-list">
              {/* Group mode toggle */}
              <div className="admin-list-actions">
                <button
                  className={`admin-mode-btn ${groupMode ? "admin-mode-btn--active" : ""}`}
                  onClick={() => { setGroupMode(m => !m); setSelected(null); setGroupSelected([]); }}>
                  {groupMode ? "cancel group" : "+ form a group"}
                </button>
                {groupMode && groupSelected.length >= 2 && (
                  <span className="admin-list-meta">{groupSelected.length} selected</span>
                )}
              </div>

              {pending.length > 0 && (
                <>
                  <p className="admin-list-label">pending ({pending.length})</p>
                  {pending.map(a => (
                    <button key={a.id}
                      className={`admin-list-item ${selected?.id === a.id && !groupMode ? "admin-list-item--active" : ""}`}
                      onClick={() => groupMode ? null : selectItem(a)}>
                      <span>{a.name}</span>
                      <span className="admin-list-meta">{new Date(a.applied_at).toLocaleDateString()}</span>
                    </button>
                  ))}
                </>
              )}

              {approved.length > 0 && (
                <>
                  <p className="admin-list-label" style={{ marginTop: "16px" }}>approved ({approved.length})</p>
                  {approved.map(a => (
                    <button key={a.id}
                      className={`admin-list-item ${selected?.id === a.id && !groupMode ? "admin-list-item--active" : ""} ${groupMode && groupSelected.includes(a.id) ? "admin-list-item--selected" : ""}`}
                      onClick={() => groupMode ? toggleGroupMember(a.id) : selectItem(a)}>
                      <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        {groupMode && (
                          <span className={`admin-checkbox ${groupSelected.includes(a.id) ? "admin-checkbox--checked" : ""}`} />
                        )}
                        {a.name}
                      </span>
                      <span className="admin-list-meta admin-list-meta--green">✓</span>
                    </button>
                  ))}
                </>
              )}

              {rejected.length > 0 && (
                <>
                  <p className="admin-list-label" style={{ marginTop: "16px" }}>rejected ({rejected.length})</p>
                  {rejected.map(a => (
                    <button key={a.id}
                      className={`admin-list-item ${selected?.id === a.id && !groupMode ? "admin-list-item--active" : ""}`}
                      onClick={() => groupMode ? null : selectItem(a)}>
                      <span>{a.name}</span>
                      <span className="admin-list-meta admin-list-meta--red">✗</span>
                    </button>
                  ))}
                </>
              )}

              {applicants.length === 0 && <p className="admin-empty">no applicants yet.</p>}
            </div>

            {/* Right: group builder or applicant detail */}
            {groupMode ? (
              <div className="admin-detail">
                <h3>form a group</h3>
                <p className="admin-detail-meta">select 2+ approved members from the list, then send.</p>

                {groupSelected.length > 0 && (
                  <div className="admin-detail-section">
                    <label>selected ({groupSelected.length})</label>
                    {groupSelected.map(id => {
                      const a = approved.find(x => x.id === id);
                      return a ? (
                        <p key={id} style={{ fontSize: "14px", margin: "4px 0" }}>
                          {a.name} — {a.neighborhood} — {a.friend_type?.slice(0, 2).join(", ")}
                        </p>
                      ) : null;
                    })}
                  </div>
                )}

                <div className="admin-detail-section">
                  <label>group name <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional — auto-generated if blank)</span></label>
                  <input className="field-input" style={{ marginTop: "6px" }}
                    value={groupName} onChange={e => setGroupName(e.target.value)}
                    placeholder="e.g. runners — east side" />
                </div>

                <div className="admin-detail-section">
                  <label>note to the group <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(included in email)</span></label>
                  <textarea className="field-input field-textarea" rows={3} style={{ marginTop: "6px" }}
                    value={groupNote} onChange={e => setGroupNote(e.target.value)}
                    placeholder="e.g. you all want to run — suggest meeting at Tenney Park Saturday at 8am." />
                </div>

                <div className="admin-actions">
                  <button className="btn-primary"
                    disabled={groupSelected.length < 2 || loading}
                    onClick={createGroup}>
                    {loading ? "creating…" : `create group + send ${groupSelected.length} emails`}
                  </button>
                </div>
              </div>
            ) : selected && (
              <div className="admin-detail">
                <div className="admin-detail-header">
                  <div>
                    <h3>{selected.name}</h3>
                    <p className="admin-detail-meta">
                      {selected.email} · age {selected.age} · {selected.stage_of_life}
                    </p>
                    <p className="admin-detail-meta">{selected.neighborhood}</p>
                  </div>
                  <span className={`admin-status-badge admin-status-badge--${selected.status}`}>
                    {selected.status}
                  </span>
                </div>

                <div className="admin-detail-section">
                  <label>goal / intention</label>
                  <p>{selected.goals}</p>
                </div>

                <div className="admin-detail-section">
                  <label>activities</label>
                  <p>{selected.friend_type?.join(", ") || "—"}</p>
                </div>

                {selected.availability_days?.length > 0 && (
                  <div className="admin-detail-section">
                    <label>availability</label>
                    <p>{selected.availability_days.join(", ")}
                      {selected.availability_detail && ` — ${selected.availability_detail}`}
                    </p>
                  </div>
                )}

                <div className="admin-detail-section">
                  <label>introduction <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, color: "var(--muted)" }}>(ai check)</span></label>
                  <p style={{ whiteSpace: "pre-wrap" }}>{selected.madison_proof}</p>
                </div>

                {selected.proof_link && (
                  <div className="admin-detail-section">
                    <label>social profile</label>
                    <a href={selected.proof_link} target="_blank" rel="noopener noreferrer"
                      style={{ fontSize: "13px", color: "var(--text)", textDecoration: "underline" }}>
                      {selected.proof_link}
                    </a>
                  </div>
                )}

                {selected.home_lat && (
                  <div className="admin-detail-section">
                    <label>location</label>
                    <p>{selected.home_lat.toFixed(4)}, {selected.home_lng.toFixed(4)} · {selected.travel_radius_km?.toFixed(1)} km radius</p>
                  </div>
                )}

                <div className="admin-detail-section">
                  <label>applied</label>
                  <p>{new Date(selected.applied_at).toLocaleString()}</p>
                </div>

                {/* Pending actions */}
                {selected.status === "pending" && !rejectMode && (
                  <div className="admin-actions">
                    <button className="btn-primary" disabled={loading}
                      onClick={() => callAction("/api/admin/approve", { id: selected.id })}>
                      {loading ? "…" : "approve"}
                    </button>
                    <button className="btn-ghost admin-reject-btn" disabled={loading}
                      onClick={() => setRejectMode(true)}>
                      reject
                    </button>
                  </div>
                )}

                {selected.status === "pending" && rejectMode && (
                  <div className="admin-reject-panel">
                    <label className="field-label">rejection reason
                      <span className="field-hint"> — included in the email</span>
                    </label>
                    <textarea className="field-input field-textarea" rows={3}
                      value={rejectReason} onChange={e => setRejectReason(e.target.value)}
                      placeholder="e.g. the introduction didn't feel genuine — you're welcome to reapply with more detail." />
                    <div className="admin-actions" style={{ marginTop: "12px" }}>
                      <button className="btn-primary" disabled={!rejectReason.trim() || loading}
                        style={{ background: "#c00", borderColor: "#c00" }}
                        onClick={() => callAction("/api/admin/reject", { id: selected.id, reason: rejectReason })}>
                        {loading ? "…" : "send rejection"}
                      </button>
                      <button className="btn-ghost" onClick={() => { setRejectMode(false); setRejectReason(""); }}>cancel</button>
                    </div>
                  </div>
                )}

                {/* Approved: strike / kick */}
                {selected.status === "approved" && !strikeMode && (
                  <div className="admin-actions" style={{ marginTop: "24px", paddingTop: "24px", borderTop: "1px solid var(--border)" }}>
                    <button className="btn-ghost" style={{ borderColor: "#c00", color: "#c00" }}
                      disabled={loading} onClick={() => setStrikeMode(true)}>
                      issue strike
                    </button>
                  </div>
                )}

                {selected.status === "approved" && strikeMode && (
                  <div className="admin-reject-panel">
                    <label className="field-label">reason for strike
                      <span className="field-hint"> — at 3 strikes, user is removed and emailed</span>
                    </label>
                    <textarea className="field-input field-textarea" rows={2}
                      value={strikeReason} onChange={e => setStrikeReason(e.target.value)}
                      placeholder="e.g. no-showed a meetup, didn't respond to messages" />
                    <div className="admin-actions" style={{ marginTop: "12px" }}>
                      <button className="btn-primary" disabled={!strikeReason.trim() || loading}
                        style={{ background: "#c00", borderColor: "#c00" }}
                        onClick={() => callAction("/api/admin/strike", { email: selected.email, reason: strikeReason })}>
                        {loading ? "…" : "issue strike"}
                      </button>
                      <button className="btn-ghost" onClick={() => { setStrikeMode(false); setStrikeReason(""); }}>cancel</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── GROUPS ── */}
        {tab === "groups" && (
          <div className="admin-two-col">
            <div className="admin-list">
              {groups.length === 0 && <p className="admin-empty">no groups yet. form one in the applicants tab.</p>}
              {groups.map(g => {
                const daysSince = Math.floor((Date.now() - new Date(g.last_activity_at)) / 86400000);
                const health = daysSince < 14 ? "green" : daysSince < 30 ? "yellow" : "red";
                return (
                  <button key={g.id}
                    className={`admin-list-item ${selected?.id === g.id ? "admin-list-item--active" : ""}`}
                    onClick={() => selectItem(g)}>
                    <span>{g.name || `group ${g.id.slice(0, 6)}`}</span>
                    <span className={`admin-health admin-health--${health}`}>{daysSince}d</span>
                  </button>
                );
              })}
            </div>

            {selected && tab === "groups" && (
              <div className="admin-detail">
                <h3>{selected.name || `group ${selected.id.slice(0, 6)}`}</h3>
                <p className="admin-detail-meta">
                  {selected.status} · created {new Date(selected.created_at).toLocaleDateString()}
                </p>

                <div className="admin-detail-section">
                  <label>members</label>
                  {selected.group_members?.filter(m => m.user_id).map(m => (
                    <p key={m.user_id} style={{ fontSize: "14px", margin: "4px 0" }}>
                      {m.profiles?.name} — {m.profiles?.email}
                    </p>
                  ))}
                </div>

                {selected.admin_notes && (
                  <div className="admin-detail-section">
                    <label>notes</label>
                    <p>{selected.admin_notes}</p>
                  </div>
                )}

                {selected.status === "active" && (
                  <div className="admin-actions">
                    <button className="btn-ghost" style={{ borderColor: "#c00", color: "#c00" }}
                      disabled={loading}
                      onClick={() => callAction("/api/admin/dissolve-group", { id: selected.id })}>
                      {loading ? "…" : "dissolve group"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── KICKED ── */}
        {tab === "kicked" && (
          <div className="admin-list admin-list--full">
            {kicked.length === 0 && <p className="admin-empty">no kicked users.</p>}
            {kicked.map(k => (
              <div key={k.id} className="admin-list-item admin-list-item--static">
                <div>
                  <span style={{ fontWeight: 600 }}>{k.name}</span>
                  <span style={{ color: "var(--muted)", marginLeft: "8px", fontSize: "13px" }}>{k.email}</span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: "12px", color: "#c00", margin: 0 }}>{k.kick_reason}</p>
                  <p style={{ fontSize: "11px", color: "var(--muted)", margin: 0 }}>{new Date(k.kicked_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
