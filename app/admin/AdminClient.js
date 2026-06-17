"use client";

import { useState } from "react";

const TABS = ["applicants", "groups", "kicked"];

export default function AdminClient({ applicants, groups, kicked }) {
  const [tab, setTab] = useState("applicants");
  const [selected, setSelected] = useState(null);
  const [actionMsg, setActionMsg] = useState("");

  async function callAction(endpoint, body) {
    setActionMsg("");
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    setActionMsg(data.message ?? (res.ok ? "done." : "error."));
    if (res.ok) setSelected(null);
  }

  const pending = applicants.filter(a => a.status === "pending");
  const approved = applicants.filter(a => a.status === "approved");

  return (
    <div className="admin-shell">
      <div className="admin-tabs">
        {TABS.map(t => (
          <button key={t} className={`admin-tab ${tab === t ? "admin-tab--active" : ""}`} onClick={() => { setTab(t); setSelected(null); setActionMsg(""); }}>
            {t}
            {t === "applicants" && pending.length > 0 && <span className="admin-badge">{pending.length}</span>}
          </button>
        ))}
      </div>

      {actionMsg && <div className="admin-toast">{actionMsg}</div>}

      <div className="admin-body">
        {tab === "applicants" && (
          <div className="admin-two-col">
            <div className="admin-list">
              {pending.length > 0 && (
                <>
                  <p className="admin-list-label">pending ({pending.length})</p>
                  {pending.map(a => (
                    <button key={a.id} className={`admin-list-item ${selected?.id === a.id ? "admin-list-item--active" : ""}`} onClick={() => setSelected(a)}>
                      <span>{a.name}</span>
                      <span className="admin-list-meta">{new Date(a.applied_at).toLocaleDateString()}</span>
                    </button>
                  ))}
                </>
              )}
              {approved.length > 0 && (
                <>
                  <p className="admin-list-label" style={{ marginTop: "24px" }}>approved ({approved.length})</p>
                  {approved.map(a => (
                    <button key={a.id} className={`admin-list-item ${selected?.id === a.id ? "admin-list-item--active" : ""}`} onClick={() => setSelected(a)}>
                      <span>{a.name}</span>
                      <span className="admin-list-meta">{a.neighborhood}</span>
                    </button>
                  ))}
                </>
              )}
              {applicants.length === 0 && <p className="admin-empty">no applicants yet.</p>}
            </div>

            {selected && (
              <div className="admin-detail">
                <h3>{selected.name}</h3>
                <p className="admin-detail-meta">{selected.email} · {selected.age} · {selected.stage_of_life}</p>
                <p className="admin-detail-meta">{selected.neighborhood}</p>

                <div className="admin-detail-section">
                  <label>goals</label>
                  <p>{selected.goals}</p>
                </div>
                <div className="admin-detail-section">
                  <label>looking for</label>
                  <p>{selected.friend_type?.join(", ")}</p>
                </div>
                <div className="admin-detail-section">
                  <label>will travel to</label>
                  <p>{selected.travel_radius?.join(", ")}</p>
                </div>
                <div className="admin-detail-section">
                  <label>availability</label>
                  <p>{selected.availability_days?.join(", ")} · {selected.availability_time?.join(", ")}</p>
                </div>
                <div className="admin-detail-section">
                  <label>madison proof</label>
                  <p>{selected.madison_proof}</p>
                </div>

                {selected.status === "pending" && (
                  <div className="admin-actions">
                    <button className="btn-primary" onClick={() => callAction("/api/admin/approve", { id: selected.id })}>approve</button>
                    <button className="btn-ghost" onClick={() => callAction("/api/admin/reject", { id: selected.id })}>reject</button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {tab === "groups" && (
          <div className="admin-two-col">
            <div className="admin-list">
              {groups.length === 0 && <p className="admin-empty">no groups yet.</p>}
              {groups.map(g => {
                const daysSince = Math.floor((Date.now() - new Date(g.last_activity_at)) / 86400000);
                const health = daysSince < 14 ? "green" : daysSince < 30 ? "yellow" : "red";
                return (
                  <button key={g.id} className={`admin-list-item ${selected?.id === g.id ? "admin-list-item--active" : ""}`} onClick={() => setSelected(g)}>
                    <span>{g.name || `group ${g.id.slice(0, 6)}`}</span>
                    <span className={`admin-health admin-health--${health}`}>{daysSince}d ago</span>
                  </button>
                );
              })}
            </div>

            {selected && (
              <div className="admin-detail">
                <h3>{selected.name || `group ${selected.id.slice(0, 6)}`}</h3>
                <p className="admin-detail-meta">status: {selected.status} · created {new Date(selected.created_at).toLocaleDateString()}</p>

                <div className="admin-detail-section">
                  <label>members</label>
                  {selected.group_members?.map(m => (
                    <p key={m.user_id}>{m.profiles?.name} — {m.profiles?.email}</p>
                  ))}
                </div>

                {selected.admin_notes && (
                  <div className="admin-detail-section">
                    <label>notes</label>
                    <p>{selected.admin_notes}</p>
                  </div>
                )}

                <div className="admin-actions">
                  <button className="btn-ghost" onClick={() => callAction("/api/admin/dissolve-group", { id: selected.id })}>dissolve group</button>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "kicked" && (
          <div className="admin-list admin-list--full">
            {kicked.length === 0 && <p className="admin-empty">no kicked users.</p>}
            {kicked.map(k => (
              <div key={k.id} className="admin-list-item admin-list-item--static">
                <span>{k.name} — {k.email}</span>
                <span className="admin-list-meta">{k.kick_reason} · {new Date(k.kicked_at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
