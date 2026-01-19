import SiteHeader from "../components/SiteHeader";

export default function GroupsPage() {
  return (
    <div className="page">
      <SiteHeader active="groups" />

      <section className="section">
        <h1>Groups</h1>
        <p>
          Start with the pilot group below. More communities will be added as we
          expand to new cities.
        </p>
        <div className="group-grid">
          <div className="group-card">
            <div className="group-header">
              <h3>Madison Software Meetup</h3>
              <span className="tag">Pilot group</span>
            </div>
            <p>
              Weekly software meetups across downtown Madison. Drop a pin to
              land with other builders.
            </p>
            <a className="btn-secondary" href="/map">
              Open map
            </a>
          </div>
          <div className="group-card muted">
            <h3>Next up</h3>
            <p>Looking for co-founders, fitness groups, and creative circles.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
