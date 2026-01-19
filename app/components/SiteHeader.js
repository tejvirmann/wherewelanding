import ThemeToggle from "./ThemeToggle";

export default function SiteHeader({
  active = "home",
  location = "Madison, WI",
  showLocationSwitcher = false
}) {
  return (
    <header className="topbar">
      <div className="logo">
        <span className="logo-mark" aria-hidden="true">
          ✦
        </span>
        <div>
          <p className="logo-title">where we landing?</p>
          <p className="logo-subtitle">Fortnite-inspired IRL meetups</p>
        </div>
      </div>
      <nav className="nav">
        <a className={active === "home" ? "active" : ""} href="/">
          Home
        </a>
        <a className={active === "groups" ? "active" : ""} href="/groups">
          Groups
        </a>
      </nav>
      <div className="topbar-actions">
        {showLocationSwitcher ? (
          <label className="location-switcher">
            <span>Location</span>
            <select defaultValue={location}>
              <option>Madison, WI</option>
              <option>Chicago, IL</option>
              <option>Milwaukee, WI</option>
            </select>
          </label>
        ) : null}
        <ThemeToggle />
      </div>
    </header>
  );
}
