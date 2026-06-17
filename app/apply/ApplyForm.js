"use client";

import { useState } from "react";
import LocationPicker from "./LocationPicker";

const STAGES = [
  "student", "unclassified student", "early career",
  "mid-career", "parent", "retired", "figuring it out"
];

const ACTIVITIES = [
  "running / fitness", "climbing", "hiking & outdoors", "golfing",
  "going out / nightlife", "book club", "cooking & food", "music",
  "creative (art / writing)", "woodworking & making",
  "sobriety-friendly socials", "gaming", "coding / tech",
  "learning something new", "volunteering"
];

const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

const GOAL_EXAMPLES = [
  { tag: "running", text: "I want to run a half marathon this fall. I need people to train with on weekends — I've been going alone and I hate it." },
  { tag: "climbing", text: "I boulder at The Bouldering Project 3x a week. I want a consistent crew to go with and push each other." },
  { tag: "sobriety", text: "I'm cutting back on drinking. I want to find people who also want to do fun things that aren't centered on alcohol." },
  { tag: "book club", text: "I want a book club that actually meets. One book, one night, everyone shows up." },
  { tag: "going out", text: "I moved here 6 months ago and haven't figured out who to go to shows and bars with. I want a group." },
  { tag: "no goal yet", text: "I don't have a specific thing. I just want to meet real people in Madison. I'm open." },
];

function toggle(arr, val) {
  return arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val];
}

export default function ApplyForm({ name, email }) {
  const [form, setForm] = useState({
    age: "", stage: "", customStage: "",
    location: null,
    activities: [], customActivity: "",
    goals: "",
    days: [], daysDetail: "",
    intro: "",
    proofLink: "",
    consent: false
  });
  const [showExamples, setShowExamples] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  function set(field, value) { setForm(f => ({ ...f, [field]: value })); }

  const effectiveStage = form.stage === "other" ? form.customStage : form.stage;

  const canSubmit =
    form.age && effectiveStage &&
    form.location &&
    (form.activities.length > 0 || form.customActivity.trim().length > 2) &&
    form.goals.trim().length > 15 &&
    form.days.length > 0 &&
    form.intro.trim().length > 30 &&
    form.consent;

  async function submit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const allActivities = form.customActivity.trim()
        ? [...form.activities, form.customActivity.trim()]
        : form.activities;

      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, email,
          age: form.age,
          stage: effectiveStage,
          homeLat: form.location?.lat,
          homeLng: form.location?.lng,
          radiusKm: form.location?.radiusKm,
          activities: allActivities,
          goals: form.goals,
          days: form.days,
          daysDetail: form.daysDetail,
          intro: form.intro,
          proofLink: form.proofLink
        })
      });
      if (!res.ok) throw new Error();
      setDone(true);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="apply-done">
        <h1>you&apos;re on the list.</h1>
        <p>Real humans — not AI — are reading your application to make sure you&apos;re a good fit. We&apos;ll email you when your squad is ready.</p>
        <p style={{ marginTop: "8px", fontSize: "13px", color: "var(--muted)" }}>usually within a week or two.</p>
        <a href="/" className="btn-ghost" style={{ marginTop: "28px", display: "inline-block" }}>back home</a>
      </div>
    );
  }

  return (
    <form className="apply-form-single" onSubmit={submit}>

      {/* Age + stage */}
      <div className="apply-row">
        <div className="apply-field">
          <label className="field-label">age</label>
          <input className="field-input" type="number" min="18" max="99"
            value={form.age} onChange={e => set("age", e.target.value)} placeholder="27" />
        </div>
        <div className="apply-field apply-field--grow">
          <label className="field-label">stage of life</label>
          <div className="chip-group">
            {STAGES.map(s => (
              <button key={s} type="button"
                className={`chip ${form.stage === s ? "chip--active" : ""}`}
                onClick={() => set("stage", s)}>{s}</button>
            ))}
            <button type="button"
              className={`chip ${form.stage === "other" ? "chip--active" : ""}`}
              onClick={() => set("stage", "other")}>other</button>
          </div>
          {form.stage === "other" && (
            <input className="field-input" style={{ marginTop: "8px" }}
              value={form.customStage} onChange={e => set("customStage", e.target.value)}
              placeholder="describe your stage" />
          )}
        </div>
      </div>

      {/* Goal */}
      <div className="apply-field">
        <div className="field-label-row">
          <label className="field-label">
            what is your personal goal or intention?
            <span className="field-hint"> be honest — we can match better.</span>
          </label>
          <button type="button" className="examples-toggle"
            onClick={() => setShowExamples(s => !s)}>
            {showExamples ? "hide examples" : "see examples"}
          </button>
        </div>
        {showExamples && (
          <div className="examples-panel">
            {GOAL_EXAMPLES.map(ex => (
              <div key={ex.tag} className="examples-row">
                <span className="examples-tag">{ex.tag}</span>
                <span className="examples-text">&ldquo;{ex.text}&rdquo;</span>
              </div>
            ))}
            <a href="/about" target="_blank" rel="noopener noreferrer" className="examples-link">
              see what kinds of squads we form →
            </a>
          </div>
        )}
        <textarea className="field-input field-textarea" rows={3}
          value={form.goals} onChange={e => set("goals", e.target.value)}
          placeholder="I want to find people to run with. training for a half marathon this fall. I've been going alone and it's getting old." />
      </div>

      {/* Activities */}
      <div className="apply-field">
        <label className="field-label">what do you want to do together?
          <span className="field-hint"> pick everything that applies</span>
        </label>
        <div className="chip-group">
          {ACTIVITIES.map(a => (
            <button key={a} type="button"
              className={`chip ${form.activities.includes(a) ? "chip--active" : ""}`}
              onClick={() => set("activities", toggle(form.activities, a))}>{a}</button>
          ))}
        </div>
        <input className="field-input" style={{ marginTop: "8px" }}
          value={form.customActivity} onChange={e => set("customActivity", e.target.value)}
          placeholder="something else? type it here" />
      </div>

      {/* Location map */}
      <div className="apply-field">
        <label className="field-label">your area + how far you&apos;ll travel</label>
        <p className="field-sub">drop a pin on your general neighborhood. drag the circle edge to show how far you&apos;re willing to go. don&apos;t use your exact address.</p>
        <LocationPicker onChange={(loc) => set("location", loc)} />
      </div>

      {/* Availability */}
      <div className="apply-field">
        <label className="field-label">days you&apos;re generally free</label>
        <div className="chip-group">
          {DAYS.map(d => (
            <button key={d} type="button"
              className={`chip ${form.days.includes(d) ? "chip--active" : ""}`}
              onClick={() => set("days", toggle(form.days, d))}>{d}</button>
          ))}
        </div>
        <input className="field-input" style={{ marginTop: "8px" }}
          value={form.daysDetail} onChange={e => set("daysDetail", e.target.value)}
          placeholder="e.g. saturday mornings, weekday evenings after 6pm" />
      </div>

      {/* Intro / proof */}
      <div className="apply-field">
        <label className="field-label">introduce yourself</label>
        <p className="field-sub">
          this is how we get to know you — and how we know you&apos;re not AI.
          if this reads like it was written by AI, we&apos;ll reject the application.
          keep it real, keep it you.
        </p>
        <textarea className="field-input field-textarea" rows={5}
          value={form.intro} onChange={e => set("intro", e.target.value)}
          placeholder="write like you're texting a friend. tell us something real about yourself — who you are, what your life looks like right now, why you're here." />
      </div>

      {/* Optional profile link */}
      <div className="apply-field">
        <label className="field-label">link to a social profile
          <span className="field-hint"> optional — LinkedIn, Instagram, anything public. helps us verify.</span>
        </label>
        <input className="field-input" type="url" value={form.proofLink}
          onChange={e => set("proofLink", e.target.value)}
          placeholder="https://instagram.com/yourhandle" />
      </div>

      {/* Consent */}
      <label className="field-check">
        <input type="checkbox" checked={form.consent}
          onChange={e => set("consent", e.target.checked)} />
        I&apos;m a real person. I understand I&apos;m being matched with a squad — a small group of people with similar goals — not just one person. ready up, run squad.
      </label>

      {error && <p className="field-error">{error}</p>}

      <button className="btn-primary" type="submit"
        disabled={!canSubmit || submitting} style={{ marginTop: "8px" }}>
        {submitting ? "submitting…" : "submit"}
      </button>
    </form>
  );
}
