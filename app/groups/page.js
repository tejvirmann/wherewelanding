import SiteHeader from "../components/SiteHeader";

export default function GroupsPage() {
  return (
    <div className="page">
      <SiteHeader active="groups" />

      <section className="section">
        <h1>Groups</h1>
        <p>
          Browse groups by city. Active counts reflect members who dropped a pin
          in the last two weeks.
        </p>
        <div className="groups-header">
          <label className="filter-control">
            City
            <select defaultValue="Madison, WI">
              <option>Madison, WI</option>
              <option>Chicago, IL</option>
              <option>Milwaukee, WI</option>
            </select>
          </label>
          <button className="btn-primary" type="button">
            Create new group
          </button>
        </div>
        <div className="group-grid">
          <a href="/map" className="group-card group-card--link">
            <div className="group-header">
              <h3>Madison Software Meetup</h3>
              <span className="tag">Pilot group</span>
            </div>
            <p>
              Weekly software meetups across downtown Madison. Drop a pin to
              land with other builders.
            </p>
            <div className="group-meta">
              <span>📍 Madison, WI</span>
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
              <span>📍 Madison, WI</span>
              <span className="group-active">✓ 7 active</span>
            </div>
          </div>
          <div className="group-card group-card--disabled">
            <h3>More groups coming soon</h3>
            <p>We are opening the next drop zones after the pilot launch.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
