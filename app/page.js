import { createClient } from "@/lib/supabase/server";
import SiteHeader from "./components/SiteHeader";
import BusHero from "./components/BusHero";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profiles = [];
  let role = null;

  if (user) {
    const [{ data: profileData }, { data: allProfiles }] = await Promise.all([
      supabase.from("profiles").select("role").eq("id", user.id).single(),
      supabase.from("profiles")
        .select("id, name, neighborhood, goals, friend_type, stage_of_life, availability_days")
        .eq("status", "active")
        .limit(20)
    ]);
    role = profileData?.role ?? null;
    profiles = allProfiles ?? [];
  }

  return (
    <div className="page">
      <SiteHeader user={user ? { ...user, role } : null} />
      <BusHero isAuthed={!!user} />

      <section className="home-pool">
        {!user ? (
          <div className="pool-gate">
            <div className="pool-dots" aria-hidden="true">
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="pool-dot" style={{
                  top: `${15 + (i * 37) % 70}%`,
                  left: `${5 + (i * 41) % 90}%`,
                  animationDelay: `${(i * 0.3) % 3}s`
                }} />
              ))}
            </div>
            <div className="pool-gate-card">
              <p className="pool-count">people in madison are on the list.</p>
              <p className="pool-sub">sign in to see who they are, where they hang, and what they&apos;re after.</p>
              <a href="/auth/signin?next=/" className="btn-primary">sign in with google</a>
            </div>
          </div>
        ) : (
          <div className="pool-grid-wrap">
            <div className="pool-header">
              <h2>{profiles.length} {profiles.length === 1 ? "person" : "people"} in the pool</h2>
              <a href="/apply" className="btn-ghost">apply to join</a>
            </div>
            <div className="pool-grid">
              {profiles.map(p => (
                <div key={p.id} className="pool-card">
                  <div className="pool-card-top">
                    <span className="pool-card-name">{p.name}</span>
                    <span className="pool-card-stage">{p.stage_of_life}</span>
                  </div>
                  <p className="pool-card-area">{p.neighborhood}</p>
                  {p.goals && <p className="pool-card-goals">{p.goals}</p>}
                  {p.friend_type?.length > 0 && (
                    <div className="chip-group chip-group--sm" style={{ marginTop: "8px" }}>
                      {p.friend_type.slice(0, 3).map(t => (
                        <span key={t} className="chip chip--sm">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <footer className="footer">© 2026 where we landing</footer>
    </div>
  );
}
