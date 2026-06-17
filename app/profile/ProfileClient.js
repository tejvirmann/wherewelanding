"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const STATUS_LABEL = {
  pending: "application received — real humans are reviewing it.",
  approved: "approved — we're finding your match.",
  rejected: "not approved. you're welcome to apply again.",
  matched: "matched — check your email."
};

export default function ProfileClient({ user, profile, application }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState("");

  async function deleteAccount() {
    setDeleting(true);
    setError("");
    try {
      const res = await fetch("/api/profile/delete", { method: "POST" });
      if (!res.ok) throw new Error();
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/");
    } catch {
      setError("Something went wrong. Try again or email us.");
      setDeleting(false);
    }
  }

  return (
    <div className="profile-shell">

      <section className="profile-section">
        <h1 className="profile-name">{user.name}</h1>
        <p className="profile-email">{user.email}</p>
      </section>

      {application && (
        <section className="profile-section">
          <h2>your application</h2>
          <p className="profile-status-pill profile-status-pill--{application.status}">
            {STATUS_LABEL[application.status] ?? application.status}
          </p>

          <div className="profile-data-grid">
            {application.stage_of_life && (
              <div className="profile-data-item">
                <label>stage</label>
                <p>{application.stage_of_life}</p>
              </div>
            )}
            {application.neighborhood && (
              <div className="profile-data-item">
                <label>your area</label>
                <p>{application.neighborhood}</p>
              </div>
            )}
            {application.goals && (
              <div className="profile-data-item profile-data-item--full">
                <label>what you want to do</label>
                <p>{application.goals}</p>
              </div>
            )}
            {application.friend_type?.length > 0 && (
              <div className="profile-data-item profile-data-item--full">
                <label>activities</label>
                <div className="chip-group chip-group--sm" style={{ marginTop: "4px" }}>
                  {application.friend_type.map(t => (
                    <span key={t} className="chip chip--sm">{t}</span>
                  ))}
                </div>
              </div>
            )}
            {application.availability_days?.length > 0 && (
              <div className="profile-data-item">
                <label>available</label>
                <p>{application.availability_days.join(", ")}</p>
              </div>
            )}
          </div>

          {application.status === "pending" && (
            <p className="profile-note">
              real humans — not ai — are reading your application. we check that you&apos;re a real person
              in madison before making any matches. this usually takes a week or two.
            </p>
          )}
        </section>
      )}

      {!application && (
        <section className="profile-section">
          <h2>no application yet</h2>
          <p style={{ color: "var(--muted)", fontSize: "14px" }}>
            you haven&apos;t applied yet.{" "}
            <a href="/apply" style={{ color: "var(--text)", textDecoration: "underline" }}>apply to join →</a>
          </p>
        </section>
      )}

      <section className="profile-section profile-section--danger">
        <h2>delete account</h2>
        <p>removes your profile and application data. this can&apos;t be undone.</p>

        {!confirmDelete ? (
          <button className="btn-ghost" style={{ borderColor: "#c00", color: "#c00" }}
            onClick={() => setConfirmDelete(true)}>
            delete my account
          </button>
        ) : (
          <div className="profile-confirm-delete">
            <p>are you sure? this is permanent.</p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button className="btn-primary" style={{ background: "#c00", borderColor: "#c00" }}
                onClick={deleteAccount} disabled={deleting}>
                {deleting ? "deleting…" : "yes, delete everything"}
              </button>
              <button className="btn-ghost" onClick={() => setConfirmDelete(false)}>cancel</button>
            </div>
          </div>
        )}
        {error && <p className="field-error" style={{ marginTop: "12px" }}>{error}</p>}
      </section>
    </div>
  );
}
