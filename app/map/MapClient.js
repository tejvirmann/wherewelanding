"use client";

const NEIGHBORHOOD_COORDS = {
  "downtown / isthmus":    { lat: 43.0731, lng: -89.3837 },
  "east side":             { lat: 43.0820, lng: -89.3500 },
  "near east":             { lat: 43.0795, lng: -89.3620 },
  "west side":             { lat: 43.0650, lng: -89.4500 },
  "south side":            { lat: 43.0450, lng: -89.3800 },
  "fitchburg / verona":    { lat: 43.0200, lng: -89.4200 },
  "north side":            { lat: 43.1100, lng: -89.3900 },
  "i'll go anywhere in madison": { lat: 43.0731, lng: -89.4012 }
};

function jitter(coord) {
  return coord + (Math.random() - 0.5) * 0.008;
}

export default function MapClient({ profiles, isAuthed }) {
  if (!isAuthed) {
    return (
      <div className="map-gate">
        <div className="map-gate-blur" aria-hidden="true">
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} className="map-gate-dot" style={{
              top: `${20 + Math.random() * 60}%`,
              left: `${10 + Math.random() * 80}%`,
              animationDelay: `${Math.random() * 2}s`
            }} />
          ))}
        </div>
        <div className="map-gate-cta">
          <p>{profiles.length > 0 ? profiles.length : "a few dozen"} people in madison are on the list.</p>
          <p className="map-gate-sub">sign in to see who they are, where they are, and what they're after.</p>
          <a href="/auth/signin" className="btn-primary">sign in with google</a>
        </div>
      </div>
    );
  }

  return (
    <div className="map-shell">
      <div className="map-list">
        {profiles.length === 0 && (
          <p className="map-empty">no one on the list yet. <a href="/apply">apply to join.</a></p>
        )}
        {profiles.map(p => {
          const coords = NEIGHBORHOOD_COORDS[p.neighborhood];
          return (
            <div key={p.id} className="map-card">
              <div className="map-card-header">
                <span className="map-card-name">{p.name}</span>
                <span className="map-card-stage">{p.stage_of_life}</span>
              </div>
              <p className="map-card-neighborhood">{p.neighborhood}</p>
              {p.goals && <p className="map-card-goals">{p.goals}</p>}
              {p.friend_type?.length > 0 && (
                <div className="chip-group chip-group--sm">
                  {p.friend_type.map(t => <span key={t} className="chip chip--sm">{t}</span>)}
                </div>
              )}
              {p.availability_days?.length > 0 && (
                <p className="map-card-avail">{p.availability_days.join(", ")}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
