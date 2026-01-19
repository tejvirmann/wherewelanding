import ThemeToggle from "./ThemeToggle";

export default function SiteHeader({ active = "home", location = "Madison, WI" }) {
  return (
    <header className="topbar">
      <div className="logo">
        <span className="logo-mark" aria-hidden="true">
          ✦
        </span>
        <div>
          <p className="logo-title">Where are we landing?</p>
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
        <a className={active === "map" ? "active" : ""} href="/map">
          Map
        </a>
      </nav>
      <div className="topbar-actions">
        <div className="location-pill">
          {location}
          <span className="location-dot" />
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
