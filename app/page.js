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
        <div className="hero-copy">
          <h1>where we landing?</h1>
          <p>
            A professional home for meetup drops. Coordinate where to cross
            paths, find community, and turn lonely nights into real-world hangs.
          </p>
          <div className="hero-actions">
            <a className="btn-primary" href="/groups">
              Explore groups
            </a>
            <a className="btn-secondary" href="#pilot">
              See the pilot group
            </a>
          </div>
        </div>
        <BattleBusScene />
      </header>

      <section id="mission" className="mission">
        <strong>Point of the website:</strong> there are a lot of disconnected,
        lonely people in Madison, WI. This makes it simple for groups to pick a
        shared landing spot, show up, and see who else chose the same location.
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
        Fortnite-inspired kickoff ritual, built for real-life Madison meetups.
      </footer>
    </div>
  );
}
