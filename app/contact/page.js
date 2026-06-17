"use client";

import { useState } from "react";
import SiteHeader from "../components/SiteHeader";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle");

  function set(field, value) { setForm(f => ({ ...f, [field]: value })); }

  async function submit(e) {
    e.preventDefault();
    setStatus("sending");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    setStatus(res.ok ? "done" : "error");
  }

  return (
    <div className="page">
      <SiteHeader active="contact" />
      <div className="contact-page">
        <h1>get in touch</h1>
        <p>questions, feedback, or just want to say hi.</p>

        {status === "done" ? (
          <p className="contact-success">sent. we&apos;ll get back to you soon.</p>
        ) : (
          <form className="apply-form-single" onSubmit={submit}>
            <div className="apply-field">
              <label className="field-label">name</label>
              <input className="field-input" value={form.name}
                onChange={e => set("name", e.target.value)} placeholder="your name" />
            </div>
            <div className="apply-field">
              <label className="field-label">email</label>
              <input className="field-input" type="email" value={form.email}
                onChange={e => set("email", e.target.value)} placeholder="you@email.com" />
            </div>
            <div className="apply-field">
              <label className="field-label">message</label>
              <textarea className="field-input field-textarea" rows={5}
                value={form.message} onChange={e => set("message", e.target.value)}
                placeholder="what&apos;s on your mind?" />
            </div>
            {status === "error" && <p className="field-error">something went wrong. try again.</p>}
            <button className="btn-primary" type="submit"
              disabled={!form.name || !form.email || !form.message || status === "sending"}>
              {status === "sending" ? "sending…" : "send"}
            </button>
          </form>
        )}
      </div>
      <footer className="footer">© 2026 where we landing</footer>
    </div>
  );
}
