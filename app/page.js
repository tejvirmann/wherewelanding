import dynamic from "next/dynamic";
import SiteHeader from "./components/SiteHeader";

const BattleBusScene = dynamic(() => import("./components/BattleBusScene"), {
  ssr: false,
  loading: () => (
    <div className="bus-hero bus-3d--loading">Loading the Battle Bus...</div>
  )
});

const MapPreview = dynamic(() => import("./components/MapPreview"), {
  ssr: false,
  loading: () => <div className="map-preview__loading">Loading map...</div>
});

export default function HomePage() {
  return (
    <div className="page">
      <SiteHeader active="home" />

      <header className="hero hero--bus">
        <BattleBusScene />
      </header>

      <section className="intro-section">
        <h2>what is where we landing?</h2>
        <p>
          we're building a platform to help people form, deepen & maintain meaningful
          connections through shared landing spots.
        </p>
        <p>
          we won't tolerate an existence where loneliness is the default. where finding
          community requires endless scrolling or algorithmic matching.
        </p>
        <p>
          we're building to maximize in-real-life (IRL) meetups. at our core, we are
          a connection company.
        </p>
        <div className="intro-callouts">
          <p>this is <strong>not</strong> endless scrolling.</p>
          <p>this is <strong>not</strong> random matching.</p>
          <p>this is <strong>not</strong> another social network.</p>
          <p>this is <strong>not</strong> a distraction.</p>
        </div>
        <p className="intro-cta-text">
          where we landing is an opportunity to choose real connection.
        </p>
        <p className="intro-tagline">
          no DMs, no scrolling, no swiping.
        </p>
        <p className="intro-tagline">
          just say "yes" & explore the meetups you'd have never experienced.
        </p>
        <a className="link-minimal" href="/mission">
          read our mission →
        </a>
      </section>

      <section id="example" className="section">
        <h2>Madison Software Meetup — Live Map</h2>
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
        <a className="btn-primary" href="/map">
          Open full map
        </a>
      </section>

      <section id="pilot" className="section">
        <h2>Pilot group: Madison Software Meetup</h2>
        <p>
          The pilot group runs the first live map experience. Verified members
          can drop pins and see who else chose the same location.
        </p>
        <a className="btn-primary" href="/groups">
          View the pilot group
        </a>
      </section>

      <footer className="footer">
        © 2026 where we landing
      </footer>
    </div>
  );
}
