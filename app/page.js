import dynamic from "next/dynamic";
import SiteHeader from "./components/SiteHeader";

const BattleBusScene = dynamic(() => import("./components/BattleBusScene"), {
  ssr: false,
  loading: () => (
    <div className="bus-3d bus-3d--loading">Loading the Battle Bus...</div>
  )
});

export default function HomePage() {
  return (
    <div className="page">
      <SiteHeader active="home" />

      <header className="hero">
        <div>
          <h1>Where are we landing?</h1>
          <p>
            A professional home for meetup drops. Coordinate where to cross
            paths, find community, and turn lonely nights into real-world hangs.
          </p>
          <div className="hero-actions">
            <a className="btn-primary" href="/map">
              Open the Madison map
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

      <section id="groups" className="section">
        <h2>Groups</h2>
        <p>
          Browse communities and choose a map that fits your schedule, location,
          and vibe.
        </p>
        <div className="group-grid">
          <div className="group-card">
            <div className="group-header">
              <h3>Madison Software Meetup</h3>
              <span className="tag">Pilot group</span>
            </div>
            <p>
              Weekly software meetups across downtown Madison. Pick a drop spot,
              see who else is landing, and coordinate your arrival.
            </p>
            <a className="btn-secondary" href="/map">
              Open map
            </a>
          </div>
          <div className="group-card muted">
            <h3>More groups coming soon</h3>
            <p>We are opening the next drop zones after the pilot launch.</p>
          </div>
        </div>
      </section>

      <section id="pilot" className="section">
        <h2>Pilot group: Madison Software Meetup</h2>
        <p>
          The pilot group runs the first live map experience. Verified members
          can drop pins and see who else chose the same location.
        </p>
        <a className="btn-primary" href="/map">
          View the pilot map
        </a>
      </section>

      <footer className="footer">
        Fortnite-inspired kickoff ritual, built for real-life Madison meetups.
      </footer>
    </div>
  );
}
