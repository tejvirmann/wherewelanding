import dynamic from "next/dynamic";
import SiteHeader from "../../components/SiteHeader";

const MapPreview = dynamic(() => import("../../components/MapPreview"), {
  ssr: false,
  loading: () => <div className="map-preview__loading">Loading map...</div>
});

const CITY_NAMES = {
  "madison-wi": "Madison, WI",
  "milwaukee-wi": "Milwaukee, WI"
};

export async function generateMetadata({ params }) {
  const cityName = CITY_NAMES[params.city] || params.city;
  return {
    title: `squads · ${cityName}`,
    description: `Browse squads and see the community map in ${cityName}. Drop a pin and connect with people landing near you.`,
    openGraph: {
      title: `squads · ${cityName}`,
      description: `Browse squads and see the community map in ${cityName}. Drop a pin and connect with people landing near you.`,
      siteName: "where we landing?"
    }
  };
}

export default function SquadsCityPage({ params }) {
  const cityName = CITY_NAMES[params.city] || params.city;

  return (
    <div className="page">
      <SiteHeader active="squads" />

      <section className="section">
        <h1>Squads in {cityName}</h1>
        <p>
          Browse squads in your city. Active counts reflect members who dropped a pin
          in the last two weeks.
        </p>
        <div className="groups-header">
          <button className="btn-primary" type="button">
            Create new squad
          </button>
        </div>
        <div className="group-grid">
          <a href="/map" className="group-card group-card--link">
            <div className="group-header">
              <h3>Madison Software Squad</h3>
              <span className="tag">Pilot squad</span>
            </div>
            <p>
              Weekly software meetups across downtown Madison. Drop a pin to
              land with other builders.
            </p>
            <div className="group-meta">
              <span>📍 {cityName}</span>
              <span className="group-active">✓ 18 active</span>
            </div>
            <div className="group-cta">
              View map →
            </div>
          </a>
          <div className="group-card group-card--disabled">
            <div className="group-header">
              <h3>Downtown Designers</h3>
              <span className="tag">Coming soon</span>
            </div>
            <p>Monthly creative meetups for designers and makers.</p>
            <div className="group-meta">
              <span>📍 {cityName}</span>
              <span className="group-active">✓ 7 active</span>
            </div>
          </div>
          <div className="group-card group-card--disabled">
            <h3>More squads coming soon</h3>
            <p>We are opening the next drop zones after the pilot launch.</p>
          </div>
        </div>
      </section>

      <section id="community-map" className="section">
        <h2>community map — {cityName}</h2>
        <p>
          See where people are landing in real-time. Drop your pin and check who else is meeting up at the same spot.
        </p>
        <MapPreview />
        <div className="map-stats">
          <div className="map-stat-card">
            <span className="map-stat-label">Active members</span>
            <strong className="map-stat-value">18</strong>
            <span className="map-stat-hint">Last 2 weeks</span>
          </div>
          <div className="map-stat-card">
            <span className="map-stat-label">Total landings</span>
            <strong className="map-stat-value">47</strong>
            <span className="map-stat-hint">All time</span>
          </div>
          <div className="map-stat-card">
            <span className="map-stat-label">Most active zone</span>
            <strong className="map-stat-value">Downtown</strong>
            <span className="map-stat-hint">8 landings</span>
          </div>
        </div>
      </section>

      <footer className="footer">
        © 2026 where we landing
      </footer>
    </div>
  );
}
